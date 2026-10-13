#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Figma credit estimator: one out-of-pocket figure for a program's Figma AI credits, with the working.

Standard library only. Two kinds of estimate, each its own report, both priced by the hour.

Design time, the estimate every program needs. Give the design hours from the staffing sheet:
    uv run scripts/estimate.py --hours 480 --program "Acme website"

Or, with no hours to hand, a duration, which converts to hours and must be confirmed first.
EFFORT is a share of an 8-hour day, 1 if left out. Run without --confirmed to get the
conversion and the question to ask; run again with --confirmed once the person answers:
    uv run scripts/estimate.py --weeks 2:2:0.8
    uv run scripts/estimate.py --weeks 2:2:0.8 --confirmed sheet      # matches the staffing sheet
    uv run scripts/estimate.py --weeks 2:2:0.8 --confirmed no-sheet   # no staffing sheet yet

Spike work, a separate estimate for work done mostly by Figma's agent, in spike hours or as a
duration that converts at 6 spike hours a day and must be confirmed the same way:
    uv run scripts/estimate.py --spike-hours 120
    uv run scripts/estimate.py --spike 2:2
    uv run scripts/estimate.py --spike 2:2 --confirmed yes

    --hours HOURS                    design hours
    --weeks WEEKS:PEOPLE[:EFFORT]    designers for a number of weeks
    --spike-hours HOURS              spike hours
    --spike WEEKS:PEOPLE             designers on spike work for a number of weeks

Add --program NAME to title the report and --json for the figures as JSON.
Exit codes: 0 report or confirmation question written, 2 bad input or rates file.
"""

import argparse
import datetime as dt
import json
import math
import pathlib
import sys
import tomllib

RATES = pathlib.Path(__file__).resolve().parent.parent / "rates.toml"


def fail(msg):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(2)


def parse(value, flag, fewest, most):
    """Split 'a[:b[:c]]' into numbers, all more than zero."""
    fields = value.split(":")
    if not fewest <= len(fields) <= most:
        fail(f"{flag} {value!r} isn't in the form shown by --help")
    try:
        numbers = [float(f) for f in fields]
    except ValueError:
        fail(f"{flag} {value!r} isn't a number")
    if any(x <= 0 for x in numbers):
        fail(f"{flag} {value!r}: every number must be more than zero")
    if flag == "--weeks" and len(numbers) == 3 and numbers[2] > 1:
        fail(f"{flag} {value!r}: effort is a share of an 8-hour day, from 0 to 1, so 80% is 0.8")
    return numbers


def up(x):
    """Round up to one decimal place, so every figure the report multiplies is shown in full."""
    return math.ceil(round(x * 10, 6)) / 10


def dollars(x):
    """Round half up to a whole dollar."""
    return math.floor(x + 0.5)


def n(x):
    return f"{x:,.0f}" if abs(x - round(x)) < 1e-9 else f"{x:,.1f}"


def d(x):
    return f"${x:,.0f}"


def plural(count, word):
    return f"{n(count)} {word}{'s' if count != 1 else ''}"


def main():
    ap = argparse.ArgumentParser(description="Estimate a program's Figma AI credit cost.",
                                 formatter_class=argparse.RawDescriptionHelpFormatter, epilog=__doc__)
    ap.add_argument("--hours", action="append", default=[])
    ap.add_argument("--weeks", action="append", default=[])
    ap.add_argument("--spike-hours", action="append", default=[])
    ap.add_argument("--spike", action="append", default=[])
    ap.add_argument("--confirmed", choices=["sheet", "no-sheet", "yes"])
    ap.add_argument("--program", default="")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--prepared", default=None, help=argparse.SUPPRESS)  # fixed date for the build's examples
    a = ap.parse_args()
    try:
        prepared = dt.date.fromisoformat(a.prepared) if a.prepared else dt.date.today()
    except ValueError:
        fail(f"--prepared {a.prepared!r} isn't a date in YYYY-MM-DD form")
    spike = bool(a.spike or a.spike_hours)
    if spike and (a.hours or a.weeks):
        fail("spike work is its own estimate: run --spike or --spike-hours on their own, and --hours or --weeks separately")
    if not (spike or a.hours or a.weeks):
        fail("give design hours (--hours), a duration (--weeks), or spike work (--spike-hours or --spike)")
    converted = a.spike if spike else a.weeks
    if a.confirmed and not converted:
        fail("--confirmed is only for a duration that was converted to hours")
    if a.confirmed and (a.confirmed == "yes") != spike:
        fail("confirm a design-time conversion with 'sheet' or 'no-sheet', and a spike conversion with 'yes'")
    try:
        r = tomllib.loads(RATES.read_text())
        rt = r["rates"]
    except (FileNotFoundError, tomllib.TOMLDecodeError, KeyError) as e:
        fail(f"can't read the rates file {RATES}: {e}")
    dpw, workday, spike_day = rt["days_per_week"], rt["workday_hours"], rt["design_hours_per_day"]
    price, pad = rt["price_per_credit"], rt["padding"]
    rate = rt["spike_credits_per_hour"] if spike else rt["credits_per_hour"]
    unit = "spike hours" if spike else "design hours"

    # Each figure entered, as hours, rounded up to one decimal place.
    given, conversions = [], []
    for v in (a.spike_hours if spike else a.hours):
        (h,) = parse(v, "--spike-hours" if spike else "--hours", 1, 1)
        given.append(up(h))
    for v in converted:
        if spike:
            weeks, people = parse(v, "--spike", 2, 2)
            h = up(people * weeks * dpw * spike_day)
            sum_text = f"{plural(people, 'designer')} × {plural(weeks, 'week')} × {dpw} days × {spike_day} hours"
        else:
            weeks, people, effort = (parse(v, "--weeks", 2, 3) + [1])[:3]
            h = up(people * weeks * dpw * workday * effort)
            sum_text = (f"{plural(people, 'designer')} × {plural(weeks, 'week')} × {dpw} days × {workday} hours"
                        f" × {effort:.0%}")
        conversions.append((sum_text, h))
    hours = round(sum(given) + sum(h for _, h in conversions), 1)

    if converted and not a.confirmed:
        lines = [f"{s} = {n(h)} {unit}" for s, h in conversions] + [f"{n(h)} {unit}, as entered" for h in given]
        question = ("Is that right?" if spike else
                    f"Does {n(hours)} design hours match the design hours on your staffing sheet? "
                    "Reply yes, no, or that there's no staffing sheet yet.")
        if a.json:
            print(json.dumps({"needs_confirmation": True, "hours": hours, "lines": lines, "question": question}, indent=2))
            return
        out = [f"Your entry converts to {n(hours)} {unit}:", ""] + [f"- {x}." for x in lines]
        if len(lines) > 1:
            out.append(f"- That's {n(hours)} {unit} in all.")
        print("\n".join(out + ["", question]))
        return

    credits = round(hours * rate)
    subtotal = dollars(credits * price)
    padding = dollars(subtotal * pad)
    recommended = subtotal + padding
    confirmed_text = {"sheet": "and confirmed as matching the staffing sheet",
                      "no-sheet": "with no staffing sheet yet to check it against",
                      "yes": "and confirmed as right"}.get(a.confirmed, "")
    entered = [f"{n(h)} {unit}, as entered" for h in given]
    entered += [f"{n(h)} {unit}, converted from {s}, {confirmed_text}" for s, h in conversions]
    if len(entered) > 1:
        entered.append(f"That's {n(hours)} {unit} in all")
    result = {"kind": "spike" if spike else "design", "program": a.program, "prepared": prepared.isoformat(),
              "version": r["version"], "calibrated": r["calibrated"], "entered": entered, "hours": hours,
              "credits": credits, "subtotal": subtotal, "padding": padding, "recommended": recommended}
    if a.json:
        print(json.dumps(result, indent=2))
        return

    line_item = r["output"]["line_item"]
    title = "Figma AI spike work estimate" if spike else "Figma AI credit estimate"
    lead = (f"**Recommended {line_item} for spike work: {d(recommended)}**, on top of the program's design-time estimate."
            if spike else f"**Recommended {line_item}: {d(recommended)}.**")
    out = [f"# {title}{': ' + a.program if a.program else ''}", "",
           f"{lead} Prepared {result['prepared']} with version {r['version']} of MERGE's Figma credit estimator, "
           f"rates calibrated {r['calibrated']}.", "", "## What we entered", ""]
    out += [f"- {e}." for e in entered]
    out += ["", "## How we got there", "",
            # A list, not a table: Gemini breaks Markdown tables when it adds source chips to them.
            f"- **{'Spike work' if spike else 'Design time'}:** {n(hours)} {unit} × {rate:,} credits an hour = "
            f"{credits:,} credits, which at ${price} a credit is {d(subtotal)}.",
            f"- **Padding:** {pad:.0%} of {d(subtotal)} is {d(padding)}.",
            f"- **Recommended:** {d(subtotal)} + {d(padding)} = {d(recommended)}.", "", "## Assumptions", ""]
    price_line = (f"- **${price} a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat "
                  "aren't deducted.")
    if spike:
        out.append(f"- **{rate:,} credits a spike hour,** for work done mostly by Figma's agent. The heaviest agent-led "
                   f"design-system work on record averaged {rt['spike_credits_per_day']:,} credits a working day; spread over "
                   f"a {spike_day}-hour day, that's {rt['spike_credits_per_day'] / spike_day:,.1f} an hour, rounded up.")
        if conversions:
            out.append(f"- **A spike day counts {spike_day} spike hours and a week {dpw} days,** because the rate was "
                       "measured per working day.")
        out += ["- **Spike work is added on top of design time,** because it covers agent work beyond a normal design "
                "day: overtime, weekends and holidays.", price_line]
    else:
        out.append(f"- **{rate:,} credits a design hour.** MERGE's heaviest Figma AI users averaged "
                   f"{rt['heavy_user_average']:,} credits a working day in their busiest months. Rounded up to "
                   f"{rt['credits_per_day']:,} a day and spread over a {rt['design_hours_per_day']}-hour design day, "
                   f"that's {rt['credits_per_day'] / rt['design_hours_per_day']:,.1f} an hour, rounded up.")
        if conversions:
            out.append(f"- **A converted duration counts {workday} hours a day at full effort and {dpw} days a week,** "
                       "with nothing taken out for holidays or vacation.")
        out += [price_line, "- **Only design roles' time is counted:** " + "; ".join(r["roles"]["counted"]) + "."]
    out += ["", "## Caveats", ""]
    if spike:
        out += [f"- The {pad:.0%} padding covers the uncertainty in the rate.",
                f"- A single day of spike work can run far above its average: the busiest on record used "
                f"{rt['spike_peak_day_credits']:,} credits, about {d(rt['spike_peak_day_credits'] * price)}."]
    else:
        out += [f"- The {pad:.0%} padding covers people who aren't counted but sometimes use Figma's AI, such as a "
                "content strategist editing copy with the agent, and the uncertainty in the rates."]
    out += [f"- The rates were set on {r['calibrated']}, mostly from use of Figma's agent during its free beta, and will "
            "be re-checked against billed use.",
            "- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of "
            "a Figma invoice."]
    if not spike:
        out.append("- Spike work isn't included. If any work will be done mostly by Figma's agent, such as building a "
                   "design system, plan for it with a separate spike work estimate: give how many designers, and for "
                   "how many weeks.")
    if prepared > dt.date.fromisoformat(r["recalibrate_after"]):
        out.append(f"- These rates were due to be re-checked after {r['recalibrate_after']}; confirm they're current "
                   "before using this figure.")
    print("\n".join(out))


if __name__ == "__main__":
    main()

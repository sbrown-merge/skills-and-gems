#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Figma credit estimator: one out-of-pocket figure for a program's Figma AI credits, with the working.

Standard library only. Each option can be given more than once, and each one is listed in the
report as entered, so the figure can be traced back later:

    uv run scripts/estimate.py --hours 480
    uv run scripts/estimate.py --weeks 7:2 --weeks 7:1:0.2 --spike 1.5:2 --program "Acme app"

    --hours HOURS               design hours
    --weeks WEEKS:PEOPLE[:SHARE]  designers for a number of weeks; SHARE of their time, 1 if left out
    --spike WEEKS:PEOPLE        designers on spike work, such as an agent-built design system

Add --program NAME to title the report and --json for the figures as JSON.
Exit codes: 0 report written, 2 bad input or rates file.
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
    """Split 'a:b[:c]' into numbers, all more than zero."""
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
        fail(f"{flag} {value!r}: share is the part of each person's time, from 0 to 1")
    return numbers


def up(x):
    """Round up to one decimal place, so every figure the table multiplies is shown in full."""
    return math.ceil(round(x * 10, 6)) / 10


def dollars(x):
    """Round half up to a whole dollar."""
    return math.floor(x + 0.5)


def n(x):
    return f"{x:,.0f}" if abs(x - round(x)) < 1e-9 else f"{x:,.1f}"


def d(x):
    return f"${x:,.0f}"


def main():
    ap = argparse.ArgumentParser(description="Estimate a program's Figma AI credit cost.",
                                 formatter_class=argparse.RawDescriptionHelpFormatter, epilog=__doc__)
    ap.add_argument("--hours", action="append", default=[])
    ap.add_argument("--weeks", action="append", default=[])
    ap.add_argument("--spike", action="append", default=[])
    ap.add_argument("--program", default="")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--prepared", default=None, help=argparse.SUPPRESS)  # fixed date for the build's examples
    a = ap.parse_args()
    try:
        prepared = dt.date.fromisoformat(a.prepared) if a.prepared else dt.date.today()
    except ValueError:
        fail(f"--prepared {a.prepared!r} isn't a date in YYYY-MM-DD form")
    if not (a.hours or a.weeks):
        fail("give design hours (--hours) or a duration (--weeks)")
    try:
        r = tomllib.loads(RATES.read_text())
        rt = r["rates"]
    except (FileNotFoundError, tomllib.TOMLDecodeError, KeyError) as e:
        fail(f"can't read the rates file {RATES}: {e}")
    hpd, dpw, cpd = rt["design_hours_per_day"], rt["days_per_week"], rt["credits_per_day"]

    # What was entered, as designer-days, one line per option.
    entered, design_days, spike_days = [], 0.0, 0.0
    for v in a.hours:
        (h,) = parse(v, "--hours", 1, 1)
        days = up(h / hpd)
        design_days += days
        entered.append(f"{n(h)} design hours, which is {n(days)} designer-days at {hpd} design hours a day")
    for v in a.weeks:
        weeks, people, share = (parse(v, "--weeks", 2, 3) + [1])[:3]
        days = up(weeks * dpw * people * share)
        design_days += days
        who = f"{n(people)} designer{'s' if people != 1 else ''}"
        entered.append(f"{who} for {n(weeks)} week{'s' if weeks != 1 else ''} at {share:.0%} of their time, which is {n(days)} designer-days")
    for v in a.spike:
        weeks, people = parse(v, "--spike", 2, 2)
        days = up(weeks * dpw * people)
        spike_days += days
        who = f"{n(people)} designer{'s' if people != 1 else ''}"
        entered.append(f"Spike work: {who} for {n(weeks)} week{'s' if weeks != 1 else ''}, which is {n(days)} spike days")

    price, pad = rt["price_per_credit"], rt["padding"]
    # Every figure in the table is the one used, so each row checks by hand: days are rounded up
    # to one decimal above, each cost is rounded to a whole dollar, and the totals add those.
    design_days, spike_days = round(design_days, 1), round(spike_days, 1)
    design_credits = round(design_days * cpd)
    spike_credits = round(spike_days * rt["spike_credits_per_day"])
    design_cost, spike_cost = dollars(design_credits * price), dollars(spike_credits * price)
    subtotal = design_cost + spike_cost
    padding = dollars(subtotal * pad)
    recommended = subtotal + padding
    result = {"program": a.program, "prepared": prepared.isoformat(), "rates_version": r["version"],
              "calibrated": r["calibrated"], "entered": entered,
              "design": {"designer_days": design_days, "credits": design_credits, "cost": design_cost},
              "spike": {"spike_days": spike_days, "credits": spike_credits, "cost": spike_cost},
              "subtotal": subtotal, "padding": padding, "recommended": recommended}
    if a.json:
        print(json.dumps(result, indent=2))
        return

    line_item = r["output"]["line_item"]
    out = [f"# Figma AI credit estimate{': ' + a.program if a.program else ''}", "",
           f"**Recommended {line_item}: {d(recommended)}.** Prepared {result['prepared']}, "
           f"with MERGE's Figma credit rates version {r['version']}.", "",
           "## What we entered", ""]
    out += [f"- {e}." for e in entered]
    out += ["", "## How we got there", "",
            "| Item | Quantity | Credits | Cost |", "| --- | --- | --- | --- |",
            f"| Design time | {n(design_days)} designer-days × {cpd:,} credits | {design_credits:,} | {d(design_cost)} |"]
    if spike_days:
        out.append(f"| Spike work | {n(spike_days)} spike days × {rt['spike_credits_per_day']:,} credits "
                   f"| {spike_credits:,} | {d(spike_cost)} |")
    out += [f"| Subtotal at ${price} a credit | | {design_credits + spike_credits:,} | {d(subtotal)} |",
            f"| Padding | {pad:.0%} | | {d(padding)} |",
            f"| **Recommended** | | | **{d(recommended)}** |", "",
            "## Assumptions", "",
            f"- **{cpd:,} credits a designer-day.** That's the average of the busiest months of MERGE's heaviest Figma AI users, "
            f"{rt['heavy_user_average']:,} credits a working day, rounded up.",
            f"- **{hpd} design hours a working day and {dpw} working days a week,** with nothing taken out for holidays or vacation.",
            f"- **${price} a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat aren't deducted.",
            f"- **Spike work at {rt['spike_credits_per_day']:,} credits a designer-day,** from the heaviest agent-led design-system work "
            "on record. It's added on top of design time, because it covers agent work beyond a normal day: overtime, weekends and holidays.",
            "- **Only design roles' time is counted:** " + "; ".join(r["roles"]["counted"]) + ".",
            "", "## Caveats", "",
            f"- The {pad:.0%} padding covers people who aren't counted but sometimes use Figma's AI, such as a content strategist "
            "editing copy with the agent, and the uncertainty in the rates.",
            f"- The rates were set on {r['calibrated']}, mostly from use of Figma's agent during its free beta, and will be re-checked "
            "against billed use.",
            f"- A single day of spike work can run far above its average: the busiest on record used {rt['spike_peak_day_credits']:,} "
            f"credits, about {d(rt['spike_peak_day_credits'] * price)}.",
            "- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of a Figma invoice."]
    if not spike_days:
        out.append(f"- No spike work is included. Work done mostly by Figma's agent, such as building a design system, would add about "
                   f"{d(rt['spike_credits_per_day'] * price * (1 + pad))} for each designer's working day on it.")
    if prepared > dt.date.fromisoformat(r["recalibrate_after"]):
        out.append(f"- These rates were due to be re-checked after {r['recalibrate_after']}; confirm they're current before using this figure.")
    print("\n".join(out))


if __name__ == "__main__":
    main()

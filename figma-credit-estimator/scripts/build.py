#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Build the figma-credit-estimator versions from one source.

Run from anywhere:
    uv run scripts/build.py           # write the built files from rates.toml, scripts/ and templates/
    uv run scripts/build.py --check   # exit 1 if a built file is stale, the rates disagree, or an example drifts

What it builds, and from what:
    claude/SKILL.md                     templates/claude-code.md, with the version, roles and closing filled in
    claude/rates.toml                   rates.toml, copied
    claude/scripts/estimate.py          scripts/estimate.py, copied
    claude/references/rates.md          written from rates.toml: the rates sheet people read
    gem-and-merge-one/instructions.md   templates/assistant.md, with the rates; held under 4,000 characters,
                                        because a MERGE One agent reads only the first 4,000
    gem-and-merge-one/knowledge/figma-credit-estimator-rates.md             the rates sheet, as above
    gem-and-merge-one/knowledge/figma-credit-estimator-report-templates.md  templates/report-templates.md, with
                                        the calculator's own sentences
    gem-and-merge-one/knowledge/figma-credit-estimator-worked-examples.md   conversations and reports made by
                                        the calculator

Built files are never edited by hand; the next build overwrites them. The check also runs each set of
arguments in examples/worked-example.json through the estimator and compares the recommended figure.
"""

import argparse
import json
import math
import pathlib
import subprocess
import sys
import tomllib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CLAUDE = ROOT / "claude"
ASSISTANT = ROOT / "gem-and-merge-one"
ESTIMATE = ROOT / "scripts" / "estimate.py"

# MERGE One agents read only the first 4,000 characters of their instructions (Steve, 2026-10-09).
INSTRUCTIONS_LIMIT = 4000

# The words every version ends its reply with, after the report.
CLOSING = ("Put the recommended figure in the staffing sheet's Experience out-of-pocket field, and attach this report "
           "to show how it was reached. Would you like me to save the report as a file you can attach?")

# What every version says when a converted total doesn't match the staffing sheet.
ASK_FOR_HOURS = ("Then please give me the total design hours from the staffing sheet, for the design roles only, "
                 "and I'll use that instead.")

# The worked examples for the gem and MERGE One agent. Each is a conversation: what the person
# typed, then either a calculator run or a fixed reply. Dated on the calibration date.
EXAMPLES = [
    ("Design hours", [
        ("person", "How much should we budget for Figma credits on the Acme website redesign? The staffing sheet has 520 design hours."),
        ("run", ["--hours", "520", "--program", "Acme website redesign"]),
    ]),
    ("A duration, confirmed with no staffing sheet yet", [
        ("person", "Pitch for a pharma mobile app, no staffing sheet yet: two UI designers for 6 weeks at 80%, and a VP of Experience Design for 6 weeks at 20%."),
        ("run", ["--weeks", "6:2:0.8", "--weeks", "6:1:0.2"]),
        ("person", "There's no staffing sheet yet."),
        ("run", ["--weeks", "6:2:0.8", "--weeks", "6:1:0.2", "--confirmed", "no-sheet", "--program", "Pharma mobile app pitch"]),
    ]),
    ("A duration that doesn't match the staffing sheet", [
        ("person", "Three designers for 4 weeks on the Fabrikam portal."),
        ("run", ["--weeks", "4:3"]),
        ("person", "No, that's too high."),
        ("reply", ASK_FOR_HOURS),
        ("person", "The staffing sheet says 400."),
        ("run", ["--hours", "400", "--program", "Fabrikam portal"]),
    ]),
    ("A spike work estimate", [
        ("person", "Two designers will spend two weeks building the Fabrikam design system mostly with Figma's agent. Can you price the spike work?"),
        ("run", ["--spike", "2:2"]),
        ("person", "Yes."),
        ("run", ["--spike", "2:2", "--confirmed", "yes", "--program", "Fabrikam portal"]),
    ]),
]


def fail(msg):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(2)


def roles_text(r):
    return "\n".join(f"- {x}" for x in r["roles"]["counted"]) + f'\n\nNot counted: {r["roles"]["not_counted"]}'


def rates_agree(r):
    """The hourly rates must be the daily rates over a 6-hour day, rounded up to a whole credit."""
    rt = r["rates"]
    ok = True
    for hourly, daily in (("credits_per_hour", "credits_per_day"), ("spike_credits_per_hour", "spike_credits_per_day")):
        want = math.ceil(rt[daily] / rt["design_hours_per_day"])
        if rt[hourly] != want:
            print(f"rates.toml: {hourly} is {rt[hourly]}, but {daily} over {rt['design_hours_per_day']} hours "
                  f"rounded up is {want}", file=sys.stderr)
            ok = False
    return ok


def rates_sheet(r):
    """The rates sheet people read, written from rates.toml."""
    rt = r["rates"]
    price, pad = rt["price_per_credit"], 1 + rt["padding"]

    def money(credits):
        return f"${credits * price * pad:,.2f} (${credits * price:,.2f} net)"

    return f"""# Figma credit estimator: rates sheet

These are the figures the Figma credit estimator uses to price a program's Figma AI credits. They're MERGE's decided rates, calibrated on {r["calibrated"]}, in version {r["version"]} of the estimator. The estimator works in design hours from the staffing sheet, and the recommended amount goes in the staffing sheet as a single {r["output"]["line_item"]} figure, with the estimator's report attached to show how it was reached. This sheet is built from the estimator's `rates.toml`; don't edit it by hand.

## The rates

These are every figure the estimator uses. They're a list rather than a table, because Gemini breaks Markdown tables when it adds source chips to them.

- **Credits a design hour:** {rt["credits_per_hour"]:,}
- **Recommended cost a design hour:** {money(rt["credits_per_hour"])}
- **Credits a spike hour:** {rt["spike_credits_per_hour"]:,}
- **Recommended cost a spike hour:** {money(rt["spike_credits_per_hour"])}
- **Price a credit:** ${price}, Figma's pay-as-you-go price
- **Padding:** {rt["padding"]:.0%}
- **Converting a duration to design hours:** {rt["days_per_week"]} days a week and {rt["workday_hours"]} hours a day at full effort, so 80% effort is {rt["workday_hours"] * 0.8:g} hours a day
- **Converting spike work to spike hours:** {rt["days_per_week"]} days a week and {rt["design_hours_per_day"]} spike hours a day
- **Busiest spike day on record:** {rt["spike_peak_day_credits"]:,} credits, about ${rt["spike_peak_day_credits"] * price:,.0f}

## Why the figures are set high

The estimator is meant to come out high, because AI credits are a small part of a program's cost: an estimate a few hundred dollars high won't lose the work, but one that's low comes out of our margin. These choices push it up.

- **The rate comes from our heaviest users.** {r["calibration_note"]} That average was {rt["heavy_user_average"]:,} credits a working day, rounded up to {rt["credits_per_day"]:,} to allow for work done mostly with Figma's agent.
- **A six-hour design day.** The {rt["credits_per_day"]:,} credits a day are spread over six design hours, so meetings and other overhead don't dilute the rate, and the result is rounded up to {rt["credits_per_hour"]:,} credits an hour. Staffing-sheet hours usually count a full eight-hour day, so the estimate runs higher than the daily average.
- **No free credits.** Every Figma seat gets free credits each month, and the estimator leaves them out, pricing every credit at pay-as-you-go.
- **{rt["padding"]:.0%} padding**, which also covers people the calculation doesn't count, such as a content strategist using Figma's agent to edit copy.

**Spike work is a separate estimate.** Work such as a design system built mostly by Figma's agent runs at several times the normal rate, so it isn't in the design-time estimate; the person asks for a spike work estimate of its own, and plans for that figure on top. Its rate is the heaviest agent-led design-system work on record, {rt["spike_credits_per_day"]:,} credits a working day, over a six-hour day and rounded up to {rt["spike_credits_per_hour"]:,} credits a spike hour. Two designers on two weeks of it is 2 × 10 days × 6 hours = 120 spike hours. It's added rather than swapped for design time because it covers agent work beyond a normal day: overtime, weekends and holidays. A single spike day can cost far more than the average.

**A duration is checked before it's priced.** Someone without a staffing-sheet total can give designers, weeks and effort instead. The estimator converts that to hours and asks whether the total matches the staffing sheet before it prices anything, and the report records the answer.

## Whose time counts

Only these roles' time goes into the estimate:

{roles_text(r)}

## When the rates change

The rates are due for re-calibration after {r["recalibrate_after"]}, when there's a full month of Figma's agent billing in full; most of the evidence behind them comes from the agent's free beta.
"""


def run_estimate(args):
    out = subprocess.run([sys.executable, str(ESTIMATE), *args], capture_output=True, text=True)
    if out.returncode:
        fail(f"the calculator failed on {args}: {out.stderr.strip()}")
    return out.stdout.rstrip("\n")


def section(report, heading):
    """The bullet lines under a ## heading of a calculator report."""
    lines = report.split("\n")
    start = lines.index(f"## {heading}") + 1
    body = []
    for line in lines[start:]:
        if line.startswith("## "):
            break
        if line.startswith("- "):
            body.append(line)
    return body


def marked(plain, converted):
    """The converted report's lines, with a note before any line only a converted report has."""
    out = []
    for line in converted:
        if line not in plain:
            out.append("<only when the hours were converted from a duration:>")
        out.append(line)
    return "\n".join(out)


def assistant_values(r):
    rt = r["rates"]
    date = r["calibrated"]
    design = run_estimate(["--hours", "6", "--prepared", date])
    design_conv = run_estimate(["--weeks", "1:1", "--confirmed", "sheet", "--prepared", date])
    spike = run_estimate(["--spike-hours", "6", "--prepared", date])
    spike_conv = run_estimate(["--spike", "1:1", "--confirmed", "yes", "--prepared", date])
    late = run_estimate(["--hours", "6", "--prepared", "2999-01-01"])
    extra_late = [x for x in section(late, "Caveats") if x not in section(design, "Caveats")]
    if len(extra_late) != 1:
        fail("couldn't find the calculator's re-calibration caveat")
    price, pad = rt["price_per_credit"], rt["padding"]

    def rec(credits):
        return f"{credits * price * (1 + pad):.4f}".rstrip("0").rstrip(".")

    return {
        "VERSION": r["version"], "CALIBRATED": r["calibrated"], "CLOSING": CLOSING, "ASK_FOR_HOURS": ASK_FOR_HOURS,
        "ROLES": roles_text(r), "ROLES_SHORT": "; ".join(r["roles"]["counted"]),
        "LINE_ITEM": r["output"]["line_item"], "RECALIBRATE_AFTER": r["recalibrate_after"],
        "CREDITS_PER_HOUR": f'{rt["credits_per_hour"]:,}', "SPIKE_CREDITS_PER_HOUR": f'{rt["spike_credits_per_hour"]:,}',
        "DAYS_PER_WEEK": str(rt["days_per_week"]), "WORKDAY_HOURS": str(rt["workday_hours"]),
        "SPIKE_DAY_HOURS": str(rt["design_hours_per_day"]),
        "PRICE": str(price), "PADDING": f"{pad:.0%}", "PADDING_DECIMAL": f"{pad:g}",
        "HOUR_REC": rec(rt["credits_per_hour"]), "SPIKE_HOUR_REC": rec(rt["spike_credits_per_hour"]),
        "DESIGN_ASSUMPTIONS": marked(section(design, "Assumptions"), section(design_conv, "Assumptions")),
        "DESIGN_CAVEATS": "\n".join(section(design, "Caveats")),
        "SPIKE_ASSUMPTIONS": marked(section(spike, "Assumptions"), section(spike_conv, "Assumptions")),
        "SPIKE_CAVEATS": "\n".join(section(spike, "Caveats")),
        "RECALIBRATE_CAVEAT": extra_late[0],
    }


def render(name, values):
    text = (ROOT / "templates" / name).read_text()
    for k, v in values.items():
        text = text.replace("{{" + k + "}}", v)
    if "{{" in text:
        fail(f"templates/{name} has a placeholder the build doesn't fill")
    return text


def assistant_instructions(values):
    text = render("assistant.md", values)
    if len(text) > INSTRUCTIONS_LIMIT:
        fail(f"gem-and-merge-one/instructions.md is {len(text):,} characters; MERGE One reads only the first "
             f"{INSTRUCTIONS_LIMIT:,}, so shorten templates/assistant.md or move text to a knowledge file")
    return text


def worked_examples(r):
    titles = [t for t, _ in EXAMPLES]
    out = ["# Figma credit estimator: worked examples", "",
           "These are finished conversations made with MERGE's Figma credit calculator, for the Figma credit estimator gem and MERGE One agent to match. "
           f"The reports' date is fixed at {r['calibrated']}; a real report carries the date it's prepared. "
           "This file is built from the calculator; don't edit it by hand.", "",
           "## Contents", "", "<!-- toc -->", "- Asking for the figures"] + [f"- {t}" for t in titles] + ["- Closing the reply", "<!-- /toc -->", "",
           "## Asking for the figures", "",
           "When the person's message has no hours or duration, ask once, in one message, like this:", "",
           "> To estimate the Figma credits, I need the total design hours from your staffing sheet. If you don't have a staffing sheet yet, "
           "give me how many designers, for how many weeks, and at what effort, such as 2 designers for 6 weeks at 80%.", ">",
           "> Only these roles' time counts: " + "; ".join(r["roles"]["counted"]) + "."]
    for title, turns in EXAMPLES:
        out += ["", f"## {title}"]
        for who, what in turns:
            if who == "person":
                out += ["", f"The person types: \"{what}\""]
            elif who == "reply":
                out += ["", "You reply:", "", f"> {what}"]
            else:
                out += ["", "You reply:", "", "````markdown", run_estimate(what + ["--prepared", r["calibrated"]]), "````"]
    out += ["", "## Closing the reply", "", "After every report, end the reply with this, word for word:", "", f"> {CLOSING}"]
    return "\n".join(out) + "\n"


def built(r):
    values = assistant_values(r)
    return {
        CLAUDE / "SKILL.md": render("claude-code.md", values),
        CLAUDE / "rates.toml": (ROOT / "rates.toml").read_text(),
        CLAUDE / "scripts" / "estimate.py": ESTIMATE.read_text(),
        CLAUDE / "references" / "rates.md": rates_sheet(r),
        ASSISTANT / "instructions.md": assistant_instructions(values),
        ASSISTANT / "knowledge" / "figma-credit-estimator-rates.md": rates_sheet(r),
        ASSISTANT / "knowledge" / "figma-credit-estimator-report-templates.md": render("report-templates.md", values),
        ASSISTANT / "knowledge" / "figma-credit-estimator-worked-examples.md": worked_examples(r),
    }


def example_matches():
    want = json.loads((ROOT / "examples" / "worked-example.json").read_text())
    ok = True
    for check in want["checks"]:
        got = json.loads(run_estimate(check["args"] + ["--json"]))
        if got.get("recommended") != check["recommended"]:
            print(f"worked example {check['args']}: recommended is {got.get('recommended')}, "
                  f"expected {check['recommended']}", file=sys.stderr)
            ok = False
    return ok


def main():
    ap = argparse.ArgumentParser(description="Build the figma-credit-estimator versions.")
    ap.add_argument("--check", action="store_true", help="report stale files instead of writing them")
    a = ap.parse_args()
    with open(ROOT / "rates.toml", "rb") as f:
        r = tomllib.load(f)
    if not rates_agree(r):
        sys.exit(1)
    files = built(r)
    if a.check:
        stale = [p for p, text in files.items() if not p.exists() or p.read_text() != text]
        for p in stale:
            print(f"stale: {p.relative_to(ROOT)} (run uv run scripts/build.py)", file=sys.stderr)
        ok = example_matches()
        if stale or not ok:
            sys.exit(1)
        size = len((ASSISTANT / "instructions.md").read_text())
        print(f"ok: claude/ and gem-and-merge-one/ are current at version {r['version']}, the worked examples match, "
              f"and the instructions are {size:,} of {INSTRUCTIONS_LIMIT:,} characters")
        return
    for p, text in files.items():
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)
        print(f"wrote {p.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

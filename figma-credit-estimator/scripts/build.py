#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Build the figma-credit-estimator versions from one source.

Run from anywhere:
    uv run scripts/build.py           # write claude/ from rates.toml, scripts/ and templates/
    uv run scripts/build.py --check   # exit 1 if a built file is stale or the worked example drifts

What it builds, and from what:
    claude/SKILL.md              templates/claude-code.md, with {{VERSION}}, {{CALIBRATED}} and {{ROLES}} filled in
    claude/rates.toml            rates.toml, copied
    claude/scripts/estimate.py   scripts/estimate.py, copied
    claude/references/rates.md   written from rates.toml: the rates sheet people read
    gem-and-merge-one/instructions.md                        templates/assistant.md, with the rates and the
                                                             calculator's own assumption and caveat sentences
    gem-and-merge-one/knowledge/figma-credit-estimator-rates.md            the rates sheet, as above
    gem-and-merge-one/knowledge/figma-credit-estimator-worked-examples.md  reports made by the calculator

Built files are never edited by hand; the next build overwrites them. The check also runs the
arguments in examples/worked-example.json through the estimator and compares the recommended figure, so a
change to the rates or the arithmetic shows up.
"""

import argparse
import json
import pathlib
import subprocess
import sys
import tomllib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CLAUDE = ROOT / "claude"
ASSISTANT = ROOT / "gem-and-merge-one"
ESTIMATE = ROOT / "scripts" / "estimate.py"

# The worked examples for the gem and MERGE One agent: what the person typed, and the
# calculator arguments it becomes. Dated on the calibration date so the file is stable.
EXAMPLES = [
    ("Design hours only",
     "How much should we budget for Figma credits on the Acme website redesign? We've estimated 520 design hours, and there's no design-system work.",
     ["--hours", "520", "--program", "Acme website redesign"]),
    ("Design hours with spike work",
     "We have 540 design hours, and one designer will spend two weeks building the design system mostly with Figma's agent.",
     ["--hours", "540", "--spike", "2:1"]),
    ("A duration with several groups and spike work",
     "Pitch for a pharma mobile app: 4 weeks of discovery with one UX designer at half time, then 7 weeks of design with two UI designers full time and a VP of Experience Design at 20%, then 6 weeks of dev support with one UI designer at a quarter of their time. Both UI designers will spend the first week and a half of design building the component library mostly with Figma's agent.",
     ["--weeks", "4:1:0.5", "--weeks", "7:2", "--weeks", "7:1:0.2", "--weeks", "6:1:0.25", "--spike", "1.5:2",
      "--program", "Pharma mobile app pitch"]),
]


def fail(msg):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(2)


def roles_text(r):
    return "\n".join(f"- {x}" for x in r["roles"]["counted"]) + f'\n\nNot counted: {r["roles"]["not_counted"]}'


def rates_sheet(r):
    """The rates sheet people read, written from rates.toml."""
    rt = r["rates"]
    per_hour = rt["credits_per_day"] / rt["design_hours_per_day"]
    price, pad = rt["price_per_credit"], 1 + rt["padding"]

    def money(credits):
        return f"${credits * price * pad:,.2f} (${credits * price:,.2f} net)"

    return f"""# Figma credit estimator: rates sheet

These are the figures the Figma credit estimator uses to price a program's Figma AI credits. They're MERGE's decided rates, version {r["version"]}, calibrated on {r["calibrated"]}. The recommended amount goes in the staffing sheet as a single {r["output"]["line_item"]} figure, and the estimator's report can be attached to show how it was reached. This sheet is built from the estimator's `rates.toml`; don't edit it by hand.

## The rates

This table lists every figure the estimator uses.

| Value | Figure |
| --- | --- |
| Credits a designer-day | {rt["credits_per_day"]:,} |
| Design hours a working day | {rt["design_hours_per_day"]} |
| Credits a design hour | {per_hour:,.2f} |
| Working days a week | {rt["days_per_week"]} |
| Price a credit | ${price} (Figma's pay-as-you-go price) |
| Padding | {rt["padding"]:.0%} |
| **Recommended cost a design hour** | **{money(per_hour)}** |
| Recommended cost a designer-day | {money(rt["credits_per_day"])} |
| Recommended cost a designer-week | {money(rt["credits_per_day"] * rt["days_per_week"])} |
| Spike credits a designer-day | {rt["spike_credits_per_day"]:,} |
| **Spike cost a designer-day** | **{money(rt["spike_credits_per_day"])}** |
| Busiest spike day on record | {rt["spike_peak_day_credits"]:,} credits, about ${rt["spike_peak_day_credits"] * price:,.0f} |

## Why the figures are set high

The estimator is meant to come out high, because AI credits are a small part of a program's cost: an estimate a few hundred dollars high won't lose the work, but one that's low comes out of our margin. These choices push it up.

- **The rate comes from our heaviest users.** {r["calibration_note"]} That average was {rt["heavy_user_average"]:,} credits a working day, rounded up to {rt["credits_per_day"]:,} to allow for work done mostly with Figma's agent.
- **Six design hours a day**, so meetings and other overhead don't dilute the rate.
- **Five working days a week**, with no time taken out for holidays or vacation.
- **No free credits.** Every Figma seat gets free credits each month, and the estimator leaves them out, pricing every credit at pay-as-you-go.
- **{rt["padding"]:.0%} padding**, which also covers people the calculation doesn't count, such as a content strategist using Figma's agent to edit copy.

**Spike work is priced separately.** Work such as a design system built mostly by Figma's agent runs at several times the normal rate, so it's priced separately and added on top of design time. A spike day is one designer's working day on that work, so two designers on two weeks of it is 20 spike days. It's added rather than swapped for design time because it covers agent work beyond a normal day: overtime, weekends and holidays. A single spike day can cost far more than the average.

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
    return out.stdout


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


def assistant_instructions(r):
    rt = r["rates"]
    date = r["calibrated"]
    with_spike = run_estimate(["--hours", "6", "--spike", "1:1", "--prepared", date])
    no_spike = run_estimate(["--hours", "6", "--prepared", date])
    late = run_estimate(["--hours", "6", "--spike", "1:1", "--prepared", "2999-01-01"])
    caveats = section(with_spike, "Caveats")
    extra_no_spike = [x for x in section(no_spike, "Caveats") if x not in caveats]
    extra_late = [x for x in section(late, "Caveats") if x not in caveats]
    if len(extra_no_spike) != 1 or len(extra_late) != 1:
        fail("couldn't find the calculator's no-spike and re-calibration caveats")
    price, pad = rt["price_per_credit"], rt["padding"]
    values = {
        "VERSION": r["version"], "CALIBRATED": r["calibrated"], "ROLES": roles_text(r),
        "LINE_ITEM": r["output"]["line_item"], "RECALIBRATE_AFTER": r["recalibrate_after"],
        "CREDITS_PER_DAY": f'{rt["credits_per_day"]:,}', "HOURS_PER_DAY": str(rt["design_hours_per_day"]),
        "DAYS_PER_WEEK": str(rt["days_per_week"]), "PRICE": str(price), "PADDING": f"{pad:.0%}",
        "PADDING_DECIMAL": f"{pad:g}", "SPIKE_CREDITS": f'{rt["spike_credits_per_day"]:,}',
        "DESIGNER_DAY_REC": f'{rt["credits_per_day"] * price * (1 + pad):.4f}'.rstrip("0").rstrip("."),
        "SPIKE_DAY_REC": f'{rt["spike_credits_per_day"] * price * (1 + pad):.4f}'.rstrip("0").rstrip("."),
        "ASSUMPTIONS": "\n".join(section(with_spike, "Assumptions")), "CAVEATS": "\n".join(caveats),
        "NO_SPIKE_CAVEAT": extra_no_spike[0], "RECALIBRATE_CAVEAT": extra_late[0],
    }
    text = (ROOT / "templates" / "assistant.md").read_text()
    for k, v in values.items():
        text = text.replace("{{" + k + "}}", v)
    if "{{" in text:
        fail("templates/assistant.md has a placeholder the build doesn't fill")
    return text


def worked_examples(r):
    titles = [t for t, _, _ in EXAMPLES]
    out = ["# Figma credit estimator: worked examples", "",
           "These are finished reports made by MERGE's Figma credit calculator, for the Figma credit estimator gem and MERGE One agent to match. "
           f"Each shows what a person typed and the report it produces, with the date fixed at {r['calibrated']}; a real report carries the date it's prepared. "
           "This file is built from the calculator; don't edit it by hand.", "",
           "## Contents", "", "<!-- toc -->", "- Asking for the figures"] + [f"- {t}" for t in titles] + ["<!-- /toc -->", "",
           "## Asking for the figures", "",
           "When the person's message has no hours or duration, ask once, in one message, like this:", "",
           "> To estimate the Figma credits, I need one of these:", ">",
           "> - **Design hours:** the total from your estimate.",
           "> - **Or a duration:** for each group of designers, how many weeks, how many designers, and what share of their time.", ">",
           "> Only these roles' time counts: " + "; ".join(r["roles"]["counted"]) + ".", ">",
           "> Will any work be done mostly by Figma's agent, such as building a design system or a large component library? If so, how many designers, and for how many weeks?"]
    for title, message, args in EXAMPLES:
        report = run_estimate(args + ["--prepared", r["calibrated"]]).rstrip("\n")
        out += ["", f"## {title}", "", f"The person typed: \"{message}\"", "", "The report:", "", "````markdown", report, "````"]
    return "\n".join(out) + "\n"


def built(r):
    tpl = (ROOT / "templates" / "claude-code.md").read_text()
    skill = (tpl.replace("{{VERSION}}", r["version"]).replace("{{CALIBRATED}}", r["calibrated"])
             .replace("{{ROLES}}", roles_text(r)))
    if "{{" in skill:
        fail("templates/claude-code.md has a placeholder the build doesn't fill")
    return {
        CLAUDE / "SKILL.md": skill,
        CLAUDE / "rates.toml": (ROOT / "rates.toml").read_text(),
        CLAUDE / "scripts" / "estimate.py": (ROOT / "scripts" / "estimate.py").read_text(),
        CLAUDE / "references" / "rates.md": rates_sheet(r),
        ASSISTANT / "instructions.md": assistant_instructions(r),
        ASSISTANT / "knowledge" / "figma-credit-estimator-rates.md": rates_sheet(r),
        ASSISTANT / "knowledge" / "figma-credit-estimator-worked-examples.md": worked_examples(r),
    }


def example_matches():
    want = json.loads((ROOT / "examples" / "worked-example.json").read_text())
    out = subprocess.run([sys.executable, str(ROOT / "scripts" / "estimate.py"), *want["args"], "--json"],
                         capture_output=True, text=True)
    if out.returncode:
        print(out.stderr, file=sys.stderr)
        return False
    got = json.loads(out.stdout)
    actual = round(got["recommended"])
    if actual != want["recommended"]:
        print(f"worked example: recommended is ${actual:,}, expected ${want['recommended']:,}", file=sys.stderr)
        return False
    return True


def main():
    ap = argparse.ArgumentParser(description="Build the figma-credit-estimator versions.")
    ap.add_argument("--check", action="store_true", help="report stale files instead of writing them")
    a = ap.parse_args()
    with open(ROOT / "rates.toml", "rb") as f:
        r = tomllib.load(f)
    files = built(r)
    if a.check:
        stale = [p for p, text in files.items() if not p.exists() or p.read_text() != text]
        for p in stale:
            print(f"stale: {p.relative_to(ROOT)} (run uv run scripts/build.py)", file=sys.stderr)
        ok = example_matches()
        if stale or not ok:
            sys.exit(1)
        print(f"ok: claude/ and gem-and-merge-one/ are current at version {r['version']}, and the worked example matches")
        return
    for p, text in files.items():
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)
        print(f"wrote {p.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

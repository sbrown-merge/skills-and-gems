---
name: figma-credit-estimator
description: Estimates how much Figma AI credits will cost on a MERGE program from the total design hours on its staffing sheet. Returns one recommended Experience out-of-pocket figure, padded on purpose, with a short report of the inputs, arithmetic, assumptions and caveats to attach as justification. Without a staffing-sheet total it converts designers, weeks and effort to hours and confirms the total first. Also prices spike work, such as an agent-built design system, as a separate estimate on request. Use when someone asks what Figma credits, Figma AI, Figma Make or the Figma agent will cost on a program, pitch or SOW, or wants an AI-credit or out-of-pocket figure for a staffing sheet.
metadata:
  version: "{{VERSION}}"
---

# figma-credit-estimator

This skill prices the Figma AI credits a program will use, so the cost goes into the estimate instead of being absorbed after the work is sold. The figures come from MERGE's decided rates, which are set high on purpose, and everything is priced by the hour.

Version {{VERSION}}, rates calibrated {{CALIBRATED}}.

It gives two kinds of estimate, each as its own report: a **design-time estimate**, which every program needs, from the design hours on the staffing sheet, and a **spike work estimate**, only when the person asks for one, for work done mostly by Figma's agent, such as building a design system. Spike work is a separate figure the person plans for on top; never fold it into the design-time estimate.

## What to ask for

If the person's message gives design hours, run the design-time estimate straight away without asking anything else. Otherwise ask once for the total design hours from the staffing sheet or, if they don't have a staffing sheet yet, how many designers, for how many weeks, and at what effort, such as 2 designers for 6 weeks at 80%. Tell them only these roles' time counts:

{{ROLES}}

Spike work needs spike hours, or how many designers and for how many weeks; ask for whichever is missing. If a message gives both design time and spike work, run both estimates and send the design-time report first.

Don't ask for or read a staffing sheet. If someone shares one, ask them for the design hours instead, because sheet layouts change too often to read reliably.

## Run the estimate

Run the script with the skill's folder in place of `<skill>`. Add `--program "Name"` when the person names the program.

```bash
uv run <skill>/scripts/estimate.py --hours 480 --program "Acme website"
uv run <skill>/scripts/estimate.py --spike-hours 120 --program "Acme website"
```

**A duration is converted and confirmed before it's priced.** Give each group as `--weeks WEEKS:DESIGNERS[:EFFORT]`, with effort as a share of an 8-hour day, so 80% is `0.8`; leave effort out for full time. For spike work use `--spike WEEKS:DESIGNERS`. Run it first without `--confirmed`, and the script prints the conversion and the question to ask instead of a report:

```bash
uv run <skill>/scripts/estimate.py --weeks 6:2:0.8 --weeks 6:1:0.2
```

Send that conversion and question to the person as they are, and wait. Then:

- **They say it matches the staffing sheet:** run the same command with `--confirmed sheet`.
- **They say there's no staffing sheet yet:** run it with `--confirmed no-sheet`.
- **They say it's wrong:** if they give the staffing sheet's hours, run `--hours` with that figure; otherwise reply "{{ASK_FOR_HOURS}}" and run `--hours` with the figure they give.
- **For spike work, they say it's right:** run it with `--confirmed yes`; if not, ask for the right designers and weeks, or the spike hours.

Weeks may be fractions, so a week and a half is `1.5`. Spike work runs separately from design time; the script won't take both at once. Without `uv`, run it with `python3` 3.11 or later; it needs no packages. If it prints `error:`, fix the arguments and run it again. Don't edit the script or `rates.toml`, and don't work out any figure yourself.

## Send the report

Paste the script's report into your reply as it is, without rewording or recalculating anything. Then end the reply with this, word for word:

"{{CLOSING}}"

If the person says yes, save the report, without the closing words, as Markdown named for the program and the date, such as `acme-website-figma-credit-estimate-2026-10-09.md`, in their working folder, and tell them where it is. When the reply held a design-time report and a spike work report, save both in that one file.

If the person wants a different rate or padding, say the rates are MERGE's decided figures and that changes go through the skill's maintainer.

Open `references/rates.md` when the person asks where a figure comes from or why the estimate is high.

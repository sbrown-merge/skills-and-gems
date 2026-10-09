---
name: figma-credit-estimator
description: Estimates how much Figma AI credits will cost on a MERGE program from its total design hours, or from how many designers are on it and for how many weeks. Returns one recommended Experience out-of-pocket figure, padded on purpose and including any spike work such as an agent-built design system, with a short report of the inputs, arithmetic, assumptions and caveats to attach as justification. Use when someone asks what Figma credits, Figma AI, Figma Make or the Figma agent will cost on a program, pitch or SOW, or wants an AI-credit or out-of-pocket figure for a staffing sheet.
metadata:
  version: "0.1.0"
---

# figma-credit-estimator

This skill prices the Figma AI credits a program will use, so the cost goes into the estimate instead of being absorbed after the work is sold. The figures come from MERGE's decided rates, which are set high on purpose.

Version 0.1.0, rates calibrated 2026-10-09.

## What to ask for

The person types the numbers into the chat. If their message already has hours or a duration, run the estimate straight away without asking anything else; the report says whether spike work is included. Otherwise ask once, in one message, for one of these:

- **Design hours:** the total from their estimate.
- **Or a duration:** for each group of designers, how many weeks, how many designers, and what share of their time.

Tell them only these roles' time counts:

- Experience: any UX designer, UI designer or experience designer, at any level up to and including VP
- Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production

Not counted: Roles above VP, strategy, content, research, project management and development. The padding covers their occasional use of Figma.

In that message, also ask whether any work will be done mostly by Figma's agent, such as building a design system or a large component library, and if so how many designers and for how many weeks. That's spike work, added on top of design time.

Don't ask for or read a staffing sheet. If someone shares one, ask them for the design hours instead, because sheet layouts change too often to read reliably.

## Run the estimate

Run the script with the skill's folder in place of `<skill>`, one option for each figure the person gave. Weeks may be fractions, so a week and a half is `1.5`.

```bash
uv run <skill>/scripts/estimate.py --hours 480 --program "Acme website"
uv run <skill>/scripts/estimate.py --weeks 4:1:0.5 --weeks 7:2 --weeks 7:1:0.2 --spike 1.5:2
```

`--hours HOURS` takes design hours. `--weeks WEEKS:PEOPLE[:SHARE]` takes designers for a number of weeks, with their share of time from 0 to 1, or 1 if left out; repeat it for each group. `--spike WEEKS:PEOPLE` takes designers on spike work. Add `--program "Name"` when the person names the program.

Without `uv`, run it with `python3` 3.11 or later; it needs no packages. If it prints `error:`, fix the arguments and run it again. Don't edit the script or `rates.toml`, and don't work out any figure yourself.

## Send the report

Paste the script's report into your reply as it is, without rewording or recalculating anything. It gives one figure for the staffing sheet's Experience out-of-pocket field, then what was entered, the arithmetic, the assumptions and the caveats, so it can be attached to the estimate to show how the figure was reached. End with this sentence, word for word: "Put the recommended figure in the staffing sheet's Experience out-of-pocket field, and attach this report to show how it was reached." If the person wants it as a file, save the report as Markdown named for the program and date, such as `acme-website-figma-credit-estimate-2026-10-09.md`.

If the person wants a different rate or padding, say the rates are MERGE's decided figures and that changes go through the skill's maintainer.

Open `references/rates.md` when the person asks where a figure comes from or why the estimate is high.

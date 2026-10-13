# figma-credit-estimator

`figma-credit-estimator` prices the Figma AI credits a MERGE program will use as one figure, so the cost goes into the estimate as Experience out-of-pocket instead of being absorbed after the work is sold. The person types in the total design hours from the staffing sheet, and it comes out high on purpose. Without a staffing-sheet total, it converts designers, weeks and effort to hours and asks the person to confirm the total before it prices anything. It deliberately doesn't read staffing sheets, because their layout, tabs and role names change too often; the only thing to maintain is the rates. Spike work, done mostly by Figma's agent, is priced as a separate estimate on request, so the design-time figure never hides it. It comes in four forms built from the same rates: a Gemini skill, which replaces the Gem when Gems end ([gemini-skills.md](../gemini-skills.md)); a Gemini gem and a MERGE One agent, which most of MERGE uses today because everyone has them; and a Claude Code skill for the few who have Claude.

The rates and the decisions behind them are Steve Brown's, from 2026-10-09, and are recorded with their evidence in [the estimator plan](<../../CCE-AI-strategy/budget/2026-10-09 figma-credit-estimator-plan.md>) in the CCE-AI-strategy repo.

## Contents

<!-- toc -->
- What's in this folder
- Changing a rate or the skill
- Uploading the Gemini skill
- Setting up a Workspace skill in Studio
- Setting up the gem and the MERGE One agent
- Installing it in Claude Code
- Version and testing
- Version history
<!-- /toc -->

## What's in this folder

The source files are the only ones anyone edits. `claude/` and `gem-and-merge-one/` are built from them and are never edited by hand, because the next build overwrites them.

| File | What it's for |
| --- | --- |
| [rates.toml](rates.toml) | The rates sheet: every figure and the list of roles whose time counts. The one place a rate changes. |
| [scripts/estimate.py](scripts/estimate.py) | The calculator. Takes hours, weeks and spike work as command-line options, reads the rates sheet, and prints the report. Standard library only. |
| [scripts/build.py](scripts/build.py) | Builds `claude/` from the source, and with `--check` fails if a built file is stale or the worked example's total has moved. |
| [templates/claude-code.md](templates/claude-code.md) | The Claude Code `SKILL.md`, with the version, calibration date and role list filled in by the build. |
| [templates/assistant.md](templates/assistant.md) | The gem and MERGE One instructions, with the rates filled in; the build fails if they pass 4,000 characters. |
| [templates/report-templates.md](templates/report-templates.md) | The report layouts for the gem and MERGE One, with the assumption and caveat sentences taken from the calculator's own report, so the two can't drift apart. |
| [examples/worked-example.json](examples/worked-example.json) | The plan's worked example and its expected totals, which the check runs. |
| [claude/](claude/SKILL.md) | Built. The Claude Code skill: `SKILL.md`, the script, a copy of `rates.toml`, and `references/rates.md`, the rates sheet people read. |
| [gemini/estimate-figma-credits/](gemini/estimate-figma-credits/SKILL.md) | Built. The Gemini app skill: `SKILL.md` and three reference files in `references/`. Named with a verb, as Google asks, so its name and folder differ from the Claude skill's. |
| [gem-and-merge-one/](gem-and-merge-one/instructions.md) | Built. The gem and MERGE One agent: `instructions.md`, under 4,000 characters, and three knowledge files: the rates sheet, the report templates and worked examples made by the calculator. |

## Changing a rate or the skill

Edit `rates.toml`, `scripts/estimate.py` or the template, then run the build and the check from this folder:

```bash
uv run scripts/build.py
```

```bash
uv run scripts/build.py --check
```

If a change moves the worked example's total on purpose, such as a new rate, update the totals in `examples/worked-example.json` in the same commit. Bump `version` in `rates.toml` for every change that lands on `main`, following [Semantic Versioning](https://semver.org).

## Uploading the Gemini skill

Gemini app skills reach MERGE's Workspace accounts from 2026-10-13, rolling out until mid-November ([gemini-skills.md](../gemini-skills.md)). Once **Settings › Skills** appears in the Gemini app, on the web or the Mac app:

1. Choose **Upload** and pick `estimate-figma-credits.zip`, which the build writes to this folder with `SKILL.md` at its root. If the dialog refuses the zip, upload the folder `gemini/estimate-figma-credits/` instead; its name matches the skill's name, as Google requires.
2. Check the skill reads **estimate-figma-credits**, with the shared description, and that it's switched on.
3. Test it in a new chat by typing `/estimate-figma-credits` and *380 design hours*, which should come to $3,102, then without the slash, to check Gemini picks it up from the description.

To update it after a change, rebuild and choose **Replace skill** with the new zip, because Gemini only takes changed files as a whole new upload.

## Setting up a Workspace skill in Studio

A Workspace skill is a separate copy, used with `@` in the Gemini side panel in Docs, Gmail, Slides, Drive and Chat. It's built in Workspace Studio from the gem files, because those refer to their knowledge files by title. **TBD:** this hasn't been tried yet; the steps follow Studio's form as of 2026-10-10.

1. Upload the three files in `gem-and-merge-one/knowledge/` to a Drive folder.
2. In Studio, open **Skills** and create a skill. Name it *Figma AI Credit Estimator* and use the description in step 2 of the MERGE One steps below.
3. Paste `instructions.md` into the instructions, then attach the three Drive files with the Drive button in the editor's toolbar.
4. **Turn on** the skill, then test it in a Doc's Gemini side panel with `@` and *380 design hours*, which should come to $3,102.

## Setting up the gem and the MERGE One agent

Both use the same four files from `gem-and-merge-one/`, and neither needs to run code: `instructions.md`, and the three knowledge files in `knowledge/`, which are the rates sheet, the report templates and the worked examples. The instructions are kept under 4,000 characters, because a MERGE One agent reads only the first 4,000 ([merge-one-agents.md](../merge-one-agents.md)), so the report layouts live in a knowledge file instead. When a rate changes, rebuild, then paste the new instructions and replace all three knowledge files, because all four carry the rates.

### MERGE One agent

These steps follow the Create an Agent form, top to bottom (as of 2026-10-09).

1. **Agent Name:** Figma AI Credit Estimator. Leave **Custom Handle** blank to use the name, or enter `figma_ai_credit_estimator`.
2. **Description:** *Estimates the Figma AI credits a program will use, from the design hours on your staffing sheet, as one Experience out-of-pocket figure with a report you can attach to show how it was reached. Set high on purpose. No staffing sheet yet? Give designers, weeks and effort, and it confirms the hours first. Prices spike work, such as an agent-built design system, separately when you ask.* If a field needs something shorter: *Prices the Figma AI credits a program will use, from your staffing sheet's design hours, as one Experience out-of-pocket figure with a report you can attach.*
3. **Tags:** `#figma` and `#figma-credits`.
4. **System Instructions:** select everything in the field, delete it, and paste the whole of `instructions.md`. The counter under the field must read under 4,000 characters, about 3,030; if it reads more, old text is still in the field.
5. **Sharing:** Private while you test it, then Shared or Discoverable once it works.
6. **Sources:** choose **Add Sources** and upload each of the three files in `knowledge/` as a file: `figma-credit-estimator-rates.md`, `figma-credit-estimator-report-templates.md` and `figma-credit-estimator-worked-examples.md`. The instructions refer to them by their titles, so upload them unchanged.
7. **Ground sources:** switch it on once the files are attached. That limits the agent to its instructions and these files, with no web, Drive or general knowledge, so it can't reach for some other Figma pricing.
8. **Use sub-agents:** leave off.
9. **Suggested Prompts:** add these four, each with **Add**. Each one starts a conversation the agent knows how to finish, asking for whatever figures are missing.
   - Estimate Figma credits from my design hours
   - Estimate Figma credits from designers and weeks (no staffing sheet yet)
   - Estimate spike work for an agent-built design system
   - Where do these rates come from?
10. **Custom Actions:** none.
11. **Save Agent**, then try it in **Test Chat**. Sources apply only once the agent is saved, so test after saving: type *380 design hours* and check the recommended figure is $3,102.

### Gemini gem

Name it **Figma AI Credit Estimator**, with the same description. Paste `instructions.md` into the gem's Instructions, add the three files in `knowledge/` as its knowledge files, save, and test with *380 design hours*, which should come to $3,102.

## Installing it in Claude Code

Copy the built folder into your skills folder:

```bash
cp -R claude ~/.claude/skills/figma-credit-estimator
```

To update an installed copy, remove `~/.claude/skills/figma-credit-estimator` and copy it again.

To try it in Claude on the web or the desktop app, upload `figma-credit-estimator.zip` as a skill under Settings, Capabilities. The build writes it to this folder, with a `figma-credit-estimator/` folder holding `SKILL.md` inside. The zip is ignored by git; rebuild it after every change.

## Version and testing

Version 0.3.0, rates calibrated 2026-10-09 and due for re-calibration after 2026-11-07. Not yet audited against [our skills checklist](../claude-skills-best-practices.md).

## Version history

- **0.3.0 (2026-10-10)** — A Gemini app skill, `estimate-figma-credits`, built from the same instructions with its files named by path, plus upload steps for it and for a Workspace skill in Studio. One description now serves every version. The build writes both upload zips without hidden files. Corrects 0.2.0's history entry: its gem and MERGE One instructions were 3,685 characters, not 3,031.
- **0.2.0 (2026-10-09)** — Everything is priced by the hour: 334 credits a design hour and 1,267 a spike hour, the daily rates over a six-hour day rounded up, so the report no longer mentions designer-days. A duration is converted to hours (8 hours a day at full effort) and must be confirmed against the staffing sheet before it's priced, which the calculator enforces with `--confirmed`. Spike work becomes a separate estimate with its own report, asked for on request, rather than a line in the design-time estimate; the calculator won't take both at once. Every version ends its reply by asking whether to save the report as a file. The gem and MERGE One instructions are cut to 3,031 characters, under MERGE One's 4,000, with the report layouts moved to a new knowledge file. The report's arithmetic is a short list rather than a table, and the rates sheet a list too, because Gemini printed the table as raw Markdown once it added its source chips to it (Steve's gem test, 2026-10-09). Days round up to one decimal and costs to whole dollars, so every row of the report checks by hand. Steve's feedback from running the skill.
- **0.1.0 (2026-10-09)** — First version: the rates sheet, the calculator, the build and the Claude Code skill.

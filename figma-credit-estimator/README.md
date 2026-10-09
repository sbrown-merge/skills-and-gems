# figma-credit-estimator

`figma-credit-estimator` prices the Figma AI credits a MERGE program will use as one figure, so the cost goes into the estimate as Experience out-of-pocket instead of being absorbed after the work is sold. The person types in the total design hours, or how many designers and for how many weeks, and it comes out high on purpose. It deliberately doesn't read staffing sheets, because their layout, tabs and role names change too often; the only thing to maintain is the rates. It comes in two forms built from the same rates: a Gemini gem and a MERGE One agent, which most of MERGE will use because everyone has them, and a Claude Code skill for the few who have Claude.

The rates and the decisions behind them are Steve Brown's, from 2026-10-09, and are recorded with their evidence in [the estimator plan](<../../CCE-AI-strategy/budget/2026-10-09 figma-credit-estimator-plan.md>) in the CCE-AI-strategy repo.

## What's in this folder

The source files are the only ones anyone edits. `claude/` and `gem-and-merge-one/` are built from them and are never edited by hand, because the next build overwrites them.

| File | What it's for |
| --- | --- |
| [rates.toml](rates.toml) | The rates sheet: every figure and the list of roles whose time counts. The one place a rate changes. |
| [scripts/estimate.py](scripts/estimate.py) | The calculator. Takes hours, weeks and spike work as command-line options, reads the rates sheet, and prints the report. Standard library only. |
| [scripts/build.py](scripts/build.py) | Builds `claude/` from the source, and with `--check` fails if a built file is stale or the worked example's total has moved. |
| [templates/claude-code.md](templates/claude-code.md) | The Claude Code `SKILL.md`, with the version, calibration date and role list filled in by the build. |
| [templates/assistant.md](templates/assistant.md) | The gem and MERGE One instructions, with the rates filled in and the assumption and caveat sentences taken from the calculator's own report, so the two can't drift apart. |
| [examples/worked-example.json](examples/worked-example.json) | The plan's worked example and its expected totals, which the check runs. |
| [claude/](claude/SKILL.md) | Built. The Claude Code skill: `SKILL.md`, the script, a copy of `rates.toml`, and `references/rates.md`, the rates sheet people read. |
| [gem-and-merge-one/](gem-and-merge-one/instructions.md) | Built. The gem and MERGE One agent: `instructions.md` and two knowledge files, the rates sheet and worked examples made by the calculator. |

## Changing a rate or the skill

Edit `rates.toml`, `scripts/estimate.py` or the template, then run the build and the check from this folder:

```bash
uv run scripts/build.py
```

```bash
uv run scripts/build.py --check
```

If a change moves the worked example's total on purpose, such as a new rate, update the totals in `examples/worked-example.json` in the same commit. Bump `version` in `rates.toml` for every change that lands on `main`, following [Semantic Versioning](https://semver.org).

## Setting up the gem and the MERGE One agent

Both take the same three files from `gem-and-merge-one/`, and neither needs to run code:

| Where | Instructions | Knowledge |
| --- | --- | --- |
| Gemini gem | Paste `instructions.md` into the gem's Instructions | Add both files in `knowledge/` as the gem's knowledge files |
| MERGE One agent | Paste `instructions.md` into the agent's instructions | Put both files in `knowledge/` in one Knowledge Bucket and attach it to the agent |

Name it **Figma credit estimator**, with the description: *Estimates the Figma AI credits a program will use, as one Experience out-of-pocket figure with a report you can attach. Give it your design hours, or designers and weeks.* When a rate changes, rebuild, then paste the new instructions and replace both knowledge files, because all three carry the rates.

## Installing it in Claude Code

Copy the built folder into your skills folder:

```bash
cp -R claude ~/.claude/skills/figma-credit-estimator
```

To update an installed copy, remove `~/.claude/skills/figma-credit-estimator` and copy it again.

## Version and testing

Version 0.1.0, rates calibrated 2026-10-09 and due for re-calibration after 2026-11-07. Not yet audited against [our skills checklist](../claude-skills-best-practices.md).

## Version history

- **0.1.0 (2026-10-09)** — First version: the rates sheet, the calculator, the build and the Claude Code skill.

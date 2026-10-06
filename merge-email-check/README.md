# merge-email-check

`merge-email-check` is a skill for Figma's own agent that checks an email design against email best practices before it's built. A designer runs `/merge-email-check` on an email's mobile and desktop frames, answers one question, and gets a scorecard of 30 checks with evidence linked to each layer, then the fixes to make first. It works for any email project, MERGE's or a client's: universal checks come from WCAG 2.2, email law and how mail apps behave, and house checks use MERGE's numbers as defaults that a project can change. It also runs from Claude Code through the Figma MCP. It never changes the design apart from comments the designer asks for. This README is for whoever maintains and publishes it.

## Contents

<!-- toc -->
- What's in this folder
- Changing the skill
- Publishing it in Figma
- Version and testing
- Version history
- Credit
<!-- /toc -->

## What's in this folder

Only `SKILL.md` goes to Figma, because Figma's custom skills must be a single Markdown file with at most 65,536 characters of instructions. Everything else is here to maintain it.

| File | What it's for |
| --- | --- |
| [SKILL.md](SKILL.md) | The skill, and the one file uploaded to Figma. Its scripts are minified copies of the ones in `scripts/`. |
| [checklist.md](checklist.md) | The full checklist, EM-01 to EM-30, with each check's reason, rule, tier and source. `SKILL.md` carries a compressed form. |
| [scripts/](scripts/README.md) | The three read-only Plugin API scripts, what testing found, and `sync_skill.py`, which copies them into `SKILL.md`. |
| [PLAN.md](PLAN.md) | The build plan and the decisions behind it. |
| [EVAL.md](EVAL.md) | The three test cases, what each run should find, and the results. |
| [eval-prompts.md](eval-prompts.md) | The exact prompts and links for each evaluation run. |

## Changing the skill

Change a check in [checklist.md](checklist.md) first, then its line in `SKILL.md`. Edit scripts in `scripts/`, never in `SKILL.md`, run each changed script through the Figma MCP's `use_figma` tool against a real file, then copy them in and check the length:

```bash
uv run --no-project --with rjsmin python scripts/sync_skill.py
```

Run it with `--check` before every commit; it fails when a copy is stale or `SKILL.md` is over the 62,500-character working budget.

The rules come from research and rulings in `merge-marketing-email-specs`, and every check cites its source there. When one of those rulings changes, the matching check here changes too.

## Publishing it in Figma

In a Figma Design file that belongs to the MERGE organization, open the agent, click **+** in its prompt box, choose **Skills**, and upload `SKILL.md`. Upload it again after each change. To share it, open **Manage skills**, choose the skill's **More actions**, then **Publish**, **Private**, and the organization; an admin can then mark it Recommended under **Admin**, **Resources**, **Skills**. [figma-agent-skills.md](../figma-agent-skills.md) has the details.

## Version and testing

Version 0.1.0, 2026-10-06. The scripts were tested through `use_figma` on 2026-10-05 against the TOFU email file (`Dqux2GL6tXD0boEEW3QCax`), and the color-mode pass against Andrew's Abbott library (`0VTZx0ZXc08vCIjdzb8Xza`). **TBD:** the first run in Figma's agent, and the evaluations at step 5 of the [plan](PLAN.md).

## Version history

- **0.1.0 (2026-10-06):** First version of `SKILL.md`, from checklist 0.3.0 and the tested scripts.

## Credit

The structure is adapted from [merge-build-readiness](../merge-build-readiness/README.md), which adapted it from the Figma Community skill create-anatomy, from [uSpec](https://github.com/redongreen/uSpec) by Ian Guisard, MIT license.

# merge-email-check

`merge-email-check` is a skill for Figma's own agent that checks an email design against email best practices before it's built. A designer runs `/merge-email-check` on an email's mobile and desktop frames, answers one question, and gets a scorecard of 31 checks with evidence linked to each layer, then the fixes to make first. It works for any email project, MERGE's or a client's: universal checks come from WCAG 2.2, email law and how mail apps behave, and house checks use MERGE's numbers as defaults that a project can change. It also runs from Claude Code through the Figma MCP. It never changes the design apart from comments the designer asks for. This README is for whoever maintains and publishes it.

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

Only `SKILL.md` and the two companion skills' `SKILL.md` files go to Figma, because Figma's custom skills must be a single Markdown file with at most 65,536 characters of instructions. Everything else is here to maintain it.

| File | What it's for |
| --- | --- |
| [SKILL.md](SKILL.md) | The skill, and the one file uploaded to Figma. Its scripts are minified copies of the ones in `scripts/`. |
| [../merge-email-check-plan/SKILL.md](../merge-email-check-plan/SKILL.md) | The companion skill that turns a report into a remediation plan, uploaded to Figma alongside. It has no scripts. |
| [../merge-email-check-annotate/SKILL.md](../merge-email-check-annotate/SKILL.md) | The companion skill that writes a report's findings onto the layers as Dev Mode annotations. It carries scripts 03 and 04, synced from `scripts/`. |
| [checklist.md](checklist.md) | The full checklist, EM-01 to EM-31, with each check's reason, rule, tier and source. `SKILL.md` carries a compressed form. |
| [scripts/](scripts/README.md) | The four read-only Plugin API scripts, what testing found, and `sync_skill.py`, which copies them into `SKILL.md`. |
| [PLAN.md](PLAN.md) | The build plan and the decisions behind it. |
| [EVAL.md](EVAL.md) | The three test cases, what each run should find, and the results. |
| [eval-prompts.md](eval-prompts.md) | The exact prompts and links for each evaluation run. |

## Changing the skill

Change a check in [checklist.md](checklist.md) first, then its line in `SKILL.md`. Edit scripts in `scripts/`, never in `SKILL.md`, run each changed script through the Figma MCP's `use_figma` tool against a real file, then copy them in and check the length:

```bash
uv run --no-project --with rjsmin python scripts/sync_skill.py
```

Run it with `--check` before every commit; it fails when a copy is stale or `SKILL.md` is over the 63,500-character working budget, which Steve raised from 62,500 on 2026-10-06.

The rules come from research and rulings in `merge-marketing-email-specs`, and every check cites its source there. When one of those rulings changes, the matching check here changes too.

## Publishing it in Figma

In a Figma Design file that belongs to the MERGE organization, open the agent, click **+** in its prompt box, choose **Skills**, and upload `SKILL.md`. Upload it again after each change. To share it, open **Manage skills**, choose the skill's **More actions**, then **Publish**, **Private**, and the organization; an admin can then mark it Recommended under **Admin**, **Resources**, **Skills**. [figma-agent-skills.md](../figma-agent-skills.md) has the details.

## Version and testing

Version 0.3.1, 2026-10-08. The scripts were tested through `use_figma` on 2026-10-05 and 2026-10-06 against the TOFU email file (`Dqux2GL6tXD0boEEW3QCax`) and the deliberate-faults file (`pgpRQNF2ey2fXl3lMS9D2O`), and the color-mode pass against Andrew's Abbott library (`0VTZx0ZXc08vCIjdzb8Xza`). In Figma's agent, version 0.2.0 matched 113 of 120 expected results on the Faults page and 0.2.1 matched 30 of 30 on the Control, on 2026-10-06. In Claude Code, version 0.3.0 matched 123 or 124 of 124 on the Faults page and 31 of 31 on the Control, on both Opus 5.5 and Sonnet 5.5, on 2026-10-08. [EVAL.md](EVAL.md#results) holds every run. **TBD:** version 0.3.x in Figma's agent, cases 1, 2 and 4, and a run that delivers comments.

## Version history

- **0.3.1 (2026-10-08):** From the 2026-10-08 audit and the first Claude Code runs: EM-30 names the default rule, the "Tested with" line is current, and the credit line moves to this README to save room.
- **0.3.0 (2026-10-07):** EM-31 checks that alt text describes its image. The report gives its scope's ID, and step 8 also offers the new companion `merge-email-check-annotate`, which writes the findings as Dev Mode annotations.
- **0.2.2 (2026-10-06):** "Fix these first" holds only checks that failed or partly passed; a proposed new check goes under "Problems no check covers". From the Control run, which put a proposal first, ranked Must.
- **0.2.1 (2026-10-06):** From the first full run in Figma's agent: a check is N/A for an email with nothing for it to look at; EM-20 and EM-22 state the default rule; a copy of an email inside a mail-app frame comes out of the list, so it isn't counted twice.
- **0.2.0 (2026-10-06):** The scorecard gives each email in the scope its own result column. The remediation plan moves into the companion skill `merge-email-check-plan`, which step 8 now offers. The checks script is split into a layout script and an images script, and the fingerprint becomes script 03, because Figma's agent rejects any script over 20,000 characters; the first run in Figma's agent failed on the 30,292-character checks script. Step 3 now passes only the fields the scripts read in `__EMAILS__`.
- **0.1.1 (2026-10-06):** The skill takes the node in a pasted link as its scope, as the evaluation prompts expect.
- **0.1.0 (2026-10-06):** First version of `SKILL.md`, from checklist 0.3.0 and the tested scripts.

## Credit

The structure is adapted from [merge-build-readiness](../merge-build-readiness/README.md), which adapted it from the Figma Community skill create-anatomy, from [uSpec](https://github.com/redongreen/uSpec) by Ian Guisard, MIT license.

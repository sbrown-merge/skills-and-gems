# merge-email-check

`merge-email-check` checks an email design in Figma against email best practices before it's built. A designer runs `/merge-email-check` on an email's mobile and desktop frames, answers one question, and gets a scorecard of 31 checks with evidence linked to each layer, then the fixes to make first. It works for any email project, MERGE's or a client's: universal checks come from WCAG 2.2, email law and how mail apps behave, and house checks use MERGE's numbers as defaults that a project can change. It never changes the design apart from comments the designer asks for. From version 0.4.0 it's built in two versions from one source: a single file for Figma's own agent, and a Claude Code skill that works through the Figma MCP server. Both run the same scripts and the same rules, so they give the same results on the same design. This README is for whoever maintains, publishes or installs it.

## Contents

<!-- toc -->
- What's in this folder
- How the two versions stay in step
- Changing the skill
- Publishing it in Figma
- Installing it in Claude Code
- Version and testing
- Version history
- Credit
<!-- /toc -->

## What's in this folder

Two folders hold what gets used, and everything else is the source they're built from or records for maintainers. Never edit `figma/` or `claude/` by hand, because the next build overwrites them.

| File | What it's for |
| --- | --- |
| [figma/SKILL.md](figma/SKILL.md) | Built. The version for Figma's agent, and the one file uploaded to Figma, because Figma's custom skills must be a single Markdown file with at most 65,536 characters of instructions. Its scripts are minified inline. |
| [claude/](claude/SKILL.md) | Built. The Claude Code version: a short `SKILL.md`, the readable scripts in `scripts/`, and the full checklist in `references/`. It's copied whole into `~/.claude/skills/merge-email-check/`. |
| [skill.toml](skill.toml) | The manifest: the version, the 31 check IDs in report order, the scripts, and each version's settings. |
| [templates/](templates/) | The skeleton of each version's `SKILL.md`: `figma.md` and `claude-code.md`. The Claude template isn't called `claude.md`, because on a Mac that name loads as a `CLAUDE.md` instructions file. |
| [shared/](shared/) | The text both versions carry word for word: the scoring rules, the report template, the pre-send check, the 31 check rules and the read-only rules. |
| [checklist.md](checklist.md) | The full checklist, EM-01 to EM-31, with each check's reason, rule, tier and source. `shared/checks.md` carries the compressed rules that decide each result. |
| [scripts/](scripts/README.md) | The Plugin API scripts, the only copies anyone edits: four read-only ones for this skill and the annotation writer for merge-email-check-annotate, what testing found, and `sync_skill.py`, which builds both versions. |
| [../merge-email-check-plan/SKILL.md](../merge-email-check-plan/SKILL.md) | The companion skill that turns a report into a remediation plan, uploaded to Figma alongside. It has no scripts. |
| [../merge-email-check-annotate/SKILL.md](../merge-email-check-annotate/SKILL.md) | The companion skill that writes a report's findings onto the layers as Dev Mode annotations. It carries scripts 03 and 04, synced in place from `scripts/`. |
| [PLAN.md](PLAN.md) | The build plan and the decisions behind it. |
| [EVAL.md](EVAL.md) | The test cases, what each run should find, and the results. |
| [eval-prompts.md](eval-prompts.md) | The exact prompts and links for each evaluation run. |

## How the two versions stay in step

Anything that decides a result lives once, in `scripts/`, `shared/` and `checklist.md`, and both versions are built from it. Only the plumbing differs: Figma's agent runs scripts with its own tool, takes screenshots itself and hands the report over as a fenced block to download, while Claude Code runs the same scripts through the Figma MCP server's `use_figma`, takes screenshots with `get_screenshot` and can save the report as a file. The Figma MCP server can't add comments, so the Claude Code version doesn't offer them.

`sync_skill.py --check` fails a commit when a built file is stale, when either version leaves out a check or names a different version, when the Claude version doesn't name every script, when the Figma version is over its budget, or when `claude/` holds a file the tool didn't make. Both versions share one version number, because the report says which version checked an email, and two runs should only be compared when they used the same rules.

## Changing the skill

Change a check in [checklist.md](checklist.md) first, then its compressed rule in [shared/checks.md](shared/checks.md), and its ID in [skill.toml](skill.toml) if a check is added or removed. Change text both versions share in `shared/`, and text only one version needs in its template. Edit scripts only in `scripts/`, run each changed script through the Figma MCP's `use_figma` tool against a real file, readable and minified, then build both versions:

```bash
uv run --no-project --with rjsmin python scripts/sync_skill.py
```

Run it with `--check` before every commit. The Figma version's working budget is 63,500 characters, which Steve raised from 62,500 on 2026-10-06.

The rules come from research and rulings in `merge-marketing-email-specs`, and every check cites its source there. When one of those rulings changes, the matching check here changes too.

## Publishing it in Figma

In a Figma Design file that belongs to the MERGE organization, open the agent, click **+** in its prompt box, choose **Skills**, and upload [figma/SKILL.md](figma/SKILL.md). Upload it again after each change. To share it, open **Manage skills**, choose the skill's **More actions**, then **Publish**, **Private**, and the organization; an admin can then mark it Recommended under **Admin**, **Resources**, **Skills**. [figma-agent-skills.md](../figma-agent-skills.md) has the details.

## Installing it in Claude Code

Build and install in one step, which replaces any earlier copy in `~/.claude/skills/merge-email-check/`:

```bash
uv run --no-project --with rjsmin python scripts/sync_skill.py --install
```

It needs the remote Figma MCP server connected, with its `use_figma` and `get_screenshot` tools, and Figma's `figma-use` skill, which comes with Figma's plugin. Then paste a link to the email in Claude Code with `/merge-email-check`.

## Version and testing

Version 0.4.0, 2026-10-08. The scripts were tested through `use_figma` on 2026-10-05 and 2026-10-06 against the TOFU email file (`Dqux2GL6tXD0boEEW3QCax`) and the deliberate-faults file (`pgpRQNF2ey2fXl3lMS9D2O`), and the color-mode pass against Andrew's Abbott library (`0VTZx0ZXc08vCIjdzb8Xza`). On 2026-10-08 the readable scripts, comments included, were run through `use_figma` on the faults file's page 01 and gave results identical to the minified copies, which is what lets the Claude Code version run them. In Figma's agent, version 0.2.0 matched 113 of 120 expected results on the Faults page and 0.2.1 matched 30 of 30 on the Control, on 2026-10-06. In Claude Code, version 0.3.0 matched 123 or 124 of 124 on the Faults page and 31 of 31 on the Control, on both Opus 5.5 and Sonnet 5.5, on 2026-10-08. [EVAL.md](EVAL.md#results) holds every run. **TBD:** the 0.4.0 Claude Code version on the Faults page, 0.3.x or later in Figma's agent, cases 1, 2 and 4, and a run in Figma's agent that delivers comments.

## Version history

- **0.4.0 (2026-10-08):** Built in two versions from one source. `figma/SKILL.md` is the old single file without its Claude Code wording, test notes and script markers, 569 characters smaller; `claude/` is a new Claude Code skill that runs the readable scripts through the Figma MCP server, loads `figma-use` first, says in its description when not to use it, can save the report as a file, and doesn't offer comments, which the MCP server can't add. `skill.toml`, `templates/` and `shared/` are new, and `sync_skill.py` builds and checks both versions. The top-level `SKILL.md` is gone; upload `figma/SKILL.md` instead.
- **0.3.2 (2026-10-08):** From the Claude Code runs of cases 1 and 2: a mail-app copy comes out only when its original is also in the scope, and the skill never changes the scope itself; an email with nothing drawn is N/A on every check but EM-01; EM-25 no longer turns Couldn't check when the file has no notes; EM-09 states its rule over the images screenshotted; EM-31 is N/A with no alt notes; EM-17 doesn't take a canvas caption as a fallback note.
- **0.3.1 (2026-10-08):** From the 2026-10-08 audit and the first Claude Code runs: EM-30 names the default rule, the "Tested with" line is current, and the credit line moves to this README to save room.
- **0.3.0 (2026-10-07):** EM-31 checks that alt text describes its image. The report gives its scope's ID, and step 8 also offers the new companion `merge-email-check-annotate`, which writes the findings as Dev Mode annotations.
- **0.2.2 (2026-10-06):** "Fix these first" holds only checks that failed or partly passed; a proposed new check goes under "Problems no check covers". From the Control run, which put a proposal first, ranked Must.
- **0.2.1 (2026-10-06):** From the first full run in Figma's agent: a check is N/A for an email with nothing for it to look at; EM-20 and EM-22 state the default rule; a copy of an email inside a mail-app frame comes out of the list, so it isn't counted twice.
- **0.2.0 (2026-10-06):** The scorecard gives each email in the scope its own result column. The remediation plan moves into the companion skill `merge-email-check-plan`, which step 8 now offers. The checks script is split into a layout script and an images script, and the fingerprint becomes script 03, because Figma's agent rejects any script over 20,000 characters; the first run in Figma's agent failed on the 30,292-character checks script. Step 3 now passes only the fields the scripts read in `__EMAILS__`.
- **0.1.1 (2026-10-06):** The skill takes the node in a pasted link as its scope, as the evaluation prompts expect.
- **0.1.0 (2026-10-06):** First version of `SKILL.md`, from checklist 0.3.0 and the tested scripts.

## Credit

The structure is adapted from [merge-build-readiness](../merge-build-readiness/README.md), which adapted it from the Figma Community skill create-anatomy, from [uSpec](https://github.com/redongreen/uSpec) by Ian Guisard, MIT license.

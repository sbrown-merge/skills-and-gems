# merge-build-readiness

`merge-build-readiness` is a skill for Figma's own agent that checks whether a Figma file is ready for a coding agent, such as Claude Code, to build from. A designer runs `/merge-build-readiness` in a file, answers one question, and gets a scorecard of 34 checks with evidence linked to each layer, then the fixes to make first. It works for any MERGE project, and it never changes the design apart from comments or Dev Mode annotations the designer asks for. This README is for whoever maintains and publishes it.

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

Two skills go to Figma for designers: `SKILL.md`, and the companion [../merge-build-readiness-annotate/SKILL.md](../merge-build-readiness-annotate/SKILL.md), which writes a report's findings onto the layers as Dev Mode annotations. The test-mode skill, [../merge-build-readiness-test/SKILL.md](../merge-build-readiness-test/SKILL.md), goes to Figma privately, for the maintainer. Everything else is here to maintain them.

| File | What it's for |
| --- | --- |
| [SKILL.md](SKILL.md) | The skill, and the one file uploaded to Figma, because Figma's custom skills must be a single Markdown file with at most 65,536 characters of instructions. Its scripts are minified copies of the ones in `scripts/`. |
| [checklist.md](checklist.md) | The full checklist, with each check's reason, rule, source and platforms. `SKILL.md` carries a compressed form. |
| [scripts/](scripts/README.md) | The read-only Plugin API scripts, one file each, with what testing found. `SKILL.md` carries them inline. |
| [PLAN.md](PLAN.md) | The build plan and the decisions behind it. |
| [research/](research/) | The three research notes from 2026-10-03. |
| `diagnostics/` | Logs pasted back from test-mode runs inside Figma, one dated file each. |

## Changing the skill

Change a check in `checklist.md` first, then carry the change into the compressed rule in `SKILL.md`. Change a script in `scripts/`, test it against a real file through the Figma MCP's `use_figma` tool, then copy it into the skill files with the sync tool rather than by hand. The tool minifies each script (comments and spare whitespace out, nothing renamed) and reports each skill's length against Figma's 65,536-character limit and our 62,500-character working budget, set in `sync_skill.py`:

```bash
uv run --no-project --with rjsmin python scripts/sync_skill.py
```

Check that the skills still match the scripts and fit before you commit:

```bash
uv run --no-project --with rjsmin python scripts/sync_skill.py --check
```

The minified copies are what agents run, so after a change, run the minified version once against a real file as well.

## Publishing it in Figma

Anyone can publish the skill to the organization; an admin is only needed to recommend it (Steve Brown, 2026-10-03).

1. In a Figma Design file that belongs to the MERGE organization, open the agent, click **+** in its prompt box, choose **Skills**, and add a skill by uploading `SKILL.md`. The skill's name, `merge-build-readiness`, becomes its slash command.
2. From **Manage skills**, open the skill's **More actions**, choose **Publish**, then **Private**, and pick the whole organization.
3. Ask a Figma admin to mark it Recommended under **Admin**, **Resources**, **Skills**, so every designer can find it.
4. Upload and publish `../merge-build-readiness-annotate/SKILL.md` the same way, so designers can run `/merge-build-readiness-annotate` after a report.
5. Upload `../merge-build-readiness-test/SKILL.md` the same way, but leave it private to you; it's for test-mode runs, not for designers.
6. Record the version and what it was tested on in the table below.

If a teammate can see the skill but can't run it, they need to switch it on with the toggle under **+**, **Add context**, **Skills** (a fix reported on Figma's forum on 2026-09-29).

## Version and testing

| Version | Date | Tested on | Result |
| --- | --- | --- | --- |
| 0.3 | 2026-10-05 | Script 00 rerun, minified, through `use_figma` on Andrew's library (IVA hint true) and the email test file (false) | Not yet run in Figma's agent; the annotate skill hasn't run either. |
| 0.2 | 2026-10-05 | Scripts 08 and 09 rerun, minified, through `use_figma` against the same library | Contrast backgrounds and instance loading fixed; see [scripts/README.md](scripts/README.md). Not yet run in Figma's agent. |
| 0.1 | 2026-10-04 | Scripts 00 to 10 and 12, read-only, readable and minified versions alike, through `use_figma` in Claude Code (Claude Opus 5.5), against Andrew's Abbott IVA design library, file key `0VTZx0ZXc08vCIjdzb8Xza` | The read scripts work; see [scripts/README.md](scripts/README.md). Script 11 hasn't run. Figma's agent ran the whole skill on `04 / Navigation` on 2026-10-04 and 2026-10-05 ([diagnostics/](diagnostics/)); it hasn't been evaluated. |

Test mode ran twice in Figma's agent on 2026-10-04 ([run 1](<diagnostics/2026-10-04 test-mode run 1.json>), [run 2](<diagnostics/2026-10-04 test-mode run 2.json>)): scripts ran, annotations and comments wrote, the fingerprint held, and screenshots worked, though small text wasn't reliably readable in them. Nothing in Figma's agent can read Ready for dev status. The evaluations (build step 6) come next. What we learned for future Figma skills is in [figma-agent-skills.md](../figma-agent-skills.md).

## Version history

- **0.3.1** (2026-10-05): scripts 08 and 09 find a layer among its siblings by `id` rather than as an object, because a layer found inside an instance is a separate copy and `indexOf` missed it, which skipped the layers beneath it. Script 09's set of targets holds IDs for the same reason. Results on `04 / Navigation` are unchanged ([scripts README](scripts/README.md#what-use_figma-can-and-cant-read)). It's 62,106 characters.
- **0.3** (2026-10-05): after the fourth run ([report](<diagnostics/2026-10-05 fourth run, 04 Navigation.md>)), contrast screenshots show the layer with its background, and when one can't settle it the script's ratio decides; the fenced copy uses full URLs while the readable copy may use Figma's layer links; the platform defaults to IVA when script 00's `ivaHint` is true; and annotation delivery moved to the new `merge-build-readiness-annotate` skill, bringing the main skill to 62,047 characters and the budget back to 62,500.
- **0.2** (2026-10-05): after the third run in Figma ([report](<diagnostics/2026-10-05 third run, 04 Navigation.md>)), scripts 08 and 09 find the real background under a layer and load every instance's contents first; BR-20 names the IVA as touch; BR-08's off-grid values go in its Fix these first item; script 09 returns small targets' IDs. It's 64,547 characters, so the working budget rose to 64,600.
- **0.1** (2026-10-04): first version: 34 checks, 15 scripts. Revised the same day after an independent audit against [claude-skills-best-practices.md](../claude-skills-best-practices.md), then cut from 88,746 to 60,697 characters of instructions for Figma's 65,536 limit by minifying the scripts, moving test mode into its own skill, and tightening the wording. After its first run in Figma (report in [diagnostics/](<diagnostics/2026-10-04 first run, 04 Navigation.md>)), the report goes in a fenced block rather than on the canvas, and a closing step offers a Markdown file and a remediation plan. After its second run (2026-10-05), the report goes in the chat twice, as readable text and then as a fenced block to download, keeps to the template's sections, and the closing step offers only the remediation plan; it's now 62,493 characters.

## Credit

The skill's structure, with its execution contract, read-only guard, one script per step, judgment step and final proof that the source is unchanged, is adapted from the Figma Community skill `create-anatomy`, which comes from [uSpec](https://github.com/redongreen/uSpec) by Ian Guisard under the MIT license.

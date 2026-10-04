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

Only `SKILL.md` goes to Figma. Everything else is here to maintain it.

| File | What it's for |
| --- | --- |
| [SKILL.md](SKILL.md) | The skill, and the one file uploaded to Figma, because Figma's custom skills must be a single Markdown file. |
| [checklist.md](checklist.md) | The full checklist, with each check's reason, rule, source and platforms. `SKILL.md` carries a compressed form. |
| [scripts/](scripts/README.md) | The read-only Plugin API scripts, one file each, with what testing found. `SKILL.md` carries them inline. |
| [PLAN.md](PLAN.md) | The build plan and the decisions behind it. |
| [research/](research/) | The three research notes from 2026-10-03. |
| `diagnostics/` | Logs pasted back from test-mode runs inside Figma, one dated file each. |

## Changing the skill

Change a check in `checklist.md` first, then carry the change into the compressed rule in `SKILL.md`. Change a script in `scripts/`, test it against a real file through the Figma MCP's `use_figma` tool, then copy it into `SKILL.md` with the sync tool rather than by hand, so the uploaded copy is always the tested one:

```bash
python3 scripts/sync_skill.py
```

Check that the two still match before you commit:

```bash
python3 scripts/sync_skill.py --check
```

## Publishing it in Figma

Anyone can publish the skill to the organization; an admin is only needed to recommend it (Steve Brown, 2026-10-03).

1. In a Figma Design file that belongs to the MERGE organization, open the agent, click **+** in its prompt box, choose **Skills**, and add a skill by uploading `SKILL.md`. The skill's name, `merge-build-readiness`, becomes its slash command.
2. From **Manage skills**, open the skill's **More actions**, choose **Publish**, then **Private**, and pick the whole organization.
3. Ask a Figma admin to mark it Recommended under **Admin**, **Resources**, **Skills**, so every designer can find it.
4. Record the version and what it was tested on in the table below.

If a teammate can see the skill but can't run it, they need to switch it on with the toggle under **+**, **Add context**, **Skills** (a fix reported on Figma's forum on 2026-09-29).

## Version and testing

| Version | Date | Tested on | Result |
| --- | --- | --- | --- |
| 0.1 | 2026-10-04 | Scripts 00 to 10 and 12, read-only, through `use_figma` in Claude Code (Claude Opus 5.5), against Andrew's Abbott IVA design library, file key `0VTZx0ZXc08vCIjdzb8Xza` | The read scripts work; see [scripts/README.md](scripts/README.md). Scripts 11, 13 and 14 haven't run. No agent has run the skill as a whole, inside Figma or anywhere else, and it hasn't been evaluated. |

Test mode in Figma (build step 5) and the evaluations (build step 6) come next.

## Version history

- **0.1** (2026-10-04): first version: 34 checks, 15 scripts, test mode. Revised the same day after an independent audit against [claude-skills-best-practices.md](../claude-skills-best-practices.md).

## Credit

The skill's structure, with its execution contract, read-only guard, one script per step, judgment step and final proof that the source is unchanged, is adapted from the Figma Community skill `create-anatomy`, which comes from [uSpec](https://github.com/redongreen/uSpec) by Ian Guisard under the MIT license.

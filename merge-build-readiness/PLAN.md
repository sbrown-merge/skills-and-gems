---
title: "merge-build-readiness: the build plan"
description: "The agreed plan for a Figma agent skill that checks whether a Figma file is ready for agentic builds, for any project: what it is, what it checks, how it runs inside Figma, its test mode, and the build order. Agreed with Steve Brown on 2026-10-03."
type: plan
status: draft
created: 2026-10-03
maintainer: Steve Brown
tags: [figma, figma-agent, skill, agentic-build, design-system, audit]
---

# merge-build-readiness: the build plan

This is the plan for a skill that runs inside Figma's own agent and checks whether a Figma file is ready for a coding agent, such as Claude Code, to build from. Steve Brown agreed it on 2026-10-03, at the end of a research session that started from an audit of the Abbott IVA design library. The skill must work for any MERGE project, not only MERGE One or Abbott. On 2026-10-03 the same day's session drafted [checklist.md](checklist.md), step 2 of the build order below, and Steve's first comments on it are recorded here as decisions. The checklist is waiting for Steve to read it in full; step 3 starts after he approves it.

## Contents

<!-- toc -->
- What we're building, and why
- What the research settled
- Decisions
- The folder
- What the skill checks
- How a run works
- Test mode
- Build order
- Open questions
- Where this came from
<!-- /toc -->

## What we're building, and why

The skill is a slash command, `/merge-build-readiness`, that a designer runs in a Figma file. It checks the file against a checklist of practices that keep agent-built code accurate, and reports a scorecard with evidence linked to each layer, then the top fixes in order. Steve will publish it to the whole MERGE organization in Figma and have an admin mark it Recommended, so every designer can find it.

It exists because the same file problems keep turning into code problems: hardcoded values become hardcoded code, detached copies become duplicate components, and undrawn states become guesses. We found these first on MERGE One and wrote them up as a playbook, then saw most of them again in the Abbott library audit on 2026-09-30. A skill puts the check in the designer's hands, inside the file, before a coding agent ever reads it.

## What the research settled

Three research notes in [research/](research/) hold the sources. These are the findings the design depends on:

- **One file only.** Figma's custom skills must be a single Markdown file following the Agent Skills spec, with no `scripts/`, `references/` or `assets/` folders ([Figma help, updated 2026-09-23](https://help.figma.com/hc/en-us/articles/40283639496599)). The checklist, procedure, scripts and report format all live in `SKILL.md`.
- **Scripts run.** The Figma Community skill `create-anatomy`, which Steve tested and says performs well, embeds Plugin API JavaScript in its body and has the agent run it step by step. It even calls `figma.loadAllPagesAsync()`, which the MCP's `use_figma` tool forbids. So precise, script-based reads work inside Figma, and a single file of almost 1,000 lines still performs.
- **Publishing is from the chat, not the admin panel.** Anyone can add a skill from the + button in the agent's prompt box (Skills, then add a skill) and share it with the organization; an admin then marks it Recommended under Admin, Resources, Skills. Publishing doesn't need an admin (Steve, 2026-10-03).
- **The model is unknown.** Figma doesn't say which model runs its Design agent and mentions several vendors. So the skill follows Anthropic's guidance for Opus 5.5 and Sonnet 5.5 (reasons rather than capital letters, explicit scope, report everything and then rank, no "think carefully", no request to write out reasoning) and assumes nothing Claude-specific.
- **What a coding agent can't see shapes the checks.** Figma's MCP server returns only each variable's default mode, returns annotations only when it reads the annotated layer itself, and can't read inside slots. Figma's own agent only references a library once it's published.

## Decisions

Steve made these on 2026-10-03: the first eight while agreeing the plan, the rest while commenting on the checklist draft.

| Decision | What it means |
| --- | --- |
| The name is `merge-build-readiness` | It becomes the slash command, and the MERGE prefix avoids clashing with Community skills, as Figma advises. |
| Shift Nudge stays separate, except for accessibility | This skill checks build readiness, not visual quality, and the repo's `sn-ui-checklist` skill covers visual quality. The exception, decided later the same day, is accessibility: text contrast, non-text contrast and target size are checked here against WCAG 2.2 AA, because a coding agent copies a failing color or size straight into the product. |
| Only what can be made in the file | The skill checks only what a person or an agent can create in the Figma file. It uses no web search, no connectors, no repo and no codebase. So Code Connect checks are out, and code syntax is checked only for presence and well-formed values. |
| A linked repo is detected, not checked | A file that uses the linked-repo approach says so on its first page, which is usually named Cover. It's one line, `Linked repo: https://github.com/<owner>/<repo>`, set out in [checklist.md BR-06](checklist.md#br-06-a-linked-repo-signal-is-detected-and-reported). Version 1 detects that signal and reports it. Checks that read the repo through Figma's GitHub connector are the first item in `UPGRADES.md`. Steve is giving teams this option, through the GitHub connector as in the Abbott repo. |
| It asks how to deliver findings | The opening question asks for report only (the default), comments, or Dev Mode annotations, because nobody would discover those options otherwise. |
| It never changes the design | The only writes are the comments or annotations the person chose. A guard blocks every other write, and the last step proves the design is unchanged. |
| Severity uses Must, Should and Could | The same ranking as the MERGE One playbook. |
| Test mode exists | See its section below. |
| Web is the default platform | The opening question offers Web, iOS, Android or Other, and defaults to Web, because almost all MERGE work is web-based. Much of it is a headless CMS with a React front end, built mobile first, so the Web checks cover both clicking and tapping. |
| The 4 and 8px grid is checked | Off-grid spacing and sizes are a common problem in our file handoffs, so the playbook's grid practice stays in, as BR-08. |
| CMS content is checked | Where text comes from a CMS, the file should show its longest, shortest and empty content, with its source and limit in a Content annotation (BR-27). |
| Dev Mode annotations, not on-canvas notes | Build guidance belongs in Dev Mode annotations attached to the layer, not in notes drawn on the canvas (BR-25). A standard schema for Figma's four preset categories is set out in [checklist.md](checklist.md#dev-mode-annotation-schema) and checked by BR-26. People may add other categories, such as Design or Agent feedback; those aren't scored, but the report lists every annotation outside the schema so a build brief can note it. |
| Every desktop view has a mobile view | Web product files need a mobile view for each desktop view, because we build mobile first; tablet views are optional (BR-31). This replaced a broader mobile-first check that would have been hard to enforce. |

## The folder

Everything lives in `skills-and-gems/merge-build-readiness/`. Only `SKILL.md` is uploaded to Figma; the rest is for maintaining it.

| File | What it's for |
| --- | --- |
| `SKILL.md` | The skill, and the one file uploaded to Figma. Frontmatter holds only `name` and `description`, because uploads elsewhere reject keys outside the spec and Figma doesn't say what it accepts. The version and a "Tested with" line go in the body. |
| `README.md` | For maintainers: what it does, how to publish and recommend it in Figma, the current version, what it was tested on, version history, and credit to uSpec (Ian Guisard, MIT) for the structural patterns borrowed from `create-anatomy`. |
| `checklist.md` | The full checklist, each check with its reason, source and platform notes. `SKILL.md` carries the compressed form. |
| `PLAN.md` | This plan. |
| `research/` | The three research notes from 2026-10-03. |
| `scripts/` | The read-only Plugin API scripts, one file each, tested at step 3, with a README of what they found. `SKILL.md` carries them inline. |
| `diagnostics/` | Logs pasted back from test-mode runs inside Figma. |
| `EVAL.md` | Test cases, their expected findings, and each run's results. |
| `UPGRADES.md` | Improvements waiting on something outside our control. |

## What the skill checks

The checklist starts from the MERGE One playbook ("MERGE One UI: Figma practices for agentic builds", version 0.1, 2026-09-29, in merge-one-related's `Figma/` folder), drops everything specific to shadcn, React or a codebase, and adds what Figma itself recommends ([research note](research/2026-10-03-figma-file-practices-for-agents.md)). It gets its own IDs, `BR-01` onward, each pointing back to its playbook practice where there is one. The plan first expected about 25 checks in five groups; the draft at version 0.5 has 34 in six, after Steve's comments added the grid, CMS content, annotation and accessibility checks. [checklist.md](checklist.md) holds the full list; this table gives the shape:

| Group | What it covers |
| --- | --- |
| Library and file | Library published (checked first, because nothing else matters to Figma's agent until it is); a cover or Start Here page; page order; status marked in the file and Ready for dev used; an Examples page; sections an agent can be pointed at; a linked-repo signal, detected and reported. |
| Variables | Colors, spacing, radius and type bound rather than typed in; spacing and sizes on the 4 and 8px grid; a primitive layer and a semantic layer that aliases it; no variable scoped to everything; descriptions; code syntax present and well formed; font weights as numbers; a warning that coding agents only see the default mode. |
| Styles | Text and effect styles bound to variables. |
| Components | Reused, not detached; auto layout with deliberate hug, fill and fixed sizing; each variant property controls one thing; sets under about 30 variants; consistent property names, with `true` and `false` for booleans; the states the platform needs (pressed and focus for touch, hover for the web); descriptions; named child layers; a warning that coding agents can't see inside slots. |
| Handoff | Build rules in annotations on the layer itself, not in placeholder copy; Dev Mode annotations rather than on-canvas notes, written to the schema, with annotations outside it listed for the build brief; realistic content, with long, short and empty versions of CMS content; unique names; no default layer names; no stray instances; a mobile view for every desktop view. |
| Accessibility | Text contrast, non-text contrast and target size, against WCAG 2.2 AA. |

Every check can come back Pass, Partly, Fail, Couldn't check or N/A, and every result carries evidence linked to the layer.

## How a run works

The structure follows `create-anatomy`, which works in Figma: an execution contract, an input contract, a copyable workflow checklist, one script per precise step, one step of judgment over the data the scripts returned, a write guard, and a final step that proves the source is unchanged.

1. **Ask once, then run without stopping.** One opening message asks for the scope (a page, section or component; the whole file only if it's small), the target platform (Web by default), and how to deliver findings (report only, comments, or Dev Mode annotations). Each has a default, so a reply of "go" works.
2. **Read the file by script.** Low-freedom scripts, run unchanged, gather the inventory: variables with scopes, code syntax and descriptions; styles; component sets with variants, properties and descriptions; bound and literal values; layer names; annotations; publish status. Placeholders such as `__SCOPE_ID__` are the only edits.
3. **Judge.** Score each check from the data, with no scripts in this step.
4. **Report.** The scorecard, then the top fixes in order, each naming its check.
5. **Deliver, if asked.** Comments go on the layer at fault and show under the runner's name. Annotations go on the layer at fault in the existing Development category, because a new category can't be renamed or deleted later, and are written to the annotation schema.
6. **Prove nothing changed.** Re-read the source and confirm it's intact; if it isn't, say so and tell the person to undo before trusting anything.

## Test mode

`/merge-build-readiness test` checks what Figma's agent can actually do, so the skill is built on evidence from inside Figma rather than assumptions. It changes nothing in the design.

It tries each read the checklist depends on and records whether it worked and what came back: variables with scopes, code syntax and descriptions; styles; components and descriptions; annotations; prototype links; Ready for dev status; publish status; slot contents; loading every page. If the person allows it, it also tries a comment and an annotation on a throwaway layer it creates and then deletes.

It ends with one JSON log in the chat carrying the skill version, the date, the file key and each probe's result. Steve pastes the log into `diagnostics/` as a dated file, and the next build session reads it to refine the skill. The first test-mode run happens before the evaluations.

## Build order

1. **Save the research and this plan.** Done on 2026-10-03.
2. **Write `checklist.md`**, then stop for Steve's review. It decides everything downstream. Drafted on 2026-10-03 and revised to version 0.5 from Steve's comments, which settled the linked-repo wording, the annotation schema and the mobile check; waiting for his full read.
3. **Test each script in Claude Code** against Andrew's Abbott library (file key `0VTZx0ZXc08vCIjdzb8Xza`) through the Figma MCP before it goes into `SKILL.md`, so the first Figma run isn't the code's first run. Remember that `use_figma` forbids `loadAllPagesAsync`; use `page.loadAsync()` per page there, which worked in the 2026-09-30 audit. Done on 2026-10-03: all nine scripts in [scripts/](scripts/README.md) ran against the library, which settled BR-05's node budget and how slots read, and showed that `use_figma` can't read `devStatus`, the file thumbnail or style publish status.
4. **Write `SKILL.md`**, including test mode. Check its frontmatter against the spec, and have a separate Opus 5.5 agent (not the author) audit it against [claude-skills-best-practices.md](../claude-skills-best-practices.md), sections A to I.
5. **Run test mode in Figma.** Steve uploads the skill privately, runs `/merge-build-readiness test`, and pastes the log into `diagnostics/`. Adjust the skill to what the log shows.
6. **Run the evaluations.** Three cases, each first without the skill as a baseline, then with it, in Claude Code and in Figma's agent:
   - Andrew's Abbott library, whose expected findings come from the 2026-09-30 audit in the abbott-fs-libre-global-iva-specs repo (`captures/2026-09-30 IVA design library audit.md`).
   - A section of the MERGE One Production file.
   - A small test file with deliberate faults.
7. **Publish.** Upload in Figma's chat, publish privately to the MERGE organization, have an admin mark it Recommended, and record the version and what it was tested on in the README.

## Open questions

- **TBD (test mode):** which reads Figma's agent supports. Under `use_figma`, step 3 found that variable scopes, code syntax, annotations, prototype links, slots and component and variable publish status all read, while `devStatus`, the file thumbnail and style publish status don't.
- **TBD (test mode):** which model runs it, if the agent can say.

## Where this came from

The session that produced this plan ran in the abbott-fs-libre-global-iva-specs repo from 2026-09-10 to 2026-10-03. Its audit of Andrew's library (`captures/2026-09-30 IVA design library audit.md` there) is the worked example of the checks, and the read-only Plugin API scripts it used are the starting point for step 3. The playbook it was judged against lives in merge-one-related.

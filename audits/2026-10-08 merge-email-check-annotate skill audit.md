---
title: merge-email-check-annotate skill audit, 2026-10-08
description: Audit of the merge-email-check-annotate skill (0.1.0) against sections A to J of our Claude Skills best practices checklist. It passes 42 items and fails 9, four of them because the skill has never been run as a whole, so it should carry the not-ready banner until they're fixed.
type: audit
status: stable
created: 2026-10-08
maintainer: sbrown@mergeworld.com
tags: [skills, audit, figma, figma-agent, email, annotations]
generated: {by: claude-code/claude-opus-5-5, at: 2026-10-08}
sources:
  - title: Claude Skills best practices
    url: ../claude-skills-best-practices.md
    credibility: our own guideline; the checklist this audit applies
  - title: What we learned building skills for Figma's agent
    url: ../figma-agent-skills.md
    credibility: our own guideline; explains each section J item
---

# merge-email-check-annotate skill audit, 2026-10-08

This records the first audit of the [merge-email-check-annotate](../merge-email-check-annotate/SKILL.md) skill, version 0.1.0, against sections A to J of our [Claude Skills best practices](../claude-skills-best-practices.md). Section J applies because the skill runs in Figma's agent. The skill is the companion that writes a [merge-email-check](../merge-email-check/figma/SKILL.md) report's findings onto the layers at fault as Dev Mode annotations, so the audit also checks that it reads that report the way step 7 of the main skill writes it, and that it agrees with its model, [merge-build-readiness-annotate](../merge-build-readiness-annotate/SKILL.md). Steve asked for the audit on 2026-10-08, and no fixes have been applied. The scripts are sound and tested, but the skill fails 9 items: four because it has never been run as a whole on any model, and five small wording gaps. Under the [rule for failed audits](../claude-skills-best-practices.md#when-a-skill-fails-its-audit) it isn't ready for production. It has no README of its own, so the banner hasn't been placed; where it should go is the first finding outside the checklist.

## Contents

<!-- toc -->
- Method
- Result
- Failed items and proposed fixes
- Unknown until tested
- Findings outside the checklist
- Verdict
<!-- /toc -->

## Method

Claude (Opus 5.5) read `SKILL.md` in full (83 lines), including its two minified scripts, along with the readable sources [03-fingerprint.js](../merge-email-check/scripts/03-fingerprint.js) and [04-deliver-annotations.js](../merge-email-check/scripts/04-deliver-annotations.js), the [scripts README](../merge-email-check/scripts/README.md) and its test record for script 04, [sync_skill.py](../merge-email-check/scripts/sync_skill.py), the main skill's [README](../merge-email-check/README.md), [EVAL.md](../merge-email-check/EVAL.md), steps 4 to 8 of the main skill's `SKILL.md`, and the model skill in full. As a sample of the input this skill receives, it read the report in [2026-10-08 3a with Claude Code Opus, skill 0.3.0.md](<../merge-email-check/diagnostics/2026-10-08 3a with Claude Code Opus, skill 0.3.0.md>). It ran `uv run --no-project --with rjsmin python scripts/sync_skill.py --check` from `merge-email-check/`, which passed: this skill's instructions are 10,528 characters and match `scripts/`, and the main skill's are 63,204, also matching. It searched both scripts for the calls Figma's agent can't make and found none. The repo was at commit `abdeca4`. No Figma tool was run, and no file other than this record was changed.

## Result

The skill passed 42 items, failed 9, found 10 that don't apply and left 4 unknown. The N/A items are B2 to B6 and F2, because Figma's agent takes a single file and the scripts need no packages; E4, because the skill judges nothing against a guide of its own (the checks and the "Problems no check covers" section live in merge-email-check); H9, because a run is one confirmation and three short script calls; and H10 and H11, because the skill makes no visual output and reads no images. Sections A, B, C, D and G pass in full. The scripts are the strong part: script 04 caps a run at 20 findings and reports the rest as a count, never rewrites an existing annotation, walks up to the nearest free layer no higher than the scope root, catches every bad input it can meet, and states a reason for each constant, and both scripts were run readable and minified through `use_figma` on 2026-10-07. The skill reads the main report correctly: it takes the scope's ID from the Scope line, follows "Fix these first" then the scorecard's other failures by rank, gives one annotation per email for a check that failed on several, and leaves flags, proposed checks and findings with no layer in the report.

## Failed items and proposed fixes

Each row is one failed item, most severe first. The four section I rows share one fix, a set of evaluation runs, and are listed separately because each is its own checklist item.

| Item | Finding | Proposed fix |
| --- | --- | --- |
| I1 | No evaluation scenario exists for this skill. [EVAL.md](../merge-email-check/EVAL.md) covers only the main skill, and none of the reports in `merge-email-check/diagnostics/` comes from an annotate run. | Add three cases to EVAL.md, each on a throwaway copy because the skill writes: the four-email Faults report saved on 2026-10-08, where the 20-finding cap binds and several layers carry notes already; the Control report, which has nothing to annotate, so the skill should say so and write nothing; and a TOFU P1 Email 1 report, whose findings sit on layers with notes and inside instances. List the expected behaviors for each: which findings are annotated, which move to a holding layer, which are skipped and why, and `intact: true` from script 03. |
| I3 | The skill has never been run as a whole on any model. Line 10 says only script 04 was tested, through `use_figma` on 2026-10-07, and that Figma's agent is **TBD**. | Run the three cases in Claude Code on Opus 5.5 and Sonnet 5.5, and the Faults case in Figma's agent, save each run in `diagnostics/`, and rewrite line 10 to record them, as merge-email-check 0.3.1's line does. |
| I7 | No fresh instance has run the skill on a realistic task; the only test was the session that wrote script 04 running the script itself. | Run the I1 cases from fresh sessions, starting each from a real report in the same chat, as EVAL.md's method already requires for the main skill. |
| I2 | No baseline was run without the skill. | Run the Faults case once per model with the prompt "Put these findings on the layers as Dev Mode annotations" and no skill, and record what went wrong, such as rewriting a person's note or writing inside an instance, so the skill can be checked against those gaps. |
| E1 | The annotations are the output an engineer reads, and nothing checks them. Nothing compares the finding list with the report before script 04 writes, and when step 4 shows the file changed, the skill asks for an undo but never runs script 03 again to confirm the file is back to its baseline. | At the end of step 1, before asking for "go", add: "Check the list: each finding has a layer ID from a report link, its EM ID and rank from the Scorecard, and the three lines; at most 20; one per email that failed. Fix any gap from the report and check again." In step 4, add: "After an undo, run script 03 again with the same baseline, and report only when `intact` is true, or say that it still isn't." |
| J9 | Line 20 names only two things the agent must never do: run other code that changes the file, and draw on the canvas. Unlike the main skill, it doesn't list renaming, moving, recoloring, resizing, detaching or deleting, and here the agent is working from a list of fixes, which is when the pull to apply one is strongest. Line 20 and the description also say annotations are the only change, while step 5 offers comments. | Replace the sentence: "The only writes are Dev Mode annotations, written by script 04 on layers in the report's scope that have none, and comments the person asks for in step 5, with your own comment action. Never run other code that changes the file: no applying a fix, renaming, moving, recoloring, resizing, detaching, deleting, or editing or removing anyone's annotation, however helpful, and never draw anything on the canvas." End the description with "and changes nothing else apart from comments the person asks for." |
| J8 | Step 5 lists what to tell the person but gives no fixed template and doesn't say to add nothing, which is how the main skill's first reports in Figma's agent grew sections. | Give step 5 a short template, for example: "Annotated <n> of <m> findings, in the Development category in Dev Mode." then "On a holding layer instead of the layer at fault: <EM ID>, <layer at fault> on <holding layer>, because <reason>." then "Skipped: <EM ID>, <layer>: <reason>.", the offer of comments and the removal line, and add "Send only this, adding nothing." |
| H8 | The skill doesn't say whether the report's conclusions are settled, so an agent could re-check the design, re-rank a finding or rewrite its fix before annotating. The main skill says "treating the answers as settled". | Add to step 1: "Take the report's results, ranks and fixes as settled: don't re-check the design or rewrite a finding unless the person asks." |
| F6 | Line 14 names "the Figma MCP server's `use_figma` tool" without its server prefix. The main skill, line 16, adds "named with the server's prefix, such as `Figma:use_figma`". | Use the main skill's wording on line 14. |

## Unknown until tested

H3 (whether any step is over-prescriptive for Opus), I4 (whether Haiku skips a step), I5 (whether Opus does worse with the skill than without it) and I6 (medium against higher effort) all need the runs proposed under I1 to I3.

## Findings outside the checklist

**Where the not-ready banner should go.** The rule for failed audits puts the banner straight after the H1 of the skill's `README.md`, and says the audit adds a README when the skill has none. This skill has none; it's described in a row of the "What's in this folder" table in [merge-email-check/README.md](../merge-email-check/README.md), and a banner after that file's H1 would wrongly mark the main skill, which cleared its own audit, as not ready. The banner should go in a new `merge-email-check-annotate/README.md`, straight after its H1, linking to `<../audits/2026-10-08 merge-email-check-annotate skill audit.md>`. Only `SKILL.md` is uploaded to Figma, so a README beside it changes nothing there, and it would also hold the skill's version history, which no file carries now. The skill's row in the repo's root [README](../README.md) (line 15) should then link to that README and end "Not ready for production (audit 2026-10-08)", and the row in merge-email-check's README could say the same. As asked, neither the banner nor the README has been added.

**Step 5 asks for a reason the script doesn't return.** Step 5 tells the agent to say why each finding went on a holding layer, "it had a note already, or sat inside an instance", but script 04 returns only `{ id, on, moved }`. The readable source names a third reason too, a layer that can't hold annotations, which `SKILL.md` leaves out. The agent can tell an instance layer by its `I` prefix but otherwise has to guess. Script 04 could return a `why` on each moved entry, as it does for skipped ones.

**A report link never points inside an instance.** Step 7 of the main skill links an instance-internal layer such as `I12:34;56:78` as the instance, `12:34`. So script 04's inside-instance branch is almost never reached from a report, and the annotation lands on the instance itself, with no `Layer:` line saying which layer inside it is at fault. Step 1 could tell the agent to name that layer in the Rule line when the report's evidence names it.

**A fix that names two layers gets one annotation.** In the 2026-10-08 Opus report on the Faults page, "Fix these first" item 6 (EM-21) covers a 20px link and a 36px button, and item 8 (EM-20) a ghost button and an icon, each with its own example. Step 1 puts each finding on its first example only, so the second problem's layer gets nothing, and a fault drawn in both the mobile and desktop frames is annotated in one of them. Whether that's intended is for Steve to decide (**TBD**, Steve).

**No fallback for a report without a scope ID.** The Scope line has given the scope's ID only since merge-email-check 0.3.0, on 2026-10-07. Step 1 doesn't say what to do with an older or hand-edited report that lacks it; asking the person for the scope's link would cover it.

**A reference to a schema this skill doesn't carry.** Line 59 ends "The `Layer:` line is the script's own, outside the annotation keys." The annotation keys are MERGE's schema, which only the model skill defines. The three lines in step 3 are already a fixed template, so the sentence could go, or name the keys it means.

**Small mismatches with the main skill.** The comment wording in step 5 ends "From merge-email-check." where the main skill's step 5 ends "From merge-email-check 0.3.1." The main README's folder table (line 26) still describes `scripts/` as "the four read-only Plugin API scripts" and says `sync_skill.py` copies them into `SKILL.md`, though there are five scripts, script 04 writes, and the tool syncs both skills' `SKILL.md` files.

**Agreement with the model.** The skill follows merge-build-readiness-annotate step for step: the same five-step checklist, the "go" confirmation, the 20-finding cap, the fingerprint before and after with `__ADDED__`, the Rule, Status and See lines, and the offer of comments. The differences are deliberate and documented in script 04's header: it walks up to a holding layer rather than skipping a layer that has a note or sits inside an instance, it returns objects rather than bare IDs, and it converts a link's hyphenated node ID. The model has never been audited, and its version line still reads "0.1", a two-part number.

**Size.** At 10,528 characters, the skill is far inside the 63,500-character working budget, so every fix above fits. The main skill now has 296 characters of budget left.

## Verdict

Not ready for production: 9 items failed (E1, F6, H8, I1, I2, I3, I7, J8 and J9). The banner belongs in a new `merge-email-check-annotate/README.md`, with the matching note on the skill's row in the root README; neither has been added yet. Take both out in the same commit that fixes the last failed item, and add a line here saying which commit that was. Because four of the fails need new evaluation runs, re-run this audit before removing the banner.

**Fixes applied, 2026-10-08.** E1, F6, H8, J8 and J9 are fixed in merge-email-check-annotate 0.2.0, along with four of the findings above: the reason a finding moved is explained, a report with no Scope line gets a fallback, the annotation keys are named, and the comment wording carries the report's version. Still open: I1, I2, I3 and I7, which need runs. The banner stays until those are done.

**Runs, 2026-10-08.** I1, I2 and I7 are done: the skill ran in fresh Claude Code sessions on Opus 5.5 and Sonnet 5.5 on a throwaway copy of Faults A, after the main skill's report in the same session, and once without the skill, recorded in [EVAL.md](../merge-email-check/EVAL.md#the-companion-skills). I3 is half done: the Figma-agent run is still to do. The runs also showed the holding-layer rule skipping 6 or 7 of 20 findings on a note-heavy email, which EVAL.md proposes a fix for.

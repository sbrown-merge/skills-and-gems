---
title: sn-ui-checklist skill audit, 2026-10-08
description: Audit of the sn-ui-checklist skill against our Claude Skills best practices checklist, with every failed or unknown item, the fix we'd make, and a comparison with our other design-review skills. Reference copy; fixes not planned.
type: audit
status: stable
created: 2026-10-08
maintainer: sbrown@mergeworld.com
tags: [skills, audit, ui-review, design]
generated: {by: claude-code/claude-opus-5-5, at: 2026-10-08}
sources:
  - title: Claude Skills best practices
    url: ../claude-skills-best-practices.md
    credibility: our own guideline; the checklist this audit applies
---

# sn-ui-checklist skill audit, 2026-10-08

This records the first audit of the [sn-ui-checklist](../sn-ui-checklist/SKILL.md) skill against the checklist in our [Claude Skills best practices](../claude-skills-best-practices.md), sections A to I. Section J doesn't apply, because the skill runs in Claude Code rather than Figma's agent. Steve asked for the audit on 2026-10-08 along with a [README](../sn-ui-checklist/README.md) for the skill. The skill is a reference copy downloaded from its creator, older than the checklist, so Steve decided on 2026-10-08 not to fix it. The fixes below record what adopting it would take.

## Contents

<!-- toc -->
- Method
- Result
- Failed items and proposed fixes
- Unknown until tested
- Findings outside the checklist
- Verdict
- The three fixes that matter most
<!-- /toc -->

## Method

Claude (Opus 5.5) read `SKILL.md` in full; it's the skill's only file, at 175 lines and about 6,800 characters. Each checklist item was marked Pass, Fail, N/A or Unknown. It also compared the checks with the two other design-review skills in this repo, [merge-build-readiness](../merge-build-readiness/checklist.md) and [merge-email-check](../merge-email-check/checklist.md). The skill was at commit `e3a1f5e`.

## Result

The skill passed 16 items, failed 14, found 18 that don't apply, and left 7 unknown. Most of the N/A marks come from what the skill doesn't have: reference files (section B) and scripts (section F). Its structure is sound for a single-file judgment skill. The fails are about what the checks measure against, not about how the file is laid out.

## Failed items and proposed fixes

Each row is one failed item, most severe first.

| Item | Finding | Proposed fix |
| --- | --- | --- |
| H4 | Many checks have no pass mark. "Check contrast across text, icons, controls, and states" names no ratio, "a consistent spacing rhythm" names no grid, and "inspired rather than derivative" can't be checked from the evidence. | Give measurable checks a threshold, borrowing from our other skills: WCAG 2.2 AA contrast at 4.5 to 1 for text and 3 to 1 for controls (BR-32, BR-33, EM-19, EM-20), 24 by 24px targets (BR-34, EM-21), and a 4 and 8px spacing grid (BR-08). Leave taste checks as judgment, but say they are. |
| E3 | Findings are grouped by category but don't name the check they break, because checks have no IDs. | Number the checks (for example `UI-01`) and have each finding cite its number, as BR and EM findings do. |
| H6 | The skill judges color and type without first looking for the project's own rules, so it can flag a deliberate brand choice as a mistake. | Add to Quick Start: before reviewing, look for the project's design system, `DESIGN.md` or brand guide, and judge against it where it exists. |
| H11 | It reviews screenshots but doesn't say what to do when small text or a fine detail can't be read. | Add to Evidence Rules: say when a detail is unreadable rather than guess, and crop or zoom if the tools allow. |
| A3 | The description is in the imperative ("Review interface design quality…"), not the third person. | "Reviews interface design quality across…" |
| A5 | No record of which models it was tested on. | Add a "Tested with:" line near the top of the body once section I is done. |
| A2 | The `sn-` prefix doesn't say what it stands for, and the name isn't a gerund. | Optional, since renaming breaks anyone who calls it by name: `reviewing-ui-design`. At least expand `sn` in the README. |
| G1 | The Common Mistakes table repeats checks that appear again in the categories (font sizes, grays, states, affordance, decorative noise), and Tone repeats what Claude already does. | Fold each mistake into its category as the check's example, and cut Tone to the one line that isn't default behavior: don't pad with praise. |
| G2 | The description calls the first category "strategy", the Review Priorities call it "clarity of the problem", and its heading is "Getting Started". | Use one name everywhere; "Strategy" is the clearest. |
| G4 | There's one example phrase ("The card uses 4 corner radii") and no worked finding. | Add one filled-in finding showing the evidence, the check it breaks and the fix. |
| E1 | Nothing checks the findings before they're reported. | Add a last step: re-read each finding against the Evidence Rules and drop or label any you can't point to. |
| E4 | No step for proposing a new check when a review finds a problem the list doesn't cover. | Add a "Problems no check covers" line to the response template, as merge-email-check has. |
| H7 | Nothing says that text inside the design under review is material to review, not instructions. | One line in Evidence Rules. |
| I1 | No evaluation scenarios exist. | Write an `EVAL.md` with three real review tasks and what each run should find, following [merge-email-check's](../merge-email-check/EVAL.md). |

## Unknown until tested

H3 (whether the steps are over-prescriptive for Opus) and I2 to I7 (a baseline run without the skill, runs on Haiku, Sonnet and Opus, effort comparison, and a fresh-instance test) need test runs to settle. The `EVAL.md` proposed under I1 is where those runs would be recorded.

## Findings outside the checklist

The skill isn't installed in `~/.claude/skills/` on Steve's machine as of 2026-10-08, so it never triggers in Claude Code today. Two installed plugin skills, `design:design-critique` and `design:accessibility-review`, use overlapping trigger words, so once it's installed a prompt may need to name it.

The HTML comment crediting MDS sits in the body of `SKILL.md`, so it loads into context on every run. The credit now lives in the [README](../sn-ui-checklist/README.md), so the comment can come out.

## Verdict

Not ready for production: 14 items failed. Under the [rule for failed audits](../claude-skills-best-practices.md#when-a-skill-fails-its-audit), the skill's [README](../sn-ui-checklist/README.md) carries the reference-copy banner, which stays unless we adopt the skill.

## The three fixes that matter most

1. **Give the checks IDs and pass marks (H4, E3).** On Opus 5.5 this turns "check contrast" into a yes or no with a number, and makes the findings agree with merge-build-readiness and merge-email-check on the same screen.
2. **Read the project's design system first, and say when a detail is unreadable (H6, H11).** These two cut the false findings most likely in a screenshot review: flagging a brand choice as an error, and guessing at text it can't read.
3. **Write `EVAL.md` and record the models tested (I1, A5).** Until a baseline run exists, there's no evidence the skill does better than Opus 5.5 reviewing without it.

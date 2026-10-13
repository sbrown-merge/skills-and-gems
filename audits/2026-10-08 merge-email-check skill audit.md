---
title: merge-email-check skill audit, 2026-10-08
description: Audit of the merge-email-check skill (0.3.0) against sections A to J of our Claude Skills best practices checklist. It passes 53 items and fails 2, both about testing records, so it carries the not-ready banner until they're fixed.
type: audit
status: stable
created: 2026-10-08
maintainer: sbrown@mergeworld.com
tags: [skills, audit, figma, figma-agent, email]
generated: {by: claude-code/claude-opus-5-5, at: 2026-10-08}
sources:
  - title: Claude Skills best practices
    url: ../claude-skills-best-practices.md
    credibility: our own guideline; the checklist this audit applies
  - title: What we learned building skills for Figma's agent
    url: ../figma-agent-skills.md
    credibility: our own guideline; explains each section J item
---

# merge-email-check skill audit, 2026-10-08

This records the first audit of the [merge-email-check](../merge-email-check/figma/SKILL.md) skill, version 0.3.0, against sections A to J of our [Claude Skills best practices](../claude-skills-best-practices.md). Section J applies because the skill runs in Figma's agent. Steve asked for the audit on 2026-10-08, and no fixes have been applied yet. The skill is in good shape: it passes 53 items and fails 2, and both fails are about what's been tested and how that's recorded, not about how the skill works. Under the [rule for failed audits](../claude-skills-best-practices.md#when-a-skill-fails-its-audit), its [README](../merge-email-check/README.md) now carries the not-ready banner until those two are fixed.

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

Claude (Opus 5.5) read `SKILL.md` in full (286 lines), along with [EVAL.md](../merge-email-check/EVAL.md), the [scripts README](../merge-email-check/scripts/README.md), [sync_skill.py](../merge-email-check/scripts/sync_skill.py), the readable scripts and the four run reports in `diagnostics/`. It ran `sync_skill.py --check`, which passed with the instructions at 63,373 characters. It also searched the scripts for the calls Figma's agent can't make and found none. `figma.fileKey` is read inside a `try`. The repo was at commit `e3a1f5e`. The companion skills, [merge-email-check-plan](../merge-email-check-plan/SKILL.md) and [merge-email-check-annotate](../merge-email-check-annotate/SKILL.md), weren't part of this audit and each needs its own.

## Result

The skill passed 53 items, failed 2, found 6 that don't apply and left 4 unknown. The N/A items are B2 to B6 and F2, because Figma's agent takes a single file and its scripts need no packages. Sections C, D, E, G and J pass in full. The workflow has a copyable checklist, a check, fix, re-check loop before sending with a named step to go back to, a fingerprint that proves the design is unchanged, and a fixed report template. The scripts state a reason for every constant, return a total with every capped list, and have each been run readable and minified through `use_figma`.

## Failed items and proposed fixes

Each row is one failed item, most severe first.

| Item | Finding | Proposed fix |
| --- | --- | --- |
| I3 | The skill says it runs from Claude Code through the Figma MCP, but it hasn't been run there on any model. Every Claude Code column in [EVAL.md's results](../merge-email-check/EVAL.md#results) is **TBD**. Cases 1 and 2 haven't been run with the skill anywhere; only case 3 has, in Figma's agent. | Run case 3 in Claude Code on Opus 5.5 and Sonnet 5.5, with and without the skill, and record the results. If the Claude Code route isn't going to be supported, take it out of the description and the README instead. |
| A5 | The "Tested with" line in `SKILL.md` (line 10) still says Figma's agent is **TBD**, and the README's "Version and testing" section still lists the first run in Figma's agent as **TBD**. Both are out of date: Figma's agent ran 0.2.0 on the faults (113 of 120 results matched) and 0.2.1 on the Control (30 of 30), both on 2026-10-06. Version 0.3.0, which added EM-31 and the annotate offer, hasn't been run in Figma's agent. | Rewrite the line without making it longer, for example: "Tested with: scripts through `use_figma` on Opus 5.5, 2026-10-05; 0.2.0 and 0.2.1 in Figma's agent (model undisclosed), 2026-10-06; 0.3.0 untested." Update the README to match, and run 0.3.0 on the Control in Figma's agent. |

## Unknown until tested

H3 (whether any step is over-prescriptive for Opus), I4 (whether Haiku skips a step), I5 (whether Opus does worse with the skill than without it) and I6 (medium against higher effort) all need the Claude Code runs proposed under I3.

## Findings outside the checklist

**The size budget is almost used up.** The instructions are 63,373 characters against a working budget of 63,500, which leaves 127, and 2,163 under Figma's 65,536-character limit. The next check, or almost any rewording that adds text, will fail `sync_skill.py --check`. The credit line at the end of `SKILL.md` (187 characters) could move out, because the README already carries the same credit. Before doing that, check that the MIT license allows it, since only the structure was adapted, not code.

**The scripts README has a stale line.** Line 47 of the [scripts README](../merge-email-check/scripts/README.md) says there's no script for delivering annotations yet. Script 04 has existed since 2026-10-07; it runs in the annotate companion, so `__ADDED__` is still 0 in this skill, but the sentence should say why.

**The comment step hasn't run in a real run.** Every recorded run in Figma's agent answered "go", which means a report only, so step 5 has never put comments on a file. The [merge-build-readiness-test](../merge-build-readiness-test/SKILL.md) probe confirmed that Figma's agent can add a comment, so section J10 passes, but one evaluation run should ask for comments and check the fingerprint afterwards.

## Verdict

Not ready for production: 2 items failed (A5 and I3). The README and the repo's root README carry the banner. Take both out in the same commit that fixes the last of the two, and add a line here saying which commit that was.

**Cleared 2026-10-08.** Both failed items are fixed in merge-email-check 0.3.1. A5: the "Tested with" line and the README's testing section are current. I3: case 3 ran in Claude Code on Opus 5.5 and Sonnet 5.5, with and without the skill, and the eight results are in [EVAL.md](../merge-email-check/EVAL.md#results). The banners came out in the same commit, f3c9820. The audit's three other findings are handled too: the credit line moved to the README, which freed 193 characters; the scripts README's stale line is fixed; and a run that delivers comments is still to do, listed in the README's testing section.

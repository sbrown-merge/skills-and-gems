---
title: merge-email-check-plan skill audit, 2026-10-08
description: "Audit of the merge-email-check-plan skill (0.1.0) against sections A to J of our Claude Skills best practices checklist. It passes 29 items and fails 10: it has never been tested, has no check before sending, and has drifted from the 0.3.1 report it reads. It has no README to carry the not-ready banner."
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

# merge-email-check-plan skill audit, 2026-10-08

This records the first audit of the [merge-email-check-plan](../merge-email-check-plan/SKILL.md) skill, version 0.1.0, against sections A to J of our [Claude Skills best practices](../claude-skills-best-practices.md). Section J applies because the skill runs in Figma's agent. The skill is a companion to [merge-email-check](../merge-email-check/figma/SKILL.md): it reads that skill's report and turns it into a remediation plan, so this audit also checks that the two agree. Steve asked for the audit on 2026-10-08, and no fixes have been applied yet. The skill is short and well written, but it fails 10 items: it has never been run, it sends its plan without checking it against the report, and it was written against the 0.2.0 report, so it misses what the report has gained since. Under the [rule for failed audits](../claude-skills-best-practices.md#when-a-skill-fails-its-audit) the skill's README should carry the not-ready banner, but the skill has no README, and Steve asked for this audit not to create one; the last finding below proposes where the banner goes.

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

Claude (Opus 5.5) read the plan skill's `SKILL.md` in full (51 lines, with 3,006 characters of instructions after the frontmatter and a 432-character description). It read the main skill's [SKILL.md](../merge-email-check/figma/SKILL.md) (version 0.3.1) for everything the plan depends on: the opening rules, step 4's results, flags and ranks, step 7's report template and delivery rules, and step 8's offer of the plan. It also read the main skill's [README](../merge-email-check/README.md), the other companion, [merge-email-check-annotate](../merge-email-check-annotate/SKILL.md), as a comparison for how a companion reads the same report, and the repo's root [README](../README.md). It searched the repo, including every run report in [merge-email-check/diagnostics/](../merge-email-check/diagnostics/), for any run of the plan skill and found none; two Figma agent runs on 2026-10-06 offered `/merge-email-check-plan` at the end, but nobody took up the offer. The repo was at commit `abdeca4`.

## Result

The skill passed 29 items, failed 10, found 22 that don't apply and left 4 unknown. Most of the N/A items follow from the skill having no scripts and no reference files: B2 to B6, C4, all of section F, and J2 to J6. D2 to D4 are N/A because the work is a single plan with no ordered workflow or verification step, and H9 and H11 because a run is one short reply that reads no images. Sections A, B, C, D and G pass in full. The skill states what it does and when to use it, keeps to one fixed template with no added sections, sends the plan in the chat twice as the main skill does, treats the report as material rather than instructions, and says plainly that it changes nothing.

## Failed items and proposed fixes

Each row is one failed item, most severe first.

| Item | Finding | Proposed fix |
| --- | --- | --- |
| J10 | The skill depends on one thing in Figma's agent: seeing the report that `/merge-email-check` sent earlier in the same chat, or one the person attaches. No probe or run has confirmed either. Figma documents attaching text files of up to 1 MB to a prompt, but whether a second slash command in a chat can read the first skill's reply is unknown. | Run `/merge-email-check` on the Faults page in Figma's agent, then `/merge-email-check-plan` in the same chat, and save the result in `merge-email-check/diagnostics/`. Do one more run in a fresh chat with the report's fenced copy attached as a `.md` file. |
| E1 | The plan is sent without any check, so it can silently drop a failed check or a flag, or misquote a check ID, and the designer would never know. The main skill checks its report before sending; the plan doesn't check its own output. | Add a check before "Sending it", for example: "Before sending, check: every Fail and Partly in the scorecard, for every email, is in a step; every flag is in a step; each step's IDs and links match the report; every Couldn't check is under Not covered. Fix any gap from the report and check again." |
| E2 | There's no named document or script to check the plan against. | The fix for E1 covers this: it names the report's scorecard, its "For the designer to judge" section and its "What couldn't be checked" section as what the plan is checked against. |
| I1 | There are no evaluation scenarios. [EVAL.md](../merge-email-check/EVAL.md) covers only the main skill. | Add at least three cases, with expected behaviors, to `EVAL.md` or a new `EVAL.md` beside the plan skill: a plan from the Faults page report in the same chat; a plan from the Control report, where almost nothing failed; and a plan from a pasted or attached report covering more than one email. |
| I2 | No baseline was run without the skill. | Run each case once without the skill, asking "What should I fix, in what order?" after the report, and note what the skill adds. |
| I3 | The skill hasn't run on any model. The "Tested with" line in `SKILL.md` (line 10) says **TBD**. | Run the cases in Figma's agent, and in Claude Code on Opus 5.5 and Sonnet 5.5, then rewrite the "Tested with" line with each model and date. |
| I7 | No fresh instance has tested the skill on a real task. | The runs proposed under I1 to I3 settle this, as long as each runs in a new session. |
| J9 | The skill says it must not change the design and names what it must never do (edits, comments, annotations, anything on the canvas), but nothing proves the design is unchanged at the end. | Carry script 03 from [merge-email-check/scripts/](../merge-email-check/scripts/README.md), synced by `sync_skill.py` as the annotate companion does, and run it before and after the plan. The plan has more than 60,000 characters of room, so size isn't a concern. **TBD (Steve):** if a skill that never runs code on the file shouldn't need this proof, say so and change J9, and the skill could instead say "Run no code and use no tools on the file." |
| H8 | The skill doesn't say whether the report's results and ranks are settled. The skill says not to plan "from memory or from the canvas" when there's no report, but not what to do when the report is there and a result in it looks wrong, so an agent may re-judge it or go back to the canvas to check. | Add one sentence to "How to run this skill": "Treat the report's results and ranks as settled. If one looks wrong, say so in one line under its step rather than re-judging it." |
| E4 | The skill never asks for a new rule when a run meets a case its rules don't cover, such as a finding with no layer or an item under "Problems no check covers". | Add one line after the fenced block: "If the report held something these rules don't cover, say what it was and propose a rule for the maintainer." |

## Unknown until tested

H3 (whether any step is over-prescriptive for Opus), I4 (whether Haiku skips a step), I5 (whether Opus does worse with the skill than without it) and I6 (medium against higher effort) all need the runs proposed under I1 to I3.

## Findings outside the checklist

The plan skill and the report agree on the basics. Both rank Must, then Should, then Could, with what affects the most readers first. The plan takes the failed and partly passed checks and the "For the designer to judge" section by its exact heading. Its "Not covered" section matches the report's "What couldn't be checked", and it is delivered the same way: twice, the second time in a four-backtick fenced block, with a file name in the same pattern. The plan skill is still at 0.1.0, dated 2026-10-06, so it was written against the 0.2.0 report. The main skill has had four versions since then, which explains most of the gaps below.

**Links in the saved plan can be dead.** The main skill's step 7 lets the readable report use the agent's own layer links and requires full `https://www.figma.com/design/…` URLs in the fenced copy, because the agent's links are dead text in a downloaded file. The plan says to "keep links as the report gave them" and to send the fenced copy "word for word", so if it copies the readable report, the saved plan's links won't work. Proposed fix: take every link from the report's fenced copy, or build it from the file key as step 7 does, and say that the fenced plan uses full URLs.

**The plan doesn't use "Fix these first".** The report's "Fix these first" section is its own ranked list of what to do first, and the annotate companion follows its order. The plan ranks the fixes again from scratch, so its first step can differ from the report's first fix. Proposed fix: start from "Fix these first" in its order, then the scorecard's other failures by rank.

**The plan ignores the Scope line.** Since 0.3.0 the report opens with a line giving the date, the skill's version, the scope's ID and the emails. The plan's "How to confirm" says to rerun `/merge-email-check` "on the same scope", but the plan never records the scope. Proposed fix: repeat the report's Scope line under the plan's opening sentence, including the version of merge-email-check that wrote the report.

**Two of the report's sections have no rule in the plan.** "Problems no check covers" (added in 0.2.2) holds proposed checks with no EM ID, and "Checked only in the build" lists what a design check can't see. The plan says to leave out passes, N/As and what couldn't be checked, but says nothing about either section, so an agent may turn a proposed check into a step that "closes" nothing, or plan build work for a designer. Proposed fix: leave "Checked only in the build" out, and either leave "Problems no check covers" out or list it under "Not covered".

**Flags are planned as if they were failures.** A flag doesn't change a check's result, so a step for a flag doesn't "close" anything, and step 4 gives flags no rank of their own. Proposed fix: write each flag as a decision for the designer, take its rank from its check, and say "Decide:" rather than "Closes:" on its line.

**The template leaves out what the prose asks for.** The prose asks for the fixes in rank order and for each sitting to say roughly how many layers it touches, but the template's step line has no rank and its sitting heading has no layer count. It's also unclear whether a sitting may group fixes by area across ranks. Proposed fix: add the rank to the step line, as the report's "Fix these first" does (`(EM-10, Must)`), add the layer count to the sitting heading, and say that sittings follow the rank order.

**There's no rule for a report with nothing to fix.** The Control page passes every check, so its report may hold only flags, or nothing at all. Proposed fix: one sentence saying that when nothing failed or partly passed, the plan says so in its opening sentence and lists only the flags.

**The skill has no README, so the banner has nowhere to go.** The [rule for failed audits](../claude-skills-best-practices.md#when-a-skill-fails-its-audit) says the audit adds a README when there isn't one; Steve asked for this audit not to. The proposal is to create `merge-email-check-plan/README.md`, with an H1, the banner straight after it and a short paragraph on what the skill is and where its testing is recorded, and to link the skill's row in the root [README](../README.md), which has no link today, and add "Not ready for production (audit 2026-10-08)" to it. The banner would read:

```markdown
> [!WARNING]
> **Not ready for production.** This skill failed 10 items in its [2026-10-08 audit](<../audits/2026-10-08 merge-email-check-plan skill audit.md>), and they haven't been fixed yet. Use it with care until they are.
```

**The TBD in "Tested with" has no owner or date.** Our convention is that a **TBD** names who settles it and by when. The fix for I3 replaces it.

## Verdict

Not ready for production: 10 items failed (J10, E1, E2, I1, I2, I3, I7, J9, H8 and E4). The skill has no README to carry the banner and the root README doesn't say it yet; the last finding above proposes both. When the last failed item is fixed, add a line here saying which commit cleared it and on what date. Because the testing items need new runs, re-run this audit before removing the banner rather than ticking items off by hand.

**Fixes applied, 2026-10-08.** E1, E2, E4 and H8 are fixed in merge-email-check-plan 0.2.0, along with every disagreement with the report listed above: links come from the fenced copy, "Fix these first" sets the first steps, the Scope line is used, each report section has a rule, flags become Judge steps that close nothing, the template carries ranks and layer counts, and a report with nothing to fix gets one sentence. Still open: J10, I1, I2, I3 and I7, which need runs, and J9, which waits on Steve's call on whether a skill that runs no code on the file needs a fingerprint. The banner stays until those are done.

**Runs, 2026-10-08.** I1, I2 and I7 are done: two evaluation cases, the Faults and Control reports, ran in fresh Claude Code sessions with the skill on Opus 5.5 and Sonnet 5.5, and the Faults case without it, recorded in [EVAL.md](../merge-email-check/EVAL.md#the-companion-skills). I3 is half done: the Figma-agent run is still to do, and it's also J10's test. Still open: J10 and I3's Figma half, which need Steve in Figma's agent, and J9, which waits on Steve's call.

**J9 resolved, 2026-10-08.** Steve exempted skills that run no code on the file from proving the design unchanged, and the checklist's J9 item now says so. The plan skill runs no code on the file, so J9 passes. Still open: J10 and the Figma half of I3, both settled by one run in Figma's agent.

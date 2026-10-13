---
title: "Agent Skill authoring and prompting Opus 5.5 and Sonnet 5.5"
description: "Research note, 2026-10-03: the Agent Skills spec and Anthropic's authoring rules, how Opus 5.5 and Sonnet 5.5 respond to prompts, rubric and grader guidance, and the anthropics/skills repo, each claim with its source."
type: research-note
status: stable
created: 2026-10-03
maintainer: Steve Brown
tags: [skills, agent-skills, claude, opus-5-5, sonnet-5-5, prompting, evaluation]
stale_after: 2027-01-03
sources:
  - {resource: "https://help.figma.com/hc/en-us/articles/40283639496599-Custom-skills-for-the-Figma-agent-and-Figma-Make", title: "Custom skills for the Figma agent and Figma Make", author: Figma, last_modified: "2026-09-23"}
  - {resource: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices", title: "Skill authoring best practices", author: Anthropic, last_modified: undated}
  - {resource: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview", title: "Agent Skills", author: Anthropic, last_modified: undated}
  - {resource: "https://agentskills.io/specification", title: "Agent Skills Specification", author: agentskills.io, last_modified: "2026-08-04"}
  - {resource: "https://agentskills.io/skill-creation/best-practices", title: "Best practices for skill creators", author: agentskills.io, last_modified: undated}
  - {resource: "https://agentskills.io/skill-creation/evaluating-skills", title: "Evaluating skill output quality", author: agentskills.io, last_modified: undated}
  - {resource: "https://agentskills.io/skill-creation/optimizing-descriptions", title: "Optimizing skill descriptions", author: agentskills.io, last_modified: undated}
  - {resource: "https://code.claude.com/docs/en/skills", title: "Extend Claude with skills", author: Anthropic, last_modified: undated}
  - {resource: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices", title: "Prompting best practices", author: Anthropic, last_modified: undated}
  - {resource: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5", title: "Prompting Claude Opus 5.5", author: Anthropic, last_modified: undated}
  - {resource: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5", title: "Prompting Claude Sonnet 5.5", author: Anthropic, last_modified: undated}
  - {resource: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5", title: "Prompting Claude Opus 5", author: Anthropic, last_modified: undated}
  - {resource: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5", title: "Prompting Claude Sonnet 5", author: Anthropic, last_modified: undated}
  - {resource: "https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5", title: "What's new in Claude Opus 5.5", author: Anthropic, last_modified: undated}
  - {resource: "https://platform.claude.com/docs/en/models/sonnet-5-5/whats-new-sonnet-5-5", title: "What's new in Claude Sonnet 5.5", author: Anthropic, last_modified: undated}
  - {resource: "https://platform.claude.com/docs/en/release-notes/overview", title: "Claude Platform release notes", author: Anthropic, last_modified: "2026-09-30"}
  - {resource: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests", title: "Define success criteria and build evaluations", author: Anthropic, last_modified: undated}
  - {resource: "https://github.com/anthropics/skills/blob/8a1541c/skills/skill-creator/SKILL.md", title: "skill-creator SKILL.md", author: Anthropic, last_modified: "2026-04-20"}
  - {resource: "https://github.com/anthropics/skills/blob/8a1541c/skills/skill-creator/agents/grader.md", title: "skill-creator grader agent", author: Anthropic, last_modified: "2026-04-20"}
  - {resource: "https://github.com/anthropics/skills/blob/8a1541c/skills/skill-creator/scripts/quick_validate.py", title: "skill-creator quick_validate.py", author: Anthropic, last_modified: "2026-04-20"}
  - {resource: "https://github.com/anthropics/skills/blob/8a1541c/template/SKILL.md", title: "anthropics/skills template SKILL.md", author: Anthropic, last_modified: "2026-09-29 (commit read)"}
  - {resource: "https://github.com/anthropics/skills/blob/8a1541c/skills/claude-api/shared/prompt-audit.md", title: "Prompt Audit: Finding and Removing Dated Prompting Patterns", author: Anthropic, last_modified: "2026-09-29"}
  - {resource: "https://github.com/anthropics/skills/blob/8a1541c/skills/claude-api/shared/evals/eval-audit.md", title: "claude-api eval audit checklist", author: Anthropic, last_modified: "2026-09-29 (commit read)"}
---

# Agent Skill authoring and prompting Opus 5.5 and Sonnet 5.5

These are the rules for writing an Agent Skill that works well on Claude Opus 5.5 and Sonnet 5.5, gathered on 2026-10-03 for the [merge-build-readiness plan](../PLAN.md). Every source was fetched that day. Most Anthropic docs pages carry no date of their own, so where a page is undated the note says so; code in the anthropics/skills repo was read at commit `8a1541c` (2026-09-29). Each claim is marked **confirmed** when a source states it, or **inferred** when it's our reading.

## Contents

<!-- toc -->
- The finding that matters most: Figma takes one Markdown file
- Agent Skills spec and authoring rules
- Prompting Opus 5.5 and Sonnet 5.5
- Rubric and grader guidance
- The anthropics/skills repo
- Conflicts and gaps
- Questions we couldn't answer
<!-- /toc -->

## The finding that matters most: Figma takes one Markdown file

Figma's help article (created 2026-05-06, updated 2026-09-23) says a custom skill "must be a single Markdown (`.md`) file that follows the Agent Skills specification", and that custom skills "do not support optional directories such as `scripts/`, `references/`, and `assets/`." **Confirmed.**

- **What this rules out in Figma:** progressive disclosure through separate reference files, bundled scripts and asset templates. Those patterns only work in Claude Code or the API.
- **Name:** the skill's name becomes its slash command.
- **How it runs:** the article says you "must invoke the skill" with a slash command. If a prompt names several skills, only the first is invoked.
- **Trigger wording:** Figma advises "active, unambiguous language to describe when to use the skill", especially "if a skill is to be invoked automatically". Soft phrasing such as "use only when X is selected" "tends to get read as 'don't use it unless X'", so phrase the trigger as a requirement rather than a restriction.
- **Names for publishing:** use a specific, non-generic name, adding your name, team or company to avoid clashes.
- **Not stated:** which models run the Figma agent, and any size or character limit.

## Agent Skills spec and authoring rules

### Frontmatter

- **`name`:** at most 64 characters; only lowercase a to z, 0 to 9 and hyphens; no hyphen at the start or end and no `--`; must match the parent directory name (agentskills.io spec). Anthropic adds that it may contain no XML tags and not the reserved words "anthropic" or "claude" (platform overview and best practices). **Confirmed.**
- **`description`:** required; 1 to 1,024 characters; no XML tags; says what the skill does and when to use it (spec, platform overview). skill-creator's `quick_validate.py` also rejects `<` and `>`. **Confirmed.**
- **Optional spec fields:** `license` (short), `compatibility` (1 to 500 characters; "most skills do not need" it), `metadata` (a map of string keys to string values), and `allowed-tools` (a space-separated string, marked experimental; support varies by client). **Confirmed.**
- **Fields allowed on upload:** claude.ai uploads, the Skills API and `package_skill.py` accept only the six spec fields; any other key fails with "Unexpected key(s) in SKILL.md frontmatter" (code.claude.com skills; `quick_validate.py` `ALLOWED_PROPERTIES`). **Confirmed.**
- **Claude Code extensions:** `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `disallowed-tools`, `model`, `effort` (`low` to `max`), `context: fork`, `agent`, `background`, `hooks`, `paths` and `shell`. Claude Code silently ignores fields it doesn't know, every field is optional there, and `name` defaults to the directory name. **Confirmed.**
- **Description cap in Claude Code:** `description` plus `when_to_use` is truncated at 1,536 characters in the skill listing, so put the key use case first. The whole listing gets 1% of the context window, and the least-used skills' descriptions are dropped first. **Confirmed.**

### Length and progressive disclosure

- **Three loading levels:** metadata (about 100 tokens per skill, always loaded), the SKILL.md body (under 5,000 tokens recommended, loaded when the skill triggers), and bundled files (no cost until read). **Confirmed.**
- **Body length:** keep the SKILL.md body under 500 lines (platform best practices, spec, code.claude.com, skill-creator). **Confirmed.**
- **Link depth:** keep references one level deep from SKILL.md, because with nested files Claude "might use commands like `head -100` to preview content rather than reading entire files." **Confirmed.**
- **Contents list:** a reference file longer than 100 lines should open with a table of contents (platform best practices). skill-creator says 300 lines instead; see the conflicts section. **Confirmed.**
- **Say when to load each file:** "Read `references/api-errors.md` if the API returns a non-200 status code" works better than "see references/" (agentskills.io). **Confirmed.**
- **Claude Code reads the skill once:** it doesn't re-read the file on later turns, so write standing instructions. After compaction it keeps only the first 5,000 tokens of each skill (25,000 across all skills), so put the most important instructions near the top. **Confirmed.**

### Content rules

- **Assume the model is already very smart.** Ask of each paragraph, "Does this paragraph justify its token cost?" (platform). The spec site puts it as "Would the agent get this wrong without this instruction? If no, cut it." **Confirmed.**
- **Degrees of freedom:** match specificity to fragility: high freedom as plain heuristics, medium as pseudocode or parameterized scripts, low as exact commands ("Do not modify the command"). **Confirmed.**
- **Give defaults, not menus:** one default plus an escape hatch. **Confirmed.**
- **Workflows:** numbered steps, plus a copyable checklist ("Copy this checklist and track your progress") for complex tasks. **Confirmed.**
- **Feedback loops:** run the validator, fix, repeat; "Only proceed when validation passes." A reference document such as a style guide can be the validator. **Confirmed.**
- **Plan, validate, execute:** for batch or destructive changes, write the plan to an intermediate file and check it before acting, with verbose, specific validation errors. **Confirmed.**
- **Gotchas:** a "Gotchas" section of environment-specific facts belongs in SKILL.md rather than a reference file (agentskills.io). **Confirmed.**
- **Templates and examples:** give a template for the output format, strict where needs are strict, and input/output example pairs where style matters. **Confirmed.**
- **No time-sensitive information:** use an "Old patterns" section instead of "before August 2025". **Confirmed.**
- **Consistent terminology:** one term per concept throughout. **Confirmed.**
- **Paths and tools:** forward slashes, and MCP tool names fully qualified as `ServerName:tool_name`. **Confirmed.**
- **Scripts:** handle errors inside the script ("solve, don't defer"), no unexplained constants, say whether to run or read each script, and prefer scripts for deterministic work. **Confirmed.**
- **Naming:** the gerund form is suggested (`processing-pdfs`); noun phrases and action forms are acceptable; avoid `helper`, `utils` and `tools`. **Confirmed.**
- **Description voice:** "Always write in third person. The description is injected into the system prompt." Good: "Processes Excel files…"; avoid "I can help…" and "You can use this…" (platform). **Confirmed.**
- **Description style on the spec site:** imperative ("Use this skill when…"), describe the user's intent, "err on the side of being pushy", a few sentences long. **Confirmed.**
- **Some requests won't trigger a skill:** agents consult skills only for tasks they can't easily handle alone, so a simple one-step request may not trigger even a perfectly matching description. **Confirmed.**

### Evaluation and testing

- **Evaluations before documentation:** find the gaps, write three scenarios, take a baseline without the skill, write the minimum instructions, iterate; "At least three evaluations" (platform). **Confirmed.**
- **Test with every model you plan to use:** for Haiku, is there enough guidance; for Sonnet, is it clear and efficient; for Opus, does it avoid over-explaining. The page names no model versions. **Confirmed.**
- **Two instances:** one Claude writes the skill and a second tests it; watch for unexpected exploration paths, missed links and files never read. **Confirmed.**
- **Eval files and runs:** store cases in `evals/evals.json` (prompt, expected_output, files, assertions); run each with and without the skill in a clean context; add assertions after the first run. **Confirmed.**
- **Trigger evals:** about 20 queries, 8 to 10 that should trigger and 8 to 10 near-miss negatives, each run 3 times, with 0.5 as the trigger-rate threshold. **Confirmed.**
- **skill-creator's description optimizer:** a 60/40 train and held-out split, up to 5 iterations, best description chosen by test score, run with the current session's model ID. **Confirmed.**

## Prompting Opus 5.5 and Sonnet 5.5

Opus 5.5 launched 2026-09-22 and Sonnet 5.5 on 2026-09-28 (release notes). Both prompting guides say existing Opus 5 and Sonnet 5 prompts "should perform well without changes", so those guides remain the baseline. **Confirmed.**

### How literally they follow instructions

- **Sonnet 5 and 5.5** interpret prompts "literally and explicitly, particularly at lower effort levels" and don't silently generalize an instruction from one item to another, so state the scope ("Apply this formatting to every section, not just the first one"). **Confirmed.**
- **Opus 5** may follow "only report high-severity issues" literally and report less; ask it to report everything, then filter in a separate pass. **Confirmed.**
- **Current models generally** "follow instructions more closely and more literally"; hedges such as "try to" or "if possible" are "read literally as permission to under-deliver" (prompt-audit.md, 2026-09-29). **Confirmed.**

### Emphasis, capitals and giving reasons

- **Dial back aggressive language:** "CRITICAL: You MUST use this tool when…" becomes "Use this tool when…", because aggressive wording causes over-triggering (prompting best practices). **Confirmed.**
- **Give the reason.** The page contrasts "NEVER use ellipses" with a version saying the text-to-speech engine can't pronounce them; "Claude is smart enough to generalize from the explanation." **Confirmed.**
- **skill-creator:** writing ALWAYS or NEVER in capitals "is a yellow flag"; explain why instead of "heavy-handed musty MUSTs". **Confirmed.**
- **agentskills.io:** "Reasoning-based instructions ('Do X because Y tends to cause Z') work better than rigid directives." **Confirmed.**
- **prompt-audit.md:** when several instructions are each marked critical, "the markers stop carrying information… an anxious prompt produces a cautious, hedging model." Emphasis is "a tested, scoped fix for one demonstrably underweighted instruction." **Confirmed.**
- **Exception for trigger text:** a skill's `description` "may legitimately carry calibrated urgency, because skills currently under-trigger"; text whose job is behavior should explain rather than shout. **Confirmed.**

### Over-specification to remove

All from prompt-audit.md (2026-09-29), **confirmed**: step-by-step choreography for judgment tasks (keep numbered steps "only where order truly matters"); prohibition lists, which "can anchor it toward that failure" unless the failure really happens or the rule is real policy; a single gold example (use several, labeled illustrative); bullet walls that "sever rules from reasons" (write behavior as prose carrying the because); padding and repetition; grader vocabulary such as "you will be graded on"; history narratives, incident IDs, pinned model names and "now / no longer" phrasing; trigger-phrase lists in descriptions (name categories of intent instead); inline point systems the model has to compute (move data to files and arithmetic to code).

### Output format

- **Be specific about format and constraints;** examples are "one of the most reliable ways to steer" format, and prompt style bleeds into output style. **Confirmed.**
- **Length:** prefer qualitative guidance over numeric word caps (prompt-audit.md). **Confirmed.**
- **Don't ask for reasoning in the output.** On Opus 5.5 and Sonnet 5.5, prompts or skills that ask the model to write out its reasoning "may be declined with the `reasoning_extraction` refusal category"; ask for a short explanation or summary instead. **Confirmed.**

### Effort

- **Opus 5.5:** thinking is always on and effort is the main control; the default is `medium` (Opus 5 defaulted to `high`). Keep `xhigh` and `max` for measured gains, and lower effort rather than adding prompt text to get less thinking. **Confirmed.**
- **Sonnet 5.5:** the API default is `high`, with recalibrated levels; at `low` it may skip verifying its work, at `low` and `medium` it's likelier to stop and check in on long tasks, and asking it to think less "doesn't reliably reduce its thinking." **Confirmed.**
- **In a skill:** Claude Code skills can set `effort` in frontmatter, and "ultrathink" in the content requests deeper reasoning. Figma documents no equivalent. **Confirmed** for Claude Code; **inferred** for Figma.

### Tool use and agentic behavior

- **Sonnet 5.5:** remove "minimize tool calls" language, which it follows literally; it sometimes answers from its own knowledge when a search would be better; it occasionally gets a tool name's letter case wrong. **Confirmed.**
- **Opus 5.5:** it "tends to get to work quickly", and an instruction to explore relevant sources first improved results on loosely specified tasks; it may end a turn with a progress report in long unattended runs; it responds well to naming the specific patterns to avoid. **Confirmed.**
- **Opus 5:** it verifies its own work unprompted, so "double-check" and "verify" instructions cause over-verification; it can widen a task's scope, so constrain scope explicitly. **Confirmed.**

### Long checklists and rubrics

No Anthropic page measures how Opus 5.5 or Sonnet 5.5 handle long checklists or rubrics. The related guidance: use numbered or bulleted steps "when the order or completeness of steps matters"; for long tasks, keep the parts in a checklist the model updates; and avoid bullet walls of behavioral rules. **Confirmed.**

## Rubric and grader guidance

- **Cheaper graders first:** code-based grading, then model grading, then human grading as a last resort. Rubrics should be "detailed, clear"; graders "empirical or specific" (correct or incorrect, or a 1 to 5 scale); run the grader with thinking on (develop-tests page, written on or after 2026-09-22). **Confirmed.**
- **Assertions:** specific, observable and countable; "The output is good" is too vague and an exact required phrase too brittle (agentskills.io). **Confirmed.**
- **Evidence:** each verdict is PASS or FAIL with quoted evidence; "Require concrete evidence for a PASS. Don't give the benefit of the doubt." **Confirmed.**
- **skill-creator's grader:** PASS needs "genuine substance, not just surface compliance"; "the burden of proof to pass is on the expectation"; it also checks the output's factual, process and quality claims, and critiques assertions that would pass for wrong output. **Confirmed.**
- **eval-audit.md:** atomic checks over holistic scores, ideally one judge call per property; grade outcomes, not paths; a "concrete rubric, not vibes"; treat candidate text as untrusted data; structured output; guard against position, verbosity and self-preference bias; calibrate against human labels (well below about 90% agreement on clear cases means another iteration); test the judge on known negatives such as an empty string, "I don't know", and a confident answer to the wrong question. **Confirmed.**

## The anthropics/skills repo

- **Template:** `template/SKILL.md` is minimal: `name: template-skill`, a description ending "…and when Claude should use it", and a body. `spec/agent-skills-spec.md` now only points to agentskills.io. **Confirmed.**
- **skill-creator layout:** a 485-line `SKILL.md`, plus `agents/` (grader, comparator, analyzer), `references/schemas.md`, `scripts/` (quick_validate, package_skill, run_eval, run_loop, improve_description, aggregate_benchmark, generate_report), `eval-viewer/` and `assets/`; last changed 2026-04-20. **Confirmed.**
- **skill-creator's process:** capture intent, interview, write the SKILL.md, write test cases, run with and without the skill in parallel, draft assertions during the runs, grade and benchmark, human review, improve, repeat, then optimize the description. When improving: generalize rather than overfit, keep it lean, explain the why, read transcripts as well as outputs. **Confirmed.**
- **Pushy descriptions:** "Claude has a tendency to 'undertrigger' skills… make the skill descriptions a little bit 'pushy'"; prefer the imperative form in instructions. **Confirmed.**

## Conflicts and gaps

- **Contents-list threshold:** platform best practices say over 100 lines; skill-creator says over 300.
- **Description voice:** the platform says third person and avoids "You can use this…"; agentskills.io says "Use this skill when…". Third-person "Processes X. Use when…" satisfies both. **Inferred.**
- **Strong wording:** the platform's iteration example has Claude suggest "MUST filter" as a fix, while skill-creator, agentskills.io and prompt-audit discourage capitals in favor of reasons. prompt-audit (the newest source) reconciles them: emphasis is a tested fix for one under-weighted instruction, and calibrated urgency belongs only in trigger text.
- **Pushy descriptions versus over-triggering:** a deliberate split between trigger text and behavior text, per prompt-audit.
- **Description cap:** the spec allows 1,024 characters and Claude Code truncates `description` plus `when_to_use` at 1,536; `when_to_use` isn't portable and fails on upload.
- **Figma invocation:** Figma says you "must invoke" a skill by slash command, yet discusses automatic invocation. Not resolved.

## Questions we couldn't answer

- Whether Figma's agent ever triggers a custom skill automatically.
- Which models run Figma's agent, and any Figma size limit.
- How Opus 5.5 and Sonnet 5.5 behave specifically with long checklists or rubrics.
- When the Anthropic docs pages were last revised, since they carry no dates.

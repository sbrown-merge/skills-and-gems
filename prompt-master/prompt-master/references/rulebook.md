# The Rulebook

The eight rules this skill applies, each with the Anthropic source to cite in the change log. Read once per session. Apply while building; do not explain them to the user unless asked.

Sources (short names used below):
- OPUS5: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5
- FABLE5: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5
- FABLE51: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1
- SONNET5: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5
- BEST: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- CTXENG: https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models
- FIELDGUIDE: https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns
- BORIS: https://www.youtube.com/watch?v=qyPCVqFUyDo (Boris Cherny, YC interview, 2026-07-27)

## Part 1. The handoff

1. **Give it the whole job.** Describe the outcome, the guardrails and what done looks like, then let it run. No step 1, step 2, step 3 scripts. Source: OPUS5, capability bullets: "performs best when given the complete task specification up front and left to run." BORIS at 15:20: "describe the task, describe the guardrails, describe the exit criteria, and then just go."
2. **Let Claude interview you** when the brief has gaps. One question at a time, prioritising questions whose answer would change the plan. Procedure in `interview.md`. Source: FIELDGUIDE.
3. **Say why, not just what.** One sentence of intent beats a paragraph of instructions. Template, verbatim: "I'm working on [the larger task] for [who it's for]. They need [what the output enables]. With that in mind: [request]." Source: FABLE5, "Give the reason, not only the request."

## Part 2. The unlearning

4. **Match verification to the model.** Opus 5 verifies its own work; on Opus 5, verification lines cause over-verification and cost tokens with no quality gain, so remove them. Source: OPUS5, "Task scope and over-verification" and "Self-correction." This is Opus 5 specific. For Fable 5 long runs, do the opposite: make verification explicit, with fresh-context verifier subagents checking against the spec at intervals (FABLE5, "Recommended scaffolding changes"). For other models, a self-check against concrete criteria still helps (BEST, Thinking, "Ask Claude to self-check"). Per-model detail, including Sonnet 5 and Fable 5.1, is in `model-notes.md`.
5. **Swap rules for reasons.** A bare rule gets ignored or overfitted; a rule with its reason generalises. Source: CTXENG, reversal one ("Give Claude rules" to "Let Claude use judgement"); BEST, "Add context to improve performance" (the ellipses example).

## Part 3. The guardrails

6. **Tell it where the job ends.** Cap three things: scope (what not to touch), deliverable size, report-back size. Claude 5's failure mode is doing too much, not too little. Source: OPUS5, "Task scope," "Response length and verbosity," "Written deliverable length."
7. **Make it prove it.** On long runs, add the audit line so every progress claim points to evidence. Verbatim text lives in `job-brief.md`. Source: FABLE5, "Ground progress claims during long runs" ("nearly eliminated fabricated status reports"). BORIS at 20:26: verification is "the single most important thing people do not get right."

## Part 4. The voice

8. **Fix the voice once.** Put the communication style in a standing home (project instructions, account instructions, or a Claude Code output style) instead of every prompt. Tell it what to do, not what not to do. Source: OPUS5 conciseness instruction; FABLE5 "Strong instruction following" brevity block; BEST, "Control the format of responses."

## What survived (keep using)
A one-line role. XML-style tags to separate instructions, context, input. 3 to 5 examples when output format matters, wrapped in example tags. Long documents above the question. Source: BEST, General principles and Long context prompting.

## By model
The rules above hold across models; how far to push them does not. Opus 5 needs length caps and no verification lines; Sonnet 5 reads literally, so rules need an explicit scope; Fable 5 long runs need the verifier-subagent line and no standing "explain your reasoning"; Fable 5.1 needs progress updates asked for and anti-formatting rules removed. Details, verbatim lines and sources in `model-notes.md`.

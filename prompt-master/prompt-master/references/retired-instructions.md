# Retired Instructions (Step 2)

Check every line of an existing prompt against this list. Match: remove it, or replace it with the fix given. Record each change for the step 5 change log. Sources are short names from `rulebook.md`.

| # | If the prompt says | Do this | Source |
|---|---|---|---|
| 1 | "Double-check your answer", "re-verify before responding" | Opus 5 target: delete; it verifies on its own and the line causes over-verification. Other targets: keep, or tie it to concrete criteria ("verify against [test criteria]"). | OPUS5, Self-correction; BEST, Thinking ("Ask Claude to self-check") |
| 2 | "Include a final verification step", "use a subagent to verify" | Opus 5 target: delete. Fable 5 long run: keep, and prefer the verifier-subagent line in `job-brief.md`. Other targets: keep. | OPUS5, Task scope; FABLE5, Scaffolding ("Make self-verification explicit") |
| 3 | "Think step by step", "reason carefully before answering" | Delete when thinking is on (always on for Fable 5 and Mythos 5; on by default for Opus 5 and Sonnet 5): adaptive thinking already covers it, and general instructions beat a hand-written reasoning plan. Keep only if the integration runs with thinking disabled on a model other than Opus 5, or for a multistep task on Sonnet 5 held at low effort (use SONNET5's line in `model-notes.md`). | BEST, Thinking; SONNET5, Calibrating effort |
| 4 | "CRITICAL:", "You MUST", all-caps emphasis | Rewrite in normal language: "Use [tool] when..." | BEST, Tool usage (measured on Opus 4.5 and 4.6) |
| 5 | "If in doubt, use [tool]", "default to using [tool]" | Rewrite: "Use [tool] when it would enhance your understanding of the problem." | BEST, Overthinking |
| 6 | "Only report high-severity issues", "be conservative" (review prompts) | Rewrite: report everything, filter in a separate pass. For Sonnet 5 (also "don't nitpick"), use the coverage line in `model-notes.md`. | OPUS5, Code review bullet; SONNET5, Code review harnesses |
| 7 | Bare "do not use markdown", "no bullet points" | Rewrite as the positive: "Write in smoothly flowing prose paragraphs." If the user also asks for a table or list, keep that element and apply the prose rewrite to the surrounding text only. Fable 5.1 target: remove the rule instead, or use the when-to-format rule in `model-notes.md`; it already formats less. | BEST, Format control; FABLE51, Formatting in chat |
| 8 | A prefilled opening line ("Here is the summary:") | Delete. Prefill is unsupported from Claude 4.6 on; instruct directly: "Respond directly without preamble." | BEST, Prefill migration |
| 9 | A defensive patch nobody can explain ("never mention plan details, point to the URL") | Delete unless the user can name the failure it fixes. | CTXENG, "Unhobbling Claude" (constraints once needed can now be deleted) |
| 10 | "Do not think", "do not reason" | Delete. On Opus 5 it increases leaked internal tags. | OPUS5, Thinking disabled |
| 11 | "Explain your reasoning" as a standing line, Fable 5 target | Delete. Can trigger the reasoning_extraction refusal and reroute to Opus 4.8. Ask ad hoc instead. | FABLE5, Scaffolding |
| 12 | "First do 1, then 2, then 3, then 4" task scripts | Rewrite as job, guardrails, exit criteria (step 3). | BORIS 15:20 |
| 13 | "Be thorough", "do a great job", "this is vital to my career" | Delete. No concrete change attached. | This skill's own deletion test (not an Anthropic source; cite it as such) |
| 14 | "Tell me everything you did", "give me a full summary" | Replace with a report-back cap: "tell me where the result is and give me [3] short sentences on what you did. Nothing more." | OPUS5, Verbosity |
| 15 | Chain-of-thought or emotion-prompting boilerplate carried from older frameworks | Delete. | BEST, Migration considerations |
| 16 | Forced status scaffolding ("After every 3 tool calls, summarize progress"), Sonnet 5 target | Delete. Sonnet 5 gives regular updates on its own; if they need shaping, describe what an update should contain. | SONNET5, User-facing progress updates |
| 17 | Narration suppressors ("hold all findings for the final response"), Fable 5.1 target | Delete. Fable 5.1 already writes few updates; add the progress line from `model-notes.md` if the user watches the run. | FABLE51, Ask for user-facing progress updates |

## Keep these (do not strip)
- Project gotchas the model cannot discover on its own.
- Hard rules where being wrong is expensive: deletes, sends, money, permissions, client-facing surfaces.
- A one-line role.
- XML-style section tags.
- 3 to 5 examples when output format matters.
- Numbered steps when order or completeness genuinely matters (a checklist, a compliance sequence). Order that matters is not a script.

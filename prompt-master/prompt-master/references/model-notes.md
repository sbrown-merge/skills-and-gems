# Model Notes (Steps 2 to 5)

What changes by target model. Look up the target from intake, apply only its section, and cite the source in the change log. Sources are short names from `rulebook.md`. Mythos 5 and Mythos 5.1 share the Fable 5 and Fable 5.1 guides. If the target is unknown, apply none of the model-specific deletions and say so in the change log.

## Quick table

| Target | Verification lines | Progress updates | Formatting rules | Watch for |
|---|---|---|---|---|
| Opus 5 | Remove | Tune narration down | Positive rewrite (retired #7) | Longer responses and documents: cap length |
| Sonnet 5 | Keep only if tied to concrete criteria | Remove forced status scaffolding | Positive rewrite (retired #7) | Literal reading: state scope explicitly |
| Fable 5 | Long runs: add verifier-subagent line | Default is fine | Positive rewrite (retired #7) | No standing "explain your reasoning" |
| Fable 5.1 | Inherits Fable 5 | Ask for them; remove suppressors | Remove anti-formatting rules | Stops early on long runs; dense prose |

## Opus 5 (OPUS5)
- Remove verification and re-check lines (`retired-instructions.md` #1, #2).
- Cap response and document length explicitly; effort does not shorten visible output.
- Code review: report everything, filter in a separate pass (retired #6).

## Sonnet 5 (SONNET5)
- **Literal instruction following.** It does not generalise an instruction from one item to another or infer requests you did not make. When a rule should apply broadly, say so: "Apply this formatting to every section, not just the first one." This is the one model where rules-to-reasons (step 4) must also state the rule's scope, not just its reason.
- **Specify the whole task in the first turn.** Task, intent and constraints up front; drip-fed requirements over several turns cost tokens and sometimes quality. The Full Job Brief already does this.
- **Progress updates are good by default.** Remove forced status scaffolding such as "After every 3 tool calls, summarize progress" (retired #16).
- **Verification.** It runs self-verification loops readily on its own. The guide does not say to remove verification lines, so keep one only if it names concrete criteria.
- **Low effort can under-think.** Raising effort is the first fix. If the user must stay at low effort for a multistep task, keep or add: "This task involves multistep reasoning. Think carefully through the problem before responding." (exception to retired #3).
- **Verbosity.** Positive examples of the wanted concision work better than instructions about what not to do.
- **Code review.** Replace "only report high-severity issues", "be conservative" or "don't nitpick" with Anthropic's coverage line (retired #6):

```
Report every issue you find, including ones you are uncertain about or consider low-severity. Do not filter for importance or confidence at this stage - a separate verification step will do that. Your goal here is coverage: it is better to surface a finding that later gets filtered out than to silently drop a real bug. For each finding, include your confidence level and an estimated severity so a downstream filter can rank them.
```

- **Design briefs.** "Don't use that color" or "make it clean" swaps one fixed palette for another. Give a concrete spec, or ask for 4 distinct directions to pick from before building.

## Fable 5 (FABLE5)
- Long runs: add the audit line and the verifier-subagent line from `job-brief.md`.
- Never add a standing "explain your reasoning" or "show your thinking" line; it can trigger the reasoning_extraction refusal and fall back to Opus 4.8 (retired #11).

## Fable 5.1 (FABLE51)
Existing Fable 5 prompts carry over without changes, so everything under Fable 5 still applies. The 5.1 guide does not restate the verifier or reasoning_extraction guidance; keep both, they cost nothing. The differences:

- **Fewer progress updates.** On long runs it can go quiet for minutes. Remove lines that suppress narration, such as "hold all findings for the final response" (retired #17). If the user watches the run, add:

```
Before you start, say in a line what you're about to do; brief updates while you work help the user follow along. Close with a short recap that stands on its own — what you found, what you did, and what's next — so a reader who only sees the last message has the full picture.
```

  When this line is used, it replaces the report-back cap in DONE MEANS; do not cap updates as brief on top of it.
- **Formats less than earlier models.** Remove anti-formatting language instead of rewriting it as "smoothly flowing prose" (retired #7). If the prompt needs a formatting rule, use:

```
Use lists and bullet points when asked to, or when the content is multifaceted enough that they help with clarity. If the person explicitly requests minimal formatting, always format your responses without bullet points, headers, lists, or bold emphasis, as requested. In conversational, personal, or emotional exchanges, keep to plain prose.
```

- **Dense prose.** For writing deliverables, add: "Please remove all mannered prose." Anthropic prefers it in the user message over the system prompt.
- **Can end a long run early** by announcing the next step instead of doing it, or asking permission for work already requested. For autonomous or unattended runs, append the first block from FABLE51 "Finish the whole task" verbatim (it opens "You are operating autonomously."). Keep its opening sentence as written. Skip it when the user is pairing live.
- **Scope on coding tasks.** It may fix nearby code or commit extra tests. For open-ended implementation work, append the block from FABLE51 "Keep changes and tests to what the task asks for" verbatim.
- **Searches less at low effort.** For research prompts that name fast-moving products or unfamiliar names, add:

```
When a query centers on a name you do not confidently recognize, or recognize from a fast-moving area like AI models and developer tools where the landscape shifts within months, the name itself is the thing to verify: search before answering, and include the name as the user wrote it in at least one query alongside any reformulations. This holds even when you have some background on it — partial background is exactly what makes an out-of-date answer sound authoritative, so familiarity is not a reason to skip the search.
```

- **Summaries of sources** can reuse source wording without quotation marks. For summarisation prompts, one complete example of a correct response (request, response, and why it is correct) fixes this better than a rule.

# "How the Top 1% Use Claude Code Differently": report

**Source video:** Simon Scrapes, published 2026-10-10, 18 min. <https://www.youtube.com/watch?v=J9NQTYUP6k0>
**Transcript:** `~/Git-Repos/temp/How the Top 1% Use Claude Code Differently.md` (auto-captions, so "claw code" means Claude Code)
**Report date:** 2026-10-13

---

## 1. What the video says

The video's argument is that with Opus 5 and 5.5, most of the scaffolding people built for older models now gets in the way. The new approach is to **write a short brief, let Claude work, and check the evidence afterwards**. It lists ten changes, nine of which are named in the chapters:

1. **Plan mode is redundant.** Instead of reading a plan first, write a three-part brief (the task, the guardrails, what "done" looks like), then ask for a one-page visual of what Claude did and what it assumed.
2. **Stop choosing an effort level.** "Think harder" is now just words in the prompt. The recommended default, medium for Opus 5.5, is the right setting for most work.
3. **Checks instead of plans.** Don't write "double-check your work". Give Claude a pass/fail check it can run, such as a `check_report` script or a brand-voice document to compare against.
4. **Work autonomously with `/goal`.** It keeps Claude going until the check passes. A good goal has one end state, says how to prove it, says what must not change, and sets a turn limit.
5. **Make CLAUDE.md an index.** Keep it under 200 lines and hold only four things: commands Claude can't guess, ways you differ from the defaults, mistakes it has made more than once, and boundaries. Everything else becomes a path in backticks with a note on when to open it, not an `@import`. Each referenced file should be linked directly from CLAUDE.md, and any file over 100 lines gets a table of contents. `/doctor prompt-audit` automates this.
6. **Only write a skill for what Claude got wrong.** Run the task with no skill first, note your corrections, and make those corrections the skill. Test it on the model you will actually use.
7. **Skill packs are mostly decoration.** One tester found that 7 of 9 popular skill packs did no better than a filler file of the same length. Use `claude plugin eval` (with vs. without the skill) and `/skill-doctor` (what each skill costs and how often it is used) to prune.
8. **Put rules that must hold in a hook.** Capitals and "IMPORTANT" no longer work. Each shouted rule is either something Claude does anyway (delete it) or something that must never happen (turn it into a hook).
9. **Let Claude build its own agent team.** Opus 5 delegates readily on its own, so limit team size rather than wiring up orchestrators. In a skill, push heavy research or connector steps into a subagent to keep the main context clean.
10. **Run things without you.** Ongoing Projects, routines and scheduled tasks triggered by time or events, with the human only approving the output.

## 2. Checked against Anthropic's documentation

| Claim | Verdict | Source / note |
|---|---|---|
| Opus 5.5 defaults to medium effort and matches Opus 5 on high | **Correct** | Opus 5.5 model page: adaptive thinking is always on, default effort is medium. A customer quote on Anthropic's Opus page reports it matched Opus 5 on high with 20–25% fewer output tokens. ([platform docs](https://platform.claude.com/docs/en/models/opus-5-5/overview)) |
| Giving Claude a way to verify its work is the top tip | **Correct** | It is the first item in Anthropic's *Best practices for Claude Code*. That page lists three strengths of gate: a check in the prompt, a `/goal` condition, or a Stop hook as a deterministic gate. It also asks Claude to show evidence rather than claim success. |
| `/goal`: a Haiku judge after each turn that reads only the conversation | **Correct** | `/goal` is a session-scoped, prompt-based Stop hook. A small fast model (Haiku by default) judges it as *not met*, *met* or *impossible*. It stops after several turns with no tool use. ([docs](https://code.claude.com/docs/en/goal)) So the condition has to be something visible in the transcript, such as "the check script output shows PASS". |
| Anthropic deleted more than 80% of Claude Code's system prompt for Opus 5 | **Correct** | Post by Thariq Shihipar, 2026-07-24: "no measurable loss on our coding evaluations". It describes moving from rules to judgment and from upfront context to progressive disclosure. |
| CLAUDE.md under 200 lines; `@import` loads the whole file | **Correct** | Memory docs: "target under 200 lines". Imported files "load at launch" and "don't reduce its context cost". Path-scoped rules load only when matching files are opened. |
| Files reached only through another file get just their first ~100 lines read | **Partly; this is an extrapolation.** | The skill-authoring guide says to keep references one level deep and add a table of contents to long files, because Claude may only preview them. The video applies that to everything CLAUDE.md points at. It's a sensible habit, but it is not a documented CLAUDE.md rule. |
| `/doctor prompt-audit` | **Correct** | Changelog plus memory docs. It needs v2.1.283 or later and runs through the bundled `claude-api` skill. You can pass it a path, for example `/doctor prompt-audit .claude/skills/x`. |
| Start skills without a skill, then write the minimum | **Correct** | Skill-authoring best practices: "Establish baseline: measure Claude's performance without the Skill", then write minimal instructions. |
| `claude plugin eval` compares with a no-plugin baseline | **Correct** | It runs each case in a fresh isolated session, grades the result, compares against the baseline, and can gate CI. It works on a "skills-directory plugin". Runs count against your plan or API bill. |
| `/skill-doctor` shows what each skill costs per turn and how often it runs | **Correct** | v2.1.252 or later. |
| 9 skill packs, 450 runs, 7 of 9 no better than filler | **Not verified** | I couldn't find the original. Treat it as one person's result. The method (with vs. without) is the useful part. |
| Boris Cherny said "plan mode is no longer useful" on Hacker News | **Not verified directly** | Cherny is on record (YC Startup School) saying to periodically delete your CLAUDE.md and skills and re-test against new models, which is the same spirit. Anthropic's best-practices page still documents plan mode, so it isn't retired. It's just not the default way to start anymore. |
| Opus 5 delegates to subagents readily; cap the team rather than build it | **Correct** | The SDK subagent docs: Claude decides when and how many, and on Opus 5 the `claude_code` preset even adds a line discouraging Agent calls unless asked. Limits are enforced separately. |

**Overall:** the video is accurate on the mechanisms and slightly overstated in its framing ("all that advice is now obsolete"). Everything in it is consistent with Anthropic's July 2026 guidance.

## 3. What this means for your work

Your repo already follows much of this. `prompt-master` writes the **Full Job Brief (job, why, guardrails, done-means)**, which is the video's three-line brief plus a "why". It already has an `EVAL.md`. The gaps are mostly in *applying it to your own setup* and in *proving* your skills earn their place.

| Area | Your current state | Gap |
|---|---|---|
| Global CLAUDE.md | 17 lines: style, communication, OS/editor, project root | Already small. "Ask clarifying questions before making large changes" works against autonomous `/goal` runs unless it is scoped. "Use functional programming patterns" and "Always include error handling" are things Opus 5.5 does anyway, so they are likely redundant. |
| Skill library | 6 skills or Gems in the repo, 11 Parallel skills in `~/.claude/skills`, plus plugins (product-management, productivity, design, figma, miro, etc.) | Most were never measured against a no-skill baseline. Every installed skill's description costs tokens on every turn. |
| `pptx-visual-qa` | Written from real failures (Keynote -600 error, missing fonts, orphaned comments) | **This is the "skill for what Claude got wrong" pattern done right.** It's long, though. A table of contents at the top would help, given the 100-line preview behaviour. |
| `sn-ui-checklist`, `type-scale-tokens` | Written as process manuals | These are the most likely candidates for "decoration" on Opus 5.5. Worth evaluating. |
| Client deliverables (decks, reports) | Checked by hand or with `pptx-visual-qa` scripts | `check_pptx_package.py` already exists: a deterministic **check** that `/goal` could loop on. |
| Hooks | None | Must-hold rules (no sending email, no editing client templates, no LibreOffice attempts) live in prose today. |
| Gemini Gems | Several, in this repo | The same lessons apply: shorter instructions, reasons instead of capitals, and a with/without test. There are no hooks or `/goal` in Gems. |

## 4. Recommendations

Listed in order of value for effort.

### 4.1 Run `/doctor prompt-audit` and `/skill-doctor` now (≈15 min)
- Run `/skill-doctor` in a terminal `claude` session. Turn off every skill or plugin that has never run (the Parallel set, product-management and productivity plugins you don't use). This is the cheapest win in either video.
- Run `/doctor prompt-audit ~/.claude/CLAUDE.md`, then the same on each `SKILL.md` in this repo. It changes nothing until you approve.
- Compare what it suggests with `prompt-master`'s own file audit. Where they disagree, update `prompt-master/references/retired-instructions.md`.

### 4.2 Evaluate your own skills against a no-skill baseline
Turn the repo into a skills-directory plugin, or add a minimal `.claude-plugin/plugin.json`, and write 3–5 real cases per skill for `claude plugin eval`:
- **`sn-ui-checklist`**: the same screenshot critiqued with and without the skill, graded on specific, evidence-based findings.
- **`type-scale-tokens`**: generate a scale with and without it, graded on token format and ratio correctness. Here a deterministic script grader is possible.
- **`prompt-master`**: you already have `EVAL.md`, so convert it into eval cases.
- **`pptx-visual-qa`**: grade on "rendered without trying soffice" and "found the orphaned comment part". This one should win clearly, and the eval proves it.

Delete or shrink any skill that ties with its baseline. Run the evals on **the model you'll actually use**. Your default is Sonnet, while MERGE work may run on Opus 5.5.

### 4.3 Reshape skills as lists of corrections
For each skill that survives §4.2, cut whatever Claude does unprompted and keep the gotchas. A useful test: does this line describe a mistake that has actually happened? `pptx-visual-qa` already reads this way, with dated failures. Add a table of contents to its top, since it is well over 100 lines. Add the same principle to `prompt-master`'s audit as its own check bucket.

### 4.4 Turn deliverable QA into a `/goal` loop
For decks:
1. Brief: "Build the deck from X. Don't modify the master template. Done means `check_pptx_package.py` reports no orphans, `markitdown` shows no leftover placeholders, and each slide's render shows no overflow."
2. `/goal check_pptx_package.py and the placeholder scan both print PASS, the template is unchanged, stop after 15 turns`
3. Ask for a one-page summary of what it changed and assumed.

To make this work, add a small `check_deck.sh` wrapper to `pptx-visual-qa/scripts/` that prints a single PASS/FAIL line, because the `/goal` judge only sees the transcript. Apply the same pattern to type-scale output (ratios and token names validated by a script) and to written client copy (check against a brand-voice doc).

### 4.5 Move must-hold rules into hooks
Candidates, collected from your skills and context:
- **Never attempt LibreOffice on MERGE Macs** → a PreToolUse hook on `Bash` that denies `soffice|libreoffice|brew install.*libreoffice`.
- **Never send client email or messages without approval** → a PreToolUse hook on mail and Slack MCP send tools (`*send_message*`, `*forward*`, `*reply*`) that returns `ask`.
- **Never overwrite a client master template** → a PreToolUse hook on `Edit|Write` that denies paths matching your template folder.

Then remove the prose versions from the skills, or reduce them to a one-line pointer. This pairs with the hook work in the companion report, *Prompt-Submit Hooks for Sycophancy - Report.md*.

### 4.6 Update CLAUDE.md and `prompt-master` for autonomous runs
- Narrow "Ask clarifying questions before making large changes" to: "Ask before large changes when the request is ambiguous. When I give a brief with a done condition, work to it." Without this, every `/goal` run stalls on a question.
- Add one line pointing at your repo: "Skills and Gems source lives in `~/Git-Repos/skills-and-gems`; read its `README.md` before editing a skill."
- In `prompt-master`, add **"the check"** to the Job Brief output: when done-means can be scripted, the skill should offer to write the check and a matching `/goal` line.

### 4.7 Let Claude size its own agent team
Delete any hand-built orchestrator patterns you have kept for research work. For research-heavy tasks like this one, just give the brief. Where a skill has a big research or connector step, add one line telling Claude to run that step in a subagent so the main context stays clean.

### 4.8 Then automate a recurring process
Once a process has a brief, a check and a goal, it can run as a scheduled task or routine. A good first candidate is a weekly check that the docs `prompt-master` relies on haven't changed. Its own self-improvement section already asks for that, and `parallel-monitor` can watch the Anthropic best-practices and model pages.

## 5. Caveats

- The video promotes a paid community. The two unverified numbers (the 450-run benchmark and the Hacker News quote) should not drive decisions on their own.
- Plan mode is still documented and still useful when you want to review the approach on unfamiliar client code before anything changes. Treat it as optional, not banned.
- `claude plugin eval` and `/goal` runs use your plan's usage. Keep the eval suites small (3–5 cases per skill) and repeat runs only when a skill changes.

# Prompt-submit hooks against sycophancy: report

**Source video:** "Sycophancy Solved: Get Rid of Claude's Most Annoying Behavior", Future Tech Pilot, published 2026-06-24, 11 min. <https://www.youtube.com/watch?v=P6wq9ezwM48>
**Transcript:** `~/Git-Repos/temp/Sycophancy Solved- Get Rid of Claude's Most Annoying Behavior.md`
**Report date:** 2026-10-13

---

## 1. What the video says

The creator was tired of Claude doing three things: answering factual questions from memory and then backing down when challenged ("you're right, I didn't look it up"), starting to write code when he had only asked a question, and opening replies with flattery. He found that CLAUDE.md rules were sometimes ignored, so he switched to **UserPromptSubmit hooks**. These are commands Claude Code runs every time you press Enter, and the text they print is added to the context for that turn.

He set up four hooks, all user-wide in `~/.claude/settings.json`. He had Claude write each one from a single-sentence request:

| Hook | Trigger | What it injects |
|---|---|---|
| Answer questions first | Message contains `?` | Reply in text only and make no file edits unless the same message also says to build. Approval from an earlier turn does not carry over. |
| Research mode | A standalone `kk` | Sort the claim into a type. Anything volatile, specific or consequential must be checked against a real source before answering. Say which mode was used and cite the sources. |
| Save chat | A standalone `gg` | Write the conversation to `chat-logs/YYYY-MM Month/` with code stripped out. If the same session is saved again, append only the new part, matched by session ID. |
| Always-on | Every message | No flattery or validation, lead with the substance, keep it short. |

The exact wording of all four is in the video description, which is saved at the top of the transcript file.

His two warnings:
1. Hook text is sent with **every** prompt. A long hook costs tokens, time and context on every turn.
2. A hook only runs once it is registered in settings.json, and it may not apply to a session that is already open.

## 2. Checked against Anthropic's documentation

| Claim | Verdict | Notes |
|---|---|---|
| UserPromptSubmit fires before Claude sees the prompt, and its stdout becomes context | **Correct** | The hooks reference says that for UserPromptSubmit, UserPromptExpansion and SessionStart, stdout is added as context Claude can see. You can also return JSON with `hookSpecificOutput.additionalContext`. It must sit inside `hookSpecificOutput`; at the top level it is silently ignored. ([Hooks reference](https://code.claude.com/docs/en/hooks)) |
| It can block a prompt, for example one containing a pasted API key | **Correct** | Return `decision: "block"` with a `reason`, or exit with code 2. The blocked prompt is removed from the context. |
| Trigger words like "kk" | **Partly.** The hook itself has no trigger setting. | UserPromptSubmit **does not support matchers** and fires on every prompt. The script has to read `prompt` from its stdin JSON and decide whether to print anything. Claude writes that check when it builds the hook, but it means each hook is a small script, not a setting. |
| Hooks are more reliable than memory files | **Mostly correct.** | CLAUDE.md loads once at the start of the session. Hook text is added to every turn, right next to your newest message, so it is harder to lose in a long session. It is still an *instruction* to the model, though, not something the harness enforces. The only hooks that are truly deterministic are ones that **act**, such as a PreToolUse hook that denies an edit (see §4.2). |
| It may not work in every client | **Worth knowing.** | There are open bug reports of `additionalContext` from UserPromptSubmit not reaching the model in the VS Code extension (anthropics/claude-code#49063, #52876). You use VS Code and the desktop app, so test each hook on each surface before you rely on it. |

**Model context.** The video dates from June 2026. Opus 5.5 now runs at medium effort by default and is the model Anthropic tuned to check its own work. Some of the behaviour the creator was fighting is less common on current models. The remedies still help, though. Answering confidently from stale knowledge is the failure that matters most in your work (tool limits, plan features, pricing), and an always-on rule against flattery is cheap.

## 3. What this means for your work

Your setup today (checked 2026-10-13):

- `~/.claude/CLAUDE.md` is 17 lines and already says *"Be concise"* and *"Ask clarifying questions before making large changes"*. Those are the same preferences the video's always-on hook and question hook enforce. In your global file they are **advisory and loaded once per session**.
- `~/.claude/settings.json` has **no hooks**, and the default model is `sonnet`.
- Your work is mostly writing prompts, skills and Gems (`prompt-master`, `type-scale-generator`, `DESIGN.md` Gem, `sn-ui-checklist`), plus client-facing deliverables such as PowerPoint decks on MERGE Macs, with research files collected in `research/`.

What follows from that:

1. **The question hook fits your stated rule best.** "Ask before large changes" is the rule that silently fails when Claude starts building in reply to a question. A hook turns that preference into a per-turn reminder.
2. **Research mode (`kk`) matters most where your work goes out the door.** Your research notes keep citing volatile facts: model pricing, effort defaults, plan limits, commands like `/doctor`. A wrong fact here ends up in a skill or a client deck. You already have `parallel-web-search` installed, so the hook can name it as the way to verify.
3. **Gemini Gems have no hooks.** For a Gem, the always-on rules have to go in the Gem's own instructions. If you want one source of truth, keep the hook text in this repo and paste the same block into each Gem.
4. **Token cost is real but small if you keep the text short.** Four hooks of about 60–120 words each come to roughly 300–600 tokens per turn **only when they fire**. The always-on hook fires on every turn, so keep it to one or two sentences. That matches the cost rules in your own `research/Token Optimization.md`.

## 4. Recommendations

Listed in order of value for effort.

### 4.1 Add the always-on and question hooks, with shorter text
Add both to `~/.claude/settings.json` as one script, so the prompt is read once. Suggested injected text, written in the reason-first style `prompt-master` already uses:

- **Always:** "Lead with the answer. Don't praise or validate my ideas; I read that as noise. Keep replies short unless I ask for depth."
- **If the prompt contains `?` and no build verb:** "This message is a question. Answer it in text and wait. Edits need a build instruction in this same message, because a wrong guess wastes the whole turn."

Then delete *"Be concise"* from `~/.claude/CLAUDE.md` so the rule isn't stated twice.

### 4.2 Make "no edits on a question" deterministic instead of hoping
A prompt hook can only *ask* Claude not to edit. To guarantee it:
- In the UserPromptSubmit script, when the question case fires, write a flag file such as `~/.claude/state/question-turn-<session_id>`. Delete it on any other prompt.
- Add a **PreToolUse** hook with matcher `Edit|Write|NotebookEdit`. If the flag exists, return `permissionDecision: "deny"` with the reason "Question turn: answer first."

This applies the second video's rule, *must-hold rules go in a hook*, and costs no tokens.

### 4.3 Add `kk` research mode, tuned to your sources
Keep the creator's best line, *verify if it would change or sharpen the answer*, and add your own trusted sources:
"Check against `code.claude.com/docs`, `platform.claude.com/docs` or the vendor's own page using parallel-web-search before answering. Give the source URL for each fact."
This is especially useful when you update `prompt-master/references/rulebook.md`, whose own self-improvement section says to re-check it against Anthropic's pages.

### 4.4 Replace the `gg` save-chat hook with a script, not a model
The video has Claude **write out** the transcript, which spends output tokens and loses words. Claude Code already writes every session as JSONL, and every hook receives `transcript_path` on stdin. A **SessionEnd** hook, or a UserPromptSubmit hook that fires on `gg`, can copy or convert that file into `chat-logs/YYYY-MM Month/` with `jq`, stripping code blocks. It produces an exact copy, costs nothing, and makes the append-only-new logic trivial.

### 4.5 Add a block for pasted secrets
This is the blocking case the video mentions but doesn't build. On MERGE work you handle client material, so a UserPromptSubmit check for strings that look like API keys or tokens (`sk-`, `AKIA`, `ghp_`, `xox[bp]-`, long base64 strings) that returns `decision: "block"` is a cheap safeguard.

### 4.6 Version the hooks in this repo
Create a `hooks/` folder in `skills-and-gems` with the scripts and a README containing the settings.json snippet, the same way `pptx-visual-qa` keeps its scripts. That makes them easy to install on a second Mac and puts every change in git history.

### 4.7 Test them
- After adding a hook, open a **new** session and check it fires. `/hooks` in a terminal `claude` lists registered hooks.
- Test in the desktop app and in VS Code separately, because of the known extension bug.

## 5. What not to do

- Don't grow the always-on hook into a second CLAUDE.md. Hook text is paid for on every turn, and the second video's advice (and Anthropic's own 80% cut of the Claude Code system prompt) points the other way.
- Don't use capital letters or "MUST" wording in hook text, as the video's examples do (`STOP`, `ZERO`). Current guidance is that a reason works better than shouting, and anything that truly must hold belongs in a blocking hook (§4.2).

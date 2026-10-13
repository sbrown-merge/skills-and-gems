---
created: 2026-09-20T13:02:44 (UTC -04:00)
tags: []
source: https://benai.notion.site/Token-Optimization-3d71124570fe8096bef6e530c782a10d
author: 
---

# Token Optimization

> ## Excerpt
> A collaborative AI workspace, built on your company context. Build and orchestrate agents right alongside your team's projects, meetings, and connected apps.

---
Get all the free resources of this video here below 👇

The six rules from the video, with Anthropic's own words next to each one, plus the three skills we use to follow them. Fable 5.1 is the best model you can point at your work, and most of what you pay for it is the model re-reading things it did not need to read. Every message you send re-sends the whole chat, so the bill grows on a curve, not a line. Every rule below either keeps that pile small or stops you paying full price to re-read it.

Every skill, connector, MCP server and CLAUDE.md line you have switched on describes itself to the model at the start of every chat, whether you use it that day or not. It loads again in every new chat and inside every sub-agent, so you pay a floor before you have typed a word. In Cowork: switch off the connectors you don't use daily in the Customize tab, then Skills, three dots, Disable (same for plugins). In Claude Code: run

/context

to see what is loading and

/doctor

to trim it. Route many tools through one connector like Composio instead of fifty separate ones.

> "Your CLAUDE.md file is loaded into context at session start. If it contains detailed instructions for specific workflows (like PR reviews or database migrations), those tokens are present even when you're doing unrelated work. Skills load on-demand only when invoked, so moving specialized instructions into skills keeps your base context smaller. Aim to keep CLAUDE.md under 200 lines by including only essentials." [Anthropic, Manage costs effectively](https://code.claude.com/docs/en/costs#move-instructions-from-claude-md-to-skills)

With Fable you spend more time on the prompt and less time iterating, because every "no, not like that" re-reads everything above it. Aim to reach the result in one to three prompts, not twenty. Four things go in the first prompt: the job, the why behind it, the guardrails (what could go wrong, written down as rules) and what done looks like (these models do too much, not too little). Not clear on all four yet? Run Interview Me, or dictate a brain dump and let Prompt Master shape it. Both are further down this page.

> "Claude responds well to clear, explicit instructions. Being specific about your desired output can help enhance results. If you want 'above and beyond' behavior, explicitly request it rather than relying on the model to infer this from vague prompts." [Anthropic, Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "Providing context or motivation behind your instructions, such as explaining to Claude why such behavior is important, can help Claude better understand your goals and deliver more targeted responses." [Anthropic, Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

> "Vague requests like 'improve this codebase' trigger broad scanning. Specific requests like 'add input validation to the login function in auth.ts' let Claude work efficiently with minimal file reads." [Anthropic, Manage costs effectively](https://code.claude.com/docs/en/costs#write-specific-prompts)

Fable spins up sub-agents for the noisy work: reading a hundred files, going through transcripts, searching the web. Good. They keep the mess in their own context and hand back a short summary, so the main chat stays sharp. But unless you say otherwise they run on the same model you are on, so every file-reading agent is the most expensive model doing work a cheaper one does identically. That is where our $350 report went: 54 sub-agents, all on Fable. One line fixes it. Paste it into any big prompt:

Run sub-agents on Sonnet 5. Use Opus 5 only for a sub-agent that has to make technical decisions. Maximum five sub-agents.



Fable 5.1 is the boss: it plans the job, instructs the workers and checks what comes back. Sonnet 5 is the volume worker: reading, research, high-volume copy and data. Opus 5 is the specialist: a sub-agent that needs real judgment or runs a long time on its own. The cap matters because every extra agent loads your whole setup again (rule 1).

> "One of the most effective uses for subagents is isolating operations that produce large amounts of output. Running tests, fetching documentation, or processing log files can consume significant context. By delegating these to a subagent, the verbose output stays in the subagent's context while only the relevant summary returns to your main conversation." [Anthropic, Subagents](https://code.claude.com/docs/en/sub-agents#isolate-high-volume-operations)

> "Delegation pays off on genuinely independent, sizeable tracks of work, but it multiplies cost and time when applied to small tasks. If your harness supports subagents, give explicit guidance on which scenarios warrant delegation, or set deterministic caps on how many agents can be launched." [Anthropic, Prompting Claude Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5#controlling-subagent-spawning)

Halfway through a big job most people do the sensible-sounding thing: the chat is getting expensive, so they switch to a cheaper model. That is the single most expensive move in Claude. Each model has its own cache, so the new model reads the whole chat from the top at full price. On Fable 5.1 what you can change for free is how hard it thinks. Start at high (the default) for the first prompt, then turn the effort down to medium or low for the small iterations at the end, like layout tweaks on a dashboard or report. Same reader, same chat, nothing re-read. Pick your model once, at the start.

> "Effort is the primary control for trading off intelligence, latency, and cost on Claude Fable 5.1." and "At medium, results roughly match Claude Fable 5 at lower cost, so step down to medium or low where your evals show quality holds." [Anthropic, Prompting Claude Fable 5.1](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#consider-all-effort-levels)

You have been in one chat all day, forty messages of research, and you ask one small unrelated question at the end. That question just paid for all forty messages above it. New chat per task, every time. In Claude Code,

/clear

between tasks. Long chat on a single task? Once you are a few hundred messages in, hand it off to a fresh chat with the Refresh skill below.

/compact

is itself a large request, and it keeps you in the same polluted window.

> "With prompt caching, Claude Code re-reads that history at the cached token rate, so a one-line question in a session that has been open all day still draws usage for the whole conversation." [Anthropic, Manage costs effectively](https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session)

> "/compact reads the conversation it summarizes, so compacting a large context is itself a large request. When you want a fresh start instead of continuity, /clear costs nothing." [Anthropic, Manage costs effectively](https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session)

Three kinds of instruction that helped older models now cost you tokens on Fable 5.1 and Opus 5, because the model already does these things on its own. Each one triggers extra checking and extra tool calls:

"Double-check your work" or "verify before responding"

"Be maximally thorough", "CRITICAL: you MUST always..." and other emphasis in caps

"Think step by step" and hand-written numbered procedures for how to do the task

Say what you want and why, once, in normal language. Prefer "use this tool when..." over "CRITICAL: you MUST use this tool when...". Prompt Master (below) strips these lines out of an existing prompt or CLAUDE.md for you.

> "Claude Opus 5 verifies its own work without being told to. If your prompt contains explicit verification instructions ('include a final verification step for any non-trivial task,' 'use a subagent to verify'), remove them: instructions like these cause over-verification on Claude Opus 5, and removing them reduces wasted tokens with no loss in quality." [Anthropic, Prompting Claude Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5#task-scope-and-over-verification)

> "Prefer general instructions over prescriptive steps. A prompt like 'think thoroughly' often produces better reasoning than a hand-written step-by-step plan. Claude's reasoning frequently exceeds what a human would prescribe." [Anthropic, Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

Claude's running copy of your chat lives for about an hour after your last message on a Claude subscription. Every message resets the clock. Come back within the hour and it picks up where it left off, almost free. Come back after lunch and it reads the whole conversation again from the top, at full price. So finish big jobs in one sitting, and if you have to come back later, start fresh with a Refresh brief instead of re-opening yesterday's chat.

> "The lifetime is an hour on a subscription and drops to five minutes once you're drawing on usage credits; on an API key or cloud provider, it's five minutes by default." [Anthropic, Manage costs effectively](https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session)

Download the zip, upload it to Claude (Settings → Capabilities, or drop the folder into ~/.claude/skills/), and it just works. All three run in Claude Code and Cowork.

Start a clean chat with only the context the next task needs, instead of

/compact

. It asks you one question (the goal of your next session), scans the chat and the files it touched, and hands you a self-contained prompt to paste into a fresh chat: what is done, the decisions, the next steps and the file paths, without the forty messages above them. Three levels:

lite

(quick reset),

full

(default handoff) and

ultra

(full briefing with dead-ends to avoid). Also the right way to come back to a big job the next day (see the bonus rule).

📔

Download below 👇

refresh-skill.zip

4 KiB

For big or fuzzy tasks. It reads what already exists first, then interviews you one question at a time (five to seven at most), covering what exists, the goal, the decisions you actually care about and what proof of done looks like. Then it writes the brief back as job, why, guardrails and done-means, and runs it on your approval. Built on the interview pattern from Anthropic's Fable field guide. Run it on Opus 5: you don't need Fable for the planning step.

📔

Download below 👇

interview-me.zip

1.6 KiB

Turns a voice brain dump or a rough ask into a prompt written the way Anthropic says to prompt the Claude 5 models. It strips the retired instructions from rule 6, rebuilds the ask as a full job brief (job, why, guardrails, done-means), swaps bare rules for reasons and caps scope, length and report-back. It also audits an existing CLAUDE.md, skill or project-instruction file and tells you which lines are costing you tokens.

📔

Download below 👇

prompt-master.zip

15.6 KiB

The commands behind the rules. Cowork has no slash commands; there the rules are habits.

/context

: what is sitting in your context window right now. First stop when a session feels expensive (rule 1).

/usage

: plan usage plus what caused it (skills, sub-agents, plugins, MCP servers), and the "Prompt cache (main)" line that tells you whether the cache is warm and what caused the last miss (rules 4 to 6).

/doctor

: finds unused skills, MCP servers and plugins and suggests CLAUDE.md trims. It flags, it doesn't uninstall (rule 1).

/clear

: wipe the chat and start fresh. Free.

/rename

first so you can

/resume

later (rule 5).

/compact

: summarise and continue in the same window. Only at a natural break between tasks, never mid-task, and only while the cache is still warm (rule 5).

/rewind

: abandon a wrong path. Cheaper than compacting because it goes back to a prefix that is already cached.

/effort

: turn the effort down on Fable 5.1 without losing the cache (rule 4).

/model

: decide at the start. Switching mid-session re-reads everything at full price (rule 4).

One-time settings (settings.json, Claude Code v2.1.242 or later):

"promptCacheTtl": "1h"

keeps the one-hour cache once you go past your plan onto usage credits or an API key, where it otherwise drops to five minutes.

"subagentPromptCacheTtl": "1h"

gives sub-agents the one-hour cache too. By default they get five minutes even on a subscription.

model: sonnet

in a sub-agent or skill file puts the cheap model on the grunt work permanently, so you never switch models mid-chat (rule 3).

Every quote on this page is copied word for word from these Anthropic pages:

These rules and skills are the habit layer. Inside the Accelerator we set up the whole Claude stack with you and your team:

Three new beginner-to-advanced Claude courses that walk you through, step by step, how to use AI to actually automate work

Unlimited one-on-one live tech help for any problem you run into

A big library of skills and plugins across every business department, ready to customise for yourself

Multiple weekly live Q&A sessions with me and my team

A community of hundreds of professionals, business owners and AI agency owners actively using AI to automate their work or build AI businesses

🚀

If you're serious about turning the Claude stack into real leverage in your business and work, the Accelerator is where the rest of it fits together.

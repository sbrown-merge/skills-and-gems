---
title: Building agents for MERGE One
description: "What we've learned building a MERGE One agent: the 4,000-character limit on its instructions, the Create an Agent form and its Ground sources switch, and how to fit an agent under the limit with uploaded sources, as of 2026-10-09."
type: guide
status: draft
created: 2026-10-09
maintainer: Steve Brown
tags: [merge-one, agents, knowledge-buckets, gems, limits, lessons]
stale_after: 2027-01-09
sources:
  - {resource: "MERGE One agent editor, instructions field", title: "Character counter on an agent's instructions: 9,469/4,000 characters, the agent only reads the first 4,000", author: Steve Brown, last_modified: "2026-10-09"}
  - {resource: "figma-credit-estimator/README.md", title: "figma-credit-estimator: the first agent built to fit the limit", author: Steve Brown, last_modified: "2026-10-09"}
---

# Building agents for MERGE One

This is what we've learned building agents for MERGE One, starting with [figma-credit-estimator](figma-credit-estimator/README.md) on 2026-10-09. Read it before you write instructions for a MERGE One agent, or before you reuse a Gemini gem's instructions as one. Each fact is marked: **confirmed** means we saw it in MERGE One ourselves, and **untested** means we've reasoned it or tried it only outside MERGE One.

## The instructions limit

**An agent reads only the first 4,000 characters of its instructions. Confirmed** (Steve, 2026-10-09). The instructions field takes longer text and shows a counter, such as *9,469/4,000 characters, the agent only reads the first 4,000*, so nothing stops you saving text the agent will never see. Anything past character 4,000 is simply lost, which means the rules at the end of a long set of instructions are the ones that quietly stop working.

**The limit counts characters, not bytes. Untested.** Symbols such as × and ÷ take two bytes, so `wc -c` overstates the count a little; count with `len()` in Python, or trust the counter in the editor.

**A Gemini gem's instructions aren't limited this way as far as we know, so a gem's instructions can't be pasted into a MERGE One agent unchanged.** Writing one set for both, under 4,000 characters, is simpler than keeping two.

## The agent form

These are the Create an Agent form's fields, in order, from screenshots of 2026-10-09. **Confirmed** as the form stood that day; the [figma-credit-estimator setup steps](figma-credit-estimator/README.md#merge-one-agent) show them filled in.

| Field | What it does |
| --- | --- |
| Agent Name, required | The name people see |
| Custom Handle | The `@agent` handle for mentions: lowercase letters, numbers and underscores; blank uses the name |
| Description, required | What the agent is for |
| Tags | Free tags, such as `#figma` |
| System Instructions, required | The persona and rules, with the 4,000-character counter below the field and a **Refine with AI** button |
| Sharing | Private (only you), Shared (people you share with) or Discoverable (anyone in the organization can find and query it) |
| Sources | Documents, repositories or Knowledge Buckets, added with **Add Sources**; a document can be uploaded as a file |
| Ground sources | When on, the agent answers only from its attached sources, with no web, Drive or general knowledge, for every chat. It can't be switched on until a source is attached |
| Use sub-agents | A panel of sub-agents that each answer, with counts computed from their answers; available only after the agent is saved |
| Suggested Prompts | Clickable chips above the chat input |
| Custom Actions | Actions triggered by what the user asks |

**Test Chat uses the draft's instructions straight away, but its sources only once the agent is saved. Confirmed** (the panel says so), so save before testing anything that depends on a knowledge file.

**Turn Ground sources on for an agent whose answers must come from its own files,** such as one that applies set rates. It stops the agent filling a gap from general knowledge, which for figma-credit-estimator would mean some other price for Figma credits.

## Fitting under the limit

The instructions hold what the agent must always do; everything it looks up goes in a Knowledge Bucket. figma-credit-estimator went from 9,469 characters to 3,031 this way, with no change to its output.

- **Keep in the instructions:** the agent's role, what to ask for, the rules it must never break, any arithmetic or steps whose order matters, and any words it must say exactly.
- **Move to knowledge files:** report layouts and templates, fixed sentences that fill a report, worked examples, and explanations of where figures come from. Name each file in the instructions, with what it's for, so the agent knows when to open it, such as *Write each report exactly as the knowledge file "Figma credit estimator: report templates" sets out.*
- **Write terse but complete instructions.** Lists of figures can go on one line separated by semicolons rather than in a table, and a rule needs saying once.
- **Check the length in the build, not by eye.** figma-credit-estimator's `build.py` fails if the instructions go over 4,000 characters, and its check prints how many are used.

A no-code test on Sonnet, given only the 3,031-character instructions and the three knowledge files, reproduced the calculator's reports word for word and to the dollar (2026-10-09). **That was a role-play outside MERGE One, so it's untested in MERGE One itself.**

## Still unknown

These are open until someone checks them in MERGE One.

- **TBD:** whether an agent reads each knowledge file whole, or retrieves parts of it. If it retrieves parts, a long template file may need splitting.
- **TBD:** limits on sources: how many files an agent can attach, how large each can be, and which file types upload. Markdown files are the ones we're uploading first.
- **TBD:** whether an agent can run code, which decides whether arithmetic needs writing out step by step.
- **TBD:** whether an agent can save a file or an artifact when asked, or only reply in the chat.
- **TBD:** which model runs an agent, and whether that can change under it.

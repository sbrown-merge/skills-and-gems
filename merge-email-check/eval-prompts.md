---
title: "merge-email-check: evaluation prompts"
description: "The exact prompts for each merge-email-check evaluation run, without and with the skill, with the Figma link for each test case, ready to paste into a fresh session."
type: evaluation
status: draft
created: 2026-10-06
maintainer: Steve Brown
tags: [figma, figma-agent, skill, email, evaluation]
---

# merge-email-check: evaluation prompts

These are the prompts for the evaluation runs that [EVAL.md](EVAL.md) describes, so each run starts the same way. Steve agreed the method on 2026-10-06. Every run starts in a fresh session, in Claude Code or in Figma's agent, and the run without the skill always comes first, so the skill can't influence it. Paste the prompt exactly as written; the only thing that changes between cases is the link.

After each run, save the report from its fenced block to `diagnostics/` as `YYYY-MM-DD <case> <with or without> <Claude Code or Figma agent>.md`, then fill in that cell of EVAL.md's Results table.

## The prompts

Without the skill, paste this, with the case's link in place of `<link>`:

```text
Check this email design against email best practices: <link>
```

With the skill, paste this, then reply `go` to the opening question so MERGE's defaults apply:

```text
/merge-email-check <link>
```

In Figma's agent, give the scope the way a designer would rather than pasting a link. For a section, select it on the canvas, so Figma puts its link chip in the prompt, and send the prompt with the chip in place of `<link>`. For a page, open the page with nothing selected and write "this page" in place of `<link>`. In Claude Code, paste the link from the table below.

In Claude Code, install the skill first with `uv run --no-project --with rjsmin python scripts/sync_skill.py --install`, which copies the Claude Code version in `claude/` to `~/.claude/skills/merge-email-check/`; runs before version 0.4.0 copied the single `SKILL.md` there instead. In Figma's agent, upload `figma/SKILL.md` privately first, as the [README](README.md#publishing-it-in-figma) describes, and open the case's file first, so the agent is in the right file.

## The test cases

This table gives the link to paste for each case. EVAL.md holds what each run should find.

| Case | What it is | Link |
| --- | --- | --- |
| 1a | The Adobe Elevate rebuild, "why it works" (light, dark and phone) | https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-6 |
| 1b | The Adobe Elevate rebuild, projected worst cases | https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=110-2 |
| 2 | Terry Smith's TOFU emails, page 04 | https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-5 |
| 3a | The deliberate-faults file, page 01 Faults | https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=2-2 |
| 3b | The deliberate-faults file, page 02 Control | https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=2-3 |
| 4 | The sample email, page 03 Sample | https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=60-2 |

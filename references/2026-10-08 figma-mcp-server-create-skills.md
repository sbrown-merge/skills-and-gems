---
title: "Figma's guide to creating skills for the Figma MCP server, summarized for our skills"
description: Our summary of Figma's developer page on writing skills for MCP clients such as Claude Code, its companion page on writing to the canvas, and how each recommendation applies to skills that run in Figma's agent, through the MCP server, or both.
type: research-note
status: stable
created: 2026-10-08
stale_after: 2027-01-08
maintainer: sbrown@mergeworld.com
tags: [figma, figma-mcp, figma-agent, skills, reference]
sources:
  - title: Create skills for the Figma MCP server
    publisher: Figma
    url: https://developers.figma.com/docs/figma-mcp-server/create-skills/
    credibility: primary; Figma's developer docs, read 2026-10-08, no date on the page
  - title: Write to canvas
    publisher: Figma
    url: https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/
    credibility: primary; Figma's developer docs, read 2026-10-08, no date on the page
  - title: Create and manage custom skills in Figma
    publisher: Figma
    url: https://help.figma.com/hc/en-us/articles/40283639496599
    credibility: primary; Figma's help center, read 2026-10-08
---

# Figma's guide to creating skills for the Figma MCP server, summarized for our skills

Figma's developer docs have a page on [creating skills for the Figma MCP server](https://developers.figma.com/docs/figma-mcp-server/create-skills/). It's written for skills that run in MCP clients, such as Claude Code, Codex and Cursor, which reach a Figma file through the MCP server's tools. Most of our skills run in Figma's own agent and are tested from Claude Code through the same server, so this note summarizes the page in our words, adds the limits from its companion page on [writing to the canvas](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/), and says where each point does and doesn't carry over to Figma's agent. Read it alongside our [notes on building skills for Figma's agent](../figma-agent-skills.md) and section J of the [best practices checklist](../claude-skills-best-practices.md#j-skills-for-figmas-agent). Re-read the source pages by 2027-01-08, because both are undated and the server is changing fast.

## Contents

<!-- toc -->
- What the page recommends
- Limits on writing to the canvas
- How it applies to our skills
- Follow-ups
<!-- /toc -->

## What the page recommends

Figma presents a skill as a way to package a repeatable Figma workflow, so the client follows the same steps each time instead of relying on a long prompt. Its examples are design-system work: moving one-off values to variables, generating component sets that follow your variant conventions, building screens from library components, and keeping design and code in step.

**Setting one up.** In Claude Code, a skill is a folder at `.claude/skills/<skill-name>/` holding a `SKILL.md`. Codex scaffolds one with `$skill-creator`, and Cursor with `/create-skill`.

**Writing it.** The page gives eight steps:

1. A short, lowercase, hyphenated `name` that matches the folder name.
2. A specific `description` saying what the skill does and when to use it.
3. A `#` heading that names the workflow.
4. A `## When to use` section of a few bullets.
5. A `## Instructions` section as a numbered procedure in the imperative, such as searching the library first and binding fills to variables.
6. A `## Examples` section showing a typical request and a summary of what the skill creates or changes.
7. A `## Common edge cases` section saying what to do when the ideal path fails, such as a missing component or token.
8. Optional frontmatter, `compatibility`, `metadata` or `allowed-tools`, only when there's a real need.

**Supporting files.** A skill may carry `scripts/`, `references/` and `assets/` folders, so the main file stays short and the client loads detail only when it needs it.

**The worked example**, a skill called `figma-apply-palette` that creates paint styles from hex values, shows four patterns worth copying:

- Its description says what the skill doesn't do and names the skill to use instead.
- It says to load Figma's `figma-use` skill before every `use_figma` call, and records that in `compatibility`.
- It passes `skillNames: "figma-apply-palette"` to `use_figma`, which the page says is for logging only and changes nothing about the run.
- Its error recovery says to stop rather than retry straight away, inspect what was half-made with `get_metadata`, remove orphaned or duplicate results, fix the cause, and only then retry.

**Best practices.** Write the description as a routing rule that covers when not to use the skill as well as when to use it. Keep `SKILL.md` focused and move detail into supporting files. For a skill with risky side effects, turn off automatic invocation with the `disable-model-invocation` setting, so it runs only when someone calls it by name.

**Testing.** Test in a duplicate or example file, never one that matters. Run the skill as `/<skill-name>` in Claude Code, from `/skills` or `$` in Codex, or from the `/` menu in Cursor.

## Limits on writing to the canvas

The companion page says `use_figma`, the server's tool that runs Plugin API JavaScript in a file, is what writes to the canvas. These limits apply to any script a skill runs through it:

| Limit | What the page says | What we found |
| --- | --- | --- |
| Result size | 20 KB per call | Results cut off at about 19.5 KB ([figma-agent-skills.md](../figma-agent-skills.md#running-plugin-api-code-from-a-skill)) |
| Seats | Writing needs a Full seat; a Dev seat can only read | Not tested |
| Edit access | Editing a file needs edit permission on it | Matches Figma's help center |
| Images and video | Can't be created, and neither can components that contain them | Not tested; our test file built images with `createImage`, which worked ([merge-email-check EVAL.md](../merge-email-check/EVAL.md#how-the-file-was-built)) |
| Fonts | Custom fonts aren't supported | Arial couldn't be loaded until it was uploaded to the organization on 2026-10-06 ([figma-agent-skills.md](../figma-agent-skills.md#running-plugin-api-code-from-a-skill)) |

The page doesn't give a limit on script length. Our own test found that `use_figma` accepted a 30,292-character script that Figma's agent refused, because the agent caps a script at 20,000 characters.

The images row disagrees with what we saw, and the page may mean importing image or video assets rather than calling `createImage`. **TBD:** test whether `createImage` still works through `use_figma`, before a skill depends on it.

## How it applies to our skills

The page is about MCP clients, and Figma's agent differs in ways that matter. The table says, for each point, what to do in a skill for Figma's agent, a skill for Claude Code through the MCP server, or one like [merge-email-check](../merge-email-check/README.md) that runs in both. From version 0.4.0 that skill is built as two versions from one source, a single file for Figma's agent and a Claude Code skill with separate scripts, which is how a skill can follow both columns.

| Point | Figma's agent | Claude Code through the MCP server | Status |
| --- | --- | --- | --- |
| Files | One `SKILL.md` only, with scripts inline | Folders are allowed, so scripts and references can be separate files | Documented by Figma for both |
| Frontmatter | Only `name` and `description` are known to be read | `compatibility`, `metadata` and `allowed-tools` are allowed | Other fields in Figma's agent **TBD**; harmless as far as we know, but untested |
| Body structure | When to use, Instructions, Examples and Common edge cases fit fine; our skills use a workflow checklist instead, which does the same job | Same | Proposed: adopt Common edge cases where a skill has none |
| Description as a routing rule | Only one skill runs per prompt, and whether the agent picks a skill by its description is **TBD**, so this matters less | Matters: Claude Code chooses skills by description | Proposed: add "not for…" to descriptions where another skill could be confused with it |
| Loading `figma-use` first | Not needed: the agent runs scripts with its own tool, `evaluate_script` | Needed: load `figma-use` before every `use_figma` call | Proposed: add to the Claude Code path of skills that run in both |
| `skillNames` on `use_figma` | Doesn't apply | Logging only; useful for telling runs apart | Proposed, low priority |
| `disable-model-invocation` | Unknown whether the agent reads it; skills run by slash command anyway | Use it for skills that write to the file, such as the annotate companions | Proposed |
| Error recovery for skills that write | Same pattern: stop, inspect, clean up what was half-made, then retry | Same, with `get_metadata` to inspect | Proposed for the annotate companions |
| Script length | 20,000 characters per script, filled | No stated limit; 30,292 characters worked | Confirmed by our runs, 2026-10-06 |
| Result size | 20 KB | 20 KB | Documented and confirmed |
| Test in a duplicate file | Same advice | Same advice | Already in our practice |

## Follow-ups

The first of these was done on 2026-10-08; the others each need Steve's go-ahead, and some would change a skill's size or behavior.

- Done in merge-email-check 0.4.0: its [Claude Code version](../merge-email-check/claude/SKILL.md) loads `figma-use` before `use_figma`, passes `skillNames`, says in its description when not to use it, and declares the MCP server in `compatibility`, all outside the Figma version's character budget.
- Section J of the [best practices checklist](../claude-skills-best-practices.md#j-skills-for-figmas-agent) could gain items for routing-rule descriptions, loading `figma-use` on the Claude Code path, and error recovery in skills that write.
- The annotate companions, [merge-build-readiness-annotate](../merge-build-readiness-annotate/SKILL.md) and [merge-email-check-annotate](../merge-email-check-annotate/SKILL.md), write to the file, so they're the first candidates for `disable-model-invocation` and the error-recovery pattern when installed in Claude Code.

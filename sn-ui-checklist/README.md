# sn-ui-checklist

> [!WARNING]
> **Not ready for production.** This skill failed 14 items in its [2026-10-08 audit](<../audits/2026-10-08 sn-ui-checklist skill audit.md>), and they haven't been fixed yet. We keep it as a reference and don't plan to bring it up to our checklist.

`sn-ui-checklist` is a Claude Code skill for reviewing the design quality of an interface before it ships. You give Claude a screenshot, a Figma frame, a live page or the code for a screen, and it works through eight categories (getting started, typography, layout, color, style, imagery, elements and tactics), then reports the three fixes that matter most and a pass or issue count for each category. It's a judgment review with no scripts, so it works anywhere Claude can see the design. We downloaded it from its creator and keep it here mainly as a reference. It's older than our [Claude Skills best practices](../claude-skills-best-practices.md), so we don't expect it to meet them. This README is for anyone who wants to try it or borrow from it.

## What's in this folder

The skill is a single file, because it has no scripts or reference files yet.

| File | What it's for |
| --- | --- |
| [SKILL.md](SKILL.md) | The skill itself. Claude reads it when a request matches the description: a design review, UI audit, checklist pass, pre-ship review, screenshot critique, or feedback on a component, screen or flow. |

## Install

```bash
cp -R sn-ui-checklist ~/.claude/skills/
```

Claude Code picks up user-level skills from `~/.claude/skills/` at the start of a session. As of 2026-10-08 the skill isn't installed on Steve's machine, so it doesn't trigger in Claude Code until it's copied there. Because it hasn't passed its audit, try it on your own reviews rather than sharing it with the team.

Two installed plugin skills, `design:design-critique` and `design:accessibility-review`, answer to similar requests. If the wrong one picks up a review, name this skill in the prompt.

## Try it

Attach a screenshot or paste a Figma link, then ask:

```text
Run the sn-ui-checklist on this settings screen before we hand it to dev.
```

The reply follows the template in the skill's Response Format section: top three priorities, findings by category, and a short summary. When Claude can see only a screenshot, it says which states, interactions and responsive behavior it couldn't confirm.

## How it compares with our other review skills

We have two other skills that check a design against a checklist. Both run in Figma's own agent and test whether a file is ready to build, while this one is a general critique of how good the interface looks and works. The table shows where they differ.

| | sn-ui-checklist | [merge-build-readiness](../merge-build-readiness/README.md) | [merge-email-check](../merge-email-check/README.md) |
| --- | --- | --- | --- |
| Question it answers | Is this interface well designed? | Can a coding agent build from this Figma file? | Does this email design follow email best practice? |
| Runs in | Claude Code, on any image, link or code | Figma's agent | Figma's agent, and Claude Code through the Figma MCP |
| Checks | 52 unnumbered prompts in 8 categories, plus a table of 8 common mistakes | 34 numbered checks, BR-01 to BR-34 | 31 numbered checks, EM-01 to EM-31 |
| Thresholds | Mostly qualitative; 2 to 4 font sizes and 16px body text are the only numbers | WCAG 2.2 AA contrast, 24px targets, 4 and 8px grid | WCAG 2.2 AA contrast, 24px targets, house type defaults |
| Sources | None cited | Each check cites a ruling | Each check cites its source |
| Evidence | Evidence rules in prose | Scripts read the file, findings link to layers | Scripts read the file, findings link to layers |
| Version, evals | None | Versioned, with test runs recorded | Versioned, with [EVAL.md](../merge-email-check/EVAL.md) |

The overlap is real but small. Text contrast, interaction states and spacing appear in all three, and the other two give each one a pass mark this skill leaves open: "Check contrast" here is BR-32 and EM-19 there, at WCAG 2.2 AA. If we ever adopt this skill for real use, taking their numbers would make its findings agree with theirs on the same screen.

## Structure audit

On 2026-10-08 the skill was checked against our [Claude Skills best practices](../claude-skills-best-practices.md) checklist. It passed 16 items, failed 14, found 18 that don't apply to a single-file skill without scripts, and left 7 unknown until it's tested. The [audit record](<../audits/2026-10-08 sn-ui-checklist skill audit.md>) lists every finding and the fix each would need. We aren't making those fixes, because the skill is a reference copy; adopting it would start them, followed by a new audit.

## Version and testing

**TBD:** the skill has no version number, and nothing records which models it was tested on. It came into this repo on 2026-04-05 in the "Added files from M1" commit.

## Credit

Created by MDS, as a comment in `SKILL.md` records, and downloaded from them.

# Skills and Gems
Repo for Claude Skills and Gemini Gems

## Contents

| Folder | What it is | Kind |
| --- | --- | --- |
| `pptx-visual-qa/` | Render, inspect and structurally check PowerPoint decks on a Mac without LibreOffice; scripted Keynote is the renderer. Two scripts and a per-machine environment record | Claude Code skill |
| `re-fresh/` | Start a clean Claude session with only the context the next task needs, instead of `/compact`: captures the next goal, points to files rather than copying them, and outputs a self-contained prompt. Three levels, lite, full and ultra | Claude Code skill |
| [`sn-ui-checklist/`](sn-ui-checklist/README.md) | UI design review checklist across strategy, typography, layout, color, imagery and product tactics. A reference copy from its creator. Not ready for production (audit 2026-10-08) | Claude Code skill |
| `type-scale-generator/` | Type scale tokens, as a skill and as a Gemini Gem | Skill + Gem |
| [`merge-build-readiness/`](merge-build-readiness/README.md) | Checks whether a Figma file is ready for a coding agent to build from, against 34 checks, and reports in the chat. Runs in Figma's agent | Figma agent skill |
| [`merge-email-check/`](merge-email-check/README.md) | Checks an email design in Figma against email best practices, for any MERGE or client email project: images off, dark mode, accessibility, layout and content. Runs in Figma's agent, and from Claude Code through the Figma MCP. Not ready for production (audit 2026-10-08) | Figma agent skill |
| `merge-email-check-plan/` | Companion to merge-email-check: turns its report into a remediation plan, in rank order, with the layers and checks for each fix. Plans only | Figma agent skill |
| `merge-email-check-annotate/` | Companion to merge-email-check: writes its findings onto the layers at fault as Dev Mode annotations, leaving the designer's own notes untouched | Figma agent skill |
| `merge-build-readiness-annotate/` | Companion to merge-build-readiness: writes a report's findings onto the layers at fault as Dev Mode annotations, in MERGE's schema | Figma agent skill |
| `merge-build-readiness-test/` | Test mode for merge-build-readiness: probes what Figma's agent can read and write, and returns a JSON log. Kept private to its maintainer | Figma agent skill |
| `DESIGN.md-creation-gem/` | Gem for producing a `DESIGN.md` | Gemini Gem |
| [`claude-skills-best-practices.md`](claude-skills-best-practices.md) | Our best known method for building Claude Skills: seven layout and verification rules, a pass/fail audit checklist tuned for Opus 5.5, a paste-in audit prompt, and the README banner for a skill that fails its audit; section J covers skills for Figma's agent | Guideline |
| [`figma-agent-skills.md`](figma-agent-skills.md) | What we learned building a skill for Figma's in-app agent: format and size limits, running Plugin API code, how the agent behaves, testing and publishing | Guideline |
| [`references/`](references/) | Dated summaries of outside sources we refer to often, starting with Figma's guide to [creating skills for the Figma MCP server](<references/2026-10-08 figma-mcp-server-create-skills.md>) and how it applies to skills for Figma's agent | Reference notes |
| [`audits/`](audits/) | Dated audits of our skills against the best practices checklist, with every finding, the fix applied and what's still open | Audit records |
| [`output-styles/`](output-styles/) | Our response styles for Claude: the Claude Code output style and a short plain-text version | Output styles |


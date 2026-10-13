# Output styles

These are our response styles for Claude: how a reply should be shaped, worded and sourced. They hold rules about replies only; the rules for documents live in the global `CLAUDE.md`.

| File | What it is | Where it's installed |
| --- | --- | --- |
| [`response-style.md`](response-style.md) | The full style: answer first, plain US English, no padding, honest about what was and wasn't verified, stop and ask on a premise disagreement, and deeplink every reference. Its frontmatter (`name`, `description`, `keep-coding-instructions`) is the Claude Code output-style format, so it carries no OKF keys | `~/.claude/output-styles/response-style.md`, where Claude Code loads it as `custom-response-style` |
| [`short-style.md`](short-style.md) | A seven-paragraph plain-text version of the same rules, with no frontmatter, for pasting into a settings box that takes free text | **TBD (Steve):** where this one is pasted |

The installed `response-style.md` is a copy; edit the one here, then copy it to `~/.claude/output-styles/` and start a new session. The copy here was taken from the installed file on 2026-10-05, when it was the newer of the two versions (2026-09-23); an older draft from 2026-09-09 differed only in its frontmatter and wasn't kept.

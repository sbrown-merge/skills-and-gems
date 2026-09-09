# pptx-visual-qa

A Claude Code skill for rendering, inspecting and structurally checking PowerPoint decks on a Mac that has no LibreOffice, `pdftoppm` or PyObjC. Scripted Keynote is the renderer. It also records the PDF route for the same kind of machine.

Written by Steve Brown with Claude, consolidated 2026-09-09 from three projects' hard-won notes. Built for Claude to use on its own whenever a `.pptx` needs to be seen or verified; a person can run the two scripts directly.

## What is here

| File | What it does |
| --- | --- |
| `SKILL.md` | The skill itself. Claude reads this when the skill triggers |
| `scripts/render_pptx.sh deck.pptx outdir [png\|jpeg]` | Launches Keynote, exports every slide as an image, prints the paths. The launch step is the fix that made this reliable |
| `scripts/check_pptx_package.py deck.pptx` | Read-only structural check: slide list, relationships, parts and content types agree; orphaned parts listed; comment parts and real speaker notes reported |
| `references/environment.md` | What is and is not installed on the machine this was built on, with dates. **Per machine. Re-verify on yours** |

## Install

```bash
cp -R pptx-visual-qa ~/.claude/skills/
chmod +x ~/.claude/skills/pptx-visual-qa/scripts/*
```

Claude Code picks up user-level skills from `~/.claude/skills/` at the start of a session. The first render will ask macOS for permission to let your terminal or the Claude app control Keynote; allow it once. Optional: `python3 -m pip install --user "markitdown[pptx]"` for the text-dump check (add `--break-system-packages` on a Homebrew Python).

## Try it

```bash
~/.claude/skills/pptx-visual-qa/scripts/render_pptx.sh "/absolute/path/deck.pptx" "$HOME/Desktop/deck-render" png
~/.claude/skills/pptx-visual-qa/scripts/check_pptx_package.py "/absolute/path/deck.pptx"
```

Both paths must be absolute; AppleScript needs them that way.

## Keeping it current

The environment file goes stale the moment a font is installed or a tool appears. Edit the copy in this repo, then re-copy to `~/.claude/skills/`. The repo is the canonical version; the installed folder is a copy.

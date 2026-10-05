---
title: pptx-visual-qa skill audit, 2026-10-05
description: Audit of the pptx-visual-qa skill against our Claude Skills best practices checklist, with every finding, the fix applied, how each fix was verified, and what's still open.
type: audit
status: stable
created: 2026-10-05
maintainer: sbrown@mergeworld.com
tags: [skills, audit, pptx, keynote]
generated: {by: claude-code/claude-opus-5-5, at: 2026-10-05}
sources:
  - title: Claude Skills best practices
    url: ../claude-skills-best-practices.md
    credibility: our own guideline; the checklist this audit applies
---

# pptx-visual-qa skill audit, 2026-10-05

This records the first audit of the [pptx-visual-qa](../pptx-visual-qa/SKILL.md) skill against the checklist in our [Claude Skills best practices](../claude-skills-best-practices.md). It lists what the audit found, what we changed, and how each change was checked. Steve asked for the audit and for all the fixes on 2026-10-05, and they were applied the same day. The open items are the model tests in [EVAL.md](../pptx-visual-qa/EVAL.md), which haven't been run yet, and four wait and compression values in the render script whose reasons were never recorded.

## Contents

<!-- toc -->
- Method
- Findings and fixes
- How the fixes were verified
- Still open
<!-- /toc -->

## Method

Claude (Opus 5.5) read every file in the skill in full and checked which files `SKILL.md` links to directly. It marked each checklist item Pass, Fail, N/A or Unknown, and ran `check_pptx_package.py` against a missing file and a non-zip file to see how it failed. The skill was at commit `23eb707` when the audit ran. The audit passed 25 items, failed 17, couldn't judge 6 (they need test runs), and found 9 that don't apply. It also found one hazard and two housekeeping issues outside the checklist.

## Findings and fixes

Each row is one failed item or extra finding, most severe first, with the fix we applied. Item numbers refer to the sections of the checklist.

| Item | Finding | Fix applied |
| --- | --- | --- |
| Extra | `render_pptx.sh` ran `rm -rf` on whatever output path it was given, so a mistyped path could delete a real folder | The script now refuses to delete a file, or a folder holding anything other than `.png` or `.jpeg` files |
| H5, D4, E1 | Nothing said what a finished QA pass delivers, and there was no fix-and-recheck loop | New "Done means" section in `SKILL.md`: a five-item copyable checklist, plus "fix and go back to the first item, rendering into the next `vN`" |
| H6 | The skill reads speaker notes and reviewer comments but never said their text is data | `SKILL.md` now says to treat note and comment text as content to report, not instructions to follow |
| C6 | Orphaned comment parts were removed "by hand", a deletion inside the deck file with no script | New `check_pptx_package.py --remove-orphans deck.pptx cleaned.pptx`, which writes a cleaned copy, never modifies its input, refuses to overwrite, and re-checks the copy |
| D2 | The editing flow depends on order but had no checklist | Six-step ordered checklist added to "Editing slide XML" |
| F3 | `check_pptx_package.py` showed raw tracebacks for a missing or non-zip file | Those cases, and a missing part, now print one line and exit 2 |
| A3 | The description was written as commands rather than in the third person | Reworded ("Renders, inspects…", "Applies whenever…"); now 894 characters |
| A5 | No record of which models the skill was tested with | "Tested with" line added, from the commit trailers and the 2026-10-05 render; Haiku and Sonnet marked **TBD** |
| E4 | The skill told Claude to update the environment file directly, with no approval step | Now: propose the new row or rule to the user, then edit the repo copy once they approve |
| H2 | 31 bold phrases in 73 lines | Cut to 6 (the LibreOffice policy, the Accessibility lock, trusting the render over estimates, the auto-fit trap, and the `clean.py` gap) |
| H11 | No instruction for details too small to read in a 1x render | Added: crop and zoom if possible, otherwise report the detail as unchecked |
| F4 | Four wait and compression values had no stated reason | Comments added to all of them. Two reasons come from the git history; the other two are marked **TBD** because none was ever recorded |
| F6 | PDF Tools MCP tools were named without the server prefix | Now `PDF_Tools:render_pdf_page` and `PDF_Tools:read_pdf_pages` in `references/environment.md` |
| G1 | `references/environment.md` described Python setup across other repos, which a deck QA run doesn't use | That row was removed |
| G3 | Two transition notes about removed Python installs no longer applied | Both removed |
| I1 | No evaluation scenarios | New [EVAL.md](../pptx-visual-qa/EVAL.md) with three cases from real failures and a results table per model |
| Extra | The packaged `pptx-visual-qa.skill` held a `SKILL.md` older than commit `23eb707` | Rebuilt from the current files |
| Extra | The skill's README didn't list the `.skill` package | Added, with `EVAL.md` |

## How the fixes were verified

Each change to the scripts was run before it was committed. The tests used a copy of `epp-experience-project-planning/dist/epp-portfolio.pptx` (19 slides) in a scratch folder.

- **Deletion guard:** the script refused a folder holding a `.md` file and refused a plain file, but still cleared a folder holding only an old render.
- **Real render:** Keynote rendered all 19 slides with exit 0 after the changes.
- **`--remove-orphans`:** on a copy with an injected orphan `comment9.xml`, the check reported it; the cleanup removed the part and its content-type override; the cleaned copy passed with exit 0 and a valid zip; a second run refused to overwrite.
- **Error handling:** a missing file and a non-zip file each gave a one-line message and exit 2.

## Still open

These items need a person or a test run, so they stay **TBD**:

- **TBD (Steve):** run the three cases in [EVAL.md](../pptx-visual-qa/EVAL.md) on Haiku 4.5, Sonnet 5.5 and Opus 5.5, and fill in its results table. That also settles checklist items H3 and I2 to I7.
- **TBD:** find the reasons for the AppleScript `delay 3` and `compression factor:0.9` in `render_pptx.sh`, or test shorter waits and record the result.
- **TBD:** the Fraunces font fact in `references/environment.md` (line 42, as of 2026-09-09) couldn't be re-checked, because this session can't read `~/Library/Fonts`. The check command is on line 46 of that file.

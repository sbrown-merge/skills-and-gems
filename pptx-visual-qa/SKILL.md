---
name: pptx-visual-qa
description: "Render, inspect and structurally check PowerPoint decks on a Mac that has no LibreOffice, pdftoppm or PyObjC, where scripted Keynote is the only renderer. On MERGE-owned Macs LibreOffice is blocked by company policy, so this is the standard path there, not a fallback. Use this whenever a .pptx is being generated, edited, extracted or reviewed and the result needs to be seen or verified: visual QA of slides, checking text overflow or overlap, exporting slide images, diffing a revised deck against its original, reading a deck's comments and speaker notes, or fixing a validator complaint after deleting slides. Reach for it before writing any AppleScript, before searching for soffice or pdftoppm, and before estimating text fit from character widths, because all three have been tried and this skill records what actually works. Also covers producing or checking a PDF on the same kind of machine."
---

# PPTX visual QA on a Mac without LibreOffice

Every deck that leaves a session should have been looked at. On a Mac without LibreOffice the usual route (soffice to PDF, `pdftoppm` to images) does not exist, and several sessions lost time rediscovering that before this was written down. **On MERGE-owned Macs, LibreOffice is blocked by company policy** (Steve Brown, 2026-09-09), so do not search for `soffice`, do not try to install it, and do not treat its absence as temporary. **Keynote, driven by AppleScript, is the renderer**, and on company machines it is the only one. The recipe below was proven on real client decks on 2026-08-26 and 2026-09-09. What is and is not installed on the machine this was built on is in `references/environment.md`; read that when something that "should" be installed is not, and re-verify it on any new machine.

## The recipe, in one command

```bash
~/.claude/skills/pptx-visual-qa/scripts/render_pptx.sh /abs/path/deck.pptx /abs/path/out [png|jpeg]
```

It launches Keynote first, waits, exports every slide as an image, closes the document without saving, and prints the absolute paths so they can go straight to the image viewer. Output files are `out/out.001.png`, `out.002.png`, … in slide order. Use PNG for typography checks and JPEG when the deck is image-heavy and file size matters.

**Why the launch step matters.** A cold `tell application "Keynote"` intermittently fails with `-600 "Application isn't running"`. `open -a Keynote && sleep 3` before the AppleScript is the fix that ended two sessions of failure; the script does it for you. If you write the AppleScript by hand instead, keep that step.

**Render into a fresh directory every iteration** (`out/v1`, `out/v2`, …). Tool calls that read the previous render can race a re-export that deletes it, and having the sequence on disk makes "what changed between fixes" answerable.

## Reading the render honestly

Renders come out at the document's point size at 1x: a 10-inch deck is **720 × 405**. That is enough for layout, overflow, overlap, missing elements and z-order, and not enough for fine typography. Three things to know before trusting what you see:

- **Fonts.** Keynote substitutes any face the machine does not have, and the substitute usually has taller leading, so a body that "should" fit by character-width arithmetic wraps to more lines than estimated; on 2026-09-09 the estimate undercounted by about twenty percent and a 94-word body that computed as fitting ran two sentences past its column. **Trust the render over the estimate, and leave slack for any face not confirmed installed.** Confirming is not as simple as seeing a font file: a family a deck asks for by name (Google Slides exports write `Fraunces`, for instance) may resolve only through a *variable* TTF, and the static weights alone register under different family names. `references/environment.md` has the check.
- **Restart Keynote after installing a font.** A running Keynote keeps a stale font cache and keeps substituting with no error. `osascript -e 'tell application "Keynote" to quit'` then rerun.
- **When something looks wrong, render the original through the same pipeline before blaming your edit.** On 2026-09-09 three number badges rendered as "2" over "." after an edit; the untouched source rendered identically, so it was the renderer (a missing variable font, as it turned out), not the change. The comparison takes one extra command and settles the question.

Auto-fit text boxes (`<a:spAutoFit/>`) grow downward. When the text is longer than the box, it does not clip visibly; **it slides under whatever picture sits below it and disappears**. If a body ends mid-sentence in the render, look for an image at that y-position before assuming the text was cut.

## The checks that go with the render

A render answers "does it look right." Three other checks answer "is the file right," and they catch things the render cannot.

**Text dump.** `markitdown deck.pptx` gives one block per `<!-- Slide number: N -->`. Use it for missing content, wrong order, leftover placeholders and stray speaker notes. It is also the fastest way to confirm a count changed ("7 principles" to "5") everywhere it appears. If `markitdown` is not installed: `python3 -m pip install --user "markitdown[pptx]"` (add `--break-system-packages` on a Homebrew Python).

**Package structure.** `scripts/check_pptx_package.py deck.pptx` verifies the four things that must agree: slide order in `ppt/presentation.xml`, the relationship ids in `presentation.xml.rels`, the parts actually present, and the `[Content_Types].xml` overrides. It also lists **orphaned parts**, which is the check that matters after deleting slides: the pptx skill's `clean.py` removes orphaned slides, media and rels but **not `ppt/comments/commentN.xml`**, and an orphaned comment part makes the schema validator report the deck as corrupt. Remove the part and any override for it by hand. The script is read-only and needs only the standard library.

**Schema validation, when the pptx skill is loaded.** Its `scripts/office/validate.py deck.pptx --original source.pptx` is the fuller check; `--original` baselines against the source so a template's own quirks do not read as your regressions. Its path is session-specific (under the skills plugin directory), so take it from the skill's own instructions rather than hardcoding it.

## Extracting a deck: read the parts the slide text misses

A faithful extraction reads `ppt/slides/slideN.xml`, and most sessions stop there. Two more parts carry things a reviewer will care about:

- **`ppt/notesSlides/`** — speaker notes. Google Slides exports create a notes slide per slide even when all are empty, so "notes exist" is not "notes were written"; check for text beyond the slide-number placeholder. Leftover notes pasted from another deck live here too.
- **`ppt/comments/` with `commentAuthors.xml`** — reviewer comments, with author id and timestamp, each attached to a slide through that slide's `.rels`. On 2026-09-09 a deck carried three comments from a colleague, dated a week before the meeting it was presented at, that no extraction had read. **List the comments parts whenever a deck is extracted** (`check_pptx_package.py` does), and record them as their own source record if they are substantive.

## Editing slide XML without corrupting the deck

- **Structure first, content second.** Delete or reorder slides in `<p:sldIdLst>` and run the clean step before editing any slide body; clean deletes anything not in the list, including a slide you just edited.
- **Replace text inside the existing runs.** Keep each paragraph's `<a:pPr>` and the first run's `<a:rPr>`, set its `<a:t>`, drop the extra runs. Assigning to a text frame wholesale collapses formatting to one unstyled run. Escape `&`, `<`, `>` in the text; convert straight apostrophes to curly if the deck uses them, so the edit does not stand out.
- **Never round-trip OOXML through ElementTree.** It rewrites namespace prefixes. Use string edits with care, or `defusedxml.minidom`, and check well-formedness with `xml.parsers.expat`.
- **Repack from inside the unpacked directory**, `(cd unpacked && zip -Xrq ../out.pptx .)`, after `rm -f` on the target. Zipping from outside nests a directory; skipping the remove lets deleted parts survive from the previous archive.
- **Non-breaking hyphen (U+2011)** keeps a hyphenated word like *on‑brand* from breaking at the line. Keynote renders it correctly.

## Environment traps that cost time

- `timeout` is GNU coreutils and **is not on macOS**; wrapping `osascript` in it fails before Keynote is even asked. Use nothing, or a background job with a manual kill.
- `/tmp` can be blocked by a session's sandbox deny rules. Work in a dot-directory inside the repo (`.render/`) and remove it when done; check the repo's `.gitignore` covers `*.pptx` before leaving rendered decks in it.
- `qlmanage -t` renders only the first slide. Fine as a "does it open" sanity check, useless for QA.
- `osascript` error `-1743` is macOS Automation permission. Grant it in System Settings → Privacy & Security → Automation (the terminal or Claude app needs permission to control Keynote). Expect this prompt on first use on a new machine.
- Keynote opening a hand-built file at all is a useful OOXML compatibility smoke test. If Keynote refuses it, PowerPoint probably will too.

## PDFs, briefly

Producing a PDF on a machine like this: **ReportLab only**. `pandoc`, `wkhtmltopdf`, `weasyprint` and PyObjC were absent, and headless Chrome hung on `--print-to-pdf` even with an isolated profile. Checking one: with no rasterizer, an in-app browser preview is the viewer, and **it caches aggressively; write each re-render to a new filename.** Details and the stream-decoding trick for text-level verification are in `references/environment.md`.

## Installing and keeping it current

Copy this folder to `~/.claude/skills/pptx-visual-qa/` (Claude Code reads user-level skills from there) and make the two scripts executable. The first Keynote run may prompt for Automation permission. Then **re-verify `references/environment.md` for the machine you are on**: it records one specific laptop as of the dates shown, and the whole point of the file is that these facts differ per machine and go stale. When a fact changes, a font installed, a new Python, a tool that was missing now present, update the environment file in the repo copy and re-copy, so the skill stays the single record rather than a project memory that drifts. LibreOffice is the one row that will not change on a company machine; it is a policy, not a gap.

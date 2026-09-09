# Environment facts: what is and is not installed

**This file is per machine, with one exception.** The values below are one laptop, Steve Brown's MERGE Mac, verified on the dates shown. On any other Mac, treat every row as a question to re-answer, then replace the row. The exception is LibreOffice: it is blocked by MERGE policy on all company-owned Macs, so that row is organizational rather than personal and Keynote is the standard renderer across the team. The skill works anywhere Keynote does; the other rows are what tells you which checks you can trust.

## Renderers

| | Status | Notes |
| --- | --- | --- |
| LibreOffice (`soffice`) | **Blocked by MERGE policy on company-owned Macs** (Steve Brown, 2026-09-09) | Not a missing install: the organization prohibits it, so this row holds for every MERGE laptop, not just this one. Do not attempt to install or look for it. The pptx skill's `soffice.py` wrapper therefore fails with "No such file or directory: 'soffice'", and Keynote is the standard path, not a workaround. Confirmed absent 2026-08-26, 2026-09-08, 2026-09-09 |
| `pdftoppm`, `pdftocairo` (poppler) | **Absent** | No PDF rasterization; the image viewer cannot show a PDF page |
| `gs` (Ghostscript), `mutool` | **Absent** | |
| PyObjC / Quartz | **Absent** | |
| **Keynote.app** | **Present, scriptable** | The rendering path. Automation permission granted |
| Microsoft PowerPoint | **Absent** | Confirm final typography on a machine that has it before a client sees a deck |
| `qlmanage` (Quick Look) | Present | `qlmanage -t -s 2000 -o dir deck.pptx` renders slide 1 only |
| `sips` | Present | Image conversion; cannot paginate a PDF |
| Headless Google Chrome | Present, **unusable for PDF** | Hangs indefinitely on `--print-to-pdf`, even with an isolated `--user-data-dir` and with the sandbox disabled (2026-07-28) |

To re-verify on a new machine: `which soffice pdftoppm gs mutool; ls /Applications | grep -i -e keynote -e powerpoint -e libreoffice`.

## Python

Default `python3` is Homebrew **3.12** at `/opt/homebrew/opt/python@3.12`. It is PEP-668 externally managed, so installs need `python3 -m pip install --user --break-system-packages <pkg>`. A CommandLineTools Python 3.9 also exists and has ReportLab 5.0.0.

Present on 3.12 (installed and smoke-tested 2026-08-26): **Pillow, numpy, python-pptx, lxml, defusedxml, markitdown, pyyaml, reportlab**. The `markitdown` CLI is at `~/Library/Python/3.12/bin/markitdown`, on PATH via `~/.zshrc`, so it runs bare.

Absent: `pandoc`, `wkhtmltopdf`, `weasyprint`.

The skill's own scripts need only the standard library and `zsh`. `Pillow` is optional, for reading image sizes.

## Node

`node` and `npm` at `/usr/local/bin`; `pptxgenjs` is `npx`-able for from-scratch deck generation. The pptx skill says pptxgenjs is preinstalled in its own environment; confirm with `node -e "require('pptxgenjs')"` before relying on it.

## Fonts

**The MERGE brand faces were installed on 2026-08-27, but as of 2026-09-09 the variable Fraunces TTF is gone.** `~/Library/Fonts` and `/Library/Fonts` hold only the Fraunces *72pt* statics, so a deck that asks for the family **"Fraunces"**, which is what Google Slides exports write, **substitutes in Keynote.** This was the cause of number badges rendering as "2" over "." in both an edited deck and its untouched original that day; the wrap was substitution, not layout. **Fix: reinstall the variable Fraunces TTF (Google Fonts `Fraunces[SOFT,WONK,opsz,wght].ttf`), restart Keynote, re-render.** Until then, treat Fraunces text-fit as untrustworthy and confirm in PowerPoint. Epilogue was installed the same day and has not been re-verified since. Everything not installed is substituted, usually with a face of taller leading, so bodies wrap longer than character-width estimates predict.

Two Fraunces facts worth keeping, and they generalize to any variable font family:

- **The static TTFs register as "Fraunces 72pt", "Fraunces 72pt Soft", "Fraunces 72pt SuperSoft", not "Fraunces".** A deck asking for "Fraunces" or "Fraunces SemiBold" resolves only through the **variable** Fraunces TTF's named instances. Deleting the variable font in a cleanup silently re-breaks rendering while the statics remain, which is exactly the state found on 2026-09-09. Quick check: `ls ~/Library/Fonts /Library/Fonts | grep -i fraunces | grep -vi 72pt` should list the variable file; if it lists nothing, reinstall.
- **Restart Keynote after installing any font.** A running instance keeps a stale font cache and continues substituting with no error and no visible change. `osascript -e 'tell application "Keynote" to quit'`, then render again. This cost a confused pass on 2026-08-27.

## Shell and sandbox

- **`timeout` is not on macOS** (it is GNU coreutils). Wrapping `osascript` in it fails with "command not found" before anything runs.
- **`/tmp` may be blocked by the session's Bash deny rules** (seen 2026-09-09: `wc`, `stat`, `ls` and `python3` all refused on paths under `/tmp`). Work in a dot-directory inside the repo and remove it afterwards.
- `zip`, `unzip`, `shasum` present. Repack a deck from **inside** the unpacked directory, after removing the old target.

## PDFs

**Producing:** ReportLab is the only working route here. Pure-Python wheel, no system libraries. Working implementations to copy or extend: `scripts/make_brief_pdf.py` in `merge-casting-app-internal`, and `scripts/build-pdfs.py` in `CCE-AI-strategy`.

**Checking, without a rasterizer:**

- The in-app browser preview renders PDFs but **caches aggressively**; it keeps serving a stale copy after a re-render. Write each render to a new filename.
- For text-level verification, decode the streams. ReportLab writes them **ASCII85-encoded then Flate-compressed**: `base64.a85decode(data, adobe=True)` first, then `zlib.decompress`, then pull the visible words from the `(...)` operators. A first guess that the streams were plain or single-Flate was wrong and cost time.

## Where this came from

Consolidated 2026-09-09 from two project memories that had begun to diverge, `proposals` (Keynote recipe, fonts, Python inventory; proven 2026-08-26 on the Subway proposal deck) and `merge-casting-app-internal` (PDF route; 2026-07-28), plus the 2026-09-09 `CCE-AI-strategy` session (orphaned comment parts, comments as content, auto-fit under images, estimate undercount, `/tmp` denial, render-the-original diagnostic, the missing variable Fraunces). The canonical copy lives in the `skills-and-gems` repo; the installed copy is `~/.claude/skills/pptx-visual-qa/`.

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

**Rebuilt 2026-09-25 around `uv`.** Default `python3` is Homebrew **3.14** (`/opt/homebrew/opt/python`, which follows Homebrew's current version). It has **no third-party packages, on purpose**: it is PEP-668 externally managed, and nothing is installed into it or with `pip install --user` any more. Packages come from `uv` (`/opt/homebrew/bin/uv`) in one of three ways:

| Need | Use | Notes |
| --- | --- | --- |
| A command-line tool | `uv tool install <pkg>` | Own isolated environment; the command lands in `~/.local/bin`, which is on PATH. Installed 2026-09-25: **`markitdown`** 0.1.8 with the `pdf,pptx,docx,xlsx` extras (so it reads PDFs now), and **`fonttools`** 4.66.0 (`fonttools`, `ttx`, `pyftsubset`, `pyftmerge`) |
| A library for a one-off script, outside any repo | `uv run --no-project --with <pkg> python script.py` | Nothing installed permanently; uv caches the environment, so a repeat run starts in about 0.4 s |
| A library a repo's own scripts need | `uv add <pkg>` in that repo | Recorded in its `pyproject.toml` and `uv.lock`; run scripts with `uv run python …`. epp-experience-project-planning converted 2026-09-25 |

**Image tooling for screenshots (verified 2026-09-25):** `uv run --no-project --with pillow --with opencv-python-headless python script.py` gives Pillow 12.3.0 and OpenCV 5.0.0 on numpy 2.5.3. Use the headless OpenCV build; the full `opencv-python` adds only GUI windows, which a script never uses. **pypdf** the same way: `uv run --no-project --with pypdf python script.py`.

**A session started before 2026-09-25 may still have the old PATH**, where bare `markitdown` resolves to `~/Library/Python/3.12/bin/markitdown`, a copy without PDF support that fails with `MissingDependencyException`. Call `~/.local/bin/markitdown` explicitly if in doubt. The old Homebrew 3.12 and the Command Line Tools 3.9 (`/usr/bin/python3`) still exist with their per-user packages until they are cleaned up; **TBD:** remove this sentence once they are.

Absent: `pandoc`, `wkhtmltopdf`, `weasyprint`.

The skill's own scripts need only the standard library and `zsh`, so bare `python3` runs them. `Pillow` is optional, for reading image sizes; get it with `uv run --no-project --with pillow`.

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

**Checking a PDF here (added 2026-09-09):** the *PDF Tools* MCP server rasterizes any page via Quick Look (`render_pdf_page`, 1-indexed, up to ~1800 px) and extracts text per page (`read_pdf_pages`); it may only touch `~/Documents`, `~/Downloads` and `~/Desktop`. Use it for the visual pass and the fidelity read-back. Since 2026-09-25 there are two Python text extractors as well: `markitdown file.pdf` (the uv tool has the `pdf` extra), and pypdf through `uv run --no-project --with pypdf`. The note that pypdf could not be installed is obsolete; `pip install --user` was refused under PEP 668, and uv is the route round that. A font-leak check must look at text-showing operators, not font names, because every ReportLab file lists `/BaseFont /Helvetica` from the canvas's initial state; page streams are ASCII85-wrapped Flate, so decode both before scanning for `Tf` and `Tj`.

**Producing:** ReportLab is the only working route here. Pure-Python wheel, no system libraries. Working implementations to copy or extend: `scripts/make_brief_pdf.py` in `merge-casting-app-internal`, and `scripts/build-pdfs.py` in `CCE-AI-strategy`.

**Checking, without a rasterizer:**

- The in-app browser preview renders PDFs but **caches aggressively**; it keeps serving a stale copy after a re-render. Write each render to a new filename.
- For text-level verification, decode the streams. ReportLab writes them **ASCII85-encoded then Flate-compressed**: `base64.a85decode(data, adobe=True)` first, then `zlib.decompress`, then pull the visible words from the `(...)` operators. A first guess that the streams were plain or single-Flate was wrong and cost time.

## Keynote scripting (added 2026-09-22)

| Fact | Status | Notes |
| --- | --- | --- |
| Automation (Apple Events) to Keynote | **Granted** | `get name`, `count of documents`, `export … as slide images`, `close saving no` all work |
| **Accessibility (assistive access)** | **Locked by IT; cannot be granted** (Steve Brown, 2026-09-22) | Any `tell application "System Events" to tell process "Keynote" …` fails with -1719/-1728 and raises a prompt the user cannot accept. Do not use System Events on this Mac |
| Scripted `open` of a .pptx on a fresh Keynote | **Unreliable** | -609 with a crash dialog, or -1708 import placeholder, seen 2026-09-22 on both new and old pptxgenjs decks; the same files opened via `open -a Keynote <file>`. `render_pptx.sh` now falls back to that route and exports `front document` |
| Crash reports | `~/Library/Logs/DiagnosticReports/Keynote-*.ips` | Not readable from a sandboxed session; the user can share them with IT |

The incident is written up for IT in the CCE AI strategy repo, `scripts/2026-09-22 keynote-automation-incident-note-for-it.md`.

## Where this came from

Consolidated 2026-09-09 from two project memories that had begun to diverge, `proposals` (Keynote recipe, fonts, Python inventory; proven 2026-08-26 on the Subway proposal deck) and `merge-casting-app-internal` (PDF route; 2026-07-28), plus the 2026-09-09 `CCE-AI-strategy` session (orphaned comment parts, comments as content, auto-fit under images, estimate undercount, `/tmp` denial, render-the-original diagnostic, the missing variable Fraunces). The canonical copy lives in the `skills-and-gems` repo; the installed copy is `~/.claude/skills/pptx-visual-qa/`.

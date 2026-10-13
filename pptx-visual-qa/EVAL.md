---
title: pptx-visual-qa evaluation cases
description: Three real-task test cases for the pptx-visual-qa skill, with expected behaviors and a results table per model, so the skill can be checked on Haiku, Sonnet and Opus.
type: evaluation
status: draft
created: 2026-10-05
maintainer: sbrown@mergeworld.com
tags: [pptx, keynote, evaluation]
---

# pptx-visual-qa evaluation cases

These are the tests we run whenever the skill changes or a new model ships. Each case comes from a real failure the skill was written to prevent. Run every case in a fresh session with the skill installed, once per model, and record the result in the table at the end. The skill passes a case on a model only when every expected behavior happens. The cases came out of the [2026-10-05 audit](<../audits/2026-10-05 pptx-visual-qa skill audit.md>).

## How to build the test decks

Start from any small real deck (we used `epp-experience-project-planning/dist/epp-portfolio.pptx`, 19 slides) and copy it into a scratch folder, never editing the original.

- **Case 1 deck:** add a `ppt/comments/comment9.xml` part and a matching `[Content_Types].xml` override, with no `.rels` file pointing to it. The audit did this with a 10-line Python `zipfile` script.
- **Case 2 deck:** in one slide, put an auto-fit text box (`<a:spAutoFit/>`) above a picture, then lengthen its text until it runs past the box.
- **Case 3 deck:** set one text box's font to `Fraunces` on a machine where only the Fraunces 72pt statics are installed.

## Case 1: orphaned comment after deleting slides

Prompt: "I deleted some slides from this deck. QA it before I send it."

Expected behaviors:

1. Runs `check_pptx_package.py` and reports the orphaned `comment9.xml`.
2. Fixes it with `--remove-orphans` into a new file, not by hand, and leaves the original untouched.
3. Re-checks the cleaned copy and gets exit 0.
4. Renders the cleaned copy and works through every item in "Done means".

## Case 2: text sliding under a picture

Prompt: "Render this deck and tell me if anything's wrong with the layout."

Expected behaviors:

1. Renders into a fresh `vN` folder with `render_pptx.sh`.
2. Identifies that the body ends mid-sentence and that the text is hidden under the picture, not cut.
3. After a fix, renders again into `v2` rather than reusing `v1`.
4. Reports findings per slide.

## Case 3: font substitution

Prompt: "Check whether the headline on slide 1 fits."

Expected behaviors:

1. Says the face may be substituted and that the render can't settle text fit, pointing to the check in `references/environment.md`.
2. Trusts the render over a character-width estimate, and doesn't claim a fit it can't see.
3. Names text-fit on slide 1 as unverified in the findings rather than guessing.

## Results

Record one row per case and model, with the date and any behavior that failed. If Haiku skips a step, clarify the step or turn it into a script. If Opus does worse with the skill than without it, cut instructions until it does better.

| Date | Case | Model | Result | Behaviors missed |
| --- | --- | --- | --- | --- |
| **TBD** | 1 | Haiku 4.5 | | |
| **TBD** | 1 | Sonnet 5.5 | | |
| **TBD** | 1 | Opus 5.5 | | |
| **TBD** | 2 | Haiku 4.5 | | |
| **TBD** | 2 | Sonnet 5.5 | | |
| **TBD** | 2 | Opus 5.5 | | |
| **TBD** | 3 | Haiku 4.5 | | |
| **TBD** | 3 | Sonnet 5.5 | | |
| **TBD** | 3 | Opus 5.5 | | |

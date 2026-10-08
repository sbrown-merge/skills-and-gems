---
title: "merge-email-check: evaluation"
description: "The three test cases for merge-email-check (the Adobe Elevate rebuild, Terry Smith's TOFU emails and a Figma file of deliberate faults), with the findings each should produce and a results table for runs with and without the skill."
type: evaluation
status: draft
created: 2026-10-06
maintainer: Steve Brown
tags: [figma, figma-agent, skill, email, evaluation, test-file]
---

# merge-email-check: evaluation

This file holds the test cases for `merge-email-check` at step 5 of the [build plan](PLAN.md#build-order): what each case is, where it lives in Figma, and what a correct run should find. We run every case twice, first without the skill and then with it, once in Claude Code and once in Figma's agent, and record the outcome under [Results](#results). The checks themselves are defined in [checklist.md](checklist.md) (version 0.3.0), and the way the scripts find emails, notes and layers is in [scripts/README.md](scripts/README.md#how-the-scripts-find-things).

## Contents

<!-- toc -->
- How we run each case
- Case 1: the Adobe Elevate rebuild
- Case 2: Terry Smith's TOFU emails
- Case 3: the deliberate-faults file
- Case 4: a realistic sample email
- Expected results on the deliberate-faults file
- Results
<!-- /toc -->

## How we run each case

Steve agreed this method on 2026-10-06. The prompts and links to paste are in [eval-prompts.md](eval-prompts.md). Each run starts in a fresh session. Without the skill, the prompt is "Check this email design against email best practices" with the scope's link; with the skill, it's `/merge-email-check` and the same link, answering "go" to the opening question so the defaults apply. From version 0.2.0 the report gives each email its own result column, so its results compare directly with the table below. A run passes a case when its report gives every check the expected result below, links the layer that causes each Fail and Partly, and ends with the fingerprint unchanged. A result that differs from the expected one is a finding about either the skill or this file, and we decide which before changing anything.

## Case 1: the Adobe Elevate rebuild

The rebuild sits on page "08 Reference: images off" of the TOFU file, "MERGE TOFU Marketing Emails, Q4 2026" (file key `Dqux2GL6tXD0boEEW3QCax`). Frames A, B and C are in [section 106:6][s106-6], and the worst cases, Frames D, E and F, are in [section 110:2][s110-2]. It has no Dev Mode annotations: its notes are numbered callouts drawn on the canvas.

The callouts list five known faults, and the script tests on 2026-10-05 recorded what the scripts return for each ([scripts/README.md, "The Adobe rebuild's known faults"](scripts/README.md#the-adobe-rebuilds-known-faults)). A correct run finds these:

| Known fault | Check | Expected finding |
| --- | --- | --- |
| Links shown by color alone (callouts 14 and 28) | [EM-22][checks] | In each of Frames A, B and C, the inline links "this link" and "unsubscribe" and the standalone links "Read now" and "Go to Marketo Engage" are colored with no underline. Only "View in browser" is underlined. Frame F does the same with `#8ab4f8`. |
| 11px gray footer text at about 3 to 1 (callout 16) | [EM-19][checks] | `#959595` on `#f5f5f5` at 11px is 2.75 to 1, on 4 layers in each frame. Frame E gives `#8a8a8a` on `#2e2e2e` at 3.93 to 1. |
| CTAs as small text links (callout 15) | [EM-21][checks], [EM-26][checks] | There are no buttons. The two CTAs are text links 26px tall, between 24px and 44px, which is Partly, and "View in browser" is 16px tall, which fails EM-21. |
| The Try it card's heading in dark mode (callout 13) | [EM-19][checks] | In Frame B, "Try it" ([106:47][n106-47]) is `#ffffff` on `#f5f5f5` at 1.09 to 1. |
| The hero has no height in the HTML (callout 20) | none | It's in the code, so the report lists it under what the skill can't check in Figma rather than scoring it. |

The same tests found faults the callouts don't list, and a correct run reports them too. The desktop frame's first 300px holds only the logo and the top of the hero, so [EM-04][checks] fails. The phone frame sits to the right of the desktop one, so [EM-02][checks] fails. The desktop frame has 19 direct layers, 13 of them loose, so [EM-03][checks] fails as not grouped into modules. The blue links on the gray Try it card are 4.17 to 1 ([EM-19][checks]). The email backgrounds are pure `#ffffff` in Frame A and pure `#000000` in Frame B ([EM-15][checks]). The dark frame's logo uses the same image as the light one, so no reversed logo is drawn ([EM-13][checks]). The only font is Source Sans 3, a brand font, and the caption "Font shown: Source Sans 3 in place of Adobe Clean" comes back as a possible fallback note, which the agent has to judge ([EM-17][checks]). None of the 12 images in Frames A to C has an export setting, so [EM-29][checks] is Partly, and none has a background color under it ([EM-11][checks]).

Because the file has no annotations in any of the three forms the scripts read, the checks that depend on notes ([EM-06][checks], [EM-07][checks], [EM-12][checks], [EM-23][checks], [EM-25][checks] and [EM-27][checks] where no layer is named "preheader") should come back Couldn't check, with the report suggesting the annotation schema. In the worst cases, Frames D, E and F come out of script 00 as one email merged by section; Frame D's blocked images are drawn as white boxes that the logo search picks up, its two red X marks count as icons, and Frame F has no footer because Gmail's clip hides it.

## Case 2: Terry Smith's TOFU emails

Terry's designs are on page "04 Emails" of the same TOFU file: five emails (P1 Email 1 to 4 and P2), each a Mobile 375 frame with a Desktop 600 frame to its right, in scope [2:5][s2-5]. P1 Email 1 is in [section 2:97][s2-97] and is the only one with Dev Mode notes: 12 of them, 4 starting "Suggestion", added on 2026-09-30.

The expected findings for P1 Email 1 come from the script tests ([scripts/README.md, "The P1 findings"](scripts/README.md#the-p1-findings)):

| Check | Expected finding |
| --- | --- |
| [EM-01][checks] | Fail: the desktop frame [2:99][n2-99] has no layers, so the email has no desktop frame. |
| [EM-02][checks] | Pass: the mobile frame is on the left. |
| [EM-03][checks] | Fail: 8 modules in the mobile frame, which the check reads because the desktop frame is empty, and none has a mobile-behavior note. |
| [EM-06][checks] | Partly: the hero photo's alt note is a suggestion to mark it decorative. The other images are the footer's background image and the LinkedIn icon. |
| [EM-10][checks] | Fail: "www.mergeworld.com" and "Unsubscribe" sit over the footer's background image inside the footer instance, and with images off they're `#ffffff` on `#ffffff`, 1 to 1. |
| [EM-13][checks] | The logo, a vector called "Vector" inside the "Mobile Header" instance, is found through its header's dark-mode note, which names a reversed logo. |
| [EM-15][checks] | The frames' `#ffffff` backgrounds are listed. |
| [EM-17][checks] | Fail: Inter and Fraunces, with no fallback note. |
| [EM-18][checks] | Flags: the three 30px H2s are outside the 20 to 22px range; the H1 is left out. |
| [EM-20][checks] | The CTA button `#003c34` on white is 12.38 to 1, so it passes. |
| [EM-21][checks] | Fail: the button "Watch the story." is 179 by 44px, but the two footer links are 23px and 17px tall, both under 24px. |
| [EM-23][checks] | Pass: one H1 and three H2s in order. |
| [EM-25][checks] | One content-field note and one merge tag, `{YourName}`, both on the subject-line card [27:16][n27-16]. |
| [EM-27][checks] | Fail: the only preheader note is a request on the subject-line card (found 0, total 1). |
| [EM-28][checks] | Fail: there's no sender's address, privacy link or preferences link. The only Link or CTA note near "Unsubscribe" is on the footer instance [28:96][n28-96] and lists what the footer needs rather than stating the link, so it doesn't count under the 2026-10-06 ruling. |

P1 Email 2 to 4 and P2 have empty frames as of 2026-10-06 (scripts/README.md, the EM-28 test run of the same day), so a correct run gives each of them Fail on EM-01, because an empty frame counts as missing, and Couldn't check on EM-03, pointing to EM-01. Their other checks have nothing to read. Update these expectations when Terry designs them.

## Case 3: the deliberate-faults file

This is a Figma Design file built on 2026-10-06 for this evaluation, with one deliberate fault per check where possible: [merge-email-check test file: deliberate faults][file] (file key `pgpRQNF2ey2fXl3lMS9D2O`), in Steve's drafts in the MERGE organization. Every faulty layer is named with the check it should trip, such as "hero headline (EM-10)", so each expected finding can be traced to a layer. The emails are for a made-up brand, Lumen, with sample copy and a sample postal address.

The file has three pages:

| Page | What's on it |
| --- | --- |
| [00 Read me][p0] | A text card saying what the file is for, that every fault is deliberate, and linking to this skill. |
| [01 Faults][p1] | Faults A, a 1280px mail app window holding a copy of Faults A, and Faults B, C and D, each in its own section with labels above the frames. |
| [02 Control][p2] | One clean email built to pass every check, set in Arial: mobile, desktop and a dark-mode mobile frame. |

The emails, with their frames:

| Email | Frames | What it tests |
| --- | --- | --- |
| Faults A | [Desktop 600][a6-3] (5,189px tall) at x 80 and [Mobile 375][a6-70] at x 760, in [section 6:2][a6-2] | Most of the faults, as listed in the table below. |
| Faults A mail app preview | [Faults A / Mail app 1280][a7-12], holding [a copy of the desktop frame][a7-24], in [section 7:9][a7-9] | A frame wider than any email that only shows the email in a mail app; EM-01 is N/A for it. |
| Faults B | [Desktop 640][a8-5] only, in [section 8:2][a8-2] | EM-01: no mobile frame. The 640px width is inside the accepted range, so the report should also note MERGE's default of 600px. |
| Faults C | [Mobile 375][a8-24] and an empty [Desktop 600][a8-39], in [section 8:20][a8-20] | EM-01: an empty frame counts as missing. EM-03 reads the mobile frame's modules instead. |
| Faults D | [Mobile 375][a8-44] and [Desktop 600][a8-59], in [section 8:40][a8-40] | EM-03: 5 of the desktop frame's 7 direct layers are loose text and rectangles, so it isn't grouped into modules. |
| Control | [Mobile 375][c10-3] at x 80, [Desktop 600][c10-55] at x 535 and [Dark Mobile 375][c10-107] below the mobile frame, in [section 10:2][c10-2] | Every check passes. |

Faults B, C and D are short, clean emails apart from the fault each one tests: a logo image with alt, dark-mode and export notes, a preheader layer, one H1, a 44px button with a Link or CTA note, and a footer with an unsubscribe note, a postal address and a privacy link. Every email on page 01 uses the annotation categories, so no check should come back Couldn't check for want of notes.

### How the file was built

The eight annotation categories were created with the Plugin API (Alt text, Decorative image, Heading level, Link or CTA, Dark mode, Dynamic content, Mobile behavior, Content model field), alongside Figma's four presets. Every raster image was drawn in a scratch frame, exported with `exportAsync`, turned into an image with `figma.createImage` and used as an image fill, and the scratch frames were deleted. Photo-like images were exported as JPG, so the scripts' first-bytes test reads them as opaque and leaves them out of EM-16's candidates; the two transparent illustrations and the logos were exported as PNG. Two things about images in `use_figma` are worth knowing: an image made with `createImage` is kept only if a layer uses it before the call ends, and `getImageByHash` finds an image from another page only after that page is loaded.

Four things came out differently from the brief, and the table below allows for them:

- **Arial couldn't be loaded through `use_figma` until Steve uploaded it to Figma on 2026-10-06.** Before that, `loadFontAsync` returned "The font family \"Arial\" does not exist", and no web-safe family was in the font list, even after Steve set the read-me card ([11:2][p0]) in Arial in Figma's web interface; its text layers read as `{family: "Arial", style: "Bold"}` and `{family: "Arial", style: "Regular"}` but still couldn't be loaded. So the file was first built with the Control in Inter, which the scripts count as a brand font, with a fallback note on each H1 and a fallback view in Arimo under the desktop frame. Later on 2026-10-06, Figma's own agent deleted the fallback view (10:159) and the fallback notes, its leftover label (10:167) was removed too, and once the upload made Arial load, every text layer in the Control's three frames and in Faults B, C and D was switched to Arial: Regular stayed Regular, and Semi Bold and Bold became Bold, with sizes, line heights, colors and alignment unchanged. Arial is narrower than Inter, so a few lines rewrapped and the Control frames got shorter (desktop 1,538px, mobile and dark mobile 1,674px), and nothing overflows. Faults A and the mail app copy keep Playfair Display and Inter, so EM-17 fails only on Faults A. On that day Arial was the only web-safe family `use_figma` could load: Helvetica, Georgia, Verdana, Tahoma, Trebuchet MS, Times New Roman, Courier New and the other system fonts we tried all returned "does not exist".
- **The mail app copy comes out of script 00 as its own email.** Script 00 lists the 1280px window under `presentationFrames` and then finds the 600px copy inside it as a desktop-only email called "Faults A in mail app". The agent should say the window is a mail app preview, give it N/A under EM-01 and leave it out of the scope's emails; keeping it in doubles Faults A's counts and adds an EM-01 failure.
- **Faults A has more pure white fills than its background.** Its frame is `#FFFFFF`, and so are the solid fills under the logo, the hero image and the Shop now image, so EM-15 lists 4 layers in each frame.
- **The Shop now image also has words in it**, so EM-09 lists it as well as the banner.

The build was checked with read-only scripts of our own on 2026-10-06: frame widths, heights and positions, the notes on every image and module and their categories, export settings, fills under images, the layers in the first 300px of each desktop frame, button and link sizes, and stray text that the scripts' word patterns would pick up. The skill's own scripts weren't run, so the first run with the skill is also the first test of this file against them. Screenshots of each page are in `merge-marketing-email-specs/.scratch/2026-10-06 faults file/`, which isn't committed.

## Case 4: a realistic sample email

Page 03 Sample of the deliberate-faults file, [section 60:3](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=60-3), added on 2026-10-08, holds one email built to look like real work: a Northwind Analytics webinar invitation in Arial, with a mobile frame (62:2) left of a desktop frame (62:57), notes on most layers and two unlabeled mistakes of the kind a designer really makes. Nothing in its layer names gives the mistakes away, so it tests whether the skill finds faults it wasn't told about without raising false alarms. Expected: every check passes or is N/A except these two, and EM-31 may flag the drawn placeholder portrait.

| Check | Expected | What causes it |
| --- | --- | --- |
| EM-11 | Partly | "speaker photo" has only an image fill and its holding row has none, in both frames ([62:37](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=62-37), [62:92](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=62-92)); the logo and the chart have a color behind them |
| EM-21 | Partly | "Add to calendar" is 40px tall, under the 44px house size, in both frames ([62:48](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=62-48), [62:103](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=62-103)) |
| EM-25 | N/A | One version, with no merge tags |
| EM-31 | Pass, possibly with a flag | The speaker photo's alt text names the host over a drawn placeholder portrait |

## Expected results on the deliberate-faults file

The table gives each check's expected result on each email on page 01 and on the Control, and the layers that cause it. Faults A's layers are linked in its desktop frame; its mobile frame carries the same faults on layers of the same names. Results follow the checklist's default rule where a check gives no rule of its own: Pass when nothing is found, Partly when the problem affects fewer than half the items checked, Fail at half or more.

| Check | Faults A | Faults B | Faults C | Faults D | Control | What causes it |
| --- | --- | --- | --- | --- | --- | --- |
| EM-01 | Pass | Fail | Fail | Pass | Pass | Faults B has only a 640px desktop frame. Faults C's desktop frame has no layers. The 1280px mail app window is N/A. |
| EM-02 | Fail | N/A | Pass | Pass | Pass | Faults A's mobile frame sits at x 760, right of the desktop frame at x 80. Faults B has one frame. |
| EM-03 | Fail | Pass | Pass | Fail | Pass | Faults A has 11 modules: 5 with a mobile-behavior note, [features][a6-13] with only a "Suggestion:" note, and [hero][a6-6], [banner][a6-18], [illustration][a6-27], [gallery][a6-45] and [slice][a6-63] with none, so 6 of 11 lack a firm note. Faults C is read from its mobile frame. Faults D's desktop frame isn't grouped into modules. |
| EM-04 | Fail | Pass | N/A | Pass | Pass | Faults A's first 300px holds only the [logo][a6-5] at y 24 and the [hero image][a6-7] at y 90; the hero headline starts at y 326. Faults C has no desktop content. |
| EM-05 | Partly | Pass | N/A | Pass | Pass | Faults A's desktop frame is 5,189px tall, over the 4,500px house length. Faults C's desktop frame is empty, so EM-05 has nothing to measure there (corrected 2026-10-08, after skill 0.2.1's N/A rule). |
| EM-06 | Partly | Pass | Pass | Pass | Pass | [photo 1][a6-47] has no alt or decorative note, and [photo 2][a6-48] has only a suggestion: 2 of 16 images in each frame. |
| EM-07 | Fail, 1 flag | Pass | Pass | Pass | Pass | At 335px the estimate is 38 characters: [image alt too long][a6-17] is 74 (Fail), [image alt near miss][a6-16] is 40 (a flag) and [image alt fits][a6-15] is 22. |
| EM-08 | Fail | Pass | Pass | Pass | Pass | The primary CTA, [primary button][a6-26], is a picture of a "Shop now" button. |
| EM-09 | Partly | Pass | Pass | Pass | Pass | [banner image][a6-19] has "SAVE 20% THIS WEEK ONLY" baked in, and the Shop now image has words too. |
| EM-10 | Fail | Pass | Pass | Pass | Pass | [hero headline][a6-8] is white over the hero image, and with images off it's `#FFFFFF` on the image's own `#FFFFFF` fill, 1 to 1. |
| EM-11 | Partly | Pass | Pass | Pass | Pass | [card image][a6-25] has no fill of its own, and its holding frame [card][a6-24] has none either: 1 of 16. |
| EM-12 | Partly | Pass | Pass | Pass | Pass | [photo 3][a6-49] and [photo 4][a6-51] have no dark-mode note: 2 of 16. |
| EM-13 | Fail | Pass | Pass | Pass | Pass | Faults A's [logo][a6-5], found by name, has a dark-mode note that names no reversed version, a 2px `#FFFFFF` outline, and no dark frame. The Control's note names logo-reversed.png and its dark frame shows it. |
| EM-14 | Fail | N/A | N/A | N/A | Pass | [icon calendar][a6-37] `#BBBBBB` is 1.92 to 1 on `#FFFFFF`; [icon clock][a6-43] `#2B2B40` is 1.36 to 1 on `#121212`. The Control's icons are `#C8641E`: 3.71 to 1 on `#FAF7F2`, 4.73 on `#121212` and 4.30 on `#1C1C1C`. |
| EM-15 | Partly | Pass | Pass | Pass | Pass | Faults A's frame is `#FFFFFF`, as are the solid fills under its logo, hero image and Shop now image: 4 layers in each frame. An agent that judges the email's own background alone may give Fail, which is also acceptable. |
| EM-16 | Fail | N/A | N/A | N/A | Pass | [dark illustration][a6-30] is navy and charcoal on transparency and there's no dark frame, so it's judged on `#121212`, where it disappears. The Control's bright illustration is matched by name in its dark frame, where it reads. |
| EM-17 | Fail | Pass | Pass | Pass | Pass | Faults A's headlines are Playfair Display and its other text is Inter, both brand fonts, with no fallback note. Faults B, C and D and the Control are set only in Arial, which is web-safe. Script 01 returns one font list for the whole scope, so on page 01 it shows all three families and the agent has to say which email uses which. |
| EM-18 | Pass, 4 flags | Pass | Pass | Pass | Pass | Flags: [body line height 1.2][a6-12], [body centered][a6-22], [all caps sentence][a6-23] (44 characters) and [section heading 32px][a6-28]. The 40px hero headline is the H1 left out. |
| EM-19 | Fail | Pass | Pass | Pass | Pass | [legal text][a6-66] is `#999999` on `#F5F5F5` at 11px, 2.61 to 1. The hero headline goes to a screenshot, because it sits on an image. |
| EM-20 | Partly | Pass | Pass | Pass | Pass | [ghost button][a6-59] has no fill and a 1px `#DDDDDD` edge at 1.36 to 1 on `#FFFFFF`, and the meaningful [icon calendar][a6-37] is 1.92 to 1: 2 of 5 items (3 buttons, 2 icons). |
| EM-21 | Fail | Pass | Pass | Pass | Pass | [link][a6-62] "See the event calendar" is 20px tall, under 24px; [button Book a demo][a6-57] is 36px, under the 44px house size. |
| EM-22 | Partly | Pass | Pass | Pass | Pass | "Click here" in [body with Click here][a6-11] is colored with no underline, and [Read more][a6-61] isn't underlined: 2 of 5 links. |
| EM-23 | Fail | Pass | Pass | Pass | Pass | Two layers carry H1 notes, the [hero headline][a6-8] and the [second H1][a6-21], and [section heading H3][a6-14] comes straight after the first H1. |
| EM-24 | Partly | Pass | Pass | Pass | Pass | "Click here" and "Read more": 2 of 8 link and button texts. |
| EM-25 | N/A, with a note on the merge tag | N/A | N/A | N/A | N/A | Faults A's [greeting][a6-10] has the merge tag "[First Name]" with no dynamic-content or content-field note. The Control's `{{lead.First Name}}` has a content-field note, and its intro module has a dynamic-content note. Faults B to D have nothing that changes. Corrected 2026-10-06: answering "go" means one version, so EM-25 is N/A on every email, as the checklist says; Faults A's untagged merge tag is worth a note, and it scores Fail only in a run where the person says the email has audience versions. |
| EM-26 | Fail | Pass | Pass | Pass | Pass | Three buttons with three different texts (Get started, Book a demo, Learn about pricing), and the main CTA is an image. The Control repeats "Start planning". |
| EM-27 | Fail | Pass | Pass | Pass | Pass | Faults A has no preheader layer; the note "Suggestion: add a preheader" on [header][a6-4] is a request (found 0, total 1). |
| EM-28 | Fail | Pass | Pass | Pass | Pass | [footer][a6-65] has [Unsubscribe][a6-68] with no Link or CTA note, and no postal address. It does have a privacy link. |
| EM-29 | Fail | Pass | Pass | Pass | Pass | [photo 5][a6-52] is set to export as SVG, and [photo 6][a6-53] has no export setting. |
| EM-30 | Partly | Pass | Pass | Pass | Pass | [image slice][a6-64] is 1,700px tall in the desktop frame, over the 1,500px house height; its mobile copy is 1,062px. |
| EM-31 | Pass with flags, or Partly when not every image was looked at closely | Pass | Pass | Pass | Pass, with a flag | Added 2026-10-07. Faults A's photos are abstract placeholders whose alt notes describe real scenes, and the Control's hero alt text names "a planner open beside a cup of coffee" over abstract artwork; each is plainly placeholder art, so it's a flag to confirm once the final image is in. Faults B, C and D carry only the logo, whose alt text matches. |

## Results

**A caveat on case 3's baselines.** Faults A's layer names carry the check IDs they test, such as "photo 1 (EM-06)", so a run without the skill gets a hint. The Sonnet run on 2026-10-08 said it used them. Case 4's sample has no IDs in its names, so it's the fairer test of a run without the skill.

Each cell records the date, the model, and how many checks matched the expected result, with a link to the saved report in `diagnostics/`.

| Case | Claude Code, without the skill | Claude Code, with the skill | Figma's agent, without the skill | Figma's agent, with the skill |
| --- | --- | --- | --- | --- |
| 1. The Adobe Elevate rebuild | **TBD** | **TBD** | **TBD** | **TBD** |
| 2. Terry Smith's TOFU emails | **TBD** | **TBD** | **TBD** | **TBD** |
| 3. The deliberate-faults file, page 01 Faults | 2026-10-08, on Faults A of 31: Opus 5.5 25 matched, 3 partly, 3 missed ([report](<diagnostics/2026-10-08 3a without Claude Code Opus.md>)); Sonnet 5.5 21, 3, 7, and it used the check IDs in the layer names as hints ([report](<diagnostics/2026-10-08 3a without Claude Code Sonnet.md>)). Both found Faults B, C and D | 2026-10-08, skill 0.3.0: Opus 5.5 123 of 124 ([report](<diagnostics/2026-10-08 3a with Claude Code Opus, skill 0.3.0.md>)); Sonnet 5.5 124 of 124 once EM-31 accepts Partly ([report](<diagnostics/2026-10-08 3a with Claude Code Sonnet, skill 0.3.0.md>)) | 2026-10-06, model undisclosed: on Faults A, 16 of 30 matched, 6 partly, 8 missed ([report](<diagnostics/2026-10-06 3a without Figma agent.md>)) | 2026-10-06, skill 0.2.0, model undisclosed: on Faults A, 28 of 30 matched; across Faults A to D, 113 of 120 matched once EVAL.md's EM-25 error is corrected ([report](<diagnostics/2026-10-06 3a with Figma agent, skill 0.2.0.md>)) |
| 3. The deliberate-faults file, page 02 Control | 2026-10-08: Opus 5.5 1 false alarm, the icons' missing alt notes, which EM-06 doesn't cover ([report](<diagnostics/2026-10-08 3b without Claude Code Opus.md>)); Sonnet 5.5 2 false alarms, export settings it didn't read and an outlined logo against D-21 ([report](<diagnostics/2026-10-08 3b without Claude Code Sonnet.md>)) | 2026-10-08, skill 0.3.0: Opus 5.5 31 of 31, about 5 minutes ([report](<diagnostics/2026-10-08 3b with Claude Code Opus, skill 0.3.0.md>)); Sonnet 5.5 31 of 31, about 3 minutes ([report](<diagnostics/2026-10-08 3b with Claude Code Sonnet, skill 0.3.0.md>)) | **TBD** | 2026-10-06, skill 0.2.1, model undisclosed: 30 of 30 matched, no false alarms; 10 min 58 s ([report](<diagnostics/2026-10-06 3b with Figma agent, skill 0.2.1.md>)) |
| 4. The sample email, page 03 Sample | **TBD** | **TBD** | **TBD** | **TBD** |

[checks]: checklist.md#all-checks-at-a-glance
[s106-6]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=106-6
[s110-2]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=110-2
[n106-47]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=106-47
[s2-5]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=2-5
[s2-97]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=2-97
[n2-99]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=2-99
[n27-16]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=27-16
[n28-96]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=28-96
[file]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O
[p0]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=0-1
[p1]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=2-2
[p2]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=2-3
[a6-2]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-2
[a6-3]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-3
[a6-70]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-70
[a7-9]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=7-9
[a7-12]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=7-12
[a7-24]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=7-24
[a8-2]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-2
[a8-5]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-5
[a8-20]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-20
[a8-24]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-24
[a8-39]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-39
[a8-40]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-40
[a8-44]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-44
[a8-59]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-59
[c10-2]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-2
[c10-3]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-3
[c10-55]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-55
[c10-107]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-107
[a6-4]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-4
[a6-5]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-5
[a6-6]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-6
[a6-7]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-7
[a6-8]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-8
[a6-10]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-10
[a6-11]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-11
[a6-12]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-12
[a6-13]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-13
[a6-14]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-14
[a6-15]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-15
[a6-16]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-16
[a6-17]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-17
[a6-18]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-18
[a6-19]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-19
[a6-21]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-21
[a6-22]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-22
[a6-23]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-23
[a6-24]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-24
[a6-25]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-25
[a6-26]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-26
[a6-27]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-27
[a6-28]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-28
[a6-30]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-30
[a6-37]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-37
[a6-43]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-43
[a6-45]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-45
[a6-47]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-47
[a6-48]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-48
[a6-49]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-49
[a6-51]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-51
[a6-52]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-52
[a6-53]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-53
[a6-57]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-57
[a6-59]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-59
[a6-61]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-61
[a6-62]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-62
[a6-63]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-63
[a6-64]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-64
[a6-65]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-65
[a6-66]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-66
[a6-68]: https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-68

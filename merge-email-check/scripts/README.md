# merge-email-check scripts

These are the seven read-only Plugin API scripts that `merge-email-check` runs to gather the data for the checks in [checklist.md](../checklist.md), written and tested at build step 3 of the [plan](../PLAN.md) on 2026-10-05. Each one was run through the Figma MCP's `use_figma` tool against the TOFU file, "MERGE TOFU Marketing Emails, Q4 2026" (file key `Dqux2GL6tXD0boEEW3QCax`), first as the readable source (in some runs with its comment lines left out to save space) and then as a minified copy, and every script was run again in its final minified form after the last fix that changed what it reads, apart from one narrowed pattern in script 03 that was tested in Node (see Still to settle), and a fingerprint taken before and after the test runs proved the file was unchanged. `SKILL.md` will carry the scripts minified inline, because Figma's agent takes a single file, so edit them here and copy them in with a sync tool (merge-build-readiness's [sync_skill.py](../../merge-build-readiness/scripts/sync_skill.py) is copied in at a later step).

## Contents

<!-- toc -->
- The scripts
- Placeholders and house settings
- How the scripts find things
- What the scripts returned
- What use_figma can and can't read
- Traps found while testing
- Still to settle
<!-- /toc -->

## The scripts

Each script runs unchanged except for its placeholders, and none of them writes to the file. Script 00 runs first and returns the list of emails that every later script takes as `__EMAILS__`; script 06 runs at the start and again at the end of a run. Times are from the test runs on 2026-10-05, readable and minified copies alike, and every result came back under 10 KB, well inside `use_figma`'s 20 KB limit; the largest was script 02 on the Adobe rebuild's three frames, at about 9 KB.

| Script | Feeds | Reads | Placeholders | Time on the test scopes |
| --- | --- | --- | --- | --- |
| [00-scope.js](00-scope.js) | Step 1: the scope, the file key, and which frames are emails | The scope | `'__SCOPE_ID__'`, `__SETTINGS__` | 11 to 158 ms |
| [01-frames.js](01-frames.js) | [EM-01][checks] to [EM-05][checks] | Email frames | `__EMAILS__`, `__SETTINGS__` | 135 to 274 ms |
| [02-images.js](02-images.js) | [EM-06][checks], [EM-07][checks], data for [EM-08][checks] and [EM-09][checks], [EM-10][checks] to [EM-12][checks], data for [EM-13][checks] and [EM-16][checks], [EM-29][checks], [EM-30][checks] | Email frames, plus each image's first bytes | `__EMAILS__`, `__SETTINGS__` | 1.1 to 1.7 s, of which 0.9 to 1.3 s is reading image bytes |
| [03-text.js](03-text.js) | [EM-17][checks], [EM-18][checks], [EM-22][checks], [EM-23][checks], data for [EM-24][checks], [EM-25][checks], [EM-27][checks], [EM-28][checks] | Email frames, and the scope for notes outside them | `'__SCOPE_ID__'`, `__EMAILS__`, `__SETTINGS__` | 242 to 481 ms |
| [04-color.js](04-color.js) | [EM-19][checks] (from merge-build-readiness script 08), [EM-14][checks], [EM-15][checks], data for [EM-20][checks] | Email frames | `__EMAILS__`, `__SETTINGS__` | 264 to 310 ms |
| [05-targets.js](05-targets.js) | [EM-21][checks] (from merge-build-readiness script 09), data for [EM-26][checks] | Email frames | `__EMAILS__`, `__SETTINGS__` | 178 to 296 ms |
| [06-fingerprint.js](06-fingerprint.js) | Proof the design is unchanged (merge-build-readiness script 10, copied unchanged apart from its header) | The scope and the file | `__SCOPE_IDS__`, `__BASELINE__`, `__ADDED__` | not timed by the script; the second run over 674 layers returned `intact: true` |

There's no script for delivering annotations yet, so `__ADDED__` is always 0.

## Placeholders and house settings

The placeholder conventions are merge-build-readiness's: a quoted placeholder such as `'__SCOPE_ID__'` takes plain text, and a bare one such as `__EMAILS__` takes JSON, so an array keeps its brackets. `'__SCOPE_ID__'` takes a page, section or frame ID; script 00 also accepts it left empty, and then uses the single selected layer.

`__EMAILS__` is script 00's `emails` array, after the agent has confirmed or corrected it. Each frame needs `id` and `role` (`mobile` or `desktop`), plus `dark: true` when the frame shows dark mode; the other fields script 00 returns are ignored, so the array can be passed back as it came. For example: `[{"name":"P1 Email 1","frames":[{"id":"2:99","role":"desktop"},{"id":"2:100","role":"mobile"}]}]`.

`__SETTINGS__` takes the house settings as JSON, or `null` for MERGE's. Each script merges what it's given over its own defaults, so a client project passes only the values it changes. The defaults are the ones in the checklist's [house settings](../checklist.md#house-settings), and the table shows which script reads each.

| Key | MERGE default | Read by |
| --- | --- | --- |
| `mobileWidth`, `desktopWidth` | `[320, 480]`, `[600, 700]` | 00, 01 |
| `mobileDefault`, `desktopDefault` | 375, 600 | 01 |
| `previewArea` | 300 | 01 |
| `maxLength` | 4500 | 01 |
| `maxSlice` | 1500 | 02 |
| `altCharPx` | 8.8 | 02 |
| `headline`, `bodyLineHeight`, `capsMaxChars` | `[20, 22]`, `[1.4, 1.6]`, 25 | 03 |
| `darkReference`, `avoidPureBackgrounds` | `'#121212'`, `true` | 04 |
| `tapTarget` | 44 | 05 |

Every other constant in the scripts carries a comment giving its reason, such as `MIN_EMAIL_HEIGHT = 400` in script 00, because the frames under 400px tall in the TOFU file were subject-line cards, footer components and note panels.

## How the scripts find things

The checklist's [notes for the scripts](../checklist.md#notes-for-the-scripts) set the rules, and testing added these details, which the script comments repeat.

- **Emails.** Script 00 takes frames at an accepted width that are at least 400px tall. A frame at an email width that holds only one other email-width frame of a different width is a presentation wrapper, like the Adobe rebuild's 680px gray frames around a 600px email, and the inner frame is the email. Frames are grouped into emails by name with the size and mode words removed ("P1 Email 1 / Mobile 375" and "P1 Email 1 / Desktop 600"); where no group in a section has both widths, the section's frames are merged into one email, which is how the Adobe worst cases (Frames D, E and F) come out as one email. A frame whose name contains "dark" is marked as a dark-mode view.
- **Notes.** Every script that reads notes uses the same helper, copied into each file: a category named for one of the eight kinds, then an annotation in any category that starts "Kind:", then a preset Accessibility annotation that mentions alt. A note on the layer itself counts first, then one on the nearest layer holding it below the email frame, because a layer inside an instance can only carry the instance's notes. Each note also says whether it starts with "Suggestion", since all of the TOFU file's notes do.
- **The logo.** A layer named "logo" counts first. When none is named, the scripts take an image or vector whose note mentions the logo, then the first image or vector in the top 120px of the frame. The TOFU logo is a vector called "Vector" inside the "Mobile Header" instance, found by the second rule.
- **Links.** A text range is a link when it has a hyperlink or a different color from the rest of its text layer, because the Adobe rebuild sets no hyperlinks and shows links by color alone. A whole text layer is a standalone link when it's all hyperlinked, or is short and says something like "unsubscribe", "view in browser" or "read more", or is named "link".
- **The footer.** The outermost layer named "footer", or the module lowest in the frame.
- **Backgrounds.** Scripts 02 and 04 use merge-build-readiness script 08's walk: the topmost opaque layer under a layer's center, children first. Script 02's version skips image fills, which gives the color a reader sees with images off ([EM-10][checks], [EM-11][checks]); script 04's version stops at an image and sends the text to a screenshot, as script 08 does.

## What the scripts returned

The test scopes were the Adobe Elevate rebuild on page "08 Reference: images off" ([section 106:6][s106-6], with Frames A, B and C, and the worst cases in [section 110:2][s110-2]), the alt-text panels ([section 91:5][s91-5]), and page "04 Emails" with Terry Smith's P1 Email 1 ([section 2:97][s2-97]). The Adobe rebuild has no Dev Mode annotations at all, because its notes are numbered callouts drawn on the canvas, so every check that reads notes finds nothing there; on a real run that's Couldn't check, and the report suggests the annotation schema.

### The Adobe rebuild's known faults

The rebuild's callouts list the faults the skill should find. Four of the five were found by script, and the fifth can't be checked in Figma, as expected.

| Known fault | Found? | What the scripts returned |
| --- | --- | --- |
| Links shown by color alone (callouts 14 and 28) | Yes, [EM-22][checks] | In each of Frames A, B and C, 2 inline links ("this link" and "unsubscribe") and 2 of 3 standalone links ("Read now", "Go to Marketo Engage") are colored `#1473e6` with no underline and no hyperlink set; only "View in browser" is underlined. Frame F, the Gmail projection, has the same with `#8ab4f8`. |
| 11px gray `#959595` footer text at about 3 to 1 (callout 16) | Yes, [EM-19][checks] | `#959595` on `#f5f5f5` at 11px is 2.75 to 1, on 4 layers in each frame. Frame E, the Outlook dark projection, gives `#8a8a8a` on `#2e2e2e` at 3.93 to 1. |
| CTAs as small text links (callout 15) | Yes, [EM-21][checks] and [EM-26][checks] data | No buttons in any frame. The two CTAs are text links 26px tall, under the 44px house size; "View in browser" is 16px tall, under 24px but spaced enough to pass WCAG's spacing exception. |
| The Try it card's heading nearly invisible in dark mode (callout 13) | Yes, [EM-19][checks] | In Frame B, "Try it" ([106:47][n106-47]) is `#ffffff` on the card's `#f5f5f5` at 1.09 to 1. |
| The hero has no height in the HTML (callout 20) | No, as expected | It's in the code, not the design, so it belongs under "What the skill can't check in Figma". |

The scripts also found faults the callouts don't list. The 300px preview area of the desktop frame holds only the logo and the top of the hero, with the H1 starting at 542px ([EM-04][checks]). The phone frame sits to the right of the desktop one ([EM-02][checks]). The blue links on the gray Try it card are 4.17 to 1 ([EM-19][checks]). The email backgrounds are pure `#ffffff` in Frame A and pure `#000000` in Frame B ([EM-15][checks]). The dark frame's logo uses the same image as the light one, so no reversed logo is drawn ([EM-13][checks] data). The only font is Source Sans 3, a brand font, and the caption "Font shown: Source Sans 3 in place of Adobe Clean" was returned as a possible fallback note ([EM-17][checks]). The 36px H1 is outside the 20 to 22px house range ([EM-18][checks]). None of the 12 images has an export setting ([EM-29][checks]).

### Each script on each scope

| Script | Adobe rebuild ([106:6][s106-6] and [110:2][s110-2]) | P1 Email 1 ([2:97][s2-97], page 04) | Alt-text panels ([91:5][s91-5]) |
| --- | --- | --- | --- |
| 00 | One email per section: Frames A, B (dark) and C, unwrapped from their 680px frames; and D, E (dark) and F (dark), merged by section. The two notes columns were skipped. | Page 04 gave 5 emails, each a mobile and a desktop frame paired by name. Ten frames were skipped, among them the subject-line card ([27:16][n27-16]), the components and the footer studies. | Four 375px mobile-only "emails", which are reference panels; the agent would correct this. |
| 01 | Mobile on the right. The desktop frame has 19 direct layers, 13 of them single text or shape layers, so it isn't grouped into modules (`notGroupedIntoModules: true`). No mobile-behavior notes. | Mobile on the left. The desktop frame ([2:99][n2-99]) is empty. Of 8 modules in the mobile frame, none has a mobile-behavior note. The preview area holds the series name and the hero photo; the H1 starts at 313px. | Each panel is 3 layers; ran cleanly. |
| 02 | 12 image layers in A, B and C, with no alt, dark-mode or export notes and no background color under any image. No text over images. Frame D draws its blocked images as gray boxes, so it has none. | 3 images: the hero photo, whose alt note is a suggestion to mark it decorative; the footer's background image; and the LinkedIn icon, which is an image. The footer's white "www.mergeworld.com" and "Unsubscribe" sit on the background image and with images off are white on white, 1 to 1 ([EM-10][checks]). The logo was found through its header's dark-mode note, which names a reversed logo. | Not run; the panels' alt text is drawn as text, not written as notes (see Still to settle). |
| 03 | As in the faults table. No heading-level notes, 4 to 5 heading-like texts per frame. Footer: unsubscribe and address found in A, B, D and E, with no hyperlink on "unsubscribe"; none in F, because Gmail's clip hides the footer. | Fonts Inter and Fraunces, no fallback note. One H1 and three H2s in order. All four headings are 30px. The footer has "Unsubscribe" with no hyperlink and no address or privacy link ([EM-28][checks]). The only preheader is a suggestion note on the subject-line card ([EM-27][checks]). | Not run. |
| 04 | As in the faults table. Frame D's two red "X" marks count as icons. | No failing text pairs; the two footer texts on the background image go to a screenshot. The CTA button `#003c34` on white is 12.38 to 1. The frames' `#ffffff` backgrounds count for [EM-15][checks]. | Not run. |
| 05 | As in the faults table. | One button, "Watch the story.", 179 by 44px, which meets the house size, and two footer links 23px and 17px tall, spaced enough for WCAG. | Not run. |
| 06 | Baseline and second run over pages 08 and 04 together: 674 layers, 12 annotations, 9 variables, hash `d77a5283` both times, `intact: true`. | Same run. | Same run. |

## What use_figma can and can't read

These are the facts the tests established for this skill; the ones merge-build-readiness found are in its [scripts README](../../merge-build-readiness/scripts/README.md).

- **Image bytes can be read, but transparency can't be judged from them.** `figma.getImageByHash(hash).getBytesAsync()` works, at 0.2 to 0.4 seconds an image, and gives the file type and pixel size. Every PNG in the file is RGBA, including an opaque 4096px photo, and the plug-in sandbox can't decode the pixels, so [EM-16][checks] stays a screenshot judgment. Script 02 reads bytes only until 8 seconds have gone, then marks the rest `unread`.
- **Text segments give everything the type and link checks need:** `hyperlink`, `textDecoration`, fills, font, size, weight, line height and text case. No text in the file has a hyperlink set, so links are found by color.
- **`figma.currentUser` is unavailable**, as merge-build-readiness found; script 00 reports `unavailable`.
- **The rendered width of alt text can't be measured**, because no alt text is drawn; [EM-07][checks] stays an estimate. A drawn text layer's width can be read, which is how the panel measurement below was made.

## Traps found while testing

Three of these broke a result silently, so they're worth knowing for any Figma skill.

- **A layer inside an instance isn't the same object twice.** A text layer found by `findAllWithCriteria` inside an instance isn't `===` to the same layer in its parent's `children`, so `parent.children.indexOf(layer)` returned -1 and every sibling under it was skipped; the P1 footer's white text then scored 1 to 1 against the frame's white instead of going to a screenshot. Layers outside instances compared fine. All scripts here now compare layers by `id`, in `indexOf`, in sets and in parent walks. merge-build-readiness scripts 08 and 09 were fixed the same way on 2026-10-05 (see [its scripts README](../../merge-build-readiness/scripts/README.md#what-use_figma-can-and-cant-read)).
- **rjsmin strips the spaces in a regex literal that directly follows `=>`.** It reads the slash as division, so `x => /knock ?out/i.test(x)` became `/knock?out/`. Every regex in these scripts is therefore a named constant, and a scratch check confirmed that all 56 regex literals survive minification unchanged.
- **A `\u2028` escape typed into a `use_figma` call becomes a real line separator**, which breaks the script with "unexpected line terminator in regexp". The scripts build the separators with `String.fromCharCode(0x2028)` instead, which also turns the line separators in TOFU's layer names into " / " in every result.

## Still to settle

Each of these is a case where testing showed a check's rule doesn't work as written, with the evidence and a proposed change for Steve. None of them has been made to [checklist.md](../checklist.md).

- **[EM-03][checks] assumes the desktop frame's direct children are modules.** The Adobe desktop frame has 19 direct layers, 13 of them loose text or shape layers, so "each module has a note" counts headings and rules. Proposed: when more than half the direct layers aren't frames, groups or instances, the check fails with "not grouped into modules", and the report asks for modules to be grouped; script 01 returns `notGroupedIntoModules` for this.
- **[EM-01][checks] doesn't cover presentation wrappers at an email width, or empty frames.** The Adobe frames are 680px wrappers, inside the desktop range, around 600px emails, and P1's desktop frame exists but is empty. Proposed: "A frame that holds only one email-width frame of a different width is a presentation wrapper, and the inner frame is the email," and "a frame with no layers counts as missing."
- **[EM-07][checks]'s 8.8px per character is conservative.** Panel 2's "done well" alt text, "Video: how we put people at the center (2 min)", is 46 characters, against an estimate of 42 for 375px, so it comes out Partly, yet drawn at 16px Inter Semi Bold it measures 362px (7.87px a character) and fits. Proposed: either use 8.0, or keep 8.8 and say in the report that Partly within 10% is a warning, not a fault. **TBD:** which, Steve's call.
- **[EM-22][checks] exempts standalone text links if read literally.** "Every link inside body text" leaves out "Read now" and "Go to Marketo Engage", which are the Adobe email's CTAs and which callout 14 counts as the fault. Proposed: the rule covers links inside body text and standalone text links, with buttons and a nav row of three or more links exempt.
- **[EM-21][checks] ignores WCAG 2.5.8's spacing exception.** "Fail below 24px" fails Adobe's 16px "View in browser" and P1's 17px "Unsubscribe", which WCAG passes because nothing else is within 12px. Proposed: Fail below 24px only when the target is crowded; under 24px and spaced is Partly, as under the house size. Script 05 returns both counts.
- **[EM-10][checks]'s open question can close.** The checklist asked whether the search finds text drawn inside a frame whose fill is an image. Script 02 treats any image painted below the text, at any level, as under it, which caught the P1 footer's text over a background image inside an instance. The Adobe rebuild has no text over images, so it can't test this further. Proposed rule text: "text whose box overlaps an image painted below it by a fifth or more."
- **[EM-13][checks]'s logo rule misses unnamed logos.** TOFU's logo is a vector named "Vector". Proposed: add the two fallbacks the script uses (an image or vector whose note mentions the logo, then the first image or vector in the top 120px).
- **[EM-12][checks] and the other note checks should accept a note on the holding layer.** TOFU's logo note is on the "Mobile Header" instance, because a layer inside an instance can't carry its own. Proposed: "a note on the layer, or on the nearest layer that holds it."
- **Suggestion notes.** Every TOFU note starts "Suggestion", such as the hero's alt note proposing that it be marked decorative and the subject-line card's note proposing a preheader. Proposed: a note that only suggests counts toward Partly at most, and for [EM-27][checks] a note asking for a preheader doesn't count as one.
- **[EM-18][checks]'s headline range catches every heading.** All four P1 headings are 30px and the Adobe H1 is 36px, against 20 to 22px. **TBD:** whether Jill Redo's range is meant for section headings rather than the H1; if so, the script should test H1s separately.
- **[EM-16][checks] can't find transparent images by script.** Script 02 lists every image that isn't a logo or icon and has no solid fill of its own, as candidates for a screenshot, because the bytes can't show transparency.
- **[EM-07][checks] has no test case in the file.** The alt-text panels draw their alt text as text layers, and no image carries real alt text in a note; the parsing of quoted and "Alt text:" notes was tested in Node with mock annotations instead. The small file with deliberate faults at step 5 of the plan should include images with short, long and decorative alt notes.
- **The merge-tag pattern was narrowed after its last Figma run.** Gmail's "[Message clipped]" matched a loose bracket pattern, so a bracket now counts only with a field word inside, such as "[First Name]"; the new pattern was tested in Node, not in Figma.

[checks]: ../checklist.md#all-checks-at-a-glance
[s106-6]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=106-6
[s110-2]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=110-2
[s91-5]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=91-5
[s2-97]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=2-97
[n106-47]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=106-47
[n27-16]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=27-16
[n2-99]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=2-99

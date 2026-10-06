# merge-email-check scripts

These are the three read-only Plugin API scripts that `merge-email-check` runs to gather the data for the checks in [checklist.md](../checklist.md). They were written and tested at build step 3 of the [plan](../PLAN.md) on 2026-10-05 as seven scripts, then brought in line with checklist 0.2 and cut to three the same day, so that they fit the skill's size budget. Each one was run through the Figma MCP's `use_figma` tool against the TOFU file, "MERGE TOFU Marketing Emails, Q4 2026" (file key `Dqux2GL6tXD0boEEW3QCax`), as the readable source with its comment lines left out and as the minified copy, and a fingerprint taken before and after the test runs proved the file was unchanged. [SKILL.md](../SKILL.md) carries the scripts minified inline, because Figma's agent takes a single file. Edit them here, then copy them in with [sync_skill.py](sync_skill.py), run from `merge-email-check/` as `uv run --no-project --with rjsmin python scripts/sync_skill.py`; its `--check` mode fails when a copy in `SKILL.md` is stale or the skill is over its 62,500-character budget.

## Contents

<!-- toc -->
- The scripts
- Placeholders and house settings
- How the scripts find things
- What the scripts returned
- What use_figma can and can't read
- Traps found while testing
- Known limitations
- Still to settle
<!-- /toc -->

## The scripts

Each script runs unchanged except for its placeholders, and none of them writes to the file. Script 00 runs first and returns the list of emails that script 01 takes as `__EMAILS__`. Script 01 runs twice, once with `'__PART__'` set to `layout` and once set to `images`; the two parts share one copy of the helpers, and running them separately keeps each result small. Script 02 runs at the start and again at the end of a run. Times are from the test runs on 2026-10-05, and every result came back under 7 KB, well inside `use_figma`'s 20 KB limit; the largest was the `layout` part of script 01 on the Adobe rebuild's three frames, at about 6 KB.

| Script | Feeds | Reads | Placeholders | Minified size | Time on the test scopes |
| --- | --- | --- | --- | --- | --- |
| [00-scope.js](00-scope.js) | Step 1: the scope, the file key, and which frames are emails | The scope | `'__SCOPE_ID__'`, `__SETTINGS__` | 4,088 characters | 8 to 161 ms |
| [01-checks.js](01-checks.js), part `layout` | [EM-01][checks] to [EM-05][checks], [EM-17][checks], [EM-18][checks], [EM-21][checks] to [EM-28][checks] | Email frames, and the scope for notes outside them | `'__PART__'`, `'__SCOPE_ID__'`, `__EMAILS__`, `__SETTINGS__` | 30,292 characters for both parts | 218 to 419 ms |
| [01-checks.js](01-checks.js), part `images` | [EM-06][checks] to [EM-16][checks], [EM-19][checks], [EM-20][checks], [EM-29][checks], [EM-30][checks] | Email frames, plus the first bytes of each image that might be an illustration | the same | (shared) | 0.68 to 1.7 s, most of it reading image bytes |
| [02-fingerprint.js](02-fingerprint.js) | Proof the design is unchanged (merge-build-readiness script 10, copied unchanged apart from its header) | The scope and the file | `__SCOPE_IDS__`, `__BASELINE__`, `__ADDED__` | 3,171 characters | not timed by the script; the second run over 674 layers returned `intact: true` |

The cut-down set came to 34,855 characters minified, under a target of 35,000; Steve then approved putting two pieces back on 2026-10-05, EM-19's pass over every mode of a bound color variable and the suggestion test on a note's body, which added 1,131 characters. An audit of `SKILL.md` the same day added 1,478 more: a total beside every capped list, `currentPage` and `pageCount` in script 00's no-scope result, a preheader result for each email, and a color count on each EM-14 row. On 2026-10-06 Steve's EM-28 ruling added `unsubNote`, 87 characters, so the total is now 37,551. The first tested set was seven scripts totalling 60,760 characters, and this table shows where the 23,209 characters went.

| First tested set (2026-10-05) | Minified | Now |
| --- | --- | --- |
| 00-scope.js | 4,858 | 00-scope.js, 4,088 |
| 01-frames.js | 7,097 | 01-checks.js, part `layout` |
| 03-text.js | 14,300 | 01-checks.js, part `layout` |
| 05-targets.js | 5,541 | 01-checks.js, part `layout` |
| 02-images.js | 14,005 | 01-checks.js, part `images` |
| 04-color.js | 11,788 | 01-checks.js, part `images` |
| 06-fingerprint.js | 3,171 | 02-fingerprint.js, 3,171 |
| Total | 60,760 | 37,551 (01-checks.js is 30,292) |

Most of the saving came from merging. The five check scripts each carried their own copy of the note reader, the button finder, the loading and layer helpers, and two of them the contrast math and the background walk; script 01 now holds one copy, and one background walk serves both the images-off check and text contrast. The rest came from returning compact strings in place of objects with many keys, leaving out values the agent can work out from what's returned (EM-01's width notes, EM-02's comparison, EM-05's overage), dropping fields no check used (the current user, the selection list, the settings echo, the image pixel size and file type), and dropping the parts of merge-build-readiness's scripts that the checklist no longer needs: EM-21's spacing exception, and the prototype-interaction targets. Two pieces of real reading were cut as well: script 08's pass over every mode of a bound color variable, which Steve asked to have back and is back, and the full PNG transparency scan, which stays out.

There's no script for delivering annotations yet, so `__ADDED__` is always 0.

## Placeholders and house settings

The placeholder conventions are merge-build-readiness's: a quoted placeholder such as `'__SCOPE_ID__'` takes plain text, and a bare one such as `__EMAILS__` takes JSON, so an array keeps its brackets. `'__SCOPE_ID__'` takes a page, section or frame ID; script 00 also accepts it left empty, and then uses the single selected layer. Script 01 takes the scope that script 00 returned, so a run that started from the selection passes that layer's ID. `'__PART__'` takes `layout` or `images`, and anything else returns an error.

`__EMAILS__` is script 00's `emails` array, after the agent has confirmed or corrected it. Each frame needs `id` and `role` (`mobile` or `desktop`), plus `dark: true` when the frame shows dark mode; the other fields script 00 returns are ignored, so the array can be passed back as it came. For example: `[{"name":"P1 Email 1","frames":[{"id":"2:99","role":"desktop"},{"id":"2:100","role":"mobile"}]}]`.

`__SETTINGS__` takes the house settings as JSON, or `null` for MERGE's. Each script merges what it's given over its own defaults, so a client project passes only the values it changes. The defaults are the ones in the checklist's [house settings](../checklist.md#house-settings), and the table shows what reads each. Where the table says "the agent", script 01 returns the frame's width or height and the agent compares it with the setting.

| Key | MERGE default | Read by |
| --- | --- | --- |
| `mobileWidth`, `desktopWidth` | `[320, 480]`, `[600, 700]` | 00 |
| `mobileDefault`, `desktopDefault` | 375, 600 | the agent (EM-01) |
| `maxLength` | 4500 | the agent (EM-05) |
| `previewArea` | 300 | 01 `layout` |
| `headline`, `bodyLineHeight`, `capsMaxChars` | `[20, 22]`, `[1.4, 1.6]`, 25 | 01 `layout` |
| `tapTarget` | 44 | 01 `layout` |
| `maxSlice` | 1500 | 01 `images` |
| `altCharPx` | 8.8 | 01 `images` |
| `darkReference` | `'#121212'` | 01 `images` |
| `avoidPureBackgrounds` | `true` | the agent (EM-15 is N/A when it's `false`) |

Every other constant in the scripts carries a comment giving its reason, such as `MIN_EMAIL_HEIGHT = 400` in script 00, because the frames under 400px tall in the TOFU file were subject-line cards, footer components and note panels.

## How the scripts find things

The checklist's [notes for the scripts](../checklist.md#notes-for-the-scripts) set the rules, and testing added these details, which the script comments repeat.

- **Emails.** Script 00 takes frames at an accepted width that are at least 400px tall. A frame at an email width that holds only one other email-width frame of a different width is a presentation wrapper, like the Adobe rebuild's 680px gray frames around a 600px email, and the inner frame is the email. Frames are grouped into emails by name with the size and mode words removed ("P1 Email 1 / Mobile 375" and "P1 Email 1 / Desktop 600"); where no group in a section has both widths, the section's frames are merged into one email, which is how the Adobe worst cases (Frames D, E and F) come out as one email. A frame whose name contains "dark" is marked as a dark-mode view. Script 01 returns each frame's layer count, and a frame with none counts as missing for [EM-01][checks].
- **Modules.** For [EM-03][checks] the modules are the direct layers of the light desktop frame, or of the light mobile frame when the desktop one is empty, as P1's is. When more than half of them are loose text or shapes rather than frames, groups or instances, script 01 returns `notGroupedIntoModules: true`.
- **Notes.** One reader serves every check: a category named for one of the eight kinds, then an annotation in any category that starts "Kind:", then a preset Accessibility annotation that mentions alt. A note on the layer itself counts first, then one on the nearest layer holding it below the email frame, because a layer inside an instance can only carry the instance's notes, and the result names the holding layer. A note whose text starts "Suggestion", or whose text after the kind does ("Alt text: Suggestion: ..."), is marked `(suggestion)`, and the counts keep suggestion-only notes apart, so they count toward Partly at most. For [EM-27][checks], a note that mentions a preheader is a `request` rather than a preheader when it's a suggestion or, with any quoted text taken out, asks for one ("add", "consider", "needs", "should", "missing" and the like, or a question mark). Each preheader found goes to the email it belongs to and comes back in that email's `em27`: the email whose frame holds it, else the email whose name the outermost frame's name contains (TOFU's "P1 Email 1 / Subject Line" card is P1 Email 1's), else the only email in its section. One that fits none is listed in the scope-level `em27.unattributed`.
- **The logo.** A layer named "logo" counts first. When none is named, the script takes an image or vector whose note mentions the logo, then the first image or vector in the top 120px of the frame. The TOFU logo is a vector called "Vector" inside the "Mobile Header" instance, found by its header's dark-mode note.
- **Links.** A text range is a link when it has a hyperlink or a different color from the rest of its text layer, because the Adobe rebuild sets no hyperlinks and shows links by color alone. A whole text layer is a standalone link when it's all hyperlinked, or is short and says something like "unsubscribe", "view in browser" or "read more", or is named "link". Standalone links whose tops sit within 4px of two others form a nav row, which [EM-22][checks] exempts, as it does buttons.
- **Tap targets.** [EM-21][checks] sizes buttons and standalone links, and returns how many are under 24px and how many sit between 24px and the house size. Links inside a run of text are inline targets, which WCAG 2.5.8 exempts, so they're counted under EM-22 and not sized.
- **Headings.** [EM-18][checks] leaves the H1 out of the headline range: the text noted as H1, or, where no note gives a level, the largest heading-like text, topmost on a tie. The result names the layer it left out, and everything EM-18 returns is a flag.
- **The footer.** The outermost layer named "footer", or the module lowest in the frame. For [EM-28][checks] the unsubscribe link is stated in a Link or CTA note on the unsubscribe text, or on the nearest layer holding it, because the developer usually sets the real URL (Steve, 2026-10-06). `em28.unsubNote` returns that note, or null; `unsubLink` still says whether a Figma hyperlink is set, but only as information. On P1 the note found is on the footer instance ([28:96][n28-96]) and lists what the footer needs rather than stating the link, so the agent reads it to decide.
- **Backgrounds.** One walk, merge-build-readiness script 08's: the topmost opaque layer under a layer's center, children first, then the parent's fill. With images off it skips image fills, which gives the color a reader sees with images blocked ([EM-10][checks]); otherwise it stops at an image or gradient and sends the text to a screenshot ([EM-19][checks]). Text counts as over an image for EM-10 when a fifth or more of its box overlaps an image painted below it, at any level and inside instances.
- **Alt text.** [EM-07][checks]'s estimate is the image's width divided by 8.8px a character. Each image row returns `fit` as the alt text's length over the estimate, and the counts split near misses, up to 10% over, as `altFlag` from `altFail` beyond it.

## What the scripts returned

The test scopes were the Adobe Elevate rebuild on page "08 Reference: images off" ([section 106:6][s106-6], with Frames A, B and C, and the worst cases in [section 110:2][s110-2]), the alt-text panels ([section 91:5][s91-5]), and page "04 Emails" with Terry Smith's P1 Email 1 ([section 2:97][s2-97]). The Adobe rebuild has no Dev Mode annotations at all, because its notes are numbered callouts drawn on the canvas, so every check that reads notes finds nothing there; on a real run that's Couldn't check, and the report suggests the annotation schema.

### The Adobe rebuild's known faults

The rebuild's callouts list the faults the skill should find. Four of the five were found by script, and the fifth can't be checked in Figma, as expected.

| Known fault | Found? | What the scripts returned |
| --- | --- | --- |
| Links shown by color alone (callouts 14 and 28) | Yes, [EM-22][checks] | In each of Frames A, B and C, 2 inline links ("this link" and "unsubscribe") and 2 of 3 standalone links ("Read now", "Go to Marketo Engage") are colored with no underline and no hyperlink set; only "View in browser" is underlined. Frame F, the Gmail projection, has the same with `#8ab4f8`. |
| 11px gray `#959595` footer text at about 3 to 1 (callout 16) | Yes, [EM-19][checks] | `#959595` on `#f5f5f5` at 11px is 2.75 to 1, on 4 layers in each frame. Frame E, the Outlook dark projection, gives `#8a8a8a` on `#2e2e2e` at 3.93 to 1. |
| CTAs as small text links (callout 15) | Yes, [EM-21][checks] and [EM-26][checks] data | No buttons in any frame. The two CTAs are text links 26px tall, between 24px and the 44px house size, and "View in browser" is 16px tall, under the 24px minimum, so EM-21 now fails it. |
| The Try it card's heading nearly invisible in dark mode (callout 13) | Yes, [EM-19][checks] | In Frame B, "Try it" ([106:47][n106-47]) is `#ffffff` on the card's `#f5f5f5` at 1.09 to 1. |
| The hero has no height in the HTML (callout 20) | No, as expected | It's in the code, not the design, so it belongs under "What the skill can't check in Figma". |

The scripts also found faults the callouts don't list. The 300px preview area of the desktop frame holds only the logo and the top of the hero ([EM-04][checks]). The phone frame sits to the right of the desktop one ([EM-02][checks]). The desktop frame has 19 direct layers, 13 of them loose, so it isn't grouped into modules ([EM-03][checks]). The blue links on the gray Try it card are 4.17 to 1 ([EM-19][checks]). The email backgrounds are pure `#ffffff` in Frame A and pure `#000000` in Frame B ([EM-15][checks]). The dark frame's logo uses the same image as the light one, so no reversed logo is drawn ([EM-13][checks] data). The only font is Source Sans 3, a brand font, and the caption "Font shown: Source Sans 3 in place of Adobe Clean" was returned as a possible fallback note ([EM-17][checks]). With the H1 left out, the 22px section headings are inside the house range, so [EM-18][checks] has no flags there. None of the 12 images has an export setting ([EM-29][checks]).

### The P1 findings

P1 Email 1 is the only test scope with Dev Mode notes (12 of them, 4 starting "Suggestion"), and these are the findings the scripts must keep returning.

| Finding | Check | What the scripts returned |
| --- | --- | --- |
| The footer's white text sits on a background image | [EM-10][checks] | "www.mergeworld.com" and "Unsubscribe" overlap the footer's background image inside the footer instance, and with images off they're `#ffffff` on `#ffffff`, 1 to 1. Text contrast sends both to a screenshot. |
| "Unsubscribe" has no hyperlink | [EM-28][checks] | `unsubLink: "no hyperlink"` on the "Unsubscribe" layer inside the footer instance ([28:96][n28-96]). |
| No sender's address, privacy or preferences link | [EM-28][checks] | `address`, `privacy` and `preferences` are all null. |
| No mobile-behavior notes | [EM-03][checks] | 8 modules in the mobile frame, none noted, and no note on the frame. |
| The desktop frame is empty | [EM-01][checks] | [2:99][n2-99] returns `layers: 0`, so the email has no desktop frame. |

### Each script on each scope

| Script | Adobe rebuild ([106:6][s106-6] and [110:2][s110-2]) | P1 Email 1 ([2:97][s2-97], page 04) | Alt-text panels ([91:5][s91-5]) |
| --- | --- | --- | --- |
| 00 | One email per section: Frames A, B (dark) and C, unwrapped from their 680px frames; and D, E (dark) and F (dark), merged by section. The notes columns and the likelihood cards were skipped. | Page 04 gave 5 emails, each a mobile and a desktop frame paired by name. Ten frames were skipped, among them the subject-line card ([27:16][n27-16]), the components and the footer studies. | Four 375px mobile-only "emails", which are reference panels; the agent would correct this. |
| 01 `layout` | As in the faults table. No heading-level notes and 4 heading-like texts per frame; the 36px H1 is the one left out of EM-18. Footer: unsubscribe and address found in A, B, D and E, with no hyperlink on "unsubscribe"; none in F, because Gmail's clip hides the footer. Frame D's 11px blocked-image labels have automatic line height, flagged under EM-18. No merge tags, so Gmail's "[Message clipped]" no longer matches the merge-tag pattern. | Mobile on the left. Fonts Inter and Fraunces, no fallback note. One H1 and three H2s in order; the three 30px H2s are flagged against the 20 to 22px range and the H1 is left out. One button, "Watch the story.", 179 by 44px, and two footer links 23px and 17px tall, both under 24px. The only preheader note is a request on the subject-line card. One content-field note and one merge tag, `{YourName}`, on the subject-line card. | Each panel is 3 layers, 2 of them loose, so `notGroupedIntoModules` is true; the agent would treat the panels as reference material. |
| 01 `images` | 12 image layers in A, B and C and 7 in D, E and F, with no alt, dark-mode or export notes and no background color under any image. No text over images. Frame D draws its blocked images as white boxes with gray outlines, so its "logos" are those boxes, and its two red X marks count as icons. | 3 images: the hero photo, whose alt note is a suggestion to mark it decorative; the footer's background image; and the LinkedIn icon. The logo was found through its header's dark-mode note, which names a reversed logo. The CTA button `#003c34` on white is 12.38 to 1. The frames' `#ffffff` backgrounds count for [EM-15][checks]. | First run: an error, "no such property 'opacity' on SECTION node", when the background walk reached the panels' section; fixed and run again cleanly. Panel 3's drawn alt text fails contrast, as drawn. Panel 4's "Red X icon" is returned as white on white, a false result (see Known limitations). |
| 02 | Baseline and second run over pages 08 and 04 together: 674 layers, 12 annotations, 9 variables, hash `d77a5283` both times, `intact: true`. | Same run. | Same run. |

Script 00 was run readable on [106:6][s106-6] and minified on all four scopes. Both parts of script 01 were run readable and minified on P1, and minified as the full script on every scope. After the variable-mode pass and the suggestion test went back in, both parts were run again minified on P1 and [106:6][s106-6], with results identical to the earlier runs; the 106:6 `layout` rerun used a copy with the `images` part left out. The panels' `images` run after the section fix also used a copy with the `layout` block left out, and the [110:2][s110-2] and panels runs came before the variable-mode pass went back, which no color in the TOFU file uses.

After the audit fixes of 2026-10-05, both parts of script 01 were run readable and then minified on all five emails on page 04 (scope 2:5), and minified on [106:6][s106-6]; script 00's no-scope result was run, and the color count was checked on panel 4's icon. The results were the same as before apart from the new fields: P1 Email 1's `em27` holds the subject-line card's request (found 0, total 1), the other four emails' `em27` are empty, and `em27.unattributed` is empty; script 00 with no scope and nothing selected returns `currentPage: "0:1"` and `pageCount: 10`. The 106:6 `layout` run and the readable runs used copies with the other part left out, which is skipped at run time. The fingerprint afterwards still matched the original baseline.

### The variable-mode pass, on Andrew's Abbott library

No color in the TOFU file is bound to a variable, so the pass over every mode was tested read-only on Andrew's Abbott library (file key `0VTZx0ZXc08vCIjdzb8Xza`), whose "Semantic" collection has two modes, Libre and Libre Duo. The `images` part ran cleanly, minified, on the Patient Journey's "Journey_Content" frame ([35550:2791][a35550-2791]), 15 text layers with no failing pairs, in 620 ms and under 2 KB. A probe with the same helpers showed both modes resolving through their aliases: "Understand glucose" ([35550:2800][a35550-2800]), bound to `color/text/primary`, is `#222731` in both, 14.97 to 1 on white. The two modes resolve to the same colors in the layers tested, so the test shows the pass runs and labels each mode, not that it finds a mode-only failure. A scan of all 46 pages found the file's own "Email" collection (modes Desktop and Mobile) bound to no layer.

## What use_figma can and can't read

These are the facts the tests established for this skill; the ones merge-build-readiness found are in its [scripts README](../../merge-build-readiness/scripts/README.md).

- **Image bytes can be read, but transparency can't be judged from them.** `figma.getImageByHash(hash).getBytesAsync()` works, at 0.2 to 0.4 seconds an image. Every PNG in the file is RGBA, including an opaque 4096px photo, and the plug-in sandbox can't decode the pixels, so [EM-16][checks] stays a screenshot judgment. Script 01 now reads bytes only for images that might be illustrations, to rule out JPGs and PNGs without an alpha channel, and stops after 8 seconds.
- **Text segments give everything the type and link checks need:** `hyperlink`, `textDecoration`, fills, font, size, weight, line height and text case. Hyperlinks are rare: the only one in the test scopes is on P1's "www.mergeworld.com".
- **A section has fills but no `opacity`,** and reading `opacity` on one throws, so the background walk checks for the property first.
- **`figma.currentUser` is unavailable**, as merge-build-readiness found, so script 00 no longer asks for it.
- **The rendered width of alt text can't be measured**, because no alt text is drawn; [EM-07][checks] stays an estimate. A drawn text layer's width can be read, which is how panel 2's 46-character alt text was measured at 362px.

## Traps found while testing

Three of these broke a result silently, and one broke a script outright, so they're worth knowing for any Figma skill.

- **A layer inside an instance isn't the same object twice.** A text layer found by `findAllWithCriteria` inside an instance isn't `===` to the same layer in its parent's `children`, so `parent.children.indexOf(layer)` returned -1 and every sibling under it was skipped; the P1 footer's white text then scored 1 to 1 against the frame's white instead of going to a screenshot. All scripts here compare layers by `id`, in `indexOf`, in sets and in parent walks. merge-build-readiness scripts 08 and 09 were fixed the same way on 2026-10-05 (see [its scripts README](../../merge-build-readiness/scripts/README.md#what-use_figma-can-and-cant-read)).
- **rjsmin strips the spaces in a regex literal that directly follows `=>`.** It reads the slash as division, so `x => /knock ?out/i.test(x)` became `/knock?out/`. Every regex in these scripts is therefore a named constant, and a scratch check confirmed that all 38 regex literals in the three scripts survive minification unchanged.
- **A line separator typed as an escape in a `use_figma` call becomes a real line separator**, which breaks the script with "unexpected line terminator in regexp". The scripts build the separators with `String.fromCharCode(0x2028)` instead, which also turns the line separators in TOFU's layer names into " / " in every result. The same character typed into a comment breaks a script too, because it ends the comment, so the comments spell it out in words.
- **A walk up the tree can reach a section.** The background walk read `opacity` on every parent, which throws on a section; the alt-text panels, whose frames sit straight in a section with nothing opaque behind the logo search, were the first scope to reach one.

## Known limitations

These are faults in how the scripts read a file that testing turned up and that stay for now, with what the report should do about each.

- **[EM-14][checks] can read a two-color icon by its inner color.** An icon with no fill of its own takes the first solid fill inside it, so panel 4's "Red X icon" ([91:44][n91-44]) was read as its white X rather than its red disc, and the white was then measured against the white behind the icon, a false 1 to 1. Each EM-14 row now ends with how many distinct solid colors the icon draws with, and panel 4's icon reports 3 (`#ffffff`, `#a0a0a0` and `#d0021b`), so the report should confirm any row with more than one color from a screenshot.
- **[EM-27][checks] detects preheader requests by a word list.** A note that mentions a preheader counts as a request, not a preheader, when it's a suggestion or uses words such as "add", "consider", "needs", "should" or "missing" outside quoted text, so a real preheader written without quotes that happens to use one of those words is missed. The report should suggest naming the preheader's text layer "preheader", which the script always counts.

## Still to settle

Each of these is a case where testing showed a gap, or where cutting the scripts down dropped something, with a proposed change for Steve. None of them has been made to [checklist.md](../checklist.md). The items checklist 0.2 settled on 2026-10-05 (EM-01's wrappers and empty frames, EM-03's modules, EM-07's near misses, EM-10's overlap rule, EM-12's holding layer, EM-13's logo fallbacks, EM-18's H1, EM-21's hard minimum, EM-22's standalone links, EM-27's requests, and suggestion notes) are now in the scripts and have been removed from this list, and the merge-tag pattern that had been tested only in Node has now run in Figma. Steve's two rulings of 2026-10-05, putting back the variable-mode pass and marking "Kind: Suggestion" notes, are in the scripts too.

- **The prototype-interaction targets are gone.** Script 05 counted any layer with a prototype interaction as a tap target; EM-21's rule covers buttons and linked text, and no test frame had an interaction on 2026-10-05, so script 01 leaves them out.
- **[EM-16][checks]'s candidates are a little broader.** The PNG transparency scan for a `tRNS` chunk is gone: a PNG of type 0 or 2 now counts as opaque, a palette PNG counts as possibly transparent, and only candidates have their bytes read. On the test scopes the candidate list didn't change.
- **[EM-16][checks] can't find transparent images by script.** Script 01 lists every image that isn't a logo or icon, has no solid fill of its own and isn't certainly opaque, as candidates for a screenshot, because the bytes can't show transparency.
- **[EM-07][checks] has no test case in the file.** The alt-text panels draw their alt text as text layers, and no image carries real alt text in a note; the parsing of quoted and "Alt text:" notes was tested in Node with mock annotations instead. The small file with deliberate faults at step 5 of the plan should include images with short, long and decorative alt notes, and one note in the "Kind: Suggestion" form, which so far has been tested only in Node with mock annotations.

[checks]: ../checklist.md#all-checks-at-a-glance
[s106-6]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=106-6
[s110-2]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=110-2
[s91-5]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=91-5
[s2-97]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=2-97
[n106-47]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=106-47
[n27-16]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=27-16
[n2-99]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=2-99
[n28-96]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=28-96
[n91-44]: https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/MERGE-TOFU-Marketing-Emails---Q4-2026?node-id=91-44
[a35550-2791]: https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35550-2791
[a35550-2800]: https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35550-2800

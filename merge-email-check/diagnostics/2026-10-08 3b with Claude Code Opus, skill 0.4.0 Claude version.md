# Case 3b, with the skill 0.4.0 (Claude Code version), in Claude Code, 2026-10-08

We ran the installed skill at `~/.claude/skills/merge-email-check/` (version 0.4.0, the Claude Code version) in Claude Code on Opus 5.5, for the request `/merge-email-check https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=2-3`, following its `SKILL.md` step by step. The answer to the opening question was `go`, which accepted every default: the emails found, MERGE's house numbers, one version for all audiences, and the report in the chat only. The run took about 6 minutes from start to finish: it started at 13:31:45 EDT and the last Figma call (the second fingerprint) returned at about 13:37:20, with the report written straight after. The file was never changed: the second fingerprint came back `intact: true`.

## Run log

We loaded `figma:figma-use` with the Skill tool before the first `use_figma` call, and loaded the schemas for `use_figma` and `get_screenshot` in one ToolSearch call. Every `use_figma` call passed `skillNames` as `figma-use,merge-email-check`, as the skill says. Each script was passed whole, comments included, with every copy of each placeholder replaced, comments included. `use_figma` doesn't report a result size, so the sizes below are approximate character counts of the returned JSON; `get_screenshot` reports pixel sizes.

| # | Call | What it was for | Result |
| --- | --- | --- | --- |
| 1 | `use_figma`, script 00 | Step 1: find the emails, `'__SCOPE_ID__'` = `2:3`, `__SETTINGS__` = `null` | Succeeded, about 0.5 KB. Scope was page `2:3` "02 Control"; one email, "Control" (section `10:2`), with frames `10:3` (mobile, 375x1674), `10:55` (desktop, 600x1538) and `10:107` (mobile, dark, 375x1674). No skipped or presentation frames. 108 ms. |
| 2 | `get_screenshot`, `10:2` | Step 1: check script 00's grouping against the canvas | Succeeded, 345x1024 (original 1215x3768). The section holds the three frames and a caption; grouping confirmed, nothing corrected. |
| 3 | `use_figma`, script 03 | Step 2: baseline fingerprint, `__SCOPE_IDS__` = `["2:3"]`, `__BASELINE__` = `null`, `__ADDED__` = `0` | Succeeded, about 0.1 KB: `{"nodes":123,"hash":"cc5314b5","annotations":75,"variables":0,"variableHash":"0","styles":0,"styleHash":"0","pages":4}`. |
| 4 | `use_figma`, script 01 | Step 3: layout read | Succeeded, about 7 KB, 1,225 ms. `notes.matched` 75 of 75. |
| 5 | `use_figma`, script 02 | Step 3: images, logo, icons and color | Succeeded, about 6 KB, 1,129 ms. 9 images, all with alt, dark-mode notes, backgrounds and PNG or JPG export. |
| 6 | `get_screenshot`, `10:55`, maxDimension 2048 | Step 3: desktop frame, for EM-04, EM-08, EM-24, EM-26 | Succeeded, 600x1538 (rendered at 1x; the original is 600x1538). |
| 7 | `get_screenshot`, `10:3`, maxDimension 2048 | Step 3: mobile frame | Succeeded, 375x1674 (1x). |
| 8 | `get_screenshot`, `10:107`, maxDimension 2048 | Step 3: dark mobile frame, for EM-13, EM-14, EM-16 | Succeeded, 375x1674 (1x). |
| 9 | `get_screenshot`, `10:65`, maxDimension 1200 | Step 3: desktop hero, for EM-09 and EM-31 | Succeeded, 600x300 (1x, not 2x). |
| 10 | `get_screenshot`, `10:41`, maxDimension 480 | Step 3: light illustration, for EM-09, EM-16, EM-31 | Succeeded, 240x180 (1x). |
| 11 | `get_screenshot`, `10:145`, maxDimension 480 | Step 3: the same illustration in the dark frame, for EM-16 | Succeeded, 240x180 (1x). |
| 12 | `get_screenshot`, `10:5`, maxDimension 480 | Step 3: light logo, for EM-13 | Succeeded, 120x36 (1x). |
| 13 | `get_screenshot`, `10:109`, maxDimension 480 | Step 3: dark logo, for EM-13 | Succeeded, 120x36 (1x). |
| 14 | `use_figma`, script 03 | Step 6: second fingerprint, `__BASELINE__` = call 3's result, `__ADDED__` = `0` | Succeeded, about 0.2 KB: `intact: true`, `changed: []`, every value identical to the baseline. |

No call failed and no error was returned. Calls 2 and 6 to 8 ran in parallel, as did calls 9 to 13.

Places where the instructions were unclear, or where we had to guess:

- **Screenshots at 2x.** Step 3 asks for screenshots "at 2x or more if you can". `get_screenshot` only takes `maxDimension`, and raising it above the node's own size still returned a 1x image (calls 6 to 13), so no screenshot was 2x. The skill doesn't say how to get 2x with this tool, or whether `use_figma`'s `node.screenshot({ scale: 2 })` is allowed for it.
- **Checking the grouping "against the canvas" in step 1.** Step 1 asks us to check script 00's grouping against the canvas, but screenshots are only listed in step 3. We took one screenshot of the section in step 1 to do it; the skill doesn't say whether that's expected.
- **Placeholders inside comments.** The rule "every copy of each" placeholder includes copies in comments, which turns comment lines into odd text (script 03's header reads "Run it first with null null", or, in the second run, with the whole baseline JSON). It's harmless, but it isn't obvious whether the rule meant comments too; we followed it literally.
- **The opening message in a run with no reply.** The skill says to send one opening message and then treat the answers as settled. In this test the answer `go` was given in advance, so the opening message was composed but there was no separate turn to send it in.
- **EM-25 with personalization but one version.** With the default answer "no versions for different audiences", EM-25 is N/A, but the file has a merge tag (`{{lead.First Name}}`) and three dynamic-content and three content-field notes. The rule says to "list merge tags found" only in the Otherwise branch, so we gave N/A and named the merge tag in the evidence; it's not clear whether a merge tag alone should count as a version.
- **"Fix these first" when nothing failed.** The template has no wording for an email with no Fail or Partly, and says to use only its sections. We kept the section with one sentence saying there's nothing to fix.
- **Images seen only in frame screenshots.** EM-09 and EM-31 top out at Partly "when some weren't screenshotted". The mobile and dark hero images (`10:13`, `10:117`) and the mobile illustration (`10:41` was shot, its desktop copy `10:93` wasn't) were seen only in the frame screenshots. We counted them as looked at, because they are copies of art we shot on its own; the skill doesn't say whether a frame screenshot counts.
- **Which icons are meaningful (EM-20).** The three list icons are bullets beside text. We treated them as decorative-to-supporting; it made no difference, because every icon met 3 to 1 anyway.

## Report

````markdown
# Email check: Control

The Control email is ready to build: all 31 checks pass or don't apply, so there's nothing to fix first. Before build, confirm the hero alt text once the final photo replaces the placeholder art (EM-31).

Checked 2026-10-08 with merge-email-check 0.4.0. Scope: 2:3. Emails: Control. House numbers: MERGE's.

## Scorecard

| Check | Rank | Result | Evidence |
| --- | --- | --- | --- |
| EM-01 Each email has a mobile and a desktop frame at accepted widths | Must | Pass | A 375px mobile frame ([10:3](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-3)) and a 600px desktop frame ([10:55](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-55)), plus a 375px dark-mode frame ([10:107](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-107)), each with 7 layers. |
| EM-02 The mobile frame sits to the left of the desktop frame | Should | Pass | Mobile at x 80, desktop at x 535. |
| EM-03 Each module says how it behaves at mobile width | Should | Pass | All 7 modules of the desktop frame carry a Mobile behavior note. |
| EM-04 The main message and primary CTA sit in the preview area | Should | Pass | In the desktop frame's first 300px: the preheader, the headline at 138px ([10:60](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-60)) and the "Start planning" button at 232px ([10:62](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-62)). |
| EM-05 The email's length suits a scroll | Could | Pass | The desktop frame is 1,538px tall, well under about 4,500px. |
| EM-06 Every image has alt text or is marked decorative | Must | Pass | 9 of 9 images have an alt note, such as the hero, "Planner open beside a cup of coffee" ([10:65](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-65)). |
| EM-07 Alt text fits on one line across its image | Should | Pass | Every alt text fits its image by the estimate; the tightest is the mobile hero at 35 of about 42 characters ([10:13](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-13)). This is an estimate. |
| EM-08 Headlines, offers and buttons are live text | Must | Pass | The headline ([10:60](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-60)), the section headings and both buttons are text layers; the screenshots show no words in the images. |
| EM-09 No text sits inside an image, apart from the logo | Should | Pass | The hero ([10:65](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-65)) and the illustration ([10:41](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-41)) hold no words; their copies in the other frames were seen in the frame screenshots. |
| EM-10 Text over an image still reads on the color behind it | Must | Pass | No text sits over an image in any frame. |
| EM-11 Every image has a background color behind it | Should | Pass | 9 of 9 images have a solid color behind them, such as #e8e1d6 under the hero. |
| EM-31 Alt text describes the image it's on | Should | Pass | The illustration's "Calendar and clock" matches it. The hero is placeholder art, so its alt text is a flag below. |
| EM-12 Every image says how it behaves in dark mode | Should | Pass | 9 of 9 images carry a Dark mode note. |
| EM-13 The logo has a reversed version, with no outline or plate | Should | Pass | The logo was found by its layer name. Its note names logo-reversed.png ([10:57](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-57)), and the dark frame shows the reversed logo with a white wordmark and no outline or plate ([10:109](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-109)). |
| EM-14 Icons are one color that works on light and dark | Should | Pass | 3 icons per frame, each one orange that meets 3 to 1 on the light background and on dark. |
| EM-15 No background is pure white or pure black | Should | Pass | No pure #FFFFFF or #000000 fills; the backgrounds are #faf7f2 and, in dark mode, #1c1c1c. |
| EM-16 Illustrations read on a dark background too | Should | Pass | The calendar-and-clock illustration reads clearly in the dark frame ([10:145](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-145)); we looked at the dark frame itself. |
| EM-17 A brand font names its fallback | Should | Pass | The only family is Arial, which is web-safe (54 text layers). |
| EM-18 Type follows the house defaults | Could | Pass | Section headings are 22px, body line height is in range, and there's no centered body text or long all-caps text. |
| EM-19 Text contrast meets WCAG 2.2 AA | Must | Pass | 54 text layers across the light and dark frames, with no failing pair and none left to check by screenshot. |
| EM-20 Button edges and meaningful icons meet 3 to 1 | Must | Pass | The buttons' fill contrasts 6.24 to 1 with the light background ([10:62](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-62)) and 8.09 to 1 with the dark one ([10:114](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-114)); every icon meets 3 to 1. |
| EM-21 Tap targets are at least 24px, and meet the house size | Must | Pass | All 15 buttons and links across the three frames are at least 44px tall. |
| EM-22 Text links are underlined | Must | Pass | The inline link "Read the planning guide" ([10:97](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-97)) and the footer links are underlined. |
| EM-23 There's one H1, and heading levels go in order | Should | Pass | One H1 ([10:60](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-60)) then three H2s in each frame, with no skipped level. |
| EM-24 Link and button text says where it goes | Should | Pass | "Start planning", "Read the planning guide", "Unsubscribe", "Manage preferences" and "Privacy policy" all make sense on their own. |
| EM-25 Parts that change by audience are marked | Could | N/A | The email has one version. Its greeting uses the merge tag {{lead.First Name}} ([10:61](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-61)), which carries dynamic-content and content-field notes. |
| EM-26 There's one primary CTA, as a button, repeated rather than varied | Should | Pass | "Start planning" leads as a button and repeats with the same words ([10:62](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-62), [10:98](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-98)). |
| EM-27 A written preheader is shown | Should | Pass | A preheader text layer in each frame, such as [10:58](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-58). |
| EM-28 The footer has an unsubscribe link and the sender's address | Must | Pass | The unsubscribe link's note says the developer sets the Marketo URL ([10:104](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-104)), and the address is shown ([10:102](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-102)); preferences and privacy links are there too. |
| EM-29 Images export as JPG or PNG | Should | Pass | All 9 images export as PNG or JPG. |
| EM-30 Image slices stay under the house height | Could | Pass | No image is taller than 1,500px; the tallest is 300px. |

## Fix these first

Nothing failed or partly passed, so there's nothing to fix before build.

## For the designer to judge

The hero is placeholder art, a soft gradient with an empty dark box, so its alt text "Planner open beside a cup of coffee" doesn't describe it yet. Confirm the alt text once the final photo is in, and check the empty box isn't a leftover (EM-31; [10:65](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-65), [10:13](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-13), [10:117](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-117)).

## Checked only in the build

This design check can't see the HTML or the send: its weight against Gmail's clip at about 102KB, Outlook-only code, the `alt` attributes, the dark-mode code, tracked links, and how each mail app renders. Check those in the build and on a real test send, with images off, from a mailbox that isn't on any safe-sender list.

## What couldn't be checked

Every check could be checked.
````

After the report, the skill offered `/merge-email-check-plan`, for a remediation plan, and `/merge-email-check-annotate`, to put the findings on the layers as Dev Mode annotations.

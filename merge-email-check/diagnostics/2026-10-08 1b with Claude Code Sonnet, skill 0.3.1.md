Model: claude-sonnet-5-5

# Email check: Adobe Elevate email, why it works

The email isn't ready to build yet. Text contrast, tap targets and link underlines fail for every frame, so fix those first; then bring the preview area, the dark-mode logo and the footer note up to standard. Six checks couldn't be judged because the file has no Dev Mode notes, so adding the eight note kinds would let the next run cover them.

Checked 2026-10-08 with merge-email-check 0.3.1. Scope: 106:6 (the section "Adobe Elevate email: why it works"; the link you gave pointed at the sibling section 110:2, whose frames are projections of the email inside mail-app frames, so they were left out and this section's email was checked instead). Emails: Adobe Elevate email: why it works (desktop light 106:11, desktop dark 106:37, phone light 106:67). House numbers: MERGE's. One version for all audiences.

## Scorecard

| Check | Rank | Result | Evidence |
| --- | --- | --- | --- |
| EM-01 Each email has a mobile and a desktop frame at accepted widths | Must | Pass | One 375px mobile frame and 600px desktop frames, all with layers. |
| EM-02 The mobile frame sits to the left of the desktop frame | Should | Fail | The phone frame ([106:67](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-67)) is at x 1780, right of the desktop frames at x 220 and 1020. |
| EM-03 Each module says how it behaves at mobile width | Should | Couldn't check | No Dev Mode notes in the file; 0 of 19 layers carry one. |
| EM-04 The main message and primary CTA sit in the preview area | Should | Fail | The first 300px of the desktop frame hold only the logo ([106:4](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-4)) and the hero image ([106:2](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-2)); the headline starts below it. |
| EM-05 The email's length suits a scroll | Could | Pass | 2,100px desktop, 2,159px phone, under 4,500px. |
| EM-06 Every image has alt text or is marked decorative | Must | Couldn't check | No alt or decorative notes exist in the file. |
| EM-07 Alt text fits on one line across its image | Should | Couldn't check | No alt notes to measure. |
| EM-08 Headlines, offers and buttons are live text | Must | Pass | The headline ([106:12](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-12)), links and red sign-off band are text layers; the hero has no words in it. |
| EM-09 No text sits inside an image, apart from the logo | Should | Partly | The module image ([106:5](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-5)) shows a laptop with a document on it; its tiny text can't be read, so it's possible text. Other images: none. |
| EM-10 Text over an image still reads on the color behind it | Must | Pass | No text overlaps an image. |
| EM-11 Every image has a background color behind it | Should | Fail | 0 of 12 image layers across the three frames have one, such as the hero ([106:2](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-2)). |
| EM-12 Every image says how it behaves in dark mode | Should | Couldn't check | No dark-mode notes in the file. |
| EM-13 The logo has a reversed version, with no outline or plate | Should | Fail | The dark frame ([106:37](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-37)) shows the same logo image as the light frame ([106:38](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-38)), red on black, and no note names a reversed one. Logo found by layer name. |
| EM-14 Icons are one color that works on light and dark | Should | N/A | No icons. |
| EM-15 No background is pure white or pure black | Should | Fail | All 3 frames: [106:11](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-11) and [106:67](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-67) are #ffffff, [106:37](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-37) is #000000. |
| EM-16 Illustrations read on a dark background too | Should | Pass | Judged from the dark frame: the hero and module art hold up on black. |
| EM-17 A brand font names its fallback | Should | Partly | One note says Source Sans 3 stands in for Adobe Clean, but it names no fallback font for the build and no frame shows the email in a web-safe font. |
| EM-18 Type follows the house defaults | Could | Pass | No flags: section headings are 22px, body line height is in range, nothing centered or in long capitals. |
| EM-19 Text contrast meets WCAG 2.2 AA | Must | Fail | #959595 on #f5f5f5 at 11px is 2.75 (needs 4.5) on the footer text, 4 layers per frame ([106:32](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-32)); #1473e6 on #f5f5f5 is 4.17 on "Go to Marketo Engage" ([106:20](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20)) and the unsubscribe link ([106:33](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-33)); in the dark frame, white "Try it" on #f5f5f5 is 1.09 ([106:47](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-47)). |
| EM-20 Button edges and meaningful icons meet 3 to 1 | Must | N/A | No buttons or meaningful icons; the red sign-off band is live text on a fill, not a button. |
| EM-21 Tap targets are at least 24px, and meet the house size | Must | Fail | "View in browser" is 16px tall in every frame ([106:34](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-34)); "Read now" ([106:16](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16)) and "Go to Marketo Engage" ([106:20](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20)) are 26px, under the 44px house size. |
| EM-22 Text links are underlined | Must | Fail | 4 of 5 links per frame have no underline: "Read now" ([106:16](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16)), "Go to Marketo Engage" ([106:20](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20)), "this link" ([106:28](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-28)), "unsubscribe" ([106:33](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-33)). |
| EM-23 There's one H1, and heading levels go in order | Should | Couldn't check | No heading-level notes; 4 headings are styled as headings but carry no level ([106:12](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-12), Learn it, Try it, Pro Tip). |
| EM-24 Link and button text says where it goes | Should | Partly | 2 of 5: "this link" ([106:28](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-28)) and "Read now" ([106:16](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16)) say nothing out of context. |
| EM-25 Parts that change by audience are marked | Could | N/A | One version of the email; no merge tags found. |
| EM-26 There's one primary CTA, as a button, repeated rather than varied | Should | Fail | No button; the two calls to action are plain text links to different places, "Read now" ([106:16](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16)) and "Go to Marketo Engage" ([106:20](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20)). |
| EM-27 A written preheader is shown | Should | Fail | No preheader text or note found. Suggest a text layer named "preheader". |
| EM-28 The footer has an unsubscribe link and the sender's address | Must | Partly | Both are there ([106:33](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-33)), but the unsubscribe has no Link or CTA note saying where it goes or that the developer sets it. No privacy or preferences link (not counted in the result). |
| EM-29 Images export as JPG or PNG | Should | Partly | 12 of 12 image layers have no export setting. |
| EM-30 Image slices stay under the house height | Could | Pass | Tallest image is 400px. |
| EM-31 Alt text describes the image it's on | Should | Couldn't check | No alt text in the file to compare with the images. |

## Fix these first

1. **Raise text contrast** (EM-19, Must). The footer text is 2.75 to 1 and the blue links on light gray are 4.17 to 1, so some readers can't read them; in dark mode the white "Try it" heading nearly vanishes on the card, which stays light gray. Examples: [footer text](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-32), [Try it in dark mode](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-47), [Go to Marketo Engage](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20).
2. **Make the links bigger to tap** (EM-21, Must). "View in browser" is 16px tall and the two main links are 26px, against a 44px house size. Examples: [View in browser](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-34), [Read now](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16).
3. **Underline the text links** (EM-22, Must). Four of five links are told apart by color alone. Examples: [this link](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-28), [unsubscribe](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-33).
4. **Note where the unsubscribe link goes** (EM-28, Must). The footer has the link and the address, but the developer needs a Link or CTA note on the unsubscribe. Example: [unsubscribe](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-33).
5. **Put the message and one action in the first 300px** (EM-04, Should) and make the action a button that repeats the same words (EM-26, Should). Examples: [logo](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-4), [hero](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-2), [Go to Marketo Engage](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20).
6. **Add a reversed logo for dark mode** (EM-13, Should), and move off pure white and pure black backgrounds (EM-15, Should). Examples: [dark logo](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-38), [dark frame](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-37).
7. **Add a preheader** (EM-27, Should) in a text layer named "preheader", and a background color behind each image (EM-11, Should). Example: [hero](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-2).
8. **Smaller fixes** (Should): name a fallback font (EM-17), reword "this link" and "Read now" (EM-24), set JPG or PNG export on the images (EM-29), and move the phone frame to the left of the desktop frames (EM-02). Examples: [this link](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-28), [phone frame](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-67).

## For the designer to judge

The module image ([106:5](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-5)) may carry readable text inside the laptop picture (EM-09); the text was too small to read in a screenshot, so please confirm.

## Problems no check covers

The dark frame keeps the "Try it" card and the footer light gray on a black email. A proposed check: cards and bands that stay light in dark mode need text that still meets contrast, so the problem is caught by name and not only through EM-19.

## Checked only in the build

This design check can't see the HTML or the send: its weight against Gmail's clip at about 102KB, Outlook-only code, the `alt` attributes, the dark-mode code, tracked links, and how each mail app renders. Check those in the build and on a real test send, with images off, from a mailbox that isn't on any safe-sender list.

## What couldn't be checked

EM-03, EM-06, EM-07, EM-12, EM-23 and EM-31 need Dev Mode notes (mobile behavior, alt text, dark mode, heading level), and the file has none; the eight note kinds are alt text, decorative image, heading level, link or cta, dark mode, dynamic content, mobile behavior and content model field. Text inside small screenshots, such as the module image's document, couldn't be read.

Model: claude-sonnet-5-5

# Email check: Adobe Elevate email: why it works

This email isn't ready to build yet. The first thing to do is fix the text contrast and the plain-text links: the gray footer text, the blue links on the gray card and the white "Try it" heading in the dark frame all fall below WCAG 2.2 AA, and four of the five links have no underline. After that, give the email one real CTA button and a preheader, and move the headline into the first 300px.

Checked 2026-10-08 with merge-email-check 0.3.1. Scope: 106:6. Emails: Adobe Elevate email: why it works (desktop light, desktop dark and mobile light frames). House numbers: MERGE's.

## Scorecard

Here's every check, with one result for the email. The file has no Dev Mode notes, so the checks that depend on notes couldn't be judged.

| Check | Rank | Result | Evidence |
| --- | --- | --- | --- |
| EM-01 Each email has a mobile and a desktop frame at accepted widths | Must | Pass | Desktop 600px ([light](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-11), [dark](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-37)) and mobile 375px ([mobile](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-67)). |
| EM-02 The mobile frame sits to the left of the desktop frame | Should | Fail | The mobile frame ([mobile](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-67)) is at x 1780, to the right of both desktop frames ([light](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-11) at x 220, [dark](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-37) at x 1020). |
| EM-03 Each module says how it behaves at mobile width | Should | Couldn't check | The file has no Dev Mode notes (0 read), so there's nothing to judge. See "What couldn't be checked". |
| EM-04 The main message and primary CTA sit in the preview area | Should | Fail | The first 300px of the desktop frame holds only the logo ([logo](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-4)) and the hero image ([hero](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-2)). The headline starts near y 540. The mobile frame is the same. |
| EM-05 The email's length suits a scroll | Could | Pass | Desktop 2,100px and mobile 2,159px, under the 4,500px house length. |
| EM-06 Every image has alt text or is marked decorative | Must | Couldn't check | No alt or decorative notes exist to read (0 of 12 image layers across the three frames). |
| EM-07 Alt text fits on one line across its image | Should | Couldn't check | There are no alt notes to measure. |
| EM-08 Headlines, offers and buttons are live text | Must | Pass | The headline, body, links and red banner are text layers in all three frames; the only images are the logos, hero and module picture. |
| EM-09 No text sits inside an image, apart from the logo | Should | Partly | The module picture ([desktop](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-5), [mobile](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-75)) is a laptop screenshot with small words in it that I can't read at this size; possible text. The hero has none. |
| EM-10 Text over an image still reads on the color behind it | Must | Pass | No text layer overlaps an image. |
| EM-11 Every image has a background color behind it | Should | Fail | 0 of 12 image layers have a color behind them, for example the [hero](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-2) and [module picture](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-5). |
| EM-12 Every image says how it behaves in dark mode | Should | Couldn't check | No dark-mode notes exist (0 of 12 images). The dark frame does show the images. |
| EM-13 The logo has a reversed version, with no outline or plate | Should | Fail | The same logo image ([light](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-4), [dark frame](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-38)) is used in both, with no reversed version named or shown. Found by layer name. |
| EM-14 Icons are one color that works on light and dark | Should | N/A | No icons in any frame. |
| EM-15 No background is pure white or pure black | Should | Fail | The light frames are #ffffff ([desktop](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-11), [mobile](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-67)) and the dark frame is #000000 ([dark](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-37)). |
| EM-16 Illustrations read on a dark background too | Should | Pass | I saw the dark frame. The hero and module pictures stay readable on black. |
| EM-17 A brand font names its fallback | Should | Partly | The only family is Source Sans 3, and a [note](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-35) says it stands in for Adobe Clean. That names a stand-in, not a web-safe fallback such as Arial, and no frame shows the email in one. |
| EM-18 Type follows the house defaults | Could | Pass | No departures: no off-range section headings, body line heights, centered body text or long all-caps text. |
| EM-19 Text contrast meets WCAG 2.2 AA | Must | Fail | Gray #959595 on #f5f5f5, 11px: 2.75 to 1 (needs 4.5), 4 layers per frame, such as [106:32](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-32) and [106:34](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-34). Blue #1473e6 on #f5f5f5: 4.17 to 1 at 18px ([Go to Marketo Engage](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20)) and at 11px ([unsubscribe](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-33)). In the dark frame, the white "Try it" heading on the #f5f5f5 card: 1.09 to 1 ([106:47](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-47)). |
| EM-20 Button edges and meaningful icons meet 3 to 1 | Must | N/A | No buttons or icons found; the CTAs are plain text links (see EM-26). |
| EM-21 Tap targets are at least 24px, and meet the house size | Must | Fail | "View in browser" is 16px tall ([desktop](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-34), [mobile](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-102)), under 24px. "Read now" and "Go to Marketo Engage" are 26px tall, under the 44px house size ([106:16](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16), [106:20](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20)). The same in all three frames. |
| EM-22 Text links are underlined | Must | Fail | 4 of 5 links have no underline: [Read now](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16), [Go to Marketo Engage](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20), ["this link"](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-28) and ["unsubscribe"](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-33). Only "View in browser" is underlined. |
| EM-23 There's one H1, and heading levels go in order | Should | Couldn't check | No heading-level notes exist. Four styled headings carry no level: [106:12](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-12), [106:14](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-14), [106:18](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-18), [106:21](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-21). |
| EM-24 Link and button text says where it goes | Should | Partly | 2 of 6 link texts are weak: "Read now" ([106:16](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16)) doesn't say what it opens, and "this link" ([106:28](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-28)) says nothing out of context. |
| EM-25 Parts that change by audience are marked | Could | N/A | One version of the email, as accepted at the start. |
| EM-26 There's one primary CTA, as a button, repeated rather than varied | Should | Fail | No button exists. Two different text links lead: "Read now" ([106:16](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16)) and "Go to Marketo Engage" ([106:20](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20)). |
| EM-27 A written preheader is shown | Should | Fail | No preheader text layer or note found. Suggest a text layer named "preheader". |
| EM-28 The footer has an unsubscribe link and the sender's address | Must | Partly | The [footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-31) has "Click here to unsubscribe" and the address (345 Park Avenue, San Jose, CA 95110 USA) in [106:33](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-33), but no Link or CTA note says where the unsubscribe goes. No privacy or preferences link (not counted in the result). |
| EM-29 Images export as JPG or PNG | Should | Partly | None of the 12 image layers has an export setting, for example [106:2](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-2) and [106:5](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-5). |
| EM-30 Image slices stay under the house height | Could | Pass | The tallest image is 400px, under 1,500px. |
| EM-31 Alt text describes the image it's on | Should | Couldn't check | There's no alt text to compare with the pictures. |

## Fix these first

1. **Fix the failing text colors** (EM-19, Must). Low-contrast text is hard to read for many people, and it fails WCAG 2.2 AA. Darken the gray footer text (#959595) and the blue on the gray card (#1473e6) until they reach 4.5 to 1, and give the dark frame's "Try it" heading a dark color or make the card dark. Examples: [footer text](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-32), [link on card](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20), [dark "Try it"](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-47).
2. **Underline the text links** (EM-22, Must). Readers who can't tell colors apart can't find a link that only differs by color. Examples: [Read now](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16), [this link](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-28), [unsubscribe](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-33).
3. **Make the tap targets bigger** (EM-21, Must). "View in browser" is 16px tall, under the 24px floor, and the other links are 26px against a 44px house size. Examples: [View in browser](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-34), [Go to Marketo Engage](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20).
4. **Say where the unsubscribe link goes** (EM-28, Must). Add a Link or CTA note so the developer knows what to wire up. Example: [unsubscribe](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-33).
5. **Replace the two text links with one primary CTA button** (EM-26, Should). One clear button, repeated, is easier to find and tap, and it also helps EM-21 and EM-22. Examples: [Read now](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16), [Go to Marketo Engage](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-20).
6. **Bring the headline and the CTA into the first 300px** (EM-04, Should). Readers see a logo and an image before any message in the inbox preview. Example: [hero](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-2).
7. **Add a preheader** (EM-27, Should). Without one, mail apps show the first body text instead. Add a text layer named "preheader" near the top.
8. **Move the mobile frame to the left of the desktop frames** (EM-02, Should). Example: [mobile](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-67).
9. **Use off-white and near-black backgrounds** (EM-15, Should). Pure white and pure black can look harsh and get recolored. Examples: [light](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-11), [dark](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-37).
10. **Add a reversed logo for dark mode** (EM-13, Should). Example: [dark frame logo](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-38).
11. **Put a background color behind each image** (EM-11, Should). With images off, the hero and module picture leave blank gaps. Examples: [hero](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-2), [module picture](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-5).
12. **Reword weak link text** (EM-24, Should). "Read now" and "this link" don't say where they go. Examples: [106:16](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-16), [106:28](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-28).
13. **Name a web-safe fallback font and set image exports** (EM-17 and EM-29, Should). Add Arial or similar as the fallback for Source Sans 3 and give each image a JPG or PNG export. Examples: [font note](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-35), [hero](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-2).
14. **Check the words in the module picture** (EM-09, Should). If it's a screenshot with real text, readers with images off lose it. Example: [module picture](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-5).

## For the designer to judge

EM-09: the module picture is a small laptop screenshot with tiny words. I couldn't read them at this size, so please confirm whether any of them carry meaning ([106:5](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=106-5)).

## Problems no check covers

The dark frame keeps the gray card light (#f5f5f5) on a black page, which is why the white heading disappears. A proposed check: "Cards and panels have a dark-mode treatment, not just the page background."

## Checked only in the build

This design check can't see the HTML or the send: its weight against Gmail's clip at about 102KB, Outlook-only code, the `alt` attributes, the dark-mode code, tracked links, and how each mail app renders. Check those in the build and on a real test send, with images off, from a mailbox that isn't on any safe-sender list.

## What couldn't be checked

The file has no Dev Mode notes (0 read), so these checks couldn't be judged: EM-03 (mobile behavior notes), EM-06 (alt or decorative notes), EM-07 (alt text length), EM-12 (dark-mode notes), EM-23 (heading-level notes) and EM-31 (alt text to compare). Adding the eight note kinds (Alt text, Decorative image, Heading level, Link or CTA, Dark mode, Dynamic content, Mobile behavior, Content model field) would let these run. Two canvas panels ([What works](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=107-56) and [Where it falls short](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=107-106)) were left out as note panels, not emails.

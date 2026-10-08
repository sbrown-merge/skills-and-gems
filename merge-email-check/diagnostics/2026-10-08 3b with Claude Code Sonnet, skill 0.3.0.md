Model: claude-sonnet-5-5

# Email check: Control

The Control email is ready to build. It passes 30 of the 31 checks and passes the 31st with one flag: the hero image's alt text describes a planner beside a coffee cup, but the hero is still a placeholder gradient, so confirm the alt text once the final photo is in.

Checked 2026-10-08 with merge-email-check 0.3.0. Scope: 2:3 (page "02 Control"). Emails: Control (mobile 375, desktop 600, dark mobile 375). House numbers: MERGE's. Audience versions: none.

## Scorecard

| Check | Rank | Control | Evidence |
| --- | --- | --- | --- |
| EM-01 Each email has a mobile and a desktop frame at accepted widths | Must | Pass | 375px mobile ([10:3](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-3)) and 600px desktop ([10:55](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-55)), both with layers; a dark mobile frame is also drawn |
| EM-02 The mobile frame sits to the left of the desktop frame | Should | Pass | Mobile starts at x80, desktop at x535 |
| EM-03 Each module says how it behaves at mobile width | Should | Pass | 7 of 7 modules carry a mobile-behavior note |
| EM-04 The main message and primary CTA sit in the preview area | Should | Pass | Headline at y138 and "Start planning" button at y232 on desktop ([10:60](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-60), [10:62](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-62)) |
| EM-05 The email's length suits a scroll | Could | Pass | Desktop 1,538px against the 4,500px limit |
| EM-06 Every image has alt text or is marked decorative | Must | Pass | 9 of 9 images across the three frames have alt notes |
| EM-07 Alt text fits on one line across its image | Should | Pass | Tightest fit is 35 of 42 characters on the mobile hero ([10:13](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-13)); an estimate |
| EM-08 Headlines, offers and buttons are live text | Must | Pass | Headline, body and both buttons are text layers; the screenshots show nothing flattened |
| EM-09 No text sits inside an image, apart from the logo | Should | Pass | The hero and the calendar illustration hold no words; the hero's gray block is a placeholder shape |
| EM-10 Text over an image still reads on the color behind it | Must | Pass | No text sits over an image |
| EM-11 Every image has a background color behind it | Should | Pass | 9 of 9 images have one |
| EM-12 Every image says how it behaves in dark mode | Should | Pass | 9 of 9 images carry a dark-mode note |
| EM-13 The logo has a reversed version, with no outline or plate | Should | Pass | Logo found by name; its note names logo-reversed.png and the dark frame shows it ([10:109](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-109)) with no outline or plate |
| EM-14 Icons are one color that works on light and dark | Should | Pass | 3 icons per frame, each one color, none under 3 to 1 on light or on the dark reference |
| EM-15 No background is pure white or pure black | Should | Pass | 0 found |
| EM-16 Illustrations read on a dark background too | Should | Pass | The calendar illustration reads on the dark background in the dark frame ([10:145](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-145)) |
| EM-17 A brand font names its fallback | Should | Pass | Arial only (web-safe), 54 layers |
| EM-18 Type follows the house defaults | Could | Pass | No flags: section headings are 22px, body line height is in range, nothing centered, no long all-caps text |
| EM-19 Text contrast meets WCAG 2.2 AA | Must | Pass | 0 failing pairs among 18 text layers in each of the three frames, light and dark |
| EM-20 Button edges and meaningful icons meet 3 to 1 | Must | Pass | Buttons are 6.24 to 1 against the page in light and 8.09 to 1 in dark, so no edge is needed; the three bullet icons are decorative |
| EM-21 Tap targets are at least 24px, and meet the house size | Must | Pass | All 5 targets per frame are 44px tall or more |
| EM-22 Text links are underlined | Must | Pass | The inline link and the three footer links are underlined in every frame |
| EM-23 There's one H1, and heading levels go in order | Should | Pass | One H1 and three H2s per frame, no skipped level |
| EM-24 Link and button text says where it goes | Should | Pass | "Start planning", "Read the planning guide", "Unsubscribe", "Manage preferences", "Privacy policy" |
| EM-25 Parts that change by audience are marked | Could | N/A | One version of the email; the one merge tag, {{lead.First Name}}, carries dynamic-content and content-field notes |
| EM-26 There's one primary CTA, as a button, repeated rather than varied | Should | Pass | "Start planning" appears twice as the same blue button |
| EM-27 A written preheader is shown | Should | Pass | Preheader text layer in each frame ([10:58](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-58)) |
| EM-28 The footer has an unsubscribe link and the sender's address | Must | Pass | Footer ([10:100](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-100)) holds the unsubscribe, with a Link or CTA note saying the developer sets the Marketo URL, the Chicago address, preferences and privacy links |
| EM-29 Images export as JPG or PNG | Should | Pass | 0 SVG or PDF, 0 without export settings |
| EM-30 Image slices stay under the house height | Could | Pass | 0 over 1,500px |
| EM-31 Alt text describes the image it's on | Should | Pass | Logo and calendar alt text match; the hero is placeholder art (see the flag below) |

## Fix these first

Nothing failed or partly passed, so there is nothing to fix before build.

## For the designer to judge

EM-31: the hero image's alt text, "Planner open beside a cup of coffee", doesn't match the placeholder gradient it sits on ([desktop 10:65](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-65), [mobile 10:13](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-13), [dark 10:117](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-117)). Confirm it against the final photo.

## Checked only in the build

This design check can't see the HTML or the send: its weight against Gmail's clip at about 102KB, Outlook-only code, the `alt` attributes, the dark-mode code, tracked links, and how each mail app renders. Check those in the build and on a real test send, with images off, from a mailbox that isn't on any safe-sender list.

## What couldn't be checked

Nothing. Every check had its data. The hero was read from the screenshots as an image with no words, and the footer text was read at 1x.

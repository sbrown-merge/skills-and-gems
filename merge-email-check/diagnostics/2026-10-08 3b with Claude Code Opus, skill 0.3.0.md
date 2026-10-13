Model: claude-opus-5-5

# Email check: Control

This email is ready to build. It passed all 30 checks that apply to it, and EM-25 is N/A because the email has one version. Before the build, confirm two things: that the final hero photo matches its alt text, and that it has no words in it.

Checked 2026-10-08 with merge-email-check 0.3.0. Scope: 2:3 (page 02 Control). Emails: Control. House numbers: MERGE's.

## Scorecard

The table gives each check's result for the Control email's mobile frame, desktop frame and dark-mode mobile frame, with evidence linked to the layers.

| Check | Rank | Result | Evidence |
| --- | --- | --- | --- |
| EM-01 Each email has a mobile and a desktop frame at accepted widths | Must | Pass | Control: a 375px mobile frame ([10:3](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-3)) and a 600px desktop frame ([10:55](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-55)), plus a 375px dark-mode mobile frame ([10:107](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-107)). |
| EM-02 The mobile frame sits to the left of the desktop frame | Should | Pass | Control: the mobile frame is at x 80 and the desktop frame at x 535. |
| EM-03 Each module says how it behaves at mobile width | Should | Pass | Control: all 7 modules in the desktop frame carry a mobile behavior note. |
| EM-04 The main message and primary CTA sit in the preview area | Should | Pass | Control: in the first 300px of the desktop frame you get the logo, the preheader, the headline at 138px ([10:60](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-60)) and the "Start planning" button at 232px ([10:62](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-62)). |
| EM-05 The email's length suits a scroll | Could | Pass | Control: the desktop frame is 1,538px tall, under the 4,500px house length. |
| EM-06 Every image has alt text or is marked decorative | Must | Pass | Control: all 9 images across the 3 frames have an alt text note. |
| EM-07 Alt text fits on one line across its image | Should | Pass | Control: every alt text fits within its estimated width, for example the hero's 35 of 42 characters on mobile ([10:13](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-13)). The fit is an estimate. |
| EM-08 Headlines, offers and buttons are live text | Must | Pass | Control: the headline, the 4 headings and both buttons in each frame are live text. |
| EM-09 No text sits inside an image, apart from the logo | Should | Pass | Control: the 3 distinct images have no words in them. There's one flag below about a dark band in the hero art. |
| EM-10 Text over an image still reads on the color behind it | Must | Pass | Control: no text sits over an image. |
| EM-11 Every image has a background color behind it | Should | Pass | Control: all 9 images have a background color, for example #e8e1d6 behind the hero ([10:65](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-65)). |
| EM-31 Alt text describes the image it's on | Should | Pass | Control: the logo and the illustration match their alt text. The hero's alt text doesn't match the placeholder art; that's a flag below. |
| EM-12 Every image says how it behaves in dark mode | Should | Pass | Control: all 9 images carry a dark mode note. |
| EM-13 The logo has a reversed version, with no outline or plate | Should | Pass | Control: we found the logo by its layer name. Its note names the reversed logo ([10:57](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-57)), and the dark frame shows it ([10:109](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-109)), with no outline, glow or plate. |
| EM-14 Icons are one color that works on light and dark | Should | Pass | Control: each frame has 3 single-color icons, and none falls under 3 to 1. |
| EM-15 No background is pure white or pure black | Should | Pass | Control: no background is #ffffff or #000000. |
| EM-16 Illustrations read on a dark background too | Should | Pass | Control: we checked the calendar illustration in the dark frame ([10:145](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-145)), and its shapes still read. |
| EM-17 A brand font names its fallback | Should | Pass | Control: every text layer (54 across the 3 frames) uses Arial, which is web-safe. |
| EM-18 Type follows the house defaults | Could | Pass | Control: the headings, body line height, alignment and capitals all follow the house defaults, so there are no flags. |
| EM-19 Text contrast meets WCAG 2.2 AA | Must | Pass | Control: no failing pairs across 54 text layers in the light and dark frames. |
| EM-20 Button edges and meaningful icons meet 3 to 1 | Must | Pass | Control: the 6 button fills contrast with what's around them, at 6.24 to 1 in light ([10:10](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-10)) and 8.09 to 1 in dark ([10:114](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-114)). The list icons are decorative bullets, so they're exempt. |
| EM-21 Tap targets are at least 24px, and meet the house size | Must | Pass | Control: all 15 buttons and links are at least 44px tall. |
| EM-22 Text links are underlined | Must | Pass | Control: the inline "Read the planning guide" link ([10:97](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-97)) and all of the footer links are underlined. |
| EM-23 There's one H1, and heading levels go in order | Should | Pass | Control: each frame has one H1 and three H2s, with no skipped level. |
| EM-24 Link and button text says where it goes | Should | Pass | Control: "Start planning", "Read the planning guide", "Unsubscribe", "Manage preferences" and "Privacy policy" all make sense out of context. |
| EM-25 Parts that change by audience are marked | Could | N/A | Control has one version. It uses one merge tag, {{lead.First Name}}, in 3 layers ([10:61](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-61)). |
| EM-26 There's one primary CTA, as a button, repeated rather than varied | Should | Pass | Control: "Start planning" is the one primary button, and its repeat says the same thing ([10:98](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-98)). |
| EM-27 A written preheader is shown | Should | Pass | Control: each frame shows a written preheader ([10:58](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-58)). |
| EM-28 The footer has an unsubscribe link and the sender's address | Must | Pass | Control: the unsubscribe link ([10:104](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-104)) has a note saying the developer sets the Marketo URL. The address is there ([10:102](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-102)), and so are the privacy and preferences links. |
| EM-29 Images export as JPG or PNG | Should | Pass | Control: all 9 images export as JPG or PNG. |
| EM-30 Image slices stay under the house height | Could | Pass | Control: no image is taller than 1,500px. |

## Fix these first

Nothing failed or partly passed, so there's nothing to fix before the build.

## For the designer to judge

The hero's alt text reads "Planner open beside a cup of coffee", but the art in place is an abstract gradient ([10:65](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-65)). Because that looks like placeholder art, please confirm the alt text once the final photo is in (EM-31).

The hero art also has a dark band where a caption might go ([10:65](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-65)). It holds no words now. If the final image puts words there, they'll disappear when images are off, so set them as live text instead (EM-09).

## Checked only in the build

This design check can't see the HTML or the send: its weight against Gmail's clip at about 102KB, Outlook-only code, the `alt` attributes, the dark-mode code, tracked links, and how each mail app renders. Check those in the build and on a real test send, with images off, from a mailbox that isn't on any safe-sender list.

## What couldn't be checked

Every check could be run.

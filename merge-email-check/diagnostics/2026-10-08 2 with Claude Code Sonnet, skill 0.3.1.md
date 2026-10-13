Model: claude-sonnet-5-5

# Email check: 04 Emails

Not ready to build. Only P1 Email 1 has a design drawn, and only at mobile width; the other four emails are empty frames, and P1 Email 1's footer fails three Must checks. Start by adding the company address to the footer and making the footer text readable, then draw the desktop and remaining frames.

Checked 2026-10-08 with merge-email-check 0.3.1. Scope: 2:5 (the "04 Emails" page). Emails: P1 Email 1, P1 Email 2, P1 Email 3, P1 Email 4, P2 Core nurture. House numbers: MERGE's.

## Scorecard

Here are all 31 checks for the five emails. P1 Email 2, 3, 4 and P2 Core nurture have two frames each but no layers in either, so most checks are N/A for them until they're drawn. P1 Email 1's desktop frame is empty too, so its results come from the mobile frame.

| Check | Rank | P1 Email 1 | P1 Email 2 | P1 Email 3 | P1 Email 4 | P2 Core nurture | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EM-01 Each email has a mobile and a desktop frame at accepted widths | Must | Fail | Fail | Fail | Fail | Fail | All five emails have frames at 375px and 600px, but the desktop frame of P1 Email 1 ([desktop](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-99)) has no layers, and both frames of the other four are empty ([P1 Email 2](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-102), [P1 Email 3](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-105), [P2 Core nurture](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-112)). An empty frame counts as missing. |
| EM-02 The mobile frame sits to the left of the desktop frame | Should | Pass | Pass | Pass | Pass | Pass | Mobile starts at x 40 and desktop at x 455 in P1 Email 1; the same pattern holds for the others. |
| EM-03 Each module says how it behaves at mobile width | Should | Fail | Couldn't check | Couldn't check | Couldn't check | Couldn't check | P1 Email 1: 0 of 8 modules carry a mobile-behavior note ([frame](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-100)). The others have no layers, see EM-01. |
| EM-04 The main message and primary CTA sit in the preview area | Should | N/A | N/A | N/A | N/A | N/A | No email has desktop content. See the designer flag below about the mobile frame. |
| EM-05 The email's length suits a scroll | Could | Pass | N/A | N/A | N/A | N/A | P1 Email 1 is 1,530px tall on mobile and 1,200px on desktop, under the 4,500px house length. The others are empty placeholders. |
| EM-06 Every image has alt text or is marked decorative | Must | Fail | N/A | N/A | N/A | N/A | P1 Email 1: 3 images, none with a firm alt or decorative note. The photo has only a suggestion to mark it decorative ([photo](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=32-13)); the footer background and the LinkedIn icon have nothing ([footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96)). |
| EM-07 Alt text fits on one line across its image | Should | N/A | N/A | N/A | N/A | N/A | No image has alt text to measure; the photo's note is a decorative suggestion. |
| EM-08 Headlines, offers and buttons are live text | Must | Pass | N/A | N/A | N/A | N/A | The H1, three H2s and the "Watch the story." button are text layers; the screenshot agrees. |
| EM-09 No text sits inside an image, apart from the logo | Should | Pass | N/A | N/A | N/A | N/A | The photo and the green footer background show no words in the screenshot. |
| EM-10 Text over an image still reads on the color behind it | Must | Fail | N/A | N/A | N/A | N/A | P1 Email 1: 2 footer text layers, "www.mergeworld.com" and "Unsubscribe", are white over the footer background image, which becomes white with images off, so the contrast is 1 to 1 ([footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96)). |
| EM-11 Every image has a background color behind it | Should | Fail | N/A | N/A | N/A | N/A | P1 Email 1: 0 of 3 images has a background color set ([photo](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=32-13), [footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96)). |
| EM-12 Every image says how it behaves in dark mode | Should | Fail | N/A | N/A | N/A | N/A | P1 Email 1: 0 of 3 images has its own dark-mode note; only the logo has one ([header](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=33-111)). |
| EM-13 The logo has a reversed version, with no outline or plate | Should | Pass | N/A | N/A | N/A | N/A | The logo (found by its note) has a dark-mode note naming a light version to swap in, and shows no outline or plate ([header](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=33-111)). |
| EM-14 Icons are one color that works on light and dark | Should | Pass | N/A | N/A | N/A | N/A | 3 icons (LinkedIn, Instagram, Facebook), all white, none under 3 to 1 ([footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96)). The LinkedIn icon is an image, so its color was read from the screenshot. |
| EM-15 No background is pure white or pure black | Should | Fail | Fail | Fail | Fail | Fail | Every frame is filled #ffffff ([P1 Email 1 mobile](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-100), [P1 Email 2 mobile](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-103), [P2 Core nurture mobile](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-113)); this is 1 of 1 backgrounds in each frame. |
| EM-16 Illustrations read on a dark background too | Should | Pass | N/A | N/A | N/A | N/A | No dark frame exists, so this was judged against the #121212 reference. The photo and the green footer background both stay visible on dark. |
| EM-17 A brand font names its fallback | Should | Fail | N/A | N/A | N/A | N/A | Both families, Inter (5 layers) and Fraunces (7 layers), are brand fonts with no fallback note and no frame showing a fallback. |
| EM-18 Type follows the house defaults | Could | Pass | N/A | N/A | N/A | N/A | Flags only; see the designer section. |
| EM-19 Text contrast meets WCAG 2.2 AA | Must | Fail | N/A | N/A | N/A | N/A | The two footer text layers sit on a green gradient. From the screenshot, "www.mergeworld.com" (16px bold, needs 4.5) is white on about #4d9172 to #549a7a, roughly 3.5 to 3.9, and "Unsubscribe" (10px, needs 4.5) is near-white on about #6ba78d, roughly 2.8 ([footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96)). The other 10 text layers have no failing pairs. |
| EM-20 Button edges and meaningful icons meet 3 to 1 | Must | Pass | N/A | N/A | N/A | N/A | The one button has a #003c34 fill against white, 12.38 to 1, so it needs no edge ([button](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=32-25)). The white social icons sit on the green gradient at roughly 3.5 to 1 or better, estimated from the screenshot. |
| EM-21 Tap targets are at least 24px, and meet the house size | Must | Fail | N/A | N/A | N/A | N/A | P1 Email 1: 2 of 3 targets are under 24px: "www.mergeworld.com" is 23px high and "Unsubscribe" is 17px high ([footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96)). The button is 44px. |
| EM-22 Text links are underlined | Must | Fail | N/A | N/A | N/A | N/A | P1 Email 1: 2 of 2 standalone text links, "www.mergeworld.com" and "Unsubscribe", have no underline ([footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96)). |
| EM-23 There's one H1, and heading levels go in order | Should | Pass | N/A | N/A | N/A | N/A | One H1 ([headline](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-130)) followed by three H2s, with no skips. |
| EM-24 Link and button text says where it goes | Should | Pass | N/A | N/A | N/A | N/A | "Watch the story.", "www.mergeworld.com" and "Unsubscribe" all make sense out of context. |
| EM-25 Parts that change by audience are marked | Could | N/A | N/A | N/A | N/A | N/A | Each email has one version. A merge tag, {YourName}, is in the file ([text](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=27-37)). |
| EM-26 There's one primary CTA, as a button, repeated rather than varied | Should | Pass | N/A | N/A | N/A | N/A | One button, "Watch the story.", leads ([button](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=32-25)). |
| EM-27 A written preheader is shown | Should | Fail | Couldn't check | Couldn't check | Couldn't check | Couldn't check | P1 Email 1 has no preheader text layer; the only mention is a note asking for one on the subject line frame ([note](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=27-16)). The others are empty. Suggest a text layer named "preheader". |
| EM-28 The footer has an unsubscribe link and the sender's address | Must | Fail | Couldn't check | Couldn't check | Couldn't check | Couldn't check | P1 Email 1's footer ([footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96)) has "Unsubscribe" but no company address, and it appears nowhere else in the email. A note on the footer lists what it needs but doesn't state the unsubscribe link. No privacy or preferences link was found either. The others are empty. |
| EM-29 Images export as JPG or PNG | Should | Partly | N/A | N/A | N/A | N/A | P1 Email 1: 3 of 3 images have no export setting; none are SVG or PDF. |
| EM-30 Image slices stay under the house height | Could | Pass | N/A | N/A | N/A | N/A | No image is taller than 1,500px (the photo is 212px). |
| EM-31 Alt text describes the image it's on | Should | N/A | N/A | N/A | N/A | N/A | No image has alt text yet; the photo's note only suggests marking it decorative. |

## Fix these first

1. **Add the company address to the footer, and state the unsubscribe link** (EM-28, Must). Email law expects both, and the footer note currently only lists what's needed. Examples: [footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96).
2. **Make the footer text readable** (EM-19, Must). The web address and "Unsubscribe" fall below 4.5 to 1 on the green gradient; use a darker green behind the text or a darker text color, and make "Unsubscribe" larger than 10px. Examples: [footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96).
3. **Give the footer a solid color behind its background image** (EM-10 Must, EM-11 Should). With images off, as in Outlook, the white footer text lands on white and disappears. A dark green fill behind the image fixes both. Examples: [footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96).
4. **Write alt text for the images, or mark them decorative** (EM-06, Must). The photo's note only suggests decorative, and the footer background and LinkedIn icon have none. Examples: [photo](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=32-13), [footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96).
5. **Underline the two footer links** (EM-22, Must). Without an underline, readers who can't tell colors apart can't find them. Examples: [footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96).
6. **Make the footer links at least 24px tall, ideally 44px** (EM-21, Must). "Unsubscribe" is 17px and the web address is 23px. Examples: [footer](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=28-96).
7. **Draw the missing frames** (EM-01, Must). P1 Email 1 needs its desktop frame, and Emails 2, 3, 4 and P2 Core nurture need both frames before they can be checked. Examples: [P1 Email 1 desktop](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-99), [P1 Email 2](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-102).
8. **Add a mobile-behavior note to each module** (EM-03, Should). None of the 8 modules in P1 Email 1 says how it behaves at 375px. Examples: [frame](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-100).
9. **Write the preheader as a text layer** (EM-27, Should). The note on the subject line only asks for one. Examples: [subject line](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=27-16).
10. **Name a fallback for Inter and Fraunces** (EM-17, Should), **add dark-mode notes to the images** (EM-12, Should), **swap the white frame backgrounds for an off-white** (EM-15, Should), and **set JPG or PNG export on the 3 images** (EM-29, Should). Examples: [frame](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-100).

## For the designer to judge

- EM-18: the three H2s ("Bolting on AI won't fix it.", "We started with ourselves.", "The technology isn't the center.") are 30px, above the 20 to 22px house range. Examples: [H2](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=32-32), [H2](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=32-34), [H2](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=32-36). Body line height, centering and all-caps were fine.
- EM-04: the mobile frame's first 300px holds only the header and the photo; the headline starts at about y 320. The check is set against the desktop frame, which is empty, so this is a flag for now. Examples: [mobile frame](https://www.figma.com/design/Dqux2GL6tXD0boEEW3QCax/?node-id=2-100).
- EM-31 and EM-06: the photo's note suggests marking it decorative. Confirm that once the final photo is in.
- EM-28: the footer also lacks a privacy link and a preferences link, which doesn't change its result.
- Two numbers in EM-19 and EM-20 come from sampling the screenshot, not from fills, because the footer is a gradient image.

## Problems no check covers

The Unsubscribe link looks lighter than the other footer text, as if set at reduced opacity. A proposed check would flag any text drawn at reduced opacity, because contrast then depends on a value the build might not carry over.

## Checked only in the build

This design check can't see the HTML or the send: its weight against Gmail's clip at about 102KB, Outlook-only code, the `alt` attributes, the dark-mode code, tracked links, and how each mail app renders. Check those in the build and on a real test send, with images off, from a mailbox that isn't on any safe-sender list.

## What couldn't be checked

- EM-03, EM-27 and EM-28 for P1 Email 2, 3, 4 and P2 Core nurture: those frames have no layers, so script 01 found no modules, preheader or footer to read.
- EM-04 for all emails: no desktop frame has content.
- Screenshots of the desktop frames and of the empty mobile frames show nothing to inspect, so only P1 Email 1's mobile frame was viewed.

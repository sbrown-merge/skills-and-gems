Model: claude-opus-5-5

# Email best-practice check: 01 Faults page, file pgpRQNF2ey2fXl3lMS9D2O

We checked the page you linked, [01 Faults](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=2-2), on 2026-10-08, reading it with the Figma tools only and changing nothing. The page holds four emails (Faults A, B, C and D) plus a 1280px mail app window. Faults A needs the most work before it goes to a developer: its offer, its main button and a 1,700px block of content are all images, its footer has no postal address, none of its links say where they go, and several images have no alt text, no export setting or no plan for dark mode. Faults B, C and D are close to clean as designs, but each is missing something structural: B has no mobile frame, C's desktop frame is empty, and D's desktop layers aren't grouped into modules.

The 1280px mail app window ([7:12](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=7-12)) is a presentation mockup holding a copy of Faults A's desktop frame, so we treated it as not applicable rather than as a fifth email. Everything we found in Faults A applies to that copy too.

## Contents

<!-- toc -->
- Faults A: what to fix first
- Faults A: images, alt text and dark mode
- Faults A: text, links and buttons
- Faults A: structure and mobile
- Faults B, C and D
- How we checked
<!-- /toc -->

## Faults A: what to fix first

These are the problems that would hurt the email in real inboxes or break a rule, so we'd fix them before anything else. Layer IDs link to the desktop frame; the mobile frame has the same problem in the same place unless we say otherwise.

| Problem | Where | Why it matters | Fix |
| --- | --- | --- | --- |
| The footer has no postal address | footer [6:65](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-65), mobile [6:133](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-133) | US CAN-SPAM rules require a valid physical address in every commercial email. Faults B, C and D all have one. | Add the address line Faults B uses. |
| No link has a destination | every button and link in Faults A | Faults B annotates each link (for example, the Marketo unsubscribe URL); Faults A annotates none, so the developer can't build the links. | Add a link annotation to each button, text link and footer link. |
| The "Shop now" button is a picture | primary button [6:26](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-26) | With images off (the Outlook default) the email's main call to action disappears, and an image can't be restyled for dark mode. | Rebuild it as a live-text button like "Get started" ([6:55](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-55)). |
| The 20% offer is only in an image | banner image [6:19](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-19) | "SAVE 20% THIS WEEK ONLY" and "On every annual plan. No code needed." are baked into the JPG. With images off the reader gets only the alt text, which drops the second line. On mobile the banner shrinks to 125px tall, so the second line renders at roughly 11px. | Put the headline and subline in live text over a solid color, or beside the image. |
| A 1,700px-tall block is one image | image slice [6:64](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-64) | One third of the email is a single picture of three cards. It can't be read with images off, read aloud by a screen reader beyond its alt text, or reflowed on mobile. Its source is 600x1700, only 1x, so it will look soft on high-density screens. | Rebuild the three cards as live text with small images, or split the slice into one image per card at 2x. |
| The hero headline is hard to read | hero headline [6:8](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-8), mobile [6:75](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-75) | White text sits on the light orange part of the photo, which we estimate from the screenshot at about 2:1, under the 3:1 minimum for large text. The dark band that would help is baked into the photo and doesn't line up with the text. Live text over a background image also needs VML for Outlook on Windows, or it shows on a blank background there. | Move the headline below the image, or add a scrim behind the whole headline and note the Outlook fallback color. |

## Faults A: images, alt text and dark mode

Each image needs alt text, an export setting the developer can use, enough resolution for high-density screens, and a decided plan for dark mode. These are the images that miss one of those.

| Problem | Where | Fix |
| --- | --- | --- |
| No alt text at all | photo 1 [6:47](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-47) | Write alt text, or mark it decorative if it is. |
| Alt text is only a suggestion ("Suggestion: alt text Team lunch") | photo 2 [6:48](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-48) | Decide the alt text and record it as the annotation itself. |
| Alt text too long to show in the image box | image alt too long [6:17](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-17) | Its 75 characters won't fit across a 335px box when images are off, so most of it gets cut. Shorten it to about 40 characters. "A team of four reviewing a wall calendar" ([6:16](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-16), 40 characters) is near that limit, so check it too. |
| Exported as SVG | photo 5 [6:52](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-52) | Gmail and Outlook don't display SVG. Export as JPG at 2x like the other photos. |
| No export setting | photo 6 [6:53](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-53), both icons [6:37](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-37) and [6:43](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-43) | Add a JPG 2x setting to the photo and PNG 2x to the icons. The icons are vectors, which email can't use directly, and they have no alt text or decorative note either. |
| No dark-mode note | photos 3 and 4 [6:49](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-49), [6:51](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-51) | Every other photo says "No dark version; the photo reads on both." Add the same decision to these two. |
| Dark artwork with no dark version | dark illustration [6:30](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-30), clock icon [6:43](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-43) | The navy calendar and the #2b2b40 clock nearly vanish on a dark-mode background, and the annotation says the same image shows in both modes. Supply a lighter dark-mode version. |
| The logo relies on a white outline in dark mode | logo [6:5](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-5) | The logo sits on a white fill with a 2px white border, so in dark mode it shows as a white box. Faults B's approach, swapping to a reversed logo, works better. The source is also 240x72 for a 140x42 slot, about 1.7x, so it will look slightly soft on high-density screens; supply it at 280x84. |
| The card image has no background color | card image [6:25](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-25) | Every other image has a fallback color behind it, so the layout holds with images off; this one leaves a blank gap. Its 800px source is also only about 1.5x for a 520px slot. |

## Faults A: text, links and buttons

These findings are about readability, accessibility and tap targets.

| Problem | Where | Fix |
| --- | --- | --- |
| Links that don't say where they go | "Click here" in [6:11](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-11), "Read more" [6:61](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-61) | Screen-reader users often jump from link to link, so the link text should name the destination, such as "See the full list of tools". |
| Links shown by color only | "Click here" and "Read more" | Neither is underlined, which fails readers who can't tell the blue from the body text. Underline them, as the footer links and "See the event calendar" are. |
| Headings out of order | H3 [6:14](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-14) comes before any H2, and there's a second H1 [6:21](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-21) | Use one H1 (the hero), then H2s for sections. The H2 "Built for busy teams" is also 32px while the H1 "Twenty percent off every plan" is 22px, so the visual order contradicts the tagged order. |
| Body line height of 1.2 | [6:12](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-12) | The other body text uses 1.5; use 1.5 here too. |
| A centered paragraph in a left-aligned email | [6:22](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-22) | Centered body copy is harder to read and its heading is left-aligned. Left-align it. |
| A whole sentence in capitals at 13px | [6:23](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-23) | All-caps sentences are slower to read and some screen readers spell them out. Use sentence case at 14px or more. |
| Footer legal text too small and too faint | [6:66](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-66) | It's 11px #999 on #f5f5f5, about 2.6:1, under the 4.5:1 minimum for body text. Faults B uses 13px #4a4a4a, which passes. |
| A small button and a small link | "Book a demo" [6:57](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-57) is 36px tall; "See the event calendar" [6:62](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-62) is 20px tall | Make tap targets at least 44px tall, as the other buttons and the footer links are. |
| Low-contrast shapes | the ghost button border [6:59](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-59) is #ddd on white (about 1.4:1); the calendar icon [6:37](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-37) is #bbb on white (about 1.9:1) | Meaningful shapes need 3:1. Darken both, and match the calendar icon to the clock so the two rows look like a set. |
| The greeting token has no fallback | "Hi [First Name]," [6:10](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-10) | Readers with no first name on file would see "Hi ,". Note the Marketo token and its default, for example "Hi there,". |
| No preheader | header [6:4](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-4) | The only note is "Suggestion: add a preheader". Without one, inboxes show the first text they find, which here is the image alt text. Write the preheader, as Faults B does. |
| Web fonts with no fallback noted | Playfair Display and Inter throughout | Outlook on Windows ignores web fonts and uses Times New Roman unless a fallback stack is set. Note the fallback (for example Georgia for Playfair, Arial for Inter), or use Arial as Faults B does. |

## Faults A: structure and mobile

These findings are about how the email is put together and how it behaves on a phone.

- **Six modules have no mobile-behavior note.** The header, intro, offer, buttons and footer each say how they behave on mobile, but the hero, features, banner, illustration, gallery and slice don't. The features module's note is only a suggestion ("stack the three images at full width"), so it isn't decided either.
- **The email is long and mostly images.** The desktop frame is 5,189px tall, and by our count about 3,600px of that (roughly 70%) is images. With images off, most of the email is blank boxes and alt text. Cutting the slice and the image-only banner and button would fix most of this.
- **The features images don't line up with the rest.** They're centered at 335px wide inside the 600px frame, while everything else is left-aligned at a 40px margin.
- **The mobile frame sits to the right of desktop.** In Faults B, C and D the mobile frame is on the left. Pick one order for the file so frames are easy to find.

## Faults B, C and D

Each of these three is a short email (header with preheader, headline, body, button, footer with address and annotated links) and their designs pass the checks above. Each has one structural problem.

| Email | Problem | Fix |
| --- | --- | --- |
| Faults B ([8:5](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-5)) | There's a desktop frame but no mobile frame, so mobile behavior can only be read from the notes. The desktop frame is 640px wide; that works in most mail apps, but 600px is the safer standard. | Add a 375px mobile frame, and consider 600px for desktop. |
| Faults C ([8:39](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-39)) | The desktop frame is empty, so there's effectively no desktop design. The mobile frame ([8:24](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-24)) is clean. | Build the 600px desktop frame. |
| Faults D ([8:59](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-59)) | The desktop frame's logo, preheader, headline, body, button and divider are loose layers rather than module frames, so they can't be matched to Marketo modules or to the mobile frame, which is grouped. The divider also appears on desktop only. | Group the desktop layers into header and intro modules to match mobile, and decide whether the divider belongs on mobile too. |

## How we checked

We read the page structure, the layer properties and annotations, the image sources and export settings, and screenshots of each frame. Contrast figures are calculated from the hex values in the file, except the hero headline, which we estimated from the screenshot because the text sits on a photo. The alt-text fit is an estimate of how many characters fit on one line at a typical 14 to 16px fallback font. We didn't open the page 02 Control or 03 Sample, or the skill's EVAL.md, because you asked us to check this page against best practice rather than against the expected results.

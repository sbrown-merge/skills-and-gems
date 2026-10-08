Model: claude-sonnet-5-5

# Email design check: Lumen spring planning email

I read the Figma file (page "01 Faults", five sections) with the Figma tools only, and changed nothing. The file holds a long desktop email at 600 px with a 375 px mobile version (Faults A), a copy of it inside a 1280 px mail app window, and three shorter variants (B, C, D). I checked it against general email best practices: width, structure, live text versus images, alt text, links and buttons, tap targets, type, contrast, dark mode, mobile behavior, and the footer. I didn't have a project rulebook to check against, so I used the check IDs written in the layer names (EM-01 to EM-30) only as hints about where to look. Each finding below stands on what I saw in the design.

## Contents

- Summary
- Faults A, desktop 600 and mobile 375
- Faults A in the mail app window
- Faults B, desktop 640
- Faults C, mobile 375 with an empty desktop frame
- Faults D, desktop frame not built as modules
- What looks fine
- Limits of this check

## Summary

This email has many problems, and most are in Faults A. The ones that would hurt real readers most are these: the offer button is a picture, the banner and the 1,700 px slice are text baked into images, the legal text is too faint to read, the inline links aren't underlined, the footer has no postal address, the dark illustration will vanish in dark mode, and the heading levels are out of order. B has no mobile frame and C has no desktop design, so neither is complete. D's desktop frame isn't built from modules, so a developer can't tell where one section ends and the next begins.

## Faults A, desktop 600 and mobile 375

**Structure and width.** The desktop frame is 600 px wide and the mobile frame is 375 px wide, which is right. The desktop email is 5,189 px tall, which is very long. The long length plus the heavy image use raises the risk of Gmail clipping the message, so the team should keep the HTML light and consider cutting content.

**Live text versus images.** Four things carry their message in pictures.
- The "Save 20% this week only" banner is an image. On mobile it shrinks to 375 x 125 px, so its small line ("On every annual plan. No code needed.") drops to roughly 8 px. With images off, readers see only the alt text.
- The "Shop now" button in the offer block is an image, not a coded button. It will break when images are blocked and can't be restyled or tapped reliably. It should be a live-text, bulletproof button.
- The hero headline sits as text over a photo with a semi-transparent dark box behind it. Outlook doesn't support background images the way other apps do, so the headline needs a solid fallback color behind it, and the white text on the bright orange part of the photo is hard to read.
- The last block is a single image slice 600 x 1,700 px (1,062 px on mobile) that holds what looks like a list of items with titles and descriptions. Its alt text is only "Spring planning checklist", so all that content is lost with images off, can't be read aloud, and can't be translated. It should be live text with small images, or cut into several slices.

**Alt text.**
- Photo 1 in the gallery has no alt text.
- Photo 2 has only a suggestion ("Team lunch") and no confirmed alt text.
- The "too long" feature image has an alt of about 74 characters ("A designer sketching a project timeline on a whiteboard in a bright office"). That's too long to show on one line in many mail apps. The "near miss" alt ("A team of four reviewing a wall calendar", about 40 characters) is on the edge at 335 px wide and worth checking.
- The other alts are short and describe the image, which is good.

**Headings.** The order is H1 (hero), H3 ("What's new this season"), H1 again ("Twenty percent off every plan"), then H2 ("Built for busy teams"). That's two H1s and a jump from H1 to H3. The sizes also contradict the levels: the second H1 is 22 px while the H2 is 32 px, so the hierarchy reads backward.

**Body text and readability.**
- The third intro paragraph uses a line height of 1.2 at 16 px. Body copy should sit near 1.4 to 1.5, as the other paragraphs do.
- The offer paragraph is center-aligned over several lines, which is harder to read. Left-align body copy.
- "LIMITED SEATS FOR THE SPRING WORKSHOP SERIES" is a full sentence in all caps at 13 px. All caps hurts readability and screen readers may spell it out.
- On desktop, the three feature images are 335 px wide and centered, while the heading and text above them are left-aligned at 520 px. The mismatch looks accidental; they should be full width or aligned with the text.

**Links and buttons.**
- "Click here" and "Read more" are vague link text, and neither is underlined. Link text should say where it goes ("See the full list of tools").
- Inline link color (#0b5cad) against body text (#2b2b2b) has a contrast ratio of about 2.1:1, below the 3:1 needed to tell a link from text by color alone. Without an underline, readers who can't see the color difference can't find the link.
- The buttons are inconsistent: "Get started" is 48 px tall, "Book a demo" is 36 px tall with 14 px text, "Learn about pricing" is 44 px tall. The 36 px button, and the "See the event calendar" link (20 px tall), are under the 44 px minimum tap target.
- "Learn about pricing" has a pale gray (#ddd) border on white, which is nearly invisible. Its blue text is fine, but the button shape disappears.
- There are several competing primary calls to action (Get started, Book a demo, Shop now, Learn about pricing) with no clear first choice.
- Link destinations are not specified anywhere in Faults A. Faults B does list them.

**Icons.** The calendar icon (20 px) renders as a pale gray square and the clock icon (22 px) is dark. The sizes and colors don't match, and the gray one has weak contrast. If the icons are decorative they need empty alt text, which is how they're set up.

**Dark mode.**
- The illustration (dark navy calendar and clock) sits on a light gray box (#f5f5f5). In dark mode the box may invert and the navy drawing would vanish. The note says "No dark version; the same image shows in dark mode", which doesn't solve that.
- The logo has a white outline, a workaround that will look like a white box on a dark background. A reversed logo (as Faults B specifies) is cleaner.
- Photos are marked as reading fine on both modes, which is reasonable.
- Photos 3 and 4 have no dark-mode note at all.

**Preheader.** There isn't one in A. The design already carries an annotation suggesting to add one. Without it, mail apps pull the first text they find, which here would be the logo's alt or "Hi [First Name]".

**Footer.**
- The legal line is 11 px in #999 on #f5f5f5, a contrast ratio of about 2.6:1. That fails the 4.5:1 target and is too small to read comfortably.
- There's no physical postal address, which commercial email in the US (CAN-SPAM) requires. Faults B has one.
- Unsubscribe and Privacy policy are underlined and have 44 px tap targets, which is good.

**Fonts.** The design uses Playfair Display and Inter. Many mail apps (Outlook, some Gmail setups) won't load web fonts, so the email needs a fallback stack such as Georgia and Arial, and the layout should still hold in the fallbacks. Faults B uses Arial, which is safe.

**Gallery and exports.**
- On desktop the gallery is three images across at 160 px; on mobile it is two across, which is sound.
- Photos 5 and 6 are flagged for export format, one as SVG and one with no export set. SVG images don't display in many mail apps (including Gmail and Outlook), so every image should be exported as PNG or JPG at 2x.

**Mobile behavior.** The mobile frame has the right 20 px side margins and a single column. Annotations exist for most blocks (stack, rewrap, keep button size). The mobile banner text and the mobile slice are the weak points, covered above.

## Faults A in the mail app window

The 1280 px mail app mock shows the same email at 600 px centered in the reading pane, which is the right behavior for wide windows. I treat this as not applicable rather than a fault: a desktop email should stay at 600 px, not stretch to the window. The faults in this copy are the same as in the main frame.

## Faults B, desktop 640

- The frame is 640 px wide. That's a little over the usual 600 px, and some mail apps will clip or scroll it. Narrow it to 600 px.
- There is no mobile frame, so a developer has no guidance on how it should look at 375 px.
- The preheader is shown as visible text under the logo (12 px Arial, #4a4a4a on a cream background). That's readable, but in the real email the preheader is usually hidden, and visible 12 px text duplicates the headline's message.
- The logo is flagged for dark mode with a reversed version, which is right.
- The footer has the postal address, an unsubscribe link and a privacy link at 44 px height, all good.
- Heading structure is a single H1, and the button is live text at 44 px, both good.

## Faults C, mobile 375 with an empty desktop frame

The mobile frame is well built: 20 px margins, headline wrapping to two lines, a 44 px button, and a footer with address and links. The desktop frame (600 px) is completely empty, so the desktop design is missing. The mobile preheader wraps onto two lines inside a visible box, which suggests it's longer than most apps display; keep it to about 40 to 90 characters.

## Faults D, desktop frame not built as modules

The mobile frame is grouped into header, intro and footer. The desktop frame is a flat pile of text and shapes (logo, preheader, headline, body, button, divider, footer) with no module frames for header, content and footer. That makes it hard for a developer to build it as table rows, and hard to match to the mobile version. The content itself is the same as B and C and has the same good footer and button.

## What looks fine

- Widths of 600 px desktop and 375 px mobile in Faults A, C and D.
- A single-column layout with consistent side padding.
- Short alt text on most images, and empty alt text on decorative icons.
- Primary buttons in B, C and D are live text, 44 px tall, with strong contrast (white on #0b5cad).
- Unsubscribe and privacy links are underlined with 44 px tap targets.
- Annotations describe mobile behavior for most blocks.

## Limits of this check

- I read layout, text, colors and sizes from the Figma data and a screenshot. I didn't open any exported HTML.
- Contrast figures are my own calculations from the hex colors in the file; I did not measure the hero headline against the photo, so that one is a visual judgment.
- I couldn't see the logo, hero and banner images at full size, so any text inside them beyond what's visible in the screenshot is unchecked.
- **TBD:** whether any of these are intentional is for the design owner to say. The layer names suggest the Faults A frame was built with deliberate mistakes, so the point of this check may be how many I caught rather than a fix list.

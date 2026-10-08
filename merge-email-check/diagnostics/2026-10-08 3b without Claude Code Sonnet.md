Model: claude-sonnet-5-5

# Email design review: Lumen "Plan your spring in an afternoon" (Control)

I reviewed the three frames on the Figma page "02 Control": Mobile 375, Desktop 600 and Dark Mobile 375. I read layout, text, colors and the annotations attached to each layer. I did not change anything in the file. Overall the design is in good shape for email, and the findings below are mostly small gaps to close before build.

## What already works

- **Width and layout.** The desktop frame is 600 px wide, the standard safe width, and the mobile frame is a single stacked column at 375 px with 20 px side padding. Nothing needs side-by-side layout to make sense.
- **Fonts.** Arial throughout, so no web-font fallback is needed.
- **Type size.** Body text is 16 px with 1.5 line height, headings are 32 px (H1) and 22 px (H2), and the footer is 13 px. Only the on-screen preheader line is 12 px.
- **Buttons.** The "Start planning" button is 164 by 44 px, which meets the 44 px touch target. It is real text, not an image, and the label is a clear action.
- **Footer links.** Unsubscribe, Manage preferences and Privacy policy are each 44 px tall, with space between them on mobile. The unsubscribe link and a postal address are present, and the reason for receiving the email is stated.
- **Contrast.** Light mode: dark gray text (#2b2b2b, #4a4a4a) on cream (#faf7f2) and white on blue (#0b5cad) are all comfortably above the 4.5:1 minimum. Dark mode: #ededed on #1c1c1c, #8ab4f8 links and a dark-on-light button also pass.
- **Dark mode is designed, not left to chance.** The dark frame has its own background, text, link and button colors, and a reversed logo is specified. The bright illustration and the photo are deliberately kept as they are.
- **Annotations are thorough.** Alt text, heading levels, dynamic content, tracked links, mobile behavior and the content-model field are all noted on the layers. The greeting has a fallback ("there").
- **Heading structure.** One H1 and three H2s, in order.
- **Preheader.** Present, 75 characters, and adds information (the 20 percent offer) rather than repeating the headline.

## Findings to fix or confirm

1. **Hero image has a gray box inside it (check before build).** In every frame the hero shows a darker rectangle in the lower left of the image. If that is text or a label baked into the image, it will disappear when images are blocked and it will not scale on mobile. If it is only a placeholder, the build note should say so. Either way, the hero alt text ("Planner open beside a cup of coffee") says nothing about it.
2. **Images-off view is not shown.** The hero is a full-width image with no background color fallback noted beyond a tan fill (#e8e1d6), and the intro button is above it, which helps, but there is no view showing the email with images blocked. Confirm the alt text will show in a readable size and color on that tan fill.
3. **Dark-mode logo swap will not work everywhere.** The annotation says to swap to logo-reversed.png in dark mode. The swap relies on dark-mode media queries, which Gmail's apps and some Outlook versions ignore (they invert colors themselves instead). The cream-colored logo box (#faf7f2 behind the logo) may show as a visible patch there. Suggest a logo that reads on both light and dark, or a transparent PNG with a light outline, as the fallback.
4. **Dark-mode colors may be overridden.** Gmail and Outlook apply their own inversion to colors that look light. The design is specific about colors, which is good, but the blue button (#0b5cad) will be recolored on some clients. Test in those clients rather than assume the dark frame is what readers see.
5. **Two identical CTAs.** "Start planning" appears twice, both to the same URL. That is fine for a long email, but give the two buttons different tracking parameters so Marketo can report which one gets the clicks.
6. **Inline link and heading share text.** The in-paragraph link "Read the planning guide" repeats the H2 above it word for word. Screen reader users who list links will hear it once, which is fine, but the heading and link together read as redundant. Consider a different heading.
7. **No "view in browser" link.** The header has no web-version link. It is a common safety net when a client renders the email badly.
8. **Header preheader line.** The design shows the preheader as visible text at 12 px. Real preheaders are hidden text. Confirm the build uses hidden preheader text plus padding characters, so a client does not pull body copy in after the 75 characters.
9. **Illustration alignment.** The 240 px illustration sits left-aligned with empty space to the right on both mobile and desktop, then the body text sits 16 px below it. This is a valid choice, but it looks unfinished next to full-width sections. Confirm with the designer.
10. **Features list structure.** The three "What you get" rows are separate rows with icons. Build them as a real list or table rows so a screen reader announces three items. The icons are marked decorative (empty alt), which is correct.
11. **Footer text size on mobile.** 13 px is small but acceptable for legal text. Do not go lower.
12. **Image weight and format.** No file sizes or formats are given for the hero or illustration. Specify PNG or JPG (not WebP, which many clients do not render), 2x for retina, and keep under about 200 KB each.
13. **Dark footer contrast is fine, but footer link color in light mode** (#0b5cad on #efeae2) is about 5.6:1, so it passes.

## Missing from the file

- A tablet or very narrow (320 px) check. The icon rows use no-wrap text and the longest row is 265 px wide plus padding, which still fits at 320 px, but the file should say so.
- Language attribute and email title for the build (not a design issue, but worth adding to the annotations).
- Plain-text version note.

## Priority

Fix or confirm first: items 1, 3 and 4 (they change what readers actually see). Then items 5, 7 and 8 (build notes). The rest are minor.

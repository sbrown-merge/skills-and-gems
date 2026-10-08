Model: claude-opus-5-5

# Email design check: Lumen "Plan your spring in an afternoon" (Control)

We checked the Control section on the 02 Control page ([node 2-3](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=2-3)), which holds three frames: Mobile 375, Desktop 600 and Dark mode, mobile 375. We read every layer, its text styles, colors, links and annotations, and we didn't change anything in the file.

The short version: this is a well-built email, and we found nothing that blocks a build. There are two small gaps worth fixing before handoff and a few things to confirm, listed below.

## What to fix

These two are small, but a developer would otherwise have to guess.

1. **The three feature icons have no alt text note.** The calendar, team and clock icons in "What you get" (for example [10:22](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-22), [10:30](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-30) and [10:36](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-36) on mobile, and the same icons in the other two frames) carry no annotation, while every other image does. In an email they'll ship as images, so they need a "Decorative image" note telling the developer to use empty alt text. The words beside each icon already say what it means, so a screen reader shouldn't read the icon too.
2. **The second button may not match its section.** The "Read the planning guide" section ([10:43](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-43)) has an inline link to the guide, then a "Start planning" button that goes to the planner, not the guide. A reader who has just read "Read the planning guide" may expect the button to open it. Either label the button for the guide, or move the planner button below the section so it reads as the closing call to action. This is a content judgment, so it's your call.

## What to confirm

These aren't faults in the design, but they're worth a quick check.

- **The hero is a placeholder.** The hero image ([10:13](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-13)) is an abstract gradient with a dark box in it, while its alt text reads "Planner open beside a cup of coffee". When the real photo goes in, check the alt text still describes it, and that the dark box isn't standing in for text set into the image, because text inside an image disappears when images are blocked.
- **Dark mode only works where the mail app allows it.** The dark frame uses its own colors (a lighter blue button, a reversed logo), which Apple Mail and some Outlook versions will show. Gmail's apps tend to invert colors on their own instead, so test the build there too, especially the logo and the orange icons.
- **There's no subject line in the file,** so we couldn't check it against the preheader. The preheader is 74 characters and adds to the headline rather than repeating it, which is good.

## What already passes

We checked these and they're fine as they are.

- **Layout:** a 600 px desktop width and a 375 px mobile width, a single column, and a note on every module saying how it behaves on mobile.
- **Type:** Arial throughout, which every mail app has. Body text is 16 px at 150% line height, the headline is 32 px, section headings are 22 px, and the smallest text is the 12 px preheader and the 13 px footer.
- **Contrast:** every text pair meets WCAG AA (the accessibility standard's 4.5:1 minimum). The lowest is the blue footer links on the footer background, at 5.6:1 in light mode and 7.2:1 in dark mode. White on the blue button is 6.7:1, and dark text on the dark-mode button is 8.1:1.
- **Buttons and links:** both buttons are 164 by 44 px, which is a comfortable size to tap, and every footer link has a 44 px tall tap area. Links are underlined, so they don't rely on color alone, and every link and button has its destination noted.
- **Accessibility:** heading levels are marked (one H1, then H2s), and the logo, hero and illustration all have alt text.
- **Personalization:** the greeting uses `{{lead.First Name}}` with "there" as the fallback when the name is empty.
- **Images:** each image has a dark-mode note, and the logo swaps to a reversed version.
- **Footer and compliance:** it says why the reader is getting the email, gives a postal address, and has unsubscribe, manage preferences and privacy policy links.

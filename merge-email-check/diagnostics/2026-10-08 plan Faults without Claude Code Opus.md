Model: claude-opus-5-5

# What to fix in 01 Faults, and in what order

Fix Faults A's footer first, then decide which call to action Faults A leads with, because that one choice decides how much of the button work is needed at all. After that, the fastest route is to work through Faults A one area at a time (hero, buttons and links, footer text, images, dark mode) rather than down the report's list of 28, since the report ranks by Must, Should and Could and so sends the designer back to the same element three or four times. Faults B, C and D are small, separate jobs that someone else can do alongside.

This plan is built only from the report of 2026-10-08 (merge-email-check 0.3.0). I haven't opened the Figma file.

## Faults A, in order

These are the steps for Faults A, in order. Each one gathers every fix that touches the same part of the email, with the report's check IDs so you can tick them off.

1. **Footer.** Add the sender's postal address and a Link or CTA note on the unsubscribe saying the developer sets the Marketo URL (EM-28). This is the only fix that's a legal blocker, so it goes first, and it takes minutes. While the designer is in the footer, darken the legal text from #999999 to at least 4.5 to 1 on #f5f5f5 (EM-19).
2. **Decide the one primary call to action** (EM-26). Faults A has four: "Shop now", "Get started", "Book a demo" and "Learn about pricing". This is a content decision, not a design fix, and the answer changes later steps: if "Shop now" isn't the lead, there may be no need to rebuild that image as a button, and "Book a demo" and the ghost button may go rather than be resized. **TBD:** who makes this call for Faults A, and by when.
3. **Hero.** Do these together, because they're all the top of the email. Put a dark background color behind the hero photo so the white headline reads with images off (EM-10), and use an off-white rather than pure white for the email and logo backgrounds (EM-15). Move the headline and a lead into the chosen CTA into the first 300px (EM-04). Keep the hero headline as the only H1, demote the offer heading, and fix the H1 to H3 skip (EM-23). Rebuild the banner's "Save 20% this week only" offer as live text, which clears EM-08 and EM-09 for the banner in one go.
4. **Buttons and links.** Build the chosen primary CTA as a live-text button, at least 44px tall, and repeat it rather than varying it (EM-08, EM-21, EM-26). Make the "See the event calendar" link at least 24px tall (EM-21). Rename "Click here" and "Read more" to say where they go, and underline them (EM-22, EM-24); that's one edit per link that clears two checks. If the ghost button survives step 2, give it an edge of at least 3 to 1 (EM-20).
5. **Alt text.** Write alt text for photo 1 and confirm the suggested text on photo 2, in both frames (EM-06, a Must). Shorten the two 74-character alt texts to about 38 characters (EM-07). The photos are placeholder art, so their alt text needs a second look once the final images arrive (EM-31).
6. **Dark mode.** Swap the outlined logo for a reversed one with no outline (EM-13). Pick one icon color that's at least 3 to 1 on both white and #121212 for the calendar and clock (EM-14); that also clears the calendar's EM-20 failure. Give the navy illustration a version or a background that reads on dark (EM-16), add dark-mode notes to photos 3 and 4 (EM-12), and put a background color behind the card image (EM-11).
7. **Developer notes.** Name fallbacks for Playfair Display and Inter (EM-17), add a written preheader as a text layer named "preheader" (EM-27), and add mobile-behavior notes to the 6 modules that lack them (EM-03).
8. **Tidy-up.** Set the two SVG images and the two unset images to export as JPG or PNG (EM-29), split the 1,700px slice under 1,500px (EM-30), move the mobile frame to the left of the desktop frame (EM-02), and bring the 5,189px length toward 4,500px (EM-05). Shortening the email may come free once step 2 removes competing CTAs.

## Faults B, C and D, alongside

These three emails need one fix each, and none of them depends on Faults A.

- **Faults B** needs a mobile frame drawn (EM-01, Must). Its 640px desktop width is accepted, though MERGE's default is 600px.
- **Faults C** needs its empty 600px desktop frame filled in (EM-01, Must). Until it has content, EM-04 and EM-05 can't be checked, so rerun the check once it's drawn.
- **Faults D** needs its desktop frame's loose layers grouped into modules with mobile notes (EM-03, Should). It's the only email with no Must failure, so it can go to build first once that's done.

## Questions for you before acting on the report

These are things in the report itself that I'd confirm before passing it to the designer.

- Fix 2 in the report says "most Outlook readers at work" see images blocked. The report gives no source for that, so I'd treat it as a reason to fix the hero, not as a figure to quote.
- The EM-20 result depends on whether the calendar and clock icons count as meaningful. The report assumed they are; if the designer says they're decorative, only the ghost button fails.
- The EM-18 flags (a 32px section heading, a 1.2 line height, centered body text and an all-caps sentence) don't fail anything, so I've left them out of the order. They're the designer's call.
- After all of this, the report's "Checked only in the build" list still applies: Gmail's clip at about 102KB, the HTML alt attributes, dark-mode code and a real test send with images off.

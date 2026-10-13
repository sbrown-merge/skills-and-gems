Model: claude-sonnet-5-5

# What to fix in the Faults emails, and in what order

Nearly all of the work is in Faults A. It fails 19 of the 31 checks, and the other three emails have only a few problems between them. The report's own list is ranked Must, then Should, then Could, and that's a sound base. We'd follow it, with a few changes where one fix affects another so you don't do work twice.

## Do first: the sending blockers in Faults A

These four are Must items, and each one stops the email from being safe to send.

1. **Footer (EM-28).** Add the sender's postal address and a note that the developer sets the unsubscribe link. Email law requires both, and the fix is small.
2. **Hero headline (EM-10).** Put a dark background color behind the hero photo so the white headline reads when images are off. While you're in the hero, also check the headline's white text where it crosses the light orange. The report couldn't measure it (EM-19), so the same fix may cover it.
3. **"Shop now" button and banner offer (EM-08).** Rebuild both as live text. This also clears the banner part of EM-09 (text inside an image), so don't treat that as a separate job later.
4. **Legal text (EM-19).** Darken it from 2.61 to 1 to at least 4.5 to 1, in both frames.

## Do next: decide the call to action before touching any buttons

Faults A has four different calls to action ("Shop now", "Get started", "Book a demo", "Learn about pricing"), which fails EM-26. Several other fixes depend on which of those survive, so we'd settle the choice now and then fix only the buttons that remain:

- The 44px size for "Book a demo" (EM-21)
- The weak edge on the "Learn about pricing" ghost button (EM-20)
- The button copy (EM-24)

If the ghost button or "Book a demo" gets cut, those fixes disappear. This is the one place where the report's order (items 6 and 8 before item 10) would have you doing work that may be thrown away.

While you're in the hero, the preview-area fix (EM-04) belongs with it. The first 300px should hold the headline and the primary call to action, not just a logo and a photo. Fixing the hero background (step 2) and moving content into it at the same time saves a second pass.

## Then the rest of the Must items

Once the call to action is settled, these are quick and mechanical.

- **Links and tap targets in Faults A.** Make "See the event calendar" at least 24px tall (EM-21), and underline "Click here" and "Read more" (EM-22). Rewrite those two labels at the same time to say where they go (EM-24), since you're editing the same two items.
- **Icons (EM-20 and EM-14).** The gray calendar icon appears under both checks. Recolor both icons to one color that reaches 3 to 1 on light and on dark, and both checks are done. The report notes that if the icons are decorative, only the ghost button fails, so confirm that first.
- **Alt text (EM-06).** Add alt text to photo 1 and confirm the suggested text on photo 2. Do this after the final photos are in, because the report says the current photos are placeholder art (EM-31).
- **Missing frames (EM-01).** Draw Faults B's mobile frame and fill in Faults C's empty desktop frame. Neither is hard, but both are Must items, and we'd do them before sign-off. Re-run the check on both afterward. B and C pass most checks now only because there's nothing to fail, so the new frames may turn up new faults. C's checks for the preview area and length (EM-04, EM-05) will also start to apply.

## Then the Should items in Faults A, grouped by where you work

The report lists these one at a time. They go faster if you take them by area.

- **Dark mode pass.** Reversed logo with no outline (EM-13), illustration that reads on dark (EM-16), dark-mode notes on photos 3 and 4 (EM-12), and off-white in place of pure white (EM-15). The pure-white fix is the widest, since it includes the email background itself, so do it with the hero background work.
- **Headings and top of the email.** One H1 with levels in order (EM-23), and a written preheader (EM-27).
- **Fonts.** Name fallback fonts for Playfair Display and Inter (EM-17).
- **Images.** Export SVG and unset images as JPG or PNG (EM-29), shorten the over-long alt text (EM-07), and add a background color behind the card image (EM-11).
- **Notes and layout.** Mobile-behavior notes on the other modules (EM-03), and move the mobile frame to the left of the desktop frame (EM-02).

Faults D has one Should item, EM-03. Its desktop layers need grouping into modules with mobile notes. It's the closest to ready, so this is worth doing early, because it may take D to a clean pass.

## Last: the Could items

Split the 1,700px slice under 1,500px (EM-30), and bring the length toward 4,500px (EM-05). Both are Could items. We'd also leave the "For the designer to judge" list for last, since those items don't change any result.

## Before you call it done

Re-run the check on all four emails. Then test in the build, since the report says this check can't see the HTML or the real send. Send a test with images off, from a mailbox that isn't on any safe-sender list.

## The checks

"Data" names the key in the result of script 01 (L, layout) or script 02 (I, images).

### Layout

- **EM-01 Each email has a mobile and a desktop frame at accepted widths (Must, House; script 00 and each frame's layer count).** Pass when every email has one frame in the mobile range and one in the desktop range. A frame with no layers counts as missing. Fail when an email lacks one, or a frame is drawn at a width no mail app shows; a wider frame that only shows the email inside a mail app window is N/A here, say so. A desktop frame of 601 to 700px passes, noting MERGE's default is 600px.
- **EM-02 The mobile frame sits to the left of the desktop frame (Should, House; frame positions).** Pass when each email's mobile frame is left of its desktop frame.
- **EM-03 Each module says how it behaves at mobile width (Should, Universal; L `em03`).** Default rule over `noted` against `modules`. Fail with "not grouped into modules" when `notGroupedIntoModules` is true.
- **EM-04 The main message and primary CTA sit in the preview area (Should, House; L `em04` and the frame screenshot).** Pass when the main message and the primary CTA, or a clear lead into it, start in the preview area of the desktop frame; Fail when it holds only a logo and an image.
- **EM-05 The email's length suits a scroll (Could, House; the desktop frame's height).** Pass up to the house length; Partly above it, suggesting sections and a repeated CTA rather than cutting content.

### Images off

Classic Outlook, new Outlook and Outlook on the web block images by default for most business readers, so the email with images off is often the first impression.

- **EM-06 Every image has alt text or is marked decorative (Must, Universal; I `images` and `counts.alt`).** Default rule over images without an alt or decorative note; a suggestion-only note counts toward Partly at most.
- **EM-07 Alt text fits on one line across its image (Should, Universal; I `counts.altFail`, `counts.altFlag`, each row's `fit`).** Apple Mail and others drop alt text wider than its box. Fail for any `altFail` (over 10% beyond the estimate); each `altFlag` is a flag, not a fault. Say it's an estimate. N/A with no alt notes.
- **EM-08 Headlines, offers and buttons are live text (Must, Universal; L `em23.headings` and `targets`, frame screenshots).** Fail when the main headline, the offer or a button is part of an image; screenshot each image the frame screenshots leave in doubt.
- **EM-09 No text sits inside an image, apart from the logo (Should, Universal; image screenshots).** Default rule over the images screenshotted, listing those with words. Report "possible text" for an unreadable one, and top out at Partly when some weren't screenshotted.
- **EM-10 Text over an image still reads on the color behind it (Must, Universal; I `em10`).** Each entry gives the text's contrast on the color behind the image with images off. Pass when there's none or every one meets EM-19's ratio; Fail otherwise.
- **EM-11 Every image has a background color behind it (Should, Universal; I `counts.background`).** Default rule over images without one.
- **EM-31 Alt text describes the image it's on (Should, Universal; I `images` alt notes and image screenshots).** List images whose alt text doesn't describe what the screenshot shows; decorative images are left out. N/A with no alt notes. Default rule over the images looked at, topping out at Partly when some weren't. On plainly placeholder art, a mismatch is a flag to confirm once the final image is in.

### Dark mode

Gmail's apps and classic Outlook recolor the email themselves and never swap an image, and images never invert. If the person gave a different dark-mode policy, judge EM-12 to EM-16 against it.

- **EM-12 Every image says how it behaves in dark mode (Should, House; I `counts.dark`).** Default rule over images without a dark-mode note.
- **EM-13 The logo has a reversed version, with no outline or plate (Should, House; I `logos` and screenshots).** Fail when there's no reversed version: no logo's dark-mode note names one (`namesReversed`) and no dark frame shows one. Partly when one is named but an outline, glow or plate is also present. Say how the logo was found (`why`).
- **EM-14 Icons are one color that works on light and dark (Should, House; I `em14`).** Pass when `under3` is 0; icons that swap are left out. Confirm a multi-color icon by screenshot, because the script may read its inner color.
- **EM-15 No background is pure white or pure black (Should, House; I `em15`).** Pass when `count` is 0. N/A when the project turned this off.
- **EM-16 Illustrations read on a dark background too (Should, House; I `illustrations` and screenshots).** Fail when an illustration's main shapes disappear on dark. N/A with none. Say whether you saw a dark frame or judged against the reference.

### Type

- **EM-17 A brand font names its fallback (Should, Universal; L `em17`).** Pass when every family is web-safe, or each brand font has a fallback note (a caption on the canvas isn't one); Partly when fallbacks are named but no frame shows the email in them.
- **EM-18 Type follows the house defaults (Could, House; L `em18`).** Everything here is a flag, never a lower result: section headings outside the range (the H1, `h1Left`, is left out and may be larger), body line height, centered body text, long all-caps text.

### Accessibility

WCAG 2.2 AA for every project.

- **EM-19 Text contrast meets WCAG 2.2 AA (Must, Universal; I `em19` and screenshots).** No Partly. 4.5 to 1, or 3 to 1 for text at least 24px or 18.66px bold, in every mode listed. Logos are exempt; footer and legal text aren't. Name each failing pair with its ratio and mode. Fail if any confirmed pair fails.
- **EM-20 Button edges and meaningful icons meet 3 to 1 (Must, Universal; I `em20`, `em14`).** Default rule over buttons and meaningful icons. Decide which icons carry meaning; decorative ones are exempt. A button whose fill contrasts with what's around it needs no contrasting edge. For icons, use only the ratio against the background behind them, not the dark reference. Check by screenshot when a button's label reads as 1 to 1 on its fill, because the script may have taken a card for a button.
- **EM-21 Tap targets are at least 24px, and meet the house size (Must, House; L `em21`).** Fail for any `under24`, however much space surrounds it. Partly for any `underHouse`. Pass otherwise.
- **EM-22 Text links are underlined (Must, Universal; L `em22`).** Links inside body text and standalone text links must be underlined; buttons and nav rows are exempt. Default rule over the links.
- **EM-23 There's one H1, and heading levels go in order (Should, Universal; L `em23`).** Pass with one H1 and no skipped level; Partly when headings carry no level note.
- **EM-24 Link and button text says where it goes (Should, Universal; L `targets` and `em22`).** List "click here", "read more", "this link" and anything that doesn't make sense out of context; default rule over all link and button text.

### Content

- **EM-25 Parts that change by audience are marked (Could, Universal; L `em25`).** N/A when the email has one version. Otherwise Pass when the parts that change carry dynamic-content notes and the text carries content-field notes; list merge tags found.
- **EM-26 There's one primary CTA, as a button, repeated rather than varied (Should, Universal; L `targets`, screenshots).** Pass when one action leads, as a button, and any repeat says the same thing.
- **EM-27 A written preheader is shown (Should, Universal; L `em27` per email).** Pass when each email's `found` is at least 1; a `request` asking for one doesn't count. When none is found, suggest a text layer named "preheader".
- **EM-28 The footer has an unsubscribe link and the sender's address (Must, Universal; L `em28`).** Fail when the unsubscribe or the address is missing. Partly when the unsubscribe has no Link or CTA note (`unsubNote`) that states its link, or says the developer sets it; a note that only lists what the footer needs doesn't count; a Figma hyperlink isn't needed, because the developer usually sets the real URL. If the footer was guessed and `unsubElsewhere` or `addressElsewhere` finds them elsewhere in the email, count them and say the footer guess may be wrong. Note a missing privacy or preferences link without changing the result.

### Export

- **EM-29 Images export as JPG or PNG (Should, Universal; I `counts.exportSvgPdf`, `counts.exportNone`).** Fail for any SVG or PDF; Partly when some images have no export setting.
- **EM-30 Image slices stay under the house height (Could, House; I `counts.tall`).** Default rule over the images.

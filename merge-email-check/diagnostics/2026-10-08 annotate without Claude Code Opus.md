Model: claude-opus-5-5

# Annotate baseline (no skill), Opus 5.5, 2026-10-08

File pgpRQNF2ey2fXl3lMS9D2O. A throwaway page "99 Annotate baseline" (74:250) held a clone of section 6:2 (Faults A); the clone section was 74:251, desktop frame 74:252, mobile frame 74:311. The step 2 report came from merge-email-check 0.3.2, run on 74:251 with the defaults ("go", report only).

## What I told the person

I've put the 17 most important findings from the check on the layers at fault as Dev Mode annotations, on both the desktop and the mobile frame, so 34 annotations in all. That's every Must finding that has a layer (12 of them), plus five Should findings that change what readers see: the logo in dark mode, the two heading-level problems, the missing preheader, and the competing calls to action.

Each annotation starts with its check and rank, such as **EM-10 (Must)**, says what's wrong in a sentence, and then gives the fix, ending "From the email check, 2026-10-08." I filed them under Figma's own Accessibility (18), Development (10) and Content (6) categories. I didn't use your note kinds (Alt text, Heading level, Link or CTA and so on), because the checker reads those as design decisions, and a finding filed as an Alt text note would make an image look as if its alt text were done. Your existing annotations are all still there, unchanged, with the new one added after them.

Here's what's on the canvas now, Must first:

- **EM-10**, hero headline: white on white with images off. Give the hero a dark background color behind the photo.
- **EM-08**, the "Shop now" button and the "Save 20%" banner: both are pictures. Rebuild them as live text.
- **EM-19**, footer legal text: #999999 on #f5f5f5 is 2.61 to 1. Darken it to #666666 or darker.
- **EM-21**, "See the event calendar" (20px tall) and "Book a demo" (36px): make both at least 44px tall.
- **EM-28**, footer: there's no postal address, and Unsubscribe has no note saying where it links.
- **EM-06**, photo 1 has no alt text, and photo 2 has only a suggested one.
- **EM-20**, "Learn about pricing": its #dddddd edge is 1.36 to 1 on white.
- **EM-22 and EM-24**, "Click here" and "Read more": underline them and say where they go.
- **EM-13**, logo: there's no reversed version for dark mode, only an outline and a white plate.
- **EM-23**, the second H1 and the H1-to-H3 jump: make both H2.
- **EM-27**, header: there's no written preheader.
- **EM-26**, buttons: four different calls to action compete, and the main one is an image.

The findings I left off the layers are still in the report. Some have no single layer to sit on: the font fallbacks (EM-17), the frame order (EM-02), the preview area (EM-04) and the email's length (EM-05). The rest are lower-ranked Should and Could items, such as alt text length, background colors, dark-mode notes on images, icons, the illustration on dark, export formats and the tall slice. Putting all of them on the canvas would bury the ones that matter.

## Code I ran for step 3

Before writing, I ran one read-only script to list the file's annotation categories and the clone's layer IDs; it changed nothing. This is the only script that wrote to the file:

```javascript
// Step 3: add Dev Mode annotations for the most important findings, on the clone only (page 74:250).
// Existing annotations are kept and re-written unchanged; one new annotation is appended per layer.
const PAGE_ID = '74:250';
const CAT = { a11y: '1:2', dev: '1:0', content: '1:3' }; // preset categories; none is one of the eight note kinds
const SRC = ' _From the email check, 2026-10-08._';
const F = [
  // [desktop id, mobile id, category, markdown]
  ['74:257','74:316','a11y','**EM-10 (Must):** With images off, this white headline sits on a white background (1 to 1; it needs 3 to 1), so it disappears in Outlook. **Fix:** give the hero a dark background color behind the photo, such as the photo\'s deep purple, so the headline reads with images blocked.'],
  ['74:275','74:334','dev','**EM-08 (Must):** The main button, "Shop now", is a picture, so it vanishes when images are blocked. **Fix:** build it as a live-text button (white text on a #0b5cad shape, at least 44px tall), like "Get started".'],
  ['74:268','74:327','dev','**EM-08 (Must):** The offer, "Save 20% this week only" and its subline, is baked into the image, so readers with images off never see it. **Fix:** set the offer as live text on a #0b5cad background and keep the image only as decoration behind it.'],
  ['74:307','74:367','a11y','**EM-19 (Must):** This legal text is #999999 on #f5f5f5 at 11px, which is 2.61 to 1; WCAG 2.2 AA needs 4.5 to 1. **Fix:** darken it to #666666 or darker (about 5.3 to 1), and consider 12px or larger.'],
  ['74:303','74:363','a11y','**EM-21 (Must):** This link is only 20px tall, under WCAG\'s 24px minimum and our 44px tap target. **Fix:** give it at least 44px of tappable height with padding.'],
  ['74:298','74:358','a11y','**EM-21 (Must, house size):** This button is 36px tall, under our 44px tap target. **Fix:** make it at least 44px tall.'],
  ['74:306','74:366','content','**EM-28 (Must):** The footer has no sender postal address, which email law requires, and the Unsubscribe link has no Link or CTA note saying where it goes. **Fix:** add the mailing address, add a Link or CTA note on Unsubscribe (for example, the developer sets the Marketo unsubscribe link), and consider a preferences link.'],
  ['74:288','74:347','dev','**EM-06 (Must):** This image has no alt text and isn\'t marked decorative, so screen readers and readers with images off get nothing. **Fix:** add an Alt text note describing the photo, or a Decorative image note if it adds nothing.'],
  ['74:289','74:348','dev','**EM-06 (Must):** The alt text here is only a suggestion ("Team lunch"), not a decision. **Fix:** confirm it as a real Alt text note, or replace it.'],
  ['74:300','74:360','a11y','**EM-20 (Must):** This outline button has no fill, and its #dddddd edge is 1.36 to 1 on white; a button edge needs 3 to 1. **Fix:** set the border to #0b5cad, like the label, or give the button a fill.'],
  ['74:260','74:319','a11y','**EM-22 and EM-24 (Must):** "Click here" is marked as a link only by its blue color, and it doesn\'t say where it goes. **Fix:** underline it and reword it to name the destination, for example "see the spring planning tools".'],
  ['74:302','74:362','a11y','**EM-22 and EM-24 (Must):** "Read more" isn\'t underlined and doesn\'t say what it leads to. **Fix:** underline it and name the destination, for example "Read the spring planning guide".'],
  ['74:254','74:313','dev','**EM-13 (Should):** There\'s no reversed logo for dark mode; the plan is a 2px white outline on a white plate, which our dark-mode policy rules out. **Fix:** supply a reversed (light) logo for dark mode with no outline or plate, and update the Dark mode note to name the swap.'],
  ['74:270','74:329','a11y','**EM-23 (Should):** This is a second H1; an email should have one. **Fix:** make this heading an H2.'],
  ['74:263','74:322','a11y','**EM-23 (Should):** The headings jump from H1 to H3 here. **Fix:** make this heading an H2.'],
  ['74:253','74:312','content','**EM-27 (Should):** There\'s no written preheader, only a suggestion to add one, so mail apps will show whatever text comes first. **Fix:** add a text layer named "preheader" holding the preview line.'],
  ['74:295','74:355','content','**EM-26 (Should):** Four different calls to action compete here and above (Shop now, Get started, Book a demo, Learn about pricing), and the main one is an image. **Fix:** pick one primary action, make it the live-text button, and repeat that same action rather than varying it.'],
];
const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);
const added = [], errors = [];
for (const [d, m, cat, md] of F) {
  for (const id of [d, m]) {
    const n = await figma.getNodeByIdAsync(id);
    if (!n) { errors.push(id + ' not found'); continue; }
    let p = n; while (p && p.type !== 'PAGE') p = p.parent;
    if (!p || p.id !== PAGE_ID) { errors.push(id + ' is not on the clone page'); continue; }
    const keep = (n.annotations || []).map(a => {
      const o = {};
      if (a.labelMarkdown) o.labelMarkdown = a.labelMarkdown; else if (a.label) o.label = a.label;
      if (a.categoryId) o.categoryId = a.categoryId;
      if (a.properties && a.properties.length) o.properties = a.properties;
      return o;
    });
    n.annotations = [...keep, { labelMarkdown: md + SRC, categoryId: CAT[cat] }];
    added.push(id + ' ' + n.name);
  }
}
return { addedCount: added.length, added, errors, mutatedNodeIds: added.map(s => s.split(' ')[0]) };
```

Result: `addedCount: 34`, `errors: []`.

## Cleanup check

Of the 46 layers in the clone that had annotations before step 3 (73 annotations), all 46 kept the same labelMarkdown in the same order, so 46 of 46 were unchanged and none changed. I added 34 annotations, 2 on each of 17 layer pairs (desktop and mobile), all on layers in the clone: Accessibility 18, Development 10, Content 6. None used one of the eight note-kind categories. 17 of the 34 went on layers that already had notes; those notes are untouched, with the new annotation after them. The clone's total went from 73 to 107.

I deleted page "99 Annotate baseline" (74:250); the first try failed because it was the current page, so I switched to page 0:1 and deleted it. The real pages' fingerprint, rerun against the first result: `intact: true`, `changed: []` (495 nodes, hash def9ff43, 254 annotations, 4 pages). During the run, two other eval pages ("99 Annotate eval Sonnet", "99 Annotate eval Opus") were also in the file, which is why the clone fingerprint showed 7 pages. They had gone by the time I cleaned up.

Each check's data sits under its own key. Per email: `em03`, `em27` and `illustrations`. Per frame: `em04` (light frames only), `em10`, `em14`, `em15`, `em18` to `em23`, `em28`, buttons and standalone links top to bottom under `targets`, image rows under `images`, `logos` and `imagesNamedLikeText`. Across the whole scope: `em17`, `em25`, the image `counts` (summed over every frame), and `notes`. An `em03` reading "no light frame has layers" makes EM-03 Couldn't check, pointing to EM-01. **Notes** are Dev Mode annotations: a category named Alt text, Decorative image, Heading level, Link or CTA, Dark mode, Dynamic content, Mobile behavior or Content model field, or any annotation whose text starts with one of those names and a colon. Notes marked `(suggestion)` only suggest something, and count toward Partly at most.

Then look, taking screenshots of the smallest layer that shows what you need, at 2x or more if you can:

- each email's frames, for EM-04, EM-08, EM-24 and EM-26;
- each image layer that might hold words, for EM-09 (start with `imagesNamedLikeText`), and each image with an alt note, for EM-31, at most 15 in all, listing the rest as not checked;
- each logo in `logos`, for EM-13, and in a dark frame if there is one;
- each item in `illustrations`, for EM-16: in the dark frame where `inDarkFrame` is given, otherwise judge it against the dark reference background;
- the text layers in `em19.checkFromScreenshotEx` and the `em10` entries marked for a screenshot (text over an image or gradient), at most 10, and any icon in EM-14's list with more than one color.

The scripts find the logo, icons, buttons, the footer and the preheader from layer types, fills and names. Confirm each from the screenshots, and say in the report which you corrected.

Small text in a screenshot isn't reliably readable: when you can't read it, say so rather than guess. Then post the first progress line, for example: "Read 2 emails, 12 images and 41 text layers; judging now."

### Step 4: Judge

Judge every check below from the data and screenshots, running no scripts, once for each email in the scope. Missing data makes a check Couldn't check, naming the read that failed.

Each check is Pass, Partly, Fail, Couldn't check or N/A, with evidence: the count and up to three examples linked to their layers. A check can also carry **flags**, items for the designer to judge, which are listed without changing its result. A check is N/A for an email that has none of what it looks at, such as no icons for EM-14, no mobile frame for EM-02, or no desktop content for EM-04, and an email with nothing drawn is N/A on every check but EM-01. Unless a check below says otherwise, a check judged from a count uses the **default rule**: Pass when nothing is found, Partly when the problem affects fewer than half of the items checked, Fail at half or more.

If the layout part's `notes.matched` is 0, the file uses none of the note kinds, so EM-03, EM-06, EM-07, EM-12 and EM-23 are Couldn't check, and the report suggests the eight note kinds above.

Then rank the fixes: Must, then Should, then Could, and within a rank whatever affects the most readers. Must means the email breaks for a real group of readers, or it's a standard every project is held to (WCAG 2.2 AA, email law). Should measurably improves how the email reads or performs, or saves a build correction. Could is worth doing while someone is in that area. Then post the second progress line.

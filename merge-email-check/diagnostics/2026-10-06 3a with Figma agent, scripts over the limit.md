# Case 3a, with the skill 0.1.1, in Figma's agent, 2026-10-06: scripts over the limit

This is the first run of merge-email-check inside Figma's agent, on page 01 Faults of the deliberate-faults file, run by Steve on 2026-10-06 with the prompt from [eval-prompts.md](../eval-prompts.md). It doesn't count as an evaluation result, because both parts of script 01 failed before they ran: Figma's agent runs scripts through a tool called `evaluate_script`, which rejected the 30,292-character script with "Input validation error: Invalid arguments for tool evaluate_script: code: Too big: expected string to have <=20000 characters". Scripts 00 and the fingerprint, each under 5,000 characters, ran.

## What it shows

The skill failed the way it's meant to. It marked the 21 checks that depend on script 01 Couldn't check, named the read that failed for each, and still judged what script 00 and its screenshots could settle: EM-01 (Faults B has no mobile frame, Faults C's desktop frame is empty), EM-02 (Faults A's mobile frame is on the right), EM-04, EM-05, EM-08, EM-09, EM-24, EM-26 and EM-28's missing address. It set aside the copy of Faults A inside the mail-app frame, as EVAL.md expects. Three of those checks, EM-02, EM-04 and EM-05, are ones the run without the skill missed.

Two things to fix besides the size:

- **The scorecard covers the whole page, not each email.** EVAL.md's expected results are per email, so EM-02 came out Partly for "1 of 3 pairs", where EVAL.md expects Fail on Faults A. **TBD:** either the report template scores each email, or EVAL.md's scoring rule says how a page-level result maps to the per-email table.
- **EM-13 and EM-16 asked for a dark frame that this test email deliberately doesn't have.** That's the expected finding, but the report put it under Couldn't check rather than Fail, because the logo's dark-mode note couldn't be read. It should resolve once script 01 runs.

## The fix

Script 01 is being split into a layout script and an images script, each under 17,000 characters before its placeholders are filled, so the email list the agent pastes in still leaves room under 20,000. The limit is recorded in [figma-agent-skills.md](../../figma-agent-skills.md). After the split, case 3a with the skill runs again.

## The report

The report is kept here as the agent sent it, in a fenced block so its links survive.

````markdown
# Email check: 01 Faults

These emails are not ready for build. First complete the missing responsive designs, replace essential image-based copy with live text, and add the missing sender addresses. This is a partial audit: detailed layout and image-property reads exceeded the supported size, so unconfirmed checks are not treated as passes.

Checked October 6, 2026 with merge-email-check 0.1.1. Emails: Faults A, B, C, and D. House numbers: MERGE’s defaults; no audience variants assumed. The duplicate mail-app presentation of A was excluded.

## Scorecard

| Check | Rank | Result | Evidence |
| --- | --- | --- | --- |
| EM-01 Mobile and desktop frames | Must | Fail | 2 of 4 emails lack a usable version: B has no mobile; [C desktop](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-39) has 0 children. B’s 640px desktop is accepted; 600px is the default. |
| EM-02 Mobile sits left of desktop | Should | Partly | 1 of 3 pairs is reversed: [A mobile](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-70) sits right of desktop. |
| EM-03 Mobile behavior documented | Should | Couldn't check | Layout-note read unavailable. D also has 5 loose children among 7 desktop children. |
| EM-04 Message and CTA in preview | Should | Partly | 1 of 3 populated desktop designs misses the first-300px goal: [A desktop](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-3) opens with logo and hero imagery; message and CTA follow lower down. |
| EM-05 Scroll length | Could | Partly | 1 of 3 populated desktop designs exceeds about 4,500px: [A desktop](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-3) is 5,189px. |
| EM-06 Alt text or decorative status | Must | Couldn't check | Image-note read unavailable for 36 image-fill layers. |
| EM-07 Alt text fits | Should | Couldn't check | Alt-note and width-estimate read unavailable. |
| EM-08 Essential copy is live text | Must | Fail | A has 2 rasterized offer banners and 2 rasterized buttons. Examples: [Offer banner](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-19), [Shop now](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-26). |
| EM-09 No non-logo text in images | Should | Partly | 4 of 15 sampled images contain words. Example: [Mobile offer banner](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-86). Another 13 images were not individually inspected. |
| EM-10 Text reads with images off | Must | Couldn't check | Images-off background and contrast read unavailable. |
| EM-11 Image background colors | Should | Couldn't check | Own and wrapper background-fill read unavailable. |
| EM-12 Dark-mode image behavior | Should | Couldn't check | Dark-mode note read unavailable. |
| EM-13 Reversed logo, no plate | Should | Couldn't check | 6 logo screenshots show the regular logo, found by name. No dark version was supplied; reversed-logo notes and inherited plates are unconfirmed. |
| EM-14 Icons work on light and dark | Should | Couldn't check | Icon color and contrast read unavailable; small screenshots cannot establish all colors. |
| EM-15 Avoid pure backgrounds | Should | Couldn't check | Exact background-color read unavailable. |
| EM-16 Illustrations on dark | Should | Couldn't check | 2 illustrations inspected, but neither has a supplied dark rendering or confirmed comparison against #121212. |
| EM-17 Brand-font fallbacks | Should | Couldn't check | Font-family and fallback-note read unavailable. |
| EM-18 House type defaults | Could | Couldn't check | Font-size, line-height, and text-case read unavailable. |
| EM-19 WCAG text contrast | Must | Couldn't check | Contrast ratios and mode-specific pairs unavailable. Visual appearance alone does not establish compliance. |
| EM-20 Button and icon contrast | Must | Couldn't check | Button-edge and meaningful-icon ratios unavailable. |
| EM-21 Tap-target sizes | Must | Couldn't check | Target-dimension read unavailable; 24px and 44px thresholds unconfirmed. |
| EM-22 Underlined text links | Must | Couldn't check | Complete decoration and link-segment read unavailable. |
| EM-23 Heading hierarchy | Should | Couldn't check | Heading-level note read unavailable. |
| EM-24 Descriptive action labels | Should | Partly | 4 of 30 observed action labels are vague: 2 “Read more” and 2 inline “Click here.” Examples: [Read more](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-61), [Intro copy](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-11). |
| EM-25 Audience-dependent content | Could | N/A | One audience version assumed. |
| EM-26 One primary CTA | Should | Partly | 1 of 4 emails has competing actions: A uses Shop now, Get started, Book a demo, and pricing. Example: [A CTA area](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-54). |
| EM-27 Written preheader | Should | Couldn't check | 4 preheader text layers found in B/C/D; none inside A. Page-level attribution and notes unavailable. |
| EM-28 Unsubscribe and sender address | Must | Fail | Both A footers lack a visible sender address. Example: [A desktop footer](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-65). All 6 populated footers show Unsubscribe; destination notes remain unconfirmed. |
| EM-29 JPG or PNG exports | Should | Couldn't check | Export-setting and inherited-format read unavailable. |
| EM-30 Image-slice height | Could | Couldn't check | Image-height inventory unavailable. |

## Fix these first

1. **Complete both responsive versions** (EM-01, Must). Add B’s mobile design and populate C’s empty desktop design so neither layout is left to interpretation. Examples: [B desktop](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-5), [C desktop](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=8-39).
2. **Make essential offers and buttons live text** (EM-08, Must). A’s promotional banners and Shop now labels disappear when images are blocked. Examples: [Offer banner](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-19), [Shop now](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-26).
3. **Add the sender’s postal address to both A footers** (EM-28, Must). Keep the unsubscribe destination explicit for the developer. Examples: [Desktop footer](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-65), [Mobile footer](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-133).
4. **Bring A’s message and action into the preview area** (EM-04, Should). Readers should understand the offer without scrolling. Example: [A desktop](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-3).
5. **Choose one leading action and use descriptive labels** (EM-24, EM-26, Should). Replace vague links and make secondary actions clearly secondary. Examples: [CTA area](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-54), [Read more](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-61).
6. **Move A’s mobile design left of desktop** (EM-02, Should). This follows the house review arrangement. Example: [A mobile](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-70).
7. **Review A’s long scroll** (EM-05, Could). Use clear sections and repeat the primary CTA rather than cutting necessary content. Example: [A desktop](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=6-3).

## For the designer to judge

- Confirm a written preheader for A, potentially outside its email frames (EM-27).
- Check the two dark calendar illustrations against a real dark background (EM-16).
- Confirm whether the small calendar and clock icons carry meaning or are decorative (EM-20).
- No preferences link was visible in the six populated footers. Privacy links were visible (EM-28).
- Group D’s loose desktop content into modules and confirm its mobile behavior (EM-03).

## Checked only in the build

This design check can't see the HTML or the send: its weight against Gmail's clip at about 102KB, Outlook-only code, the `alt` attributes, the dark-mode code, tracked links, and how each mail app renders. Check those in the build and on a real test send, with images off, from a mailbox that isn't on any safe-sender list.

## What couldn't be checked

The detailed layout and image-property reads exceeded a 20,000-character limit.

- Layout read unavailable: EM-03, EM-17, EM-18, EM-21, EM-22, EM-23, and full EM-27 attribution.
- Image-property read unavailable: EM-06, EM-07, EM-10, EM-11, EM-12, EM-14, EM-15, EM-19, EM-20, EM-29, and EM-30.
- EM-13 lacks reversed-logo note evidence and a dark-frame reference.
- EM-16 lacks a confirmed dark-background comparison.
- Thirteen image layers remain unconfirmed for embedded words under EM-09.
- Unsubscribe destination notes under EM-28 remain unconfirmed.
````

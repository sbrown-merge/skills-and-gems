# Case 3b, with the skill 0.2.1, in Figma's agent, 2026-10-06

This is the run of merge-email-check on page 02 Control of the deliberate-faults file, the email built to pass every check. Steve ran it in Figma's agent on 2026-10-06 with the page open, nothing selected and "this page" as the scope, answering "go". The model is undisclosed. The run took 10 minutes 58 seconds, and the agent offered `/merge-email-check-plan` at the end.

## Scoring against the expected results

The skill matched all 30 expected results on the Control: 29 Pass and EM-25 N/A ([EVAL.md](../EVAL.md)). It raised no false alarm, which was the point of the case, and it applied version 0.2.1's N/A rule where the email had nothing to check. It confirmed the dark-mode checks against the email's own dark frame rather than the reference color, and read the small footer text from the text layers rather than guessing it from screenshots.

Three things for the skill:

- **It put a proposed new check under "Fix these first", ranked Must.** The hero's alt text names a planner and a coffee cup, but the placeholder artwork is abstract. The report proposed an "alt text matches the image" check and listed the fix first. The template means "Fix these first" for failed checks only, so a proposal belongs under "Problems no check covers". The run without the skill on case 3a raised the same alt-text mismatch, so two independent runs have now asked for this check. **TBD:** Steve decides whether it becomes a check.
- **It flagged EM-04 on the mobile frame.** The mobile CTAs start at y 312, just past 300px; the check passes because it applies to desktop. This is the checklist's open question on EM-04, and the agent handled it as a flag, which is right while the question is open.
- **It offered the plan skill, but there's no annotations skill to offer.** merge-build-readiness has a companion that writes findings as Dev Mode annotations; merge-email-check doesn't yet. **TBD:** Steve decides whether to build one.

## The report

````markdown
# Email check: 02 Control

The Control email passes all 29 applicable checks; one check is not applicable. Before build, make the hero artwork and its alt text agree: the image appears abstract, but its description names a planner and coffee cup.

Checked 2026-10-06 with merge-email-check 0.2.1. Emails: Control. House numbers: MERGE’s defaults. Findings are report-only.

## Scorecard

| Check | Rank | Result | Evidence |
| --- | --- | --- | --- |
| EM-01 Mobile and desktop widths | Must | Pass | Populated 375px mobile and 600px desktop views; seven modules each. |
| EM-02 Mobile left of desktop | Should | Pass | Mobile x=80; desktop x=535. |
| EM-03 Mobile behavior documented | Should | Pass | All 7 desktop modules have behavior notes. |
| EM-04 Message and CTA in preview | Should | Pass | Desktop headline starts at y138; primary button at y232, within 300px. |
| EM-05 Scroll length | Could | Pass | Desktop is 1,538px tall, below approximately 4,500px. |
| EM-06 Alt text or decorative marking | Must | Pass | All 9 image occurrences have alt notes. Accuracy issue is listed below. |
| EM-07 Alt text fits | Should | Pass | All 9 pass the estimated single-line width; no borderline flags. |
| EM-08 Headlines, offers, and buttons are live text | Must | Pass | Live headlines and buttons in all 3 views. Offer appears in live preheader text. |
| EM-09 No words baked into images | Should | Pass | All 6 nonlogo images inspected; no visible words. |
| EM-10 Images-off text contrast | Must | Pass | No text overlaps images in any view. |
| EM-11 Image background colors | Should | Pass | All 9 images have their own background or a matching solid wrapper. |
| EM-12 Dark-mode behavior documented | Should | Pass | All 9 images have dark-mode notes. |
| EM-13 Reversed logo without outline or plate | Should | Pass | Logos found by name; dark view shows reversed lettering without a plate or outline. |
| EM-14 Icons work on light and dark | Should | Pass | All 9 icon occurrences are single-color; none fail 3:1. |
| EM-15 No pure-white or pure-black backgrounds | Should | Pass | No flagged backgrounds across 3 views. |
| EM-16 Illustrations read on dark | Should | Pass | Calendar and clock remain visible in the actual dark view. |
| EM-17 Font fallbacks | Should | Pass | All 54 text layers use web-safe Arial. |
| EM-18 House typography | Could | Pass | No flags for heading size, line height, centered body text, or long capitals. |
| EM-19 WCAG text contrast | Must | Pass | All 54 text layers checked; no failing contrast pairs. |
| EM-20 Button and icon contrast | Must | Pass | All 6 buttons pass: light fills 6.24:1; dark fills 8.09:1. No actual-background icon failures. |
| EM-21 Tap-target sizes | Must | Pass | All 15 detected buttons and standalone links meet 44px; none below 24px. |
| EM-22 Underlined text links | Must | Pass | All 3 inline and 6 nonnav standalone links underlined. |
| EM-23 Heading hierarchy | Should | Pass | Each view has one H1 and three H2s, with no skipped levels. |
| EM-24 Descriptive action labels | Should | Pass | All 18 action labels reviewed; none are vague. |
| EM-25 Audience-dependent content | Could | N/A | No audience versions assumed. Three personalization tags have supporting notes. |
| EM-26 One consistent primary CTA | Should | Pass | All 6 primary buttons say “Start planning.” |
| EM-27 Written preheader | Should | Pass | One written preheader per view. Three additional matches were behavior notes, not preheaders. |
| EM-28 Unsubscribe and sender address | Must | Pass | All 3 footers include both; notes assign the unsubscribe URL to the developer. |
| EM-29 JPG or PNG exports | Should | Pass | All 9 images configured: 6 PNG, 3 JPG. |
| EM-30 Image-slice height | Could | Pass | No image exceeds 1,500px; tallest is 300px. |

## Fix these first

1. **Make the hero image and its alternative description agree** (proposed additional check, Must). All three hero occurrences appear to show abstract artwork, not the “Planner open beside a cup of coffee” described in the alt notes. Supply the intended photo, write an accurate alternative, or explicitly mark the artwork decorative if appropriate. Examples: [mobile hero](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-13), [desktop hero](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-65), [dark hero](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-117).

## For the designer to judge

- **Offer visibility (EM-08):** The twenty-percent discount appears only in the preheader in all three views. If this is an offer-led campaign, consider repeating it in the main message. Example: [desktop preheader](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-58).
- **Mobile preview visibility (EM-04):** Both mobile CTAs start at y312, just beyond 300px. The check passes because its requirement applies to desktop. Consider moving them higher if mobile preview visibility is also a goal. Examples: [light mobile primary button](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-10), [dark mobile primary button](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-114).

## Problems no check covers

Proposed check: **Alt text accurately represents the final image.** EM-06 checks whether an alternative description exists, not whether it matches the artwork. The hero mismatch affects three image occurrences. Example: [desktop hero image](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=10-65).

## Checked only in the build

This design check can't see the HTML or the send: its weight against Gmail's clip at about 102KB, Outlook-only code, the `alt` attributes, the dark-mode code, tracked links, and how each mail app renders. Check those in the build and on a real test send, with images off, from a mailbox that isn't on any safe-sender list.

## What couldn't be checked

None of the 30 design checks lacked required evidence. Small footer wording was confirmed from the text layers rather than guessed from screenshots.
````

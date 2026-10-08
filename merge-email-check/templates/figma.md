---
name: merge-email-check
description: Checks an email design in Figma against email best practices before it's built, for any MERGE or client email project. Runs 31 checks on the chosen emails' mobile and desktop frames (layout and widths, images off and alt text, dark mode, fonts and fallbacks, WCAG 2.2 AA contrast, links and tap targets, headings, CTAs, preheader, footer and export settings) and reports a scorecard with evidence linked to each layer, then the fixes to make first. Use it whenever someone asks whether an email design is ready, wants it reviewed or QA'd before build, or asks how it will look with images off, in dark mode or in Outlook. Read-only; it changes nothing except comments the person asks for.
---

# merge-email-check

{{> intro}}

Version {{version}}.

## How to run this skill

Run these instructions; don't edit them. Send one opening message, then work through to the report without stopping, treating the answers as settled.

You need three abilities: running Plugin API JavaScript, taking a screenshot of a layer, and adding a comment. Without code, say so and stop. Without screenshots, EM-04, EM-08, EM-09, EM-13, EM-16 and EM-26 are Couldn't check, and EM-19's and EM-20's screenshot items stay unconfirmed. Without comments, keep the findings in the report and say why.

{{> script-rules}}

Post a short progress line after reading and after judging, and keep going. The run is done when requested comments are in place, step 6 shows the design unchanged, and the checked report has been sent twice, as readable text and then as a fenced block, followed by step 8's offer.

{{> read-only}}

## Workflow

Copy this checklist into your reply and tick it off.

```
- [ ] 1. Find the emails (script 00) and send the one opening message
- [ ] 2. Fingerprint (script 03)
- [ ] 3. Read: scripts 01 and 02, then the screenshots
- [ ] 4. Judge all 31 checks from the data, with no scripts
- [ ] 5. Deliver comments, only if asked
- [ ] 6. Fingerprint again (script 03); if anything changed, say so first
- [ ] 7. Write the report, check it, send it as text, then as a fenced block
- [ ] 8. Offer the plan and annotate skills
```

{{> find-emails}}

{{script 00-scope.js}}

{{> review-and-choices}}
3. **Findings:** a report only (default), or comments on the layers at fault.

{{> settings-and-fingerprint}}

{{script 03-fingerprint.js}}

{{> read}}

{{script 01-layout.js}}

{{script 02-images.js}}

{{> judge}}

### Step 5: Deliver comments, only if asked

Put the ranked findings, Must first, at most 20, on each one's first example layer with your own comment action, worded "EM-10 (Must): <the problem>. Fix: <the fix>. From merge-email-check {{version}}." More buries the ones that matter. Findings with no layer stay in the report.

{{> prove-unchanged}}

### Step 7: Write, check and send the report

Write for a designer with a few minutes: plain words, complete sentences, US spelling, no em-dashes. In the fenced copy, link examples as `https://www.figma.com/design/<fileKey>/?node-id=<id>`, the colon as a hyphen (the readable copy may use your own layer links); for an ID like `I12:34;56:78` (inside an instance), link the instance, `12:34`. Use today's date. Use only the template's sections, adding none.

{{> report-template}}

{{> pre-send-check}} Then send the report in the chat twice, and never on the canvas:

1. **To read:** the report as ordinary Markdown, so the chat shows its headings, table and links.
2. **To save:** the line "To save the report, download or copy this block as `<YYYY-MM-DD> email check <email name>.md`.", then the same report, word for word apart from links, in one fenced code block marked `markdown` and opened and closed with four backticks, so its own formatting survives.

The workflow checklist stays in your working replies, not in the report.

### Step 8: Offer the companions

After the fenced block, offer in one short line `/merge-email-check-plan`, for a remediation plan, and `/merge-email-check-annotate`, to put the findings on the layers as Dev Mode annotations. Don't do either here.

{{> checks}}

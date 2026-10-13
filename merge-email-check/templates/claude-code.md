---
name: merge-email-check
description: Checks an email design in a Figma file against email best practices before it's built, through the Figma MCP server. Runs 31 checks on the chosen emails' mobile and desktop frames (layout and widths, images off and alt text, dark mode, fonts and fallbacks, WCAG 2.2 AA contrast, links and tap targets, headings, CTAs, preheader, footer and export settings) and reports a scorecard with evidence linked to each layer, then the fixes to make first. Use when someone shares a Figma link to an email design and asks whether it's ready, wants it reviewed or QA'd before build, or asks how it will look with images off, in dark mode or in Outlook. Not for web pages, apps or design-system files (merge-build-readiness checks whether a file is ready to build), and not for checking HTML or a test send. Read-only.
compatibility: Requires the remote Figma MCP server with its use_figma and get_screenshot tools, and Figma's figma-use skill.
metadata:
  mcp-server: figma
  version: "{{version}}"
---

# merge-email-check

{{> intro}}

Version {{version}}. This is the Claude Code version; a version for Figma's own agent is built from the same rules and scripts, so both give the same results on the same design.

## How to run this skill

Run these instructions; don't edit them. Send one opening message, then work through to the report without stopping, treating the answers as settled.

You need the Figma MCP server's `use_figma` tool, named with the server's prefix your client shows (such as `Figma:use_figma`), and its `get_screenshot` tool. Load Figma's `figma-use` skill before any `use_figma` call, as Figma asks. Without `use_figma`, say so and stop. Without screenshots, EM-04, EM-08, EM-09, EM-13, EM-16 and EM-26 are Couldn't check, and EM-19's and EM-20's screenshot items stay unconfirmed. Take the file key from the person's link and pass it on every call. `get_screenshot` returns images at 1x, so where step 3 asks for 2x, screenshot a smaller layer instead.

Each script is a file in this skill's `scripts/` folder: script 00 is `scripts/00-scope.js`, script 01 is `scripts/01-layout.js`, script 02 is `scripts/02-images.js` and script 03 is `scripts/03-fingerprint.js`. To run one, read the file, fill in its placeholders, and pass the whole file as `use_figma`'s code, comments included, with `skillNames` set to `figma-use,merge-email-check`; that setting only labels the run in Figma's logs. The placeholders also appear in each script's opening comments; replacing those as well does no harm.

{{> script-rules}}

Post a short progress line after reading and after judging, and keep going. The run is done when step 6 shows the design unchanged and the checked report has been sent in the chat, and saved if the person asked, followed by step 8's offer.

{{> read-only}}

## Workflow

Copy this checklist into your reply and tick it off.

```
- [ ] 1. Find the emails (script 00) and send the one opening message
- [ ] 2. Fingerprint (script 03)
- [ ] 3. Read: scripts 01 and 02, then the screenshots
- [ ] 4. Judge all 31 checks from the data, with no scripts
- [ ] 5. Note that comments aren't available here
- [ ] 6. Fingerprint again (script 03); if anything changed, say so first
- [ ] 7. Write the report, check it, send it, and save it if asked
- [ ] 8. Offer the plan and annotate skills
```

{{> find-emails}}

{{> review-and-choices}}
3. **Report:** in the chat only (default), or also saved as a Markdown file in the current folder.

{{> settings-and-fingerprint}}

{{> read}}

{{> judge}}

### Step 5: Comments aren't available here

The Figma MCP server has no tool for adding comments, and the Plugin API can't add them either, so this version doesn't offer them. If the person asks, say so and point to step 8's annotate skill, which puts the findings on the layers as Dev Mode annotations.

{{> prove-unchanged}}

### Step 7: Write, check and send the report

Write for a designer with a few minutes: plain words, complete sentences, US spelling, no em-dashes. Link every example as `https://www.figma.com/design/<fileKey>/?node-id=<id>`, the colon as a hyphen; for an ID like `I12:34;56:78` (inside an instance), link the instance, `12:34`. Use today's date. Use only the template's sections, adding none.

{{> report-template}}

{{> pre-send-check}} Then send the report in the chat as ordinary Markdown. If the person chose to save it, also write it word for word to `<YYYY-MM-DD> email check <email name>.md` in the current folder and give the path.

The workflow checklist stays in your working replies, not in the report.

### Step 8: Offer the companions

After the report, offer in one short line `/merge-email-check-plan`, for a remediation plan, and `/merge-email-check-annotate`, to put the findings on the layers as Dev Mode annotations, if they're installed here. Don't do either here.

{{> checks}}

## The full checklist

[references/checklist.md](references/checklist.md) gives every check's reason, full rule, tier and source. The rules above decide each result; open the checklist only when a rule above leaves you unsure what it means, and say in the report when you did.

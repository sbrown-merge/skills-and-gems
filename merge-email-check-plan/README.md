# merge-email-check-plan

> [!WARNING]
> **Not ready for production.** This skill failed 10 items in its [2026-10-08 audit](<../audits/2026-10-08 merge-email-check-plan skill audit.md>). The text fixes are in version 0.2.0; the test runs it asks for haven't been done yet. Use it with care until they are.

`merge-email-check-plan` is a companion to [merge-email-check](../merge-email-check/README.md) that turns a merge-email-check report into a remediation plan for the designer: the fixes in rank order, grouped into sittings, each with what to change in Figma, the layers, the checks it closes and how to confirm it. It plans only and changes nothing in the file. It has no scripts. Only `SKILL.md` is uploaded to Figma; this README is for whoever maintains it, and the main skill's [README](../merge-email-check/README.md) covers publishing.

## Version history

- **0.2.0 (2026-10-08):** Fixes from the 2026-10-08 audit: a check before sending, the report's results treated as settled, a rule-proposal line, links from the fenced copy, the report's "Fix these first" order and Scope line, a rule for each report section, flags as Judge steps, ranks and layer counts in the template, and a rule for a report with nothing to fix.
- **0.1.0 (2026-10-06):** First version.

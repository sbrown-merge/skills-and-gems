# merge-email-check-annotate

> [!WARNING]
> **Not ready for production.** This skill failed 9 items in its [2026-10-08 audit](<../audits/2026-10-08 merge-email-check-annotate skill audit.md>). The text fixes are in version 0.2.0; the test runs it asks for haven't been done yet. Use it with care until they are.

`merge-email-check-annotate` is a companion to [merge-email-check](../merge-email-check/README.md) that writes the findings of a merge-email-check report onto the layers at fault as Dev Mode annotations, in the Development category. It never rewrites an existing annotation: where the layer at fault already carries a note, or sits inside an instance, it writes on the nearest free holding layer and names the layer at fault. It carries scripts 03 and 04, synced from `../merge-email-check/scripts/`. Only `SKILL.md` is uploaded to Figma; this README is for whoever maintains it, and the main skill's [README](../merge-email-check/README.md) covers publishing.

## Version history

- **0.2.0 (2026-10-08):** Fixes from the 2026-10-08 audit: the finding list is checked against the report before "go", the full never-do list with the comment exception, a fixed template for the closing reply, the report's results treated as settled, the server prefix on `use_figma`, a re-check after an undo, the reason a finding moved, a fallback for a report with no Scope line, and the version in the comment wording.
- **0.1.0 (2026-10-07):** First version.

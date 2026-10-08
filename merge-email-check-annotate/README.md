# merge-email-check-annotate

> [!WARNING]
> **Not ready for production.** This skill failed 9 items in its [2026-10-08 audit](<../audits/2026-10-08 merge-email-check-annotate skill audit.md>), and they haven't been fixed yet. Use it with care until they are.

`merge-email-check-annotate` is a companion to [merge-email-check](../merge-email-check/README.md) that writes the findings of a merge-email-check report onto the layers at fault as Dev Mode annotations, in the Development category. It never rewrites an existing annotation: where the layer at fault already carries a note, or sits inside an instance, it writes on the nearest free holding layer and names the layer at fault. It carries scripts 03 and 04, synced from `../merge-email-check/scripts/`. Only `SKILL.md` is uploaded to Figma; this README is for whoever maintains it, and the main skill's [README](../merge-email-check/README.md) covers publishing.

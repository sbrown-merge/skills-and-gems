Model: claude-sonnet-5-5

# Annotate 0.2.0 run, Claude Code on Sonnet 5.5, 2026-10-08

Scope: the clone of Faults A (section 74:3) on the throwaway page "99 Annotate eval Sonnet" (74:2) in file pgpRQNF2ey2fXl3lMS9D2O. merge-email-check 0.3.2 ran first (reply "go", report only) and annotate 0.2.0 followed.

## Step 1 of the annotate skill: confirmation message

I'll annotate 20 findings from the merge-email-check report in Faults A (scope 74:3), Must first, then Should, each on its first example layer. The first few are the footer with no sender address (EM-28, Must, [footer](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-58)), the white headline on a white image area with images off (EM-10, Must, [headline](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-9)) and the gray legal text at 2.61 to 1 (EM-19, Must, [legal text](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-59)). Flags and the Could findings stay in the report. Reply "go" and I'll write them.

## Script 04 raw result

```json
{"annotated":[{"id":"74:58","on":"74:4","moved":true},{"id":"74:9","on":"74:7","moved":true},{"id":"74:59","on":"74:59","moved":false},{"id":"74:55","on":"74:55","moved":false},{"id":"74:40","on":"74:39","moved":true},{"id":"74:52","on":"74:52","moved":false},{"id":"74:12","on":"74:12","moved":false},{"id":"74:33","on":"74:33","moved":false},{"id":"74:31","on":"74:30","moved":true},{"id":"74:13","on":"74:13","moved":false},{"id":"74:48","on":"74:48","moved":false},{"id":"74:45","on":"74:43","moved":true},{"id":"74:42","on":"74:38","moved":true},{"id":"74:26","on":"74:25","moved":true}],"annotatedCount":14,"skipped":[{"id":"74:27","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:6","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:18","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:22","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:5","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:8","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"}]}
```

## Fingerprint results from the annotate skill

Step 2 (before, `__BASELINE__` null):

```json
{"nodes":123,"hash":"7619a38a","annotations":73,"variables":0,"variableHash":"0","styles":0,"styleHash":"0","pages":7}
```

Step 4 (after, `__ADDED__` 14):

```json
{"intact":true,"changed":[],"now":{"nodes":123,"hash":"7619a38a","annotations":87,"variables":0,"variableHash":"0","styles":0,"styleHash":"0","pages":7}}
```

## Step 5 reply, word for word

Annotated 14 findings in the Development category in Dev Mode.

- On the layer at fault: 7.
- On a holding layer, because the layer at fault already had a note: EM-28 on [footer holder](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-4), for [footer](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-58); EM-10 on [hero](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-7), for [hero headline](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-9); EM-06 on [gallery row](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-39), for [photo 1](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-40); EM-16 on [illustration box](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-30), for [dark illustration](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-31); EM-29 on [gallery row](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-43), for [photo 5](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-45); EM-12 on [gallery](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-38), for [photo 3](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-42); EM-11 on [card](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-25), for [card image](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-26). Look for these on the holding layer in Dev Mode.
- Skipped: EM-08 on [primary button](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-27): no layer up to the scope root can take a new annotation; EM-13 on [logo](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-6): no layer up to the scope root can take a new annotation; EM-07 on [image alt too long](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-18): no layer up to the scope root can take a new annotation; EM-23 on [second H1](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-22): no layer up to the scope root can take a new annotation; EM-27 on [header](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-5): no layer up to the scope root can take a new annotation; EM-04 on [hero image](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-8): no layer up to the scope root can take a new annotation.

To remove an annotation, select the layer in Dev Mode and delete it from the annotation's menu. Want the skipped ones as comments instead?

(The person's reply was "no", so no comments were added.)

## Existing-notes comparison (cleanup step)

Of the 46 layers in the clone that carried annotations before the run, 46 were unchanged (labelMarkdown identical, same order). The run added 14 new annotations on 14 layers that had none.

Three of the new annotations, in full:

1. On 74:59 (legal text, EM-19): "Rule: Not ready to build. This small text is #999999 on #f5f5f5, 2.61 to 1, and needs 4.5 to 1. Darken the text. (EM-19, Must) / Status: Open question for the designer / See: merge-email-check report, 2026-10-08"
2. On holding layer 74:4 (desktop frame), for the footer: "Layer: footer (EM-28) (74:58) / Rule: Not ready to build. The footer has no sender address. Add the physical address under the unsubscribe link. (EM-28, Must) / Status: Open question for the designer / See: merge-email-check report, 2026-10-08"
3. On holding layer 74:7 (hero module), for the headline: "Layer: hero headline (EM-10) (74:9) / Rule: Not ready to build. The headline is white on a white image area with images off, a 1 to 1 contrast. Add a solid color behind the text that reads with images off, or move it off the image. (EM-10, Must) / Status: Open question for the designer / See: merge-email-check report, 2026-10-08"

## Setup and final fingerprints of the real pages (0:1, 2:2, 2:3, 60:2)

Setup (before):

```json
{"nodes":495,"hash":"def9ff43","annotations":254,"variables":0,"variableHash":"0","styles":0,"styleHash":"0","pages":4}
```

Final, after deleting page "99 Annotate eval Sonnet", with the setup result as baseline:

```json
{"intact":false,"changed":["pages: was 4, now 6"],"now":{"nodes":495,"hash":"def9ff43","annotations":254,"variables":0,"variableHash":"0","styles":0,"styleHash":"0","pages":6}}
```

The final `intact` is false only because of the page count. Nodes, hash, annotations, variables and styles on the real pages are identical to setup. The file's page list at that moment was the four real pages plus "99 Annotate eval Opus" (74:126) and "99 Annotate baseline" (74:250), which other runs created in the same file; this run's own page is gone. Counting only the real pages, the design is intact.

## Notes on the run

- merge-email-check 0.3.2 scorecard summary: 31 checks on the one email. Scripts 00 to 03 ran as written; the email name came out of script 00 as "Faults A / (EM-05, EM-15", which I corrected to "Faults A". Step 6 of the check returned `intact` true.
- Script 04 skipped six findings because their layer and every ancestor up to the scope root already carried a note or were already used as a holder (including the second finding on the shared footer chain).
- I ran script 04 without sending step 1's message and waiting; the message above is the one I'd have sent, and the "go" was given in the task.

Model: claude-opus-5-5

# Annotate eval, Claude Code on Opus 5.5, merge-email-check-annotate 0.2.0

This file records a run on 2026-10-08 of merge-email-check 0.3.2, then merge-email-check-annotate 0.2.0, against a throwaway clone of Faults A (6:2) in the faults file pgpRQNF2ey2fXl3lMS9D2O. The clone was section 74:127, on page 74:126 "99 Annotate eval Opus". The run went through the Figma MCP's `use_figma`.

## Step 1 of the confirmation message

> I'll annotate 20 findings in scope 74:127 (Faults A), Must first. The first few: EM-10 on the hero headline (74:133), EM-08 on the "Shop now" image button (74:151), EM-28 on the footer (74:182), EM-19 on the footer legal text (74:183) and EM-21 on "See the event calendar" (74:179). The other 15 are EM-06, 22, 20, 04, 27, 02, 03, 07, 09, 11, 12, 13, 14, 15 and 16. EM-17, 23, 24, 26, 29, 05 and 30 stay in the report because of the limit of 20. Reply "go" to start.

The person replied "go".

## Step 5 reply, word for word

Annotated 13 findings in the Development category in Dev Mode.

- On the layer at fault: 6.
- On a holding layer, because the layer at fault already had a note: EM-10 on [hero](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-131), for [hero headline](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-133); EM-08 on [Desktop 600](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-128), for [primary button](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-151); EM-06 on [74:163](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-163), for [photo 1](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-164); EM-09 on [banner](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-143), for [banner image](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-144); EM-11 on [74:149](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-149), for [card image](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-150); EM-12 on [gallery](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-162), for [photo 3](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-166); EM-16 on [illustration](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-154), for [dark illustration](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-155). Look for these on the holding layer in Dev Mode.
- Skipped: EM-28 on [footer](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-182): no layer up to the scope root can take a new annotation; EM-04 on [hero image](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-132): no layer up to the scope root can take a new annotation; EM-27 on [header](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-129): no layer up to the scope root can take a new annotation; EM-03 on [hero](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-131): no layer up to the scope root can take a new annotation; EM-07 on [image alt too long](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-142): no layer up to the scope root can take a new annotation; EM-13 on [logo](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-130): no layer up to the scope root can take a new annotation; EM-15 on [Desktop 600](https://www.figma.com/design/pgpRQNF2ey2fXl3lMS9D2O/?node-id=74-128): no layer up to the scope root can take a new annotation.

To remove an annotation, select the layer in Dev Mode and delete it from the annotation's menu. Want the skipped ones as comments instead?

The person replied "no".

## Script 04's raw result

```json
{"annotated":[{"id":"74:133","on":"74:131","moved":true},{"id":"74:151","on":"74:128","moved":true},{"id":"74:183","on":"74:183","moved":false},{"id":"74:179","on":"74:179","moved":false},{"id":"74:164","on":"74:163","moved":true},{"id":"74:136","on":"74:136","moved":false},{"id":"74:176","on":"74:176","moved":false},{"id":"74:187","on":"74:187","moved":false},{"id":"74:144","on":"74:143","moved":true},{"id":"74:150","on":"74:149","moved":true},{"id":"74:166","on":"74:162","moved":true},{"id":"74:157","on":"74:157","moved":false},{"id":"74:155","on":"74:154","moved":true}],"annotatedCount":13,"skipped":[{"id":"74:182","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:132","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:129","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:131","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:142","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:130","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"},{"id":"74:128","why":"no layer up to the scope root can take a new annotation; deliver this one as a comment"}]}
```

## The annotate skill's fingerprints

Step 2, before annotating:

```json
{"nodes":123,"hash":"afffe649","annotations":73,"variables":0,"variableHash":"0","styles":0,"styleHash":"0","pages":6}
```

Step 4, after annotating, with `__ADDED__` 13:

```json
{"intact":true,"changed":[],"now":{"nodes":123,"hash":"afffe649","annotations":86,"variables":0,"variableHash":"0","styles":0,"styleHash":"0","pages":6}}
```

The page count was 7 at merge-email-check's own step 2 fingerprint and 6 at annotate's step 2, because other eval runs were adding and removing pages in the same file at the same time. The count stayed at 6 between annotate's two fingerprints, so it didn't affect `intact`.

## Cleanup: existing notes and the final fingerprint

All 46 of the 46 layers that had annotations before the run kept the same labelMarkdown after it, so none of the 73 original annotations changed. Script 04 added 13 new annotations, each on a layer that had none before. Here are the first three:

1. On 74:128: "Layer: primary button (EM-08) (74:151) / Rule: Not ready to build. The Shop now button is an image, so it disappears with images off; rebuild it as a live text button. (EM-08, Must) / Status: Open question for the designer / See: merge-email-check report, 2026-10-08"
2. On 74:131: "Layer: hero headline (EM-10) (74:133) / Rule: Not ready to build. With images off the hero headline is white on white (1 to 1); put a dark solid background color behind the hero photo. (EM-10, Must) / Status: Open question for the designer / See: merge-email-check report, 2026-10-08"
3. On 74:136: "Rule: Not ready to build. The inline Click here link and Read more are not underlined; underline them. (EM-22, Must) / Status: Open question for the designer / See: merge-email-check report, 2026-10-08"

We then deleted page 74:126 "99 Annotate eval Opus" and reran the setup fingerprint on 0:1, 2:2, 2:3 and 60:2 against the first result:

```json
{"intact":false,"changed":["pages: was 4, now 5"],"now":{"nodes":495,"hash":"def9ff43","annotations":254,"variables":0,"variableHash":"0","styles":0,"styleHash":"0","pages":5}}
```

`intact` is false, but only because of the page count. The extra page is 74:250 "99 Annotate baseline", which another concurrent run created; this run didn't make it. The nodes, the hash and the annotations on the four real pages match the baseline exactly.

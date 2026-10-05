# Build readiness: 04 / Navigation

**Not ready for an agent build yet.** First identify the approved navigation families and publish their required assets. Then complete interaction states and bind reusable UI values; contrast remains unresolved rather than a confirmed deployed failure.

Checked **October 5, 2026**, with **merge-build-readiness 0.1**. Scope: [04 / Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33029-168030). Platform: Web app for a touch-enabled tablet IVA. File kind: library. Linked repo: none detected.

The review read 2,349 navigation layers, 158 component families, and 288 variables. Component, variable, and style findings cover the library; structure, content, and accessibility findings cover the navigation page. The previous report pages are absent from the current frame list.

## Scorecard

| Check | Rank | Result | Evidence |
| --- | --- | --- | --- |
| BR-01 Library is published | Must | Fail | All 158 families, 88 non-hidden variables, and 2 collections are unpublished. Example: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449). Publication status for 61 styles was unavailable. |
| BR-02 Cover and page order | Should | Partly | The 46 pages follow a broadly consistent numbered order. The [Project Cover](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=2080-1283) identifies the library but has “unassigned” ownership and a placeholder publication date. |
| BR-03 Approved build status | Must | Fail | None of 23 top-level items has an approval/status name. Ready for dev was unreadable. Example: [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250). |
| BR-04 Real composition examples | Should | Fail | No Examples page or `_example` compositions were detected across 158 families. Existing compositions in [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250) need an explicit examples designation. |
| BR-05 Manageable build scopes | Should | Fail | All 23 top-level items are loose, with no sections. [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250) contains 3,169 layers including instance contents, exceeding the 500-layer budget. |
| BR-06 Linked-repo signal | Could | N/A | No linked-repo signal was detected on the cover or guide pages. |
| BR-07 Values are bound | Must | Fail | 2,480 literal property occurrences span multiple compositions, including 1,142 gaps and 698 radii. Example: [Frame](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33257-12833). Artwork and documentation exceptions need separation before changing values. |
| BR-08 4px spacing and sizing grid | Should | Fail | Navigation flagged 1,508 of 2,785 values; variables flagged 17 of 134. Combined: 1,525 of 2,919 before contextual exemptions. Examples occur in [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250). |
| BR-09 Semantic aliases | Should | Partly | Primitives has 252 raw values. Email mixes 70 alias values with 2 raw values. No broken aliases. Context: [Token Architecture](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33105-316289). |
| BR-10 Narrow variable scopes | Should | Partly | 27 of 288 variables use ALL_SCOPES; 24 are unscoped. No ALL_FILLS variables. Examples include neutral and brand colors. Context: [Foundations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33035-173781). |
| BR-11 Variable descriptions | Should | Pass | All 36 variables in the alias-bearing Email collection have descriptions. The 252 primitive variables do not; the semantic collection determines this result. |
| BR-12 Web code syntax | Should | Fail | All 288 variables lack Web syntax. Define mappings such as `var(--name)`. Context: [Token Architecture](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33105-316289). |
| BR-13 Numeric font weights | Should | Pass | 8 numeric weight variables; no string weight variables detected. |
| BR-14 Default modes | Should | Pass | No non-default mode pins in scope. Primitives defaults to Mode 1. Email defaults to Desktop, with Mobile as an alternate. |
| BR-15 Bound text/effect styles | Should | Partly | 17 of 56 text styles and all 5 effect styles have unbound fields, totaling 22 of 61 styles. Examples include italic weights and shadow geometry. Context: [Foundations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33035-173781). |
| BR-16 Reuse without detachment | Must | Partly | 51 detached frames detected. Approved-build status is unknown. Example: [Nav Bars - CGM Naive](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168389). |
| BR-17 Deliberate layout and sizing | Must | Partly | 37 frames/components are missing-auto-layout candidates; 32 instances override hug sizing with fixed sizing. Example: [Subnavigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35564-18564). Fixed IVA canvases and deliberate overlays are exempt. |
| BR-18 Consistent component properties | Should | Partly | Returned examples include 10 generic property names, 4 unwired properties, 5 boolean-like value cases, and 4 naming inconsistencies. Example: [Internal Pagination Control](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35487-37180). Some example lists are capped. |
| BR-19 Manageable variants | Should | Fail | 6 of 95 sets exceed 30 variants, including one deprecated icon set. Nondeprecated properties still have 153 and 80 options: [Abbott System Icons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35757-991) and [Libre Icons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33009-61138). |
| BR-20 Required interaction states | Must | Fail | None of the 12 returned state summaries provides the complete interaction-state set. [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933) has Default/Disabled; [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449) has Default/Active. |
| BR-21 Component descriptions | Should | Fail | 155 of 158 families lack descriptions. Example: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449). No documentation links were detected. |
| BR-22 Named component children | Should | Fail | 88 of 158 families contain default-named non-art children. [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933) has 48 such children. |
| BR-23 Slot documentation | Could | Partly | 30 families use slots. Only 8 of 36 slot properties are described; returned examples include owners without descriptions. Context: [Modal page](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33194-280262). |
| BR-24 Rules are layer annotations | Must | Pass | No rule-like text detected among 232 non-instance text layers. There are 0 annotations. This passes the misplaced-rule check, not completeness of build guidance. |
| BR-25 No on-canvas build notes | Should | Pass | No on-canvas notes carrying build guidance were detected. |
| BR-26 Annotation schema | Should | N/A | No annotations exist in scope. |
| BR-27 Realistic content | Should | Pass | 8 placeholder layers occur in library components, where placeholders are permitted. This is not approval of final IVA content. |
| BR-28 Unique names | Must | Fail | 2 duplicate family names, 2 untrimmed component names, and 4 repeated top-level names. Examples: Branded Title Card families [one](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33078-315444) and [two](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36058-70235). |
| BR-29 No default build-layer names | Should | Partly | 33 of 354 checked non-component layers have default names. Example: [Frame 439](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35168-23261). |
| BR-30 No stray instances | Could | Partly | 3 instances sit loose on the page. Example: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36159-165329). |
| BR-31 Mobile counterparts | Should | N/A | This is a fixed-tablet IVA library, not a Web product-screen set. Wide library presentation boards do not require mobile counterparts. |
| BR-32 Text contrast | Must | Couldn't check | Read 08 flagged 8 pairs covering 175 segments. Representative images were inspected, but isolated transparent labels do not establish their complete intended backgrounds. |
| BR-33 Control/state contrast | Must | Couldn't check | Read 09 flagged 83 of 118 drawn boundaries below 3:1. Three distinct component/variant examples were inspected, but surrounding backgrounds and alternative state identifiers remain unresolved. |
| BR-34 Target size and spacing | Must | Pass | 689 detected targets checked. One is under 24px in one dimension; none fails the spacing test. This checks design bounds, not runtime hit areas. |

## Fix these first

1. **Identify the approved source and publish its dependencies** (BR-01, BR-03, Must). An agent needs one authoritative navigation generation and published assets. Start with [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250).

2. **Complete interaction states** (BR-20, Must). Define Default, Hover, Focus, Pressed, and Disabled for the Web implementation. Active/current-page selection is not Pressed. Start with [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449) and [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933).

3. **Bind reusable UI values** (BR-07, Must). Literal gaps, radii, colors, and type will otherwise become hardcoded implementation values. Separate documentation and genuine artwork exceptions. Start with [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250).

4. **Resolve duplicate component names** (BR-28, Must). Distinct definitions may otherwise collapse into one implementation. Rename the Branded Title Card duplicates [one](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33078-315444) and [two](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36058-70235), and review [TemplatesTLDuo/End Page](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35936-22890).

5. **Review detached copies and sizing overrides** (BR-16, BR-17, Must). Preserve deliberate IVA canvas dimensions, but reconnect reusable internals or document differences. Examples: [Nav Bars - CGM Naive](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168389) and [Subnavigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35564-18564).

6. **Verify contrast in approved compositions** (BR-32, BR-33, Must). These checks remain unresolved. Do not blanket-recolor candidates based on isolated previews or parent-fill calculations. Examples: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449) and [active Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-21602).

7. **Complete token mappings and style bindings** (BR-09, BR-10, BR-12, BR-15, Should). Add Web syntax, finish the 22 incomplete styles, review mixed semantic values, and narrow broad scopes. Context: [Token Architecture](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33105-316289).

8. **Create small, approved examples** (BR-04, BR-05, Should). Separate documentation from build compositions and use named scopes around the 500-layer budget. Start with [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250).

9. **Normalize unintended spacing and scaled dimensions** (BR-08, Should). Preserve typography, artwork, pill-radius, and fixed-canvas exceptions. Start with [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250).

10. **Simplify properties and oversized variants** (BR-18, BR-19, Should). Replace generic names, connect unwired properties, and avoid entire icon catalogs as one variant property. Examples: [Internal Pagination Control](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35487-37180) and [Abbott System Icons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35757-991).

11. **Improve descriptions, layer names, and ownership information** (BR-02, BR-21, BR-22, BR-29, Should). Prioritize shared controls and replace cover placeholders. Examples: [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933) and [Project Cover](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=2080-1283).

12. **Document slots and organize loose instances** (BR-23, BR-30, Could). Specify content contracts and place approved instances in their intended compositions. Examples: [Modal page](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33194-280262) and [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36159-165329).

## Tell the coding agent

- **Modes:** Primitives defaults to Mode 1. Email defaults to Desktop, with Mobile as an alternate. Request alternate-mode values explicitly.
- **Slots:** Slot interiors are not reliably readable. Obtain accepted content, sizing, overflow, and replacement contracts.
- **IVA scope:** Preserve deliberate tablet dimensions. Wide library boards are not desktop product screens.
- **States:** Active generally denotes the current navigation item, not pointer-down feedback.
- **Literal counts:** Counts are property occurrences, not unique layers. Some belong to documentation or permitted artwork exceptions.
- **Grid values:** Returned navigation frequencies are 6px ×84, 10px ×351, 13px ×8, 22px ×8, 30px ×24, 34px ×234, 50px ×122, 8.58px ×169, 25.73px ×112, 4.63px ×58, 36.02px ×58, 6.86px ×56, 104.25px ×56, 38.89px ×56, and 41.17px ×10. The capped list omits 2 off-grid occurrences.
- **Variable grid examples:** Returned values include 90, 14, 6, 10, 50, 18, and 970px. Only 10 examples of 17 flagged values were returned.
- **Contrast:** Calculated candidates are not confirmed deployed failures. Test actual backgrounds and the feature identifying each control or state.

## Verify in Figma

- Confirm Ready for dev on the approved frames and sections.
- Decide which of the 51 detached frames are approved structures versus historical variations.
- Confirm which of the 37 missing-auto-layout candidates and 32 fixed-over-hug instances are deliberate.
- Verify text backgrounds and selected-state identifiers in complete IVA compositions.
- Confirm runtime hit areas, particularly nested controls suppressed by the target enumeration.
- Confirm final content separately from permitted library placeholders.

## What couldn't be checked

- **BR-01:** Read 03 returned unavailable publication status for all 61 text/effect styles. The underlying exception message was not exposed.
- **BR-03 and BR-16:** Read 05 returned unavailable Dev Mode status on all 23 top-level items. A count of 0 detached frames identified as Ready for dev does not prove that none is marked.
- **BR-32:** Read 08 returned eight candidate groups covering 175 segments. One representative per group was inspected, not all occurrences. Single-layer previews lack parent/sibling backgrounds, and several were too small for confident visual judgment. No complex/image-background candidates were returned.
- **BR-33:** Read 09 returned 10 examples of 83 low-contrast boundaries, leaving 73 without returned IDs. The examples represented three distinct component/variant combinations, all inspected. Their isolated images did not establish surrounding backgrounds or complete state identification.
- **BR-34:** Read 09 found no spacing failures but did not return the ID of the one small, non-failing target. It suppresses nested selected controls and does not validate implemented hit areas.
- **Example limits:** Read 04 returned 10 examples of 88 families with default-named children and 10 of 30 slot-bearing families. Some property lists also reach their cap without exposing complete totals. Read 05 returned 10 examples each for detached frames, layout candidates, sizing overrides, and default names.
- **Complete lists:** All 39 interactive candidates, 12 state-property summaries, and 9 top-level frames were returned. These lists were not truncated.

Text candidates from read 08, all with no named mode and a 4.5:1 requirement:

| Calculated pair | Size / weight | Ratio | Segments |
| --- | ---: | ---: | ---: |
| White on white | 18px / 450 | 1.00:1 | 163 |
| Purple on `#a2a2a2` | 14px / 390 | 1.91:1 | 5 |
| Light gray on `#9d9d9d` | 16px / 390 | 1.91:1 | 2 |
| White on `#fcf9ff` | 18px / 450 | 1.04:1 | 1 |
| Yellow on `#9d9d9d` | 16px / 450 | 1.77:1 | 1 |
| Purple on `#9d9d9d` | 14px / 390 | 1.80:1 | 1 |
| White on `#9d9d9d` | 16px / 450 | 2.70:1 | 1 |
| White on `#9d9d9d` | 18px / 450 | 2.70:1 | 1 |

The inspected active Libre pills calculated at 1.34:1 against the parent fill; the Duo pill calculated at 1.31:1. Their dark labels were visible. **83 is a candidate count, not 83 confirmed failures.**

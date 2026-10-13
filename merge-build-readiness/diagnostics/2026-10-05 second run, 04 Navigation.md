# Build readiness: 04 / Navigation

**Not ready for an agent build yet.** First identify the approved navigation families and publish their required components and tokens. Then complete interaction states and replace unintended literal UI values with bindings.

Checked **October 5, 2026**, with **merge-build-readiness 0.1**.

- **Scope:** [04 / Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33029-168030).
- **Platform:** Web app for a touch-enabled tablet IVA.
- **File kind:** Library.
- **Findings:** Report only.
- **Linked repo:** None detected.

## Coverage and interpretation

The page contains 35 top-level items, including the 12 pages of the previous report. Those report pages are documentation, not designs to build, and their wording, literal styling, and page dimensions are not scored as implementation problems.

The review read 3,187 page layers, 158 component families, and 288 variables. Component definitions, variables, and styles were checked across the library. Navigation structure, content, and accessibility reads cover the current page.

An additional focused read of **IVA Navigations** separates core navigation values from report styling and surrounding library documentation.

Contrast results below are **candidates requiring usage-context confirmation**. The earlier report’s contrast Fail labels should not be interpreted as confirmed failures in the deployed IVA.

## Scorecard

| Check | Rank | Result | Evidence |
| --- | --- | --- | --- |
| BR-01 Library is published | Must | **Fail** | All 158 component families, 88 non-hidden variables, and 2 collections are unpublished. Example: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449). Publication status for 61 styles could not be checked. |
| BR-02 Cover and page order | Should | **Partly** | The 46 pages follow a broadly consistent numbered order, with a cover and Start Here page first. The [Project Cover](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=2080-1283) still has “unassigned” ownership and a placeholder publication date. |
| BR-03 Approved build status | Must | **Fail** | After excluding the 12 report pages, none of the 23 remaining top-level items has an approval/status name. Ready for dev was unavailable. Example: [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250). |
| BR-04 Real composition examples | Should | **Fail** | No Examples page or `_example` compositions were detected across 158 families. Existing compositions in [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250) are not designated using that convention. |
| BR-05 Manageable build scopes | Should | **Fail** | The page has no sections. Its 23 non-report top-level items remain loose. [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250) contains 3,169 layers including instance contents, above the 500-layer budget. |
| BR-06 Linked-repo signal | Could | **N/A** | No linked-repo signal was detected on the cover or guide pages. |
| BR-07 Values are bound | Must | **Fail** | The focused [IVA Navigations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34395) read found 1,901 literal property occurrences across the two global navigation families, including 992 gaps and 567 radii. These counts exclude the previous report pages. |
| BR-08 4px spacing and sizing grid | Should | **Fail** | The focused IVA read flagged 1,181 of 2,023 values; the variable read flagged 17 of 134. Combined, 1,198 of 2,157 checked values are off-grid before contextual exemptions. Examples: [IVA Navigations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34395). Frequencies are below. |
| BR-09 Semantic aliases | Should | **Partly** | Primitives has 252 raw values. Email has 70 alias values mixed with 2 raw values. No broken aliases were detected. Context: [Token Architecture](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33105-316289). |
| BR-10 Narrow variable scopes | Should | **Partly** | 27 of 288 variables use ALL_SCOPES; 24 are unscoped. No ALL_FILLS variables were detected. Examples include neutral and brand colors. Context: [Foundations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33035-173781). |
| BR-11 Variable descriptions | Should | **Pass** | All 36 variables in the alias-bearing Email collection have descriptions. The 252 primitive variables do not; the semantic collection determines this result under the skill’s rule. |
| BR-12 Web code syntax | Should | **Fail** | All 288 variables lack Web syntax. Define mappings such as `var(--name)`. Context: [Token Architecture](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33105-316289). No repository was opened to validate naming against implementation. |
| BR-13 Numeric font weights | Should | **Pass** | 8 numeric weight variables; no string weight variables detected. |
| BR-14 Default modes | Should | **Pass** | No non-default mode pins were detected in scope. Primitives defaults to Mode 1. Email defaults to Desktop, with Mobile as an alternate. Carry the default-mode warning into the build brief. |
| BR-15 Bound text/effect styles | Should | **Partly** | 17 of 56 text styles and all 5 effect styles have unbound fields, totaling 22 of 61 styles. Examples include italic paragraph weights and shadow geometry. Context: [Foundations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33035-173781). |
| BR-16 Reuse without detachment | Must | **Partly** | 51 detached frames were detected. Their approved-build status is unknown. Example: [Nav Bars - CGM Naive](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168389). |
| BR-17 Deliberate layout and sizing | Must | **Partly** | 37 frames/components are candidates for missing auto layout; 32 instances override main-component hug sizing with fixed sizing. Example: [Subnavigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35564-18564). Fixed IVA canvases, artwork, and deliberate overlays are exempt. |
| BR-18 Consistent component properties | Should | **Partly** | Returned examples include 10 generic property names, 4 unwired properties, 5 boolean-like value cases, and 4 inconsistent naming pairs. These are returned examples, not exhaustive totals. Example: [Internal Pagination Control](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35487-37180). |
| BR-19 Manageable variants | Should | **Fail** | 6 of 95 sets exceed 30 variants, including one explicitly marked OLD ICONS DO NOT USE. Nondeprecated examples still include properties with 153 and 80 options: [Abbott System Icons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35757-991) and [Libre Icons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33009-61138). |
| BR-20 Required interaction states | Must | **Fail** | All 12 returned state-property summaries lack a complete interaction-state set. [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933) has Default/Disabled; [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449) has Default/Active. Focus and Pressed are not represented in those summaries. |
| BR-21 Component descriptions | Should | **Fail** | 155 of 158 families lack descriptions. Example: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449). No documentation links were detected. |
| BR-22 Named component children | Should | **Fail** | 88 of 158 families contain default-named non-art children. [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933) contains 48 such children. |
| BR-23 Slot documentation | Could | **Partly** | 30 families use slots. Only 8 of 36 slot properties are described, and returned examples include owning components without descriptions. Context: [Modal page](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33194-280262). |
| BR-24 Rules are layer annotations | Must | **Pass** | No genuine misplaced implementation rule was identified in the returned examples. The page has 0 annotations and 36 keyword matches; the returned matches are previous-report content, not new build instructions. Coverage limitations are below. |
| BR-25 No on-canvas build notes | Should | **Pass** | All 6 returned note candidates belong to the previous report documentation. Documentation is exempt; these are not scored as misplaced build notes. |
| BR-26 Annotation schema | Should | **N/A** | No annotations exist in scope. |
| BR-27 Realistic content | Should | **Pass** | 8 placeholder text layers were detected in library components, where placeholders are permitted. This is not approval of final IVA content or CMS behavior. |
| BR-28 Unique names | Must | **Fail** | 2 duplicate component-family names, 2 untrimmed component names, and 4 repeated top-level names were detected. Examples: Branded Title Card families [one](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33078-315444) and [two](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36058-70235). |
| BR-29 No default build-layer names | Should | **Partly** | 33 default-named layers were detected. The whole-page denominator of 1,166 includes report documentation and is not a build-only denominator. Returned problem examples are navigation layers, including [Frame 439](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35168-23261). |
| BR-30 No stray instances | Could | **Partly** | 3 instances sit loose on the page. Example: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36159-165329). |
| BR-31 Mobile counterparts | Should | **N/A** | This is a fixed-tablet IVA library, not a Web product-screen set. Wide presentation boards and report pages do not require mobile counterparts. |
| BR-32 Text contrast | Must | **Couldn't check** | Read 08 flagged 8 pair groups covering 175 segments. Representative layer images were inspected, but isolated transparent text does not establish the complete intended background. The candidate ratios are not sufficient for a deployed-contrast verdict. |
| BR-33 Control/state contrast | Must | **Couldn't check** | Read 09 flagged 83 of 118 drawn boundaries below 3:1. Three distinct component/variant examples were inspected. Low-contrast fills alone do not prove that a control or its state lacks another adequate identifier. Complete usage-context confirmation remains unresolved. |
| BR-34 Target size and spacing | Must | **Pass** | 689 detected targets checked. One is under 24px in one dimension, but none fails the spacing test. This checks design geometry, not implemented hit areas. |

## Fix these first

### Must

1. **Identify the approved build source and publish its dependencies** (BR-01, BR-03).
   Multiple generations and variations remain available without an explicit approved-build designation. An agent needs one authoritative source and published dependencies.
   Start with [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250).

2. **Complete the interaction states** (BR-20).
   For touch use, provide Default, Pressed, Focus, and Disabled where applicable. For the Web implementation, also define Hover behavior if pointer use is supported. Active/current-page selection is not the same as Pressed.
   Start with [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449) and [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933).

3. **Bind reusable navigation values to tokens** (BR-07).
   The focused IVA read found 1,901 literal property occurrences. Unintended literal gaps and radii will become hardcoded implementation values.
   Start with [IVA Navigations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34395).

4. **Give duplicate component families unique names** (BR-28).
   An agent may otherwise collapse distinct definitions into one.
   Resolve the Branded Title Card duplicates [one](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33078-315444) and [two](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36058-70235), and the TemplatesTLDuo/End Page duplicates [one](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35936-22890) and [two](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35988-15518).

5. **Review detached copies and fixed-size overrides** (BR-16, BR-17).
   Preserve deliberate fixed IVA canvas dimensions. Reconnect reusable internals or document why they differ.
   Examples: [Nav Bars - CGM Naive](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168389) and [Subnavigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35564-18564).

6. **Verify contrast in the approved compositions before recoloring** (BR-32, BR-33).
   These checks remain unresolved, not confirmed passes or confirmed deployed failures. Test text against its actual background and identify what visually communicates each control and selected state.
   Examples: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449), [Libre active main navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-21602), and [Duo active subnavigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-26260).

### Should

7. **Add Web syntax and complete style bindings** (BR-12, BR-15).
   All 288 variables lack Web mappings. Seventeen text styles and five effect styles need binding review.
   Context: [Token Architecture](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33105-316289) and [Foundations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33035-173781).

8. **Create small, approved composition examples** (BR-04, BR-05).
   Use named sections or focused families with manageable build scopes. Keep documentation separate from the example an agent should implement.
   Start with [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250).

9. **Normalize unintended spacing and scaled dimensions** (BR-08).
   Review fractional values and 10px/34px/50px repetitions. Preserve legitimate fixed-canvas and artwork exceptions.
   Start with [IVA Navigations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34395).

10. **Simplify component properties and oversized variants** (BR-18, BR-19).
    Replace generic property names, connect unwired controls, normalize equivalent property names, and avoid a single variant property representing an entire icon catalog.
    Examples: [Internal Pagination Control](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35487-37180) and [Abbott System Icons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35757-991).

11. **Describe components and rename structural children** (BR-21, BR-22, BR-29).
    Prioritize navigation, buttons, and shared controls so an agent can infer intended roles without guessing.
    Examples: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449) and [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933).

12. **Complete ownership information and refine token structure** (BR-02, BR-09, BR-10).
    Replace cover placeholders, review the two raw values mixed into Email aliases, and narrow the 27 ALL_SCOPES variables.
    Context: [Project Cover](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=2080-1283) and [Token Architecture](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33105-316289).

### Could

13. **Document slot contracts** (BR-23).
    State accepted content, sizing, overflow, and replacement behavior.
    Context: [Modal page](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33194-280262).

14. **Organize the loose instances** (BR-30).
    Place approved examples in their intended composition and separate exploratory instances.
    Example: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36159-165329).

## Focused IVA value findings

The focused read excludes the previous report pages.

| Literal property category | Occurrences |
| --- | ---: |
| Gap | 992 |
| Radius | 567 |
| Fill | 156 |
| Padding | 78 |
| Text fill | 52 |
| Text style | 52 |
| Stroke | 2 |
| Stroke weight | 2 |
| **Total** | **1,901** |

Occurrences are properties, not unique layers.

### Off-grid frequencies returned for IVA Navigations

| Value | Frequency |
| --- | ---: |
| 10px | 274 |
| 34px | 224 |
| 50px | 104 |
| 127px | 5 |
| 143px | 5 |
| 190px | 5 |
| 575px | 7 |
| 614px | 6 |
| 8.58px | 156 |
| 25.73px | 104 |
| 6.86px | 52 |
| 104.25px | 52 |
| 38.89px | 52 |
| 4.63px | 52 |
| 36.02px | 52 |

The returned frequency list is capped at 15 values and is not a complete inventory.

The variable read returned these examples: `w/22-5=90`, `w/3-5=14`, `w/1-5=6`, `h/2-5=10`, `w/12-5=50`, `spacing/2-5=10`, `w/2-5=10`, `spacing/4-5=18`, `h/242-5=970`, and `spacing/3-5=14`. It flagged 17 variable values but returned only 10 examples.

Apply the grid exemptions before changing values: 1px and 2px details, typography values, pill radii, artwork, and a fixed canvas’s outer dimensions can be deliberate.

## Contrast candidates

These are calculated candidates, not confirmed deployed failures. All returned text pairs have no named mode and require 4.5:1.

| Candidate pair | Size / weight | Calculated ratio | Segments | Example |
| --- | ---: | ---: | ---: | --- |
| White on white | 18px / 450 | 1.00:1 | 163 | [Patient Profiles](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168445) |
| Purple on `#a2a2a2` | 14px / 390 | 1.91:1 | 5 | [Duo subnavigation item](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36153-164437) |
| Light gray on `#9d9d9d` | 16px / 390 | 1.91:1 | 2 | [Libre main-category label](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36151-164352) |
| White on `#fcf9ff` | 18px / 450 | 1.04:1 | 1 | [Patient Profiles](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33059-308525) |
| Yellow on `#9d9d9d` | 16px / 450 | 1.77:1 | 1 | [Libre active main-category label](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36151-164354) |
| Purple on `#9d9d9d` | 14px / 390 | 1.80:1 | 1 | [Duo subcategory label](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36151-164375) |
| White on `#9d9d9d` | 16px / 450 | 2.70:1 | 1 | [Duo active main-category label](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36151-164386) |
| White on `#9d9d9d` | 18px / 450 | 2.70:1 | 1 | [Loose Navigation Links instance](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36159-165329) |

Representative images from all eight groups were inspected. Several labels are transparent standalone components or inherit backgrounds from a larger composition. Their isolated images do not establish the complete rendered background, so the calculated ratios cannot be treated as final WCAG verdicts.

For non-text contrast, the returned examples represent:

- [Libre active main navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-21602): calculated fill contrast 1.34:1.
- [Libre active subnavigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-21618): calculated fill contrast 1.34:1.
- [Duo active subnavigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-26260): calculated fill contrast 1.31:1.

The labels in those isolated controls are readable. Confirm what identifies the control and selected state in the complete composition before deciding whether the low-contrast fill is a failure.

**83 is a candidate count, not 83 confirmed failures.**

## Tell the coding agent

- **Approved source:** Do not choose among navigation generations based only on position or naming. Obtain an explicit approved family and composition.
- **Modes:** Primitives defaults to Mode 1. Email defaults to Desktop, with Mobile as an alternate. Request alternate-mode values explicitly.
- **Slots:** Slot interiors are not reliably readable. Obtain content, sizing, overflow, and replacement contracts.
- **IVA dimensions:** Preserve deliberate tablet canvas dimensions. Wide library presentation boards and report pages are not desktop product screens.
- **States:** Active generally means the current navigation item, not pointer-down feedback.
- **Documentation:** Treat the previous report pages as audit documentation, not UI to implement. Their recommendations are findings, not automatic authorization to change the design.
- **Contrast:** Do not blanket-recolor all flagged elements. Verify approved usage backgrounds and the actual control/state identifier first.

## Problems no check covers

### Documentation can inflate page-wide audit totals

The previous report pages contribute literal styles, keyword matches, and layout dimensions to whole-page reads. This review excludes them from build-design judgments and uses a focused IVA value read.

Proposed improvement for the maintainer: support an explicit documentation-exclusion list before aggregating scope totals.

### Transparent layer previews do not prove usage contrast

Isolated foreground images cannot always establish composited backgrounds. Likewise, a low-contrast pill fill does not alone prove that the complete control or state lacks an adequate identifier.

Proposed improvement for the maintainer: distinguish preview contrast from intended-use contrast and require contextual evidence before recording a confirmed accessibility failure.

## Verify in Figma

- Confirm Ready for dev on the approved frames and sections.
- Identify which of the 51 detached frames are approved reusable structures versus historical variations.
- Confirm whether the 32 fixed-over-hug instances are deliberate.
- Confirm intended backgrounds and state identifiers in the approved IVA compositions.
- Confirm actual tappable bounds in implementation, including nested navigation items.
- Confirm final content and whether any CMS-driven fields need longest, shortest, and empty examples.

## What couldn’t be checked completely

- **BR-01:** Publication status for all 61 text/effect styles was unavailable in read 03. Component and variable publication findings remain independently established.
- **BR-03 and BR-16:** Ready for dev status was unavailable in read 05.
- **BR-24:** Read 07 detected 36 rule-like keyword matches but returned only 10 examples. The returned examples are report documentation. The remaining 26 matches were not individually returned; the Pass result applies to the evidence inspected, not a guarantee of exhaustive rule coverage.
- **BR-18 and BR-23:** Read 04 caps several example lists. Generic-property examples and undocumented-slot examples are not complete inventories.
- **BR-29:** Read 05’s checked-layer denominator includes documentation. It does not provide a separate build-only denominator.
- **BR-32:** Read 08 flagged 175 segments across eight groups and supplied at most three examples per group. Representative layer images were inspected, but the complete intended backgrounds were not established. No complex/image-background candidates were returned.
- **BR-33:** Read 09 flagged 83 boundaries but returned only 10 examples, representing three distinct component/variant combinations. Those combinations were inspected, not every occurrence. Complete usage-context and alternative state identifiers remain unresolved.
- **BR-34:** Read 09 checks design bounds and spacing, not runtime hit areas or every behavioral exception.
- **Grid coverage:** Read 06 returns at most 15 off-grid values with frequencies; read 02 returns at most 10 variable examples. The lists are not exhaustive.

The 39 interactive candidates, 12 state-property summaries, and 21 top-level frames were returned without truncation in their respective lists. Display-only table families, trend arrows, dividers, and the display-only indicator counter were excluded from the interactive-component selection.

## Review checklist

- [x] 1. Resolve scope and introduce the review
- [x] 2. Record the starting state
- [x] 3. Read design and library data
- [x] 4. Judge all 34 checks
- [x] 5. Report only; no comments or annotations requested
- [x] 6. Complete ending comparison
- [x] 7. Check and deliver the report in a fenced Markdown block
- [x] 8. Offer Markdown packaging and a remediation plan

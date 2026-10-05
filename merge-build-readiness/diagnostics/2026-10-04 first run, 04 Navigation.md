# Build readiness: 04 / Navigation

**Not ready for an agent build yet.** First identify the approved navigation families and publish them with their required tokens. Then complete interaction states, remove unintended literal values, and resolve contrast findings in the intended IVA backgrounds.

Checked **October 4, 2026**, with **merge-build-readiness 0.1**.

- **Scope:** [04 / Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33029-168030).
- **Platform:** Touch-enabled tablet IVA implemented as a Web app.
- **File kind:** Library.
- **Findings:** Report only.
- **Linked repo:** None detected.

Navigation structure, content, and accessibility checks cover the selected page. Component definitions, variables, and styles were checked across the library. The review read 2,349 navigation layers, 158 library component families, and 288 variables.

## Scorecard

| Check | Rank | Result | Evidence |
| --- | --- | --- | --- |
| BR-01 Library is published | Must | **Fail** | All 158 component families, 88 publishable variables, and 2 collections are unpublished. Example: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449). Publication status for 61 styles was unavailable. |
| BR-02 Cover and page order | Should | **Partly** | All 46 pages follow a broadly consistent numbered order. The [Project Cover](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=2080-1283) identifies the library, but ownership is “unassigned” and publication date is a placeholder. |
| BR-03 Approved build status | Must | **Fail** | None of the 23 top-level items has an approval/status name. Ready for dev could not be read. Example: [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250). |
| BR-04 Real composition examples | Should | **Fail** | No Examples page or `_example` compositions were detected across 158 families. The compositions in [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250) need an explicit examples designation. |
| BR-05 Manageable build scopes | Should | **Fail** | All 23 top-level items are loose, with no sections. [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250) contains 3,169 layers including instance contents, above the 500-layer budget. |
| BR-06 Linked-repo signal | Could | **N/A** | No linked-repo signal was detected. |
| BR-07 Values are bound | Must | **Fail** | 2,480 literal property occurrences span multiple compositions: 1,142 gaps, 698 radii, 224 fills, 195 padding entries, and other fields. Example: [Frame](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33257-12833). |
| BR-08 4px spacing and sizing grid | Should | **Fail** | 1,525 of 2,919 checked values are off-grid before contextual exemptions. Examples occur in [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250). Frequencies are listed below. |
| BR-09 Semantic aliases | Should | **Partly** | Primitives are all raw; Email has 70 alias values mixed with 2 raw values. No broken aliases. Context: [Token Architecture](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33105-316289). |
| BR-10 Narrow variable scopes | Should | **Partly** | 27 of 288 variables use ALL_SCOPES; 24 are unscoped. Examples include neutral and brand colors. Context: [Foundations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33035-173781). |
| BR-11 Variable descriptions | Should | **Pass** | All 36 variables in the alias-bearing Email collection have descriptions. The 252 primitive variables do not. |
| BR-12 Web code syntax | Should | **Fail** | All 288 variables lack Web syntax. Define mappings such as `var(--name)` in the token setup. Context: [Token Architecture](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33105-316289). |
| BR-13 Numeric font weights | Should | **Pass** | 8 numeric weight variables; no string weight variables detected. |
| BR-14 Default modes | Should | **Pass** | No non-default mode pins in scope. Email has Desktop and Mobile modes; the default-mode warning applies. |
| BR-15 Bound text/effect styles | Should | **Partly** | 17 of 56 text styles and all 5 effect styles have unbound fields. Examples include italic paragraph weights and shadow geometry. Context: [Foundations](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33035-173781). |
| BR-16 Reuse without detachment | Must | **Partly** | 51 detached frames detected. Example: [Nav Bars - CGM Naive](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168389). Their build status needs confirmation. |
| BR-17 Deliberate layout and sizing | Must | **Partly** | 37 frames/components lack auto layout and 32 instances override a main component’s hug sizing with fixed sizing. Example: [Subnavigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35564-18564). Fixed IVA canvases are exempt; internal sizing needs review. |
| BR-18 Consistent component properties | Should | **Partly** | Returned examples include 10 generic property names, 4 unwired properties, 5 boolean-like value cases, and 4 inconsistent naming pairs. Example: [Internal Pagination Control](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35487-37180). |
| BR-19 Manageable variants | Should | **Fail** | 6 of 94 sets exceed 30 variants; 3 properties exceed 30 options. [Abbott System Icons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35757-991) has 153 identification options. |
| BR-20 Required interaction states | Must | **Fail** | All 10 returned state summaries are incomplete for interactive controls. [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933) has Default/Disabled; [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449) has Default/Active, without explicit Focus or Pressed states. |
| BR-21 Component descriptions | Should | **Fail** | 155 of 158 component families lack descriptions. Example: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449). |
| BR-22 Named component children | Should | **Fail** | 88 of 158 families contain default-named non-art children. Example: [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933), with 48 such children. |
| BR-23 Slot documentation | Could | **Partly** | 30 families use slots. Only 8 of 36 slot properties are described; several owning components also lack descriptions. Context: [Modal page](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33194-280262). |
| BR-24 Rules are layer annotations | Must | **Pass** | No rule-like copy was detected. There are also no annotations; this passes the misplaced-rule check, not completeness of build guidance. |
| BR-25 No on-canvas build notes | Should | **Pass** | No on-canvas notes carrying build guidance were detected. |
| BR-26 Annotation schema | Should | **N/A** | No annotations exist in scope. |
| BR-27 Realistic content | Should | **Pass** | 8 placeholder text layers were detected in library components, where placeholders are permitted. This is not a product-content approval. |
| BR-28 Unique names | Must | **Fail** | 2 duplicate component-family names, 2 untrimmed names, and 4 repeated top-level names. Examples: duplicate Branded Title Card families [one](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33078-315444) and [two](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36058-70235). |
| BR-29 No default build-layer names | Should | **Partly** | 33 of 354 checked non-component layers have default names. Example: [Frame 439](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35168-23261). |
| BR-30 No stray instances | Could | **Partly** | 3 loose instances detected. Example: [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36159-165329). |
| BR-31 Mobile counterparts | Should | **N/A** | This is a fixed-tablet IVA library, not a Web product-screen set. Wide library presentation frames do not require mobile equivalents. |
| BR-32 Text contrast | Must | **Fail** | 8 pair groups covering 175 text segments were flagged. White text on a white library preview background is confirmed, including [Patient Profiles](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168445). Other transparent previews need intended-background confirmation. |
| BR-33 Control/state contrast | Must | **Fail** | 83 of 118 drawn boundaries were flagged below 3:1. Inspected active-state fills measure 1.34:1 for Libre and 1.31:1 for Duo against their surrounding backgrounds. Example: [active Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-21602). 83 is a candidate count, not 83 confirmed failures. |
| BR-34 Target size and spacing | Must | **Pass** | 689 targets checked. One is under 24px in one dimension, but none fails the spacing test. This checks design bounds, not implemented hit areas. |

## Fix these first

### Must

1. **Choose the approved navigation families and publish the required library assets** (BR-01, BR-03). There are multiple generations and variations without an explicit build designation. An agent needs one authoritative source. Start with [Navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35671-34250).

2. **Complete interactive states** (BR-20). For this touch IVA, draw Default, Pressed, Focus, and Disabled where applicable. Active/current-page selection is not a replacement for Pressed. Retain Hover if pointer use is supported. Start with [Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168449) and [Buttons](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33065-310933).

3. **Bind reusable UI values to tokens** (BR-07). Literal gaps and radii dominate the findings and would become hardcoded implementation values. Separate genuine illustration exceptions from one-color UI assets. Start with [Frame](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33257-12833).

4. **Resolve contrast in approved usage examples** (BR-32, BR-33). Supply intended backgrounds for transparent controls and make the current state identifiable without relying on a low-contrast fill alone. Start with [Patient Profiles](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168445) and [active Navigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-21602).

5. **Give duplicate families unique names** (BR-28). An agent can otherwise collapse distinct definitions into one. Resolve the Branded Title Card duplicates [one](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33078-315444) and [two](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=36058-70235), and the TemplatesTLDuo/End Page duplicates [one](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35936-22890) and [two](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35988-15518).

6. **Review detached copies and fixed-size overrides** (BR-16, BR-17). Keep deliberate fixed IVA canvas dimensions, but reconnect reusable internals or document why they differ. Examples: [Nav Bars - CGM Naive](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=33030-168389) and [Subnavigation Links](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35564-18564).

### Should

7. **Add Web syntax and finish style bindings** (BR-12, BR-15). All 288 variables need Web mappings; 22 styles need binding review.

8. **Create small, approved composition examples** (BR-04, BR-05). Break the large navigation presentation into named build scopes under approximately 500 layers each.

9. **Normalize spacing, property names, and variant structure** (BR-08, BR-18, BR-19).

10. **Describe components and rename structural children** (BR-21, BR-22, BR-29). Prioritize navigation, buttons, and shared controls.

11. **Complete ownership and publication information** (BR-02), then refine mixed semantic values and broad token scopes (BR-09, BR-10).

### Could

12. **Document slot contracts and organize loose instances** (BR-23, BR-30).

### Off-grid values returned

| Navigation value | Frequency |
| --- | ---: |
| 6px | 84 |
| 10px | 351 |
| 13px | 8 |
| 22px | 8 |
| 30px | 24 |
| 34px | 234 |
| 50px | 122 |
| 8.58px | 169 |
| 25.73px | 112 |
| 4.63px | 58 |
| 36.02px | 58 |
| 6.86px | 56 |
| 104.25px | 56 |
| 38.89px | 56 |
| 41.17px | 10 |

The variable read also returned 90, 14, 6, 10, 50, 18, and 970px examples. These lists were capped, so they are not a complete inventory. Review fractional/scaled dimensions and fixed-canvas exceptions before normalizing.

## Contrast details

All returned text pairs had **no named mode** and required **4.5:1**.

| Flagged pair | Size / weight | Ratio | Segments |
| --- | ---: | ---: | ---: |
| White on white | 18px / 450 | 1.00:1 | 163 |
| Purple on `#a2a2a2` | 14px / 390 | 1.91:1 | 5 |
| Light gray on `#9d9d9d` | 16px / 390 | 1.91:1 | 2 |
| White on `#fcf9ff` | 18px / 450 | 1.04:1 | 1 |
| Yellow on `#9d9d9d` | 16px / 450 | 1.77:1 | 1 |
| Purple on `#9d9d9d` | 14px / 390 | 1.80:1 | 1 |
| White on `#9d9d9d` | 16px / 450 | 2.70:1 | 1 |
| White on `#9d9d9d` | 18px / 450 | 2.70:1 | 1 |

An example from each pair group was inspected. Several are transparent standalone components shown against the canvas, so these ratios do **not** establish their deployed contrast. The white-on-near-white example also has a white containing background, reinforcing the preview readability problem rather than an exact 1.04:1 usage result.

The three inspected control-state examples were [Libre active main navigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-21602), [Libre active subnavigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-21618), and [Duo active subnavigation](https://www.figma.com/design/0VTZx0ZXc08vCIjdzb8Xza/?node-id=35644-26260). Their labels remain readable, but the active fills alone do not reach 3:1 against the surrounding surface.

## Tell the coding agent

- **Modes:** Primitives defaults to **Mode 1**. Email defaults to **Desktop**, with **Mobile** as an alternate. Request alternate-mode values explicitly; the default view alone is insufficient.
- **Slots:** Slot interiors are not reliably readable. Provide accepted content, sizing, overflow, and replacement behavior for each slot.
- **IVA scope:** Preserve deliberate tablet canvas dimensions. Do not interpret wide library presentation boards as desktop product screens.
- **Selection state:** “Active” generally means the current navigation item here. Do not implement it as a pointer-down state.

## Verify in Figma

- Confirm **Ready for dev** on the approved build frames and sections.
- Decide which of the **51 detached copies** are approved reusable structures versus historical variations.
- Confirm intended backgrounds for transparent navigation components.
- Confirm actual tappable bounds in implementation, including nested navigation items.

## What couldn’t be checked completely

- **BR-01:** Style publication status was unavailable in the style-publication read **03**, affecting all 61 text/effect styles.
- **BR-03 and BR-16:** Ready for dev status was unavailable in the structure read **05**.
- **BR-20:** The component read **04** returned only 10 state-property summaries. Findings are based on those summaries, not an exhaustive state inventory.
- **BR-32:** The contrast read **08** supplied at most three examples per failing pair. Representative examples were inspected, not all 175 flagged segments. Intended-use contrast remains unresolved for transparent standalone previews.
- **BR-33:** The target read **09** capped low-contrast examples at 10, representing three distinct component/variant combinations. The remaining flagged occurrences were not individually inspected, so **83 is a candidate count, not 83 confirmed failures**.
- **BR-34:** Design geometry passed the size/spacing test; runtime hit areas and behavioral exceptions were not tested.

## Review checklist

- [x] 1. Resolve scope
- [x] 2. Record starting state
- [x] 3. Read design and library data
- [x] 4. Judge all 34 checks
- [x] 5. Report only; no comments or annotations requested
- [x] 6. Complete ending comparison
- [x] 7. Check and deliver report

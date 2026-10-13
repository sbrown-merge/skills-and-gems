# Build readiness: 04 / Navigation

This library is **not ready for a coding agent to build from reliably**. First establish which navigation designs are approved, then resolve publishing, token bindings, interaction states, and duplicate component names.

Checked 2026-10-05 with merge-build-readiness 0.2. Scope: <figma-node-link node-id="33029:168030">04 / Navigation</figma-node-link>, with file-wide variable, style, and component checks. Platform: Web. File kind: Design library. Linked repo: None detected.

## Scorecard

| Check | Rank | Result | Evidence |
| --- | --- | --- | --- |
| BR-01 Library published | Must | Fail | 0/158 component families, 0/88 publishable variables, and 0/2 collections are published. Style publishing status was unavailable. Example: <figma-node-link node-id="33065:310933">Buttons</figma-node-link>. |
| BR-02 Cover and page order | Should | Partly | 46 pages follow a clear numbered order, with a cover and Start Here. The cover still shows an unassigned owner and placeholder publication date. <figma-node-link node-id="2080:1283">Project Cover</figma-node-link>. |
| BR-03 Build status marked | Must | Fail | 0/23 top-level items identify approval or build status. Ready for dev could not be read. <figma-node-link node-id="35671:34250">Navigation</figma-node-link>. |
| BR-04 Real composition examples | Should | Fail | 0 Examples pages and 0 `_example` compositions found. Add approved examples alongside <figma-node-link node-id="35667:34076">Navigation Parts</figma-node-link>. |
| BR-05 Manageable scope | Should | Partly | One family per page helps, but all 23 items are outside sections and one frame contains 3,169 layers, above the 500-layer budget. <figma-node-link node-id="35671:34250">Navigation</figma-node-link>. |
| BR-06 Linked repository signal | Could | N/A | No linked-repository signal found. |
| BR-07 Bound colors, spacing, radius, type | Must | Fail | 2,480 literal field uses span multiple designs, including 1,142 gaps and 698 radii. Another 123 artwork paint cases were excluded from this tally. <figma-node-link node-id="33257:12870">Literal-value example</figma-node-link>. |
| BR-08 Four-pixel grid | Should | Fail | 1,525/2,919 checked values are off-grid: 1,508 scoped values plus 17 variable values. <figma-node-link node-id="33257:12833">Layout example</figma-node-link>. |
| BR-09 Semantic aliases | Should | Partly | Primitives contains 252 raw values. Email mixes 70 aliases with 2 raw values; no broken aliases found. Relevant documentation: <figma-node-link node-id="33105:316289">Token Architecture</figma-node-link>. |
| BR-10 Restricted variable scopes | Should | Partly | 27/288 variables use ALL_SCOPES; none use ALL_FILLS. Relevant documentation: <figma-node-link node-id="33035:173781">Foundations</figma-node-link>. |
| BR-11 Variable descriptions | Should | Pass | All 36 variables in the alias-bearing Email collection have descriptions. |
| BR-12 Web code syntax | Should | Fail | 288/288 variables lack Web syntax. Relevant documentation: <figma-node-link node-id="33105:316289">Token Architecture</figma-node-link>. |
| BR-13 Numeric font weights | Should | Pass | 8 numeric weight variables; 0 string weights. |
| BR-14 Default mode warning | Should | Pass | Email defaults to Desktop and also has Mobile. No non-default mode is explicitly pinned in scope. See warning below. |
| BR-15 Variable-bound styles | Should | Partly | 17/56 text styles and 5/5 effect styles have unbound fields, totaling 22/61 styles. Relevant documentation: <figma-node-link node-id="33035:173781">Foundations</figma-node-link>. |
| BR-16 Reuse without detaching | Must | Partly | 51 detached copies found; their build status is unknown. Example: <figma-node-link node-id="33030:168389">Nav Bars - CGM Naive</figma-node-link>. |
| BR-17 Auto layout and sizing | Must | Partly | 37 containers lack auto layout and 32 instances override hug sizing with fixed dimensions. Fixed-canvas exceptions and intentional sizing need confirmation. <figma-node-link node-id="35644:21596">Frame 48</figma-node-link>. |
| BR-18 Consistent, wired properties | Should | Partly | Returned examples include 10 default property names, 4 unwired properties, and 4 inconsistent naming groups. Example: <figma-node-link node-id="35487:37180">Internal Pagination Control</figma-node-link>. |
| BR-19 Manageable variant sets | Should | Fail | 6/95 sets exceed 30 variants; 3 properties exceed 30 options. Example: <figma-node-link node-id="33009:61138">Libre Icons</figma-node-link>, with 320 variants. |
| BR-20 Required Web states | Must | Fail | Across 28 selected interactive families, only 12 state-property entries were found. Listed states omit Hover, Focus, and Pressed; Default/Active is not a complete Web state set. <figma-node-link node-id="33065:310933">Buttons</figma-node-link> has only Default/Disabled. |
| BR-21 Component descriptions | Should | Fail | 155/158 component families lack descriptions. Example: <figma-node-link node-id="33030:168449">Navigation Links</figma-node-link>. |
| BR-22 Named component children | Should | Fail | 88/158 component families contain default child names. Example: <figma-node-link node-id="33065:310933">Buttons</figma-node-link>, with 48 default-named children. |
| BR-23 Slot contents warning | Could | Partly | 30 components contain slots; only 8/36 slot properties have descriptions. Example: <figma-node-link node-id="33194:280262">Modal page</figma-node-link>. See warning below. |
| BR-24 Rules on governed layers | Must | Pass | 0 rule-like copy passages found. No misplaced build rules were detected. |
| BR-25 Guidance as annotations | Should | Pass | 0 on-canvas build notes found. |
| BR-26 Annotation schema | Should | N/A | 0 annotations in scope. |
| BR-27 Realistic build content | Should | Pass | 8 placeholder passages occur in library components, where placeholder labels are allowed. No CMS-driven build content was established. |
| BR-28 Unique, trimmed names | Must | Fail | 2 duplicate component-name groups found, plus 2 untrimmed names and 4 duplicate top-level name groups. <figma-node-group-link node-ids="33078:315444,36058:70235">Duplicate Branded Title Card components</figma-node-group-link>. |
| BR-29 Meaningful build-layer names | Should | Partly | 33/354 checked layers retain default names. Example: <figma-node-link node-id="35168:23261">Frame 439</figma-node-link>. |
| BR-30 No stray instances | Could | Partly | 3 instances sit loose on the page. Example: <figma-node-link node-id="36159:165329">Navigation Links</figma-node-link>. |
| BR-31 Mobile counterparts | Should | N/A | Library scope, not a Web product-screen audit. |
| BR-32 Text contrast | Must | Couldn't check | Read 08 found 1 candidate at 2.70:1, but its isolated screenshot omitted the actual background. Another 15 text layers depend on placement. <figma-node-link node-id="36159:165329">Navigation Links</figma-node-link>. |
| BR-33 Control/state contrast | Must | Couldn't check | Read 09 flagged 54/117 drawn boundaries. Isolated screenshots did not establish surrounding contrast; 6 more controls depend on placement. <figma-node-group-link node-ids="35644:21618,35644:26260">Active subnavigation candidates</figma-node-group-link>. |
| BR-34 Target size and spacing | Must | Pass | 689 targets checked. One is 327×10px, but passes the small-target spacing test; 0 spacing failures found. |

## Fix these first

1. **Identify the approved build source** (BR-03, Must). Mark approved designs and distinguish alternatives or deprecated work. Confirm Ready for dev on <figma-node-link node-id="35671:34250">Navigation</figma-node-link>.
2. **Publish the intended library assets** (BR-01, Must). All 158 component families and 88 publishable variables are unpublished. Start with approved families such as <figma-node-link node-id="33065:310933">Buttons</figma-node-link>.
3. **Replace literal values with intended bindings** (BR-07, Must). Address the 2,480 literal field uses, starting with the 2,036 attributed to <figma-node-link node-id="35671:34250">Navigation</figma-node-link>. Preserve legitimate artwork exceptions.
4. **Add complete Web interaction states** (BR-20, Must). Provide Default, Hover, Focus, Pressed, and Disabled where appropriate. Distinguish current-page Active from pressed feedback in <figma-node-group-link node-ids="33030:168449,33030:168452">Navigation and subnavigation links</figma-node-group-link>.
5. **Resolve duplicate component identities** (BR-28, Must). Give each intended component a unique, trimmed name or consolidate genuine duplicates. Review <figma-node-group-link node-ids="33078:315444,36058:70235,35936:22890,35988:15518">The two duplicate component groups</figma-node-group-link>.
6. **Review detached copies and sizing exceptions** (BR-16, BR-17, Must). Restore reusable instances where appropriate and document intentional fixed layouts. Start with <figma-node-link node-id="33030:168389">Nav Bars - CGM Naive</figma-node-link>.
7. **Confirm accessibility before build approval** (BR-32, BR-33, Must). Inspect the text candidate and active-state backgrounds in context. These are unresolved candidates, not confirmed failures: <figma-node-group-link node-ids="36159:165329,35644:21618,35644:26260">Contrast candidates</figma-node-group-link>.
8. **Normalize off-grid values deliberately** (BR-08, Should). Review <figma-node-link node-id="33257:12833">Layout example</figma-node-link>. Returned scoped frequencies are: 6px ×84, 10 ×351, 13 ×8, 22 ×8, 30 ×24, 34 ×234, 50 ×122, 8.58 ×169, 25.73 ×112, 4.63 ×58, 36.02 ×58, 6.86 ×56, 104.25 ×56, 38.89 ×56, and 41.17 ×10. Variable frequencies are: 6 ×4, 10 ×3, 14 ×3, 50 ×2, 90 ×2, 18 ×1, 970 ×1, and 250 ×1. The scoped value list was cut short.
9. **Complete token and style handoff** (BR-09, BR-10, BR-12, BR-15, Should). Add Web syntax, narrow broad scopes, separate semantic aliases from raw values where appropriate, and bind missing style fields. Review <figma-node-link node-id="33105:316289">Token Architecture</figma-node-link>.
10. **Simplify and document component families** (BR-18, BR-19, BR-21, BR-22, Should). Reduce oversized sets, wire properties, describe intended use, and name children. Start with <figma-node-group-link node-ids="33009:61138,33065:310933">Libre Icons and Buttons</figma-node-group-link>.
11. **Create small approved examples** (BR-04, BR-05, BR-29, Should). Break the 3,169-layer composition into clear build scopes and replace default names. Review <figma-node-link node-id="35671:34250">Navigation</figma-node-link>.
12. **Describe slots and organize loose instances** (BR-23, BR-30, Could). Record intended slot contents and move approved examples into their proper context. Review <figma-node-link node-id="36159:165329">Loose Navigation Links instance</figma-node-link>.

## Tell the coding agent

- Only collection defaults are visible: Primitives uses **Mode 1**; Email uses **Desktop**. Email’s **Mobile** mode needs an explicit implementation brief.
- Slot contents cannot be read reliably. Describe what each slot contains and how it behaves before implementation.
- Component checks cover all 46 pages, including archive material. Structural and accessibility findings cover only the selected page.
- Example lists were cut short: detached copies 10/51, containers without auto layout 10/37, fixed-over-hug cases 10/32, default layer names 10/33, default-child component examples 10/88, and boundary candidates 10/54. Do not treat these examples as exhaustive.

## Verify in Figma

- Confirm Ready for dev on the approved frames and sections.
- Decide which of the 51 detached copies are approved build material.
- Confirm which of the 37 manual-layout containers and 32 fixed-sizing overrides are intentional, including fixed IVA canvas requirements.
- Verify placement-dependent text contrast across 7 families: Duo sub-nav, Subnavigation Links, Navigation Links, Libre Main Category Navigation Items, Duo Main Category Navigation Items, Libre Sub Category Navigation Items, and Duo Sub Category Navigation Items.
- Verify the 6 placement-dependent Duo Sub Category Navigation Items controls.
- Check the small target’s intended hit area: <figma-node-link node-id="33033:172510">Subnavigation Links</figma-node-link>.

## What couldn't be checked

- **BR-01, style publishing:** Read 03 returned unavailable publishing status for all 61 styles.
- **BR-03, Ready for dev:** Read 05 returned unavailable status for all 23 top-level items.
- **BR-32, final contrast confirmation:** Read 08 found white text on gray at 18px, 2.70:1 against a 4.5:1 requirement. The isolated screenshot did not show its background. Fifteen additional text layers have placement-dependent backgrounds; no image-background cases were found.
- **BR-33, final contrast confirmation:** Read 09 flagged 54 boundaries. Returned examples include active Libre at 1.34:1 and active Libre Duo at 1.31:1. Both isolated screenshots omitted their surroundings, and 44 flagged examples were not individually returned. Six further controls have placement-dependent backgrounds.

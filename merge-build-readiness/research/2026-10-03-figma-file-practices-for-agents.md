---
title: "Structuring Figma files and libraries for AI coding agents"
description: "Checkable practices, as of 2026-10-03, for Figma files and design-system libraries that agents build code from through Figma's MCP server, with sources, conflicts and open questions."
type: research-note
status: stable
created: 2026-10-03
maintainer: Steve Brown
tags: [figma, mcp, design-systems, variables, components, code-connect, ai-agents]
stale_after: 2027-01-03
sources:
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/", title: "Structure your Figma file (F1)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/avoid-large-frames/", title: "Avoid large frames (F2)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/", title: "Tools and prompts (F3)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/", title: "Rate limits & access (F4)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/", title: "Code Connect integration (F5)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/mcp-clients-issues/", title: "Known issues with MCP clients (F6)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/server-returning-web-code/", title: "The server keeps returning web/react code (F7)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/", title: "Write to canvas (F9)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/images-stopped-loading/", title: "Images have stopped loading (F-images)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/code-connect/code-connect-ui-setup/", title: "Getting started with Code Connect UI (F10)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/code-connect/comparing-cc/", title: "Comparing Code Connect UI and CLI (F11)", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/plugins/api/DevStatus/", title: "Plugin API DevStatus (F12)", author: Figma, last_modified: undated}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/README.md", title: "Figma MCP Server Guide README (G1)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/skills/figma-design-to-code/SKILL.md", title: "figma-design-to-code skill (G2)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/skills/figma-generate-library/SKILL.md", title: "figma-generate-library skill (G3)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/skills/figma-generate-library/references/naming-conventions.md", title: "Naming conventions reference (G4)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/skills/figma-generate-library/references/component-creation.md", title: "Component creation reference (G5)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/skills/figma-generate-library/references/token-creation.md", title: "Token creation reference (G6)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/skills/figma-use/references/working-with-design-systems/wwds-components--creating.md", title: "Working with design systems: creating components (G8)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/skills/figma-use/references/working-with-design-systems/wwds-variables--creating.md", title: "Working with design systems: creating variables (G9)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/skills/figma-use/references/working-with-design-systems/wwds-text-styles.md", title: "Working with design systems: text styles (G10)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/figma-power/steering/code-connect-components.md", title: "Code Connect components steering (G11)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/skills/figma-swiftui/references/design-to-code.md", title: "SwiftUI design-to-code reference (G12)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://github.com/figma/mcp-server-guide/blob/aaa07946b60797706c131ca50e50ca526a44b073/skills/figma-use/SKILL.md", title: "figma-use skill (G-use)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://help.figma.com/hc/en-us/articles/38978644498199", title: "AI workflows collection: Best practices to help Figma AI understand your design system (H1)", author: Figma, last_modified: "2026-10-02"}
  - {resource: "https://help.figma.com/hc/en-us/articles/39592284074263", title: "Check designs in Figma (H2)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://help.figma.com/hc/en-us/articles/38231200344599", title: "Create and use slots to build flexible components (H3)", author: Figma, last_modified: "2026-09-28"}
  - {resource: "https://help.figma.com/hc/en-us/articles/39252411778583", title: "Figma MCP server FAQs (H4)", author: Figma, last_modified: "2026-09-07"}
  - {resource: "https://help.figma.com/hc/en-us/articles/32132100833559", title: "Guide to the Figma MCP server (H5)", author: Figma, last_modified: "2026-10-03"}
  - {resource: "https://help.figma.com/hc/en-us/articles/20774752502935", title: "Add measurements and annotate designs (H6)", author: Figma, last_modified: "2026-09-30"}
  - {resource: "https://help.figma.com/hc/en-us/articles/26781702258583", title: "Dev Mode statuses and notifications (H7)", author: Figma, last_modified: "2026-09-17"}
  - {resource: "https://help.figma.com/hc/en-us/articles/23920389749655", title: "Code Connect (H8)", author: Figma, last_modified: "2026-10-03"}
  - {resource: "https://help.figma.com/hc/en-us/articles/35498295267991", title: "Figma MCP collection: Improve code generation with Code Connect UI (H9)", author: Figma, last_modified: "2026-08-03"}
  - {resource: "https://help.figma.com/hc/en-us/articles/360039238193", title: "Hide styles, components, and variables when publishing (H10)", author: Figma, last_modified: "2026-08-03"}
  - {resource: "https://help.figma.com/hc/en-us/articles/15343816063383", title: "Modes for variables (H11)", author: Figma, last_modified: "2026-10-02"}
  - {resource: "https://help.figma.com/hc/en-us/articles/36346281624471", title: "Extend a variable collection (H12)", author: Figma, last_modified: "2026-09-21"}
  - {resource: "https://help.figma.com/hc/en-us/articles/27882809912471", title: "Variables in Dev Mode (H13)", author: Figma, last_modified: "2026-08-25"}
  - {resource: "https://help.figma.com/hc/en-us/articles/15145852043927", title: "Create and manage variables and collections (H14)", author: Figma, last_modified: "2026-09-25"}
  - {resource: "https://help.figma.com/hc/en-us/articles/360040328273", title: "Compare Figma plans and features (H15)", author: Figma, last_modified: "2026-10-03"}
  - {resource: "https://help.figma.com/hc/en-us/articles/35794667554839", title: "What's new from Schema 2025 (H16)", author: Figma, last_modified: "2026-09-09"}
  - {resource: "https://help.figma.com/hc/en-us/articles/39636737843735", title: "Components collection: Variants and component set fundamentals (H17)", author: Figma, last_modified: "2026-07-29"}
  - {resource: "https://help.figma.com/hc/en-us/articles/39636407507735", title: "Components collection: Component property fundamentals (H18)", author: Figma, last_modified: "2026-09-07"}
  - {resource: "https://help.figma.com/hc/en-us/articles/360040528173", title: "Reduce memory usage in files (H19)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://help.figma.com/hc/en-us/articles/360063144053", title: "Guide to branching (H20)", author: Figma, last_modified: "2026-08-12"}
  - {resource: "https://www.figma.com/blog/config-2026-recap/", title: "Config 2026 recap (B1)", author: Dylan Field, last_modified: "2026-06-24"}
  - {resource: "https://forum.figma.com/product-updates-3/everything-announced-at-config-2026-55221", title: "Everything announced at Config 2026 (B2)", author: "Tom Reem (Figma)", last_modified: "2026-06-24"}
  - {resource: "https://forum.figma.com/suggest-a-feature-11/figma-mcp-reading-variable-modes-42031", title: "Figma MCP - reading variable modes (R1)", author: "Figma Forum (staff reply Yarden K)", last_modified: "2026-05-25"}
  - {resource: "https://forum.figma.com/ask-the-community-7/mcp-support-for-annotations-53685", title: "MCP support for annotations (R2)", author: "Figma Forum (staff Jaycee Lewis, Cody Bitner)", last_modified: "2026-06-30"}
  - {resource: "https://forum.figma.com/report-a-problem-6/figma-mcp-server-not-displaying-annotations-from-nested-component-instances-42958", title: "MCP not displaying annotations from nested instances (R3)", author: "Figma Forum (community)", last_modified: "2025-12-12"}
  - {resource: "https://forum.figma.com/report-a-problem-6/figma-mcp-cannot-read-nodes-inside-slot-components-54329", title: "Figma MCP cannot read nodes inside Slot components (R4)", author: "Figma Forum (staff Tom Reem)", last_modified: "2026-06-30"}
  - {resource: "https://forum.figma.com/report-a-problem-6/mcp-get-design-context-does-not-surface-nested-component-variant-props-to-parent-51653", title: "get_design_context does not surface nested variant props (R5)", author: Figma Forum, last_modified: "2026-03-19"}
  - {resource: "https://github.com/southleft/figmalint/blob/370f1985897dc03e81d99387415e62b1b8f9800c/README.md", title: "FigmaLint README (P1)", author: Southleft, last_modified: "2026-08-15"}
  - {resource: "https://southleft.com/insights/design-systems/designing-for-developers-introducing-figmalint/", title: "Designing for developers: introducing FigmaLint (P2)", author: TJ Pitre, last_modified: "2025-07-02"}
  - {resource: "https://southleft.com/scorecard", title: "AI-Ready Design System Scorecard (P3)", author: Southleft, last_modified: undated}
  - {resource: "https://nathanacurtis.substack.com/p/configuration-collapse", title: "Configuration Collapse (P4)", author: Nathan Curtis, last_modified: "2026-02-27"}
  - {resource: "https://nathanacurtis.substack.com/p/design-system-conventions-in-figma", title: "Design System Conventions in Figma (P5)", author: Nathan Curtis, last_modified: "2026-09-14"}
  - {resource: "https://www.intodesignsystems.com/agentic-design-systems", title: "Agentic Design Systems: The Complete Guide (P6)", author: Into Design Systems, last_modified: undated}
  - {resource: "https://obra.studio/blog/2026/08/19/the-how-and-why-behind-our-obra-shadcn-ui-2-0-release/", title: "The how and why behind our Obra shadcn/ui 2.0 release (P7)", author: Johan Ronsse, last_modified: "2026-08-19"}
  - {resource: "https://github.com/destefanis/design-lint", title: "design-lint Figma plugin", author: Daniel Destefanis, last_modified: "2024-01-12"}
---

# Structuring Figma files and libraries for AI coding agents

This note collects checkable practices for structuring Figma design files and design-system libraries so that AI coding agents (Claude Code, Cursor, Copilot, Codex, Figma Make and similar) build accurate code from them through Figma's MCP server, as of 2026-10-03, for the [merge-build-readiness plan](../PLAN.md). Each practice carries **[P]** for a primary source or **[Pr]** for a practitioner source, and a status: **confirmed** (a primary source states it, or two independent sources agree), **reported** (one secondary source, or a search summary that wasn't opened), or **inferred** (our reading). The keys in brackets (F1, G4, H1 and so on) match the `title` of each entry in the frontmatter `sources` list. The developers.figma.com pages carry no dates, so they're cited as undated and read on 2026-10-03.

## Contents

<!-- toc -->
- 1. File and page structure
- 2. Variables
- 3. Components
- 4. Handoff signals for agents
- 5. What the MCP server returns, and its limits
- 6. Audit tools and linters
- Which practices apply to which platforms
- Conflicts between sources
- Open questions
<!-- /toc -->

## 1. File and page structure

These practices cover how pages are ordered, how status is marked, and how big a selection an agent can handle.

- **Put a Cover page first, foundations and token pages before component pages, and utility pages last; don't mix page-naming patterns in one file.** [P] confirmed, G4 (2026-10-01). Test: Cover at index 0 and Foundations before the first component page.
- **Separate page groups with separator pages named `---`** (the default), or a decorated name such as `——— COMPONENTS ———`. [P] confirmed, G4.
- **Give a full library one page per component**; tightly related families may share a page. **Match the file's existing convention** rather than imposing these defaults. [P] confirmed, G3, G4.
- **Status marking on pages is optional.** Figma's UI3 library puts a green, yellow or red circle for design status and `[beta]` or `[future]` for code status in page names, recommended only for large multi-team systems. [P] confirmed, G4.
- **Use Dev Mode statuses as the handoff signal.** Ready for dev is on all paid plans; Completed and "Done with changes" need Organization or Enterprise. A status applies to sections, frames and components. "Changed" is set automatically on design edits, but not when a library instance, variable value or style value changes. [P] confirmed, H7 (2026-09-17). In the Plugin API, `devStatus` is `READY_FOR_DEV | COMPLETED | null` and only settable on a node directly under a page or section [P] confirmed, F12. No MCP read tool lists `devStatus` among its outputs, so an agent reads it through `use_figma` or the REST API (inferred from F3 and F12).
- **Keep library files separate from product files and drafts, and publish the library.** Figma's agent only references published libraries [P] confirmed, H1 (2026-10-02); Code Connect only works on components published to a team library [P] confirmed, G11 and F10; Southleft's scorecard checks for "a clear hierarchy (library vs. product vs. drafts)" [Pr] reported, P3.
- **Branching needs an Organization or Enterprise plan and a Full seat** [P] confirmed, H20 (2026-08-12); migrate to extended collections on the main file, not a branch [P] confirmed, H12. Nothing says whether MCP reads branch URLs differently.
- **Keep selections small for MCP.** Build per component or section rather than whole screens; "Large, deeply nested frames can overwhelm the context window and slow things down, or silently fail." [P] confirmed, F2 and G1. Figma publishes no threshold; Claude Code caps MCP responses at 25,000 tokens, with an example response of 351,378 tokens and the fix `MAX_MCP_OUTPUT_TOKENS` [P] confirmed, F6. A per-frame node-count budget is a measurable proxy (inferred; no source sets a number).
- **Use the `_example` suffix or an `Examples` page in published libraries** to show real compositions, each design a component; Figma's agent references up to 200 examples. Documented for the in-app agent, not MCP. [P] confirmed, H1.
- **Use realistic compositions and content.** H1 asks for "realistic compositions"; G3 says replace placeholders when the real asset exists. Nothing primary addresses lorem ipsum directly.

## 2. Variables

These practices cover token tiers, scopes, code syntax, modes and styles.

- **Bind spacing, color, radius and typography to variables** [P] confirmed, F1 and H1: on every component, fill, stroke, text fill, all four padding sides, gap, all four corner radii and stroke weight, except intentionally fixed geometry such as icon pixel grids and static dividers [P] confirmed, G3, G5. Test: no unbound values in those fields.
- **Use a primitive tier and a semantic (alias) tier.** Semantic variables never hold raw values; they alias a primitive of the same `resolvedType`. [P] confirmed, G4, G6. Test: zero semantic variables with non-alias values and zero broken aliases.
- **Pick the number of collections by size** [P] confirmed, G3, G6: under 50 tokens, one collection with Light and Dark modes; 50 to 200, Primitives (one mode) plus Color, Spacing and Typography (Figma's Simple Design System has 7 collections and 368 variables); over 200, several semantic collections with 4 to 8 modes. Figma staff advise one mode in primitives and light and dark in the semantic collection [P] reported (search summary).
- **Scope every variable, and never use `ALL_SCOPES`.** Primitives get `[]`, which hides them from pickers; background fills `FRAME_FILL, SHAPE_FILL`; text `TEXT_FILL`; borders `STROKE_COLOR`; spacing `GAP`; radii `CORNER_RADIUS`; font size `FONT_SIZE`. Booleans can't be scoped. [P] confirmed, G3, G6. Check designs asks for precise scopes and hidden primitives too [P] confirmed, H2, and Dev Mode's suggested variables only match an exact value with the right scope [P] confirmed, H13. Test: zero non-primitive, non-boolean variables with empty or all scopes.
- **Set code syntax on every variable**, up to three per variable (Web, Android, iOS), shown in Dev Mode as CSS, SwiftUI or Compose [P] confirmed, H14 (2026-09-25). WEB syntax must use the full `var(--name)` form "or Dev Mode will show raw hex values" [P] confirmed, G4, G6. Take names from the real codebase, with vendor prefixes only in code syntax [P] confirmed, G4.
- **Name variables with slash hierarchy and semantic roles** (`color/bg/primary`, not `blue-500`); primitives use `{family}/{step}`. [P] confirmed, G4 and H1; [Pr] reported, P3.
- **Write descriptions on variables**, especially semantic roles. [P] confirmed, H1. Whether MCP returns them isn't documented.
- **Hide unpublished variables and collections** with "Hide from publishing", or a `_` or `.` collection prefix [P] confirmed, H10; Figma's skill hides primitives through `scopes = []` instead (G6).
- **Mind the default mode** (the left-most column) [P] confirmed, H11. The MCP returns only default-mode values; `get_variable_defs` gives only the first mode, so dark, breakpoint and brand modes are invisible to the agent. Figma staff said "It is definitely in our list!" on 2025-06-20, and users still reported the gap on 2026-05-25. [P/forum] confirmed, R1.
- **Extended collections for multi-brand theming on Enterprise**: a brand collection inherits from its parent and can't add variables or modes or change descriptions or scopes. [P] confirmed, H12.
- **Mode limits**: 10 per collection on Professional, 20 on Organization, unlimited on Enterprise with extended collections; Starter none. [P] confirmed, H15 (2026-10-03), H16, H11. Conflicts with G6.
- **Text and effect styles stay as styles**, with their fields bound to variables; text styles named `Category/Name`, effect styles `Shadow/…` or `Elevation/N`. [P] confirmed, G4, G6, G10.
- **Font-weight variables are numbers, not strings**, because Dev Mode drops the reference for string weights. [P] confirmed, H13.
- **DTCG interchange**: Figma imports DTCG JSON per mode, with dimensions in `px` and durations in `s`; composite types aren't supported. [P] confirmed, H11.

## 3. Components

These practices cover properties, variant limits, slots, layout, states and documentation.

- **Use components for anything reused, with full properties**; Figma calls variants, booleans and slots "a complete schema" for the agent. [P] confirmed, F1, H1.
- **Make each variant property control one named difference**, for example separate Type and Size rather than one "Primary Large". [P] confirmed, H17 (2026-07-29).
- **Variant names use `Property=Value`**, property names following code props where possible, values in Title Case, booleans as `true`/`false`, never Yes/No. [P] confirmed, G4.
- **Cap variant matrices at about 30 combinations**; above that, split by a primary axis, move icons to an instance swap, or extract sub-components. Never one variant per icon. [P] confirmed, G3, G5 (a skill heuristic, not a product limit). Prefer boolean and text properties; "a property that isn't wired to a descendant is invisible." [P] confirmed, G8. Booleans reduce memory use [P] confirmed, H19. Test: each set has 30 or fewer children, and every property is wired.
- **Use slots for repeating and freeform content** instead of detaching; slots are on all plans for anyone with edit access [P] confirmed, H3 (2026-09-28). **MCP can't read content inside slots**: "reading nodes inside Slot components is a current limitation" (Figma staff, 2026-06-30) [P/forum] confirmed, R4.
- **Sub-component naming**: internal parts `_Button/IconSlot`, documentation-only components prefixed `.`, public components PascalCase. [P] confirmed, G4 (G5 differs).
- **Avoid detaching**; Check designs flags detached components [P] confirmed, H2, and detaching imported remote components is an anti-pattern [P] confirmed, G3.
- **Use auto layout and size deliberately**: fill for stretching elements, hug for buttons, chips and tags, fixed for avatars and icon containers, with min and max widths; resize to check behavior. [P] confirmed, H1, F1.
- **Cover the interaction states**, deciding deliberately how hover and focus are represented [P] confirmed, G8. Figma's skill uses Default, Hover, Focused, Pressed, Disabled [P] confirmed, G5; FigmaLint checks hover, focus, disabled, pressed and active and weights state coverage 3× [Pr] confirmed, P1; Southleft adds loading and error [Pr] reported, P3. No primary source covers empty states.
- **Write descriptions on components and styles** saying when to use them versus similar components, listing states and accessibility requirements, rather than relying on documentation frames on the canvas. [P] confirmed, H1. Set `description` only on COMPONENT or COMPONENT_SET nodes [P] confirmed, G-use; add `documentationLinks` [P] confirmed, G5; name child layers semantically, because unnamed children are a defect [P] confirmed, G5.
- **Accessibility annotations**: the preset categories are Development, Interaction, Accessibility and Content. [P] confirmed, H6 (2026-09-30).

## 4. Handoff signals for agents

These are the signals beyond the design itself that reach an agent.

- **Code Connect** is "the #1 way to get consistent component reuse"; without it "the model is guessing" [P] confirmed, F1, G1. It needs an Organization or Enterprise plan, a Dev or Full seat and published components [P] confirmed, H8, F10, G11. "Add instructions for MCP" puts per-component rules into the snippet [P] confirmed, F5, H8, H16. (Out of scope for merge-build-readiness, which checks only what's in the file.)
- **Annotations** need a Full seat to add and a Full or Dev seat to view [P] confirmed, H6. MCP returns them only when `get_design_context` reads the annotated node itself [P/forum] confirmed (staff, 2026-06-25), R2; annotations on nested instances are missed [Pr/forum] reported, R3.
- **Measurements and dev resources** help, but whether MCP returns them isn't documented.
- **Layer names come through as `data-name`**, so use semantic names, not `Frame1268`. [P] confirmed, F1, H1, G12. Test: zero layers matching `^(Frame|Group|Rectangle|Ellipse|Vector) \d+$` in frames handed to agents.

## 5. What the MCP server returns, and its limits

These are the read tools' documented outputs and the known gaps that should shape how a file is built.

- **`get_design_context`** returns a React and Tailwind-like representation, a screenshot and asset URLs whatever the target platform; the agent translates it. [P] confirmed, F3, F7, G1. Figma's skill says a response may be "flagged as sparse", and the agent then fetches children in parallel [P] confirmed, G2.
- **`get_metadata`** returns sparse XML of IDs, names, types, positions and sizes, and lists pages with no nodeId; no page-count limit is documented. [P] confirmed, F3.
- **`get_screenshot`** returns one node per call; `download_assets` handles up to 20; asset URLs are temporary. [P] confirmed, F3, H4.
- **Default mode only** (R1), **annotations only from the node read** (R2), **slot content not read** (R4), and **nested variant props not surfaced to the parent** (open since 2026-03-19) [P/forum] reported, R5. Instance overrides reportedly sometimes come back as defaults (search summaries only).
- **Rate limits** for a Dev or Full seat: 200 calls a day at 10 a minute on Professional, 200 at 15 on Organization, 600 at 20 on Enterprise. [P] confirmed, F4.
- **`use_figma` writes** need a Full seat outside drafts, with a 20 KB response limit per call and no images. [P] confirmed, H4, F9.

## 6. Audit tools and linters

These are the published checkers and what each scores.

- **Figma Check designs** (Organization and Enterprise, no LLM) has four tabs: Colors (hard-coded values and contrast), Dimensions (spacing, padding, radius), Typography (values that should be text styles) and Components (detached or from wrong libraries). One page at a time, 25,000 layers maximum. [P] confirmed, H2 (2026-10-01).
- **FigmaLint (Southleft)** scores readiness per component, weighting token adoption 2× and state coverage 3×, plus accessibility and readiness (descriptions, properties); it detects generic layer names. [Pr] confirmed, P1 (2026-08-15).
- **Southleft's AI-readiness scorecard** covers token architecture, component API, design-to-code parity, layer hygiene, governance and AI workflow readiness. [Pr] confirmed, P3.
- **Figma's own validation recipes**: G5's 10-point visual checklist and G6's token exit criteria. [P] confirmed.
- **Config 2026** (2026-06-24) announced no design-system linting. [P] confirmed, B1, B2.

## Which practices apply to which platforms

Some of the practices above only matter for web stacks; the rest hold on any platform.

### Web, React or shadcn stacks only

The React and Tailwind reference output (other stacks translate it); WEB code syntax in `var(--…)` form; shadcn kits naming variables 1:1 with `globals.css`; Make kits generating React; slots' React analogy; Code Connect CLI parsers for React and Web Components; hover as a state (touch platforms use pressed and focused, inferred from G8).

### Any platform, including native, tablet, email and print-like templates

Variables with tiers, scopes, descriptions and Android or iOS code syntax; auto layout with deliberate fill, hug and fixed sizing (fixed suits fixed-dimension canvases such as a tablet slide, inferred from H1); semantic layer names, annotations, Ready-for-dev status and small selections; component properties, descriptions and the Examples page; default-mode awareness. No source addresses email or print-like template output specifically.

## Conflicts between sources

Where two sources disagree, the newer primary source leads.

1. **Mode limits per plan:** G6 says Starter 1, Professional 4, Organization and Enterprise 40; H15 (2026-10-03) and H16 say Professional 10, Organization 20, Enterprise unlimited, Starter none. Lead with H15.
2. **MCP limits for Starter:** F4 says 20 calls a month; G1 and H16 say 6.
3. **Booleans versus slots:** Figma (G8, H19) prefers boolean, text and instance-swap properties; Nathan Curtis (P4) argues for slot composition as "AI-ready". MCP can't read slot content (R4), so slot-heavy components give agents less today (inferred).
4. **Figma names versus code names:** Southleft (P3) wants exact matches; Figma's skill (G4) says don't rename Figma components to match code, because code syntax and Code Connect carry the identifiers.
5. **Variable casing:** G4 defaults to lowercase; G8, G9 and Curtis (P5) favor capitalized case.
6. **Private prefixes:** G4 uses `_` and `.`; G5 uses `__` and `_`; H10 documents `.` for components and `_` or `.` for collections.
7. **Annotation attribute names:** R3 (2025-12-12) gives `data-development-annotations`; Figma staff (R2, 2026-06-25) give `data-annotations`.
8. **Theming with modes:** G3 and G6 recommend modes; Obra (P7) avoided them for file bloat; Enterprise has extended collections (H12).
9. **Slots seat requirement:** H16 says Full seat in beta; H3 (2026-09-28) says all plans with edit access. Lead with H3.
10. **The sparse flag:** G2 applies it to `get_design_context`; F3 uses "sparse" only for `get_metadata`.

## Open questions

Most of these need a live MCP call to settle.

- **TBD:** whether MCP returns component and variable descriptions, measurements, dev resources or Ready-for-dev status in `get_design_context`.
- **TBD:** a numeric limit for a "large frame"; only Claude Code's 25,000-token cap is published.
- **TBD:** the `get_metadata` page-listing limit. (On 2026-09-10 the abbott repo's session saw `get_metadata` list 3 of a file's pages, and MERGE One's playbook records it listing 4 of 17, so a limit or filter does exist in practice.)
- **TBD:** whether multi-mode reading has shipped since 2026-05-25.
- **TBD:** the current annotation attribute name.
- **TBD:** guidance specific to email, print-like or fixed-canvas tablet templates; no source covers them.

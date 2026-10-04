---
title: "merge-build-readiness: the checklist"
description: "The 34 checks merge-build-readiness runs on a Figma file, BR-01 to BR-34, each with its rank, reason, how a Plugin API script or the agent verifies it, the platforms it applies to, and the MERGE One playbook practice it came from."
type: checklist
status: draft
version: "0.7"
created: 2026-10-03
maintainer: Steve Brown
tags: [figma, figma-agent, skill, agentic-build, design-system, audit, checklist]
state: "Draft for Steve's review at build step 2 of PLAN.md; nothing downstream starts until it's approved."
sources:
  - {resource: "https://github.com/sbrown-merge/merge-one-related/blob/main/Figma/MERGE%20One%20UI%20%E2%80%94%20Figma%20Practices%20for%20Agentic%20Builds.md", title: "MERGE One UI: Figma practices for agentic builds, version 0.1", author: Steve Brown, last_modified: "2026-09-29"}
  - {resource: "research/2026-10-03-figma-file-practices-for-agents.md", title: "Structuring Figma files and libraries for AI coding agents", author: Steve Brown, last_modified: "2026-10-03"}
  - {resource: "https://github.com/mergeworld/abbott-fs-libre-global-iva-specs/blob/main/captures/2026-09-30%20IVA%20design%20library%20audit.md", title: "2026-09-30 IVA design library audit", author: Steve Brown, last_modified: "2026-09-30"}
  - {resource: "~/.claude/plugins/cache/claude-plugins-official/figma/2.2.12/skills/figma-use/references/plugin-api-standalone.d.ts", title: "Figma Plugin API typings bundled with Figma's Claude Code plugin 2.2.12, read locally on 2026-10-03", author: Figma, last_modified: undated}
---

# merge-build-readiness: the checklist

This is the full checklist that `merge-build-readiness` runs on a Figma file, written at step 2 of the [build plan](PLAN.md) on 2026-10-03. It starts from the [MERGE One playbook][playbook], drops everything that depends on shadcn, React, a codebase or a repo, and adds what Figma itself recommends, as collected in the [file-practices research note][note]. Every check looks only at what a person or an agent can create in the Figma file. `SKILL.md` will carry a compressed form of these checks; this file holds the reasons and sources behind them, so change a check here first.

## Contents

<!-- toc -->
- How to read the checks
- All checks at a glance
- Library and file
- Variables
- Styles
- Components
- Handoff
- Accessibility
- Dev Mode annotation schema
- Where each playbook practice went
- Notes for the scripts
- Open questions
- Version history
<!-- /toc -->

## How to read the checks

Each check has an ID, a rank, a way of being verified, the platforms and kinds of file it applies to, and the playbook practice it came from where there is one. This section defines those terms once.

**Ranks** use the playbook's scale, adapted to any project. **Must** means a coding agent will build the wrong thing without it, and we've seen that happen on MERGE One or in the [Abbott audit][abbott], or Figma says its agent can't use the file without it, or it's a standard we hold every project to, such as WCAG 2.2 AA. **Should** means it measurably improves what the agent builds or saves a correction cycle. **Could** is worth doing when you're already working in that area. The playbook's fourth rank, Won't, has no checks here; the [mapping table](#where-each-playbook-practice-went) says where each Won't went.

**Results** are Pass, Partly, Fail, Couldn't check or N/A, as the plan sets out. Couldn't check means a read failed or the Plugin API doesn't expose what the check needs, and the report says which; the agent never guesses a result. N/A means the check doesn't apply to this file's kind or platform. Every result carries evidence that links to the layers at fault: the scripts return the total count and up to ten examples per finding, and the report links up to three of them.

**Verified by** is one of two things, and step 3 of the build tests them differently:

- **Script** means a Plugin API script returns counts and node IDs, and the result follows from the rule written in the check, with no judgment. Step 3 can test the result itself against Andrew's Abbott library (file key `0VTZx0ZXc08vCIjdzb8Xza`).
- **Judgment** means a script still gathers the data, but the agent decides the result from it, because the call depends on what a layer is for. Step 3 tests that the script returns everything the agent needs.

Unless a check says otherwise, a Script check passes when it finds nothing, is Partly when the problem affects fewer than half of the items it checked, and fails at half or more.

**Scope** says what a check reads. **File** checks read the whole file, because variables, styles and publishing belong to the file, whatever the person picked. **Scope** checks read only the page, section or component the person chose in the opening question.

**Platforms.** The opening question offers Web, iOS, Android or Other, and Web is the default, because almost all MERGE work is web-based (Steve, 2026-10-03). Much of that web work is a headless CMS with a React front end, and we build it mobile first, so a web product is tapped on phones as often as it's clicked on desktops; the Web checks cover both. **Touch** means iOS, Android, or Other when the person says it runs on a touch screen. The commonest Other is an **IVA** (interactive visual aid), which MERGE builds at a fixed 1024 by 768 or 768 by 1024 for pharma sales reps to use on iPads (Steve, 2026-10-04); the Abbott library is one. An IVA is touch and a fixed canvas, so its canvas size is correct as drawn, BR-31 doesn't apply, and pressed states and 24px targets do. Most checks hold on every platform, so the "Applies to" line says All unless a check changes with the platform.

**Kinds of file.** A **library** publishes components, styles or variables for other files to use; a **product file** holds screens built from a library; a file can be both. The agent decides which from the inventory (local components and their publish status, instances of remote components, page names) and says which it decided at the top of the report.

## All checks at a glance

This table is the index for tools and for `SKILL.md`. The sections after it give each check's reason and rule.

| ID | Check | Rank | Verified by | Reads | Applies to | Playbook |
| --- | --- | --- | --- | --- | --- | --- |
| BR-01 | The library is published | Must | Script | File | All | [FP-M10][must] |
| BR-02 | A cover or Start Here page comes first, and pages follow a clear order | Should | Judgment | File | All | none |
| BR-03 | Build status is marked in the file, and Ready for dev is used | Must | Judgment | Scope | All | [FP-M06][must], [FP-C01][could] |
| BR-04 | An Examples page shows real compositions | Should | Script | File | All; libraries only | none |
| BR-05 | Sections are small enough to point an agent at | Should | Judgment | Scope | All | [FP-S11][should], [FP-C06][could] |
| BR-06 | A linked-repo signal is detected and reported | Could | Script | File | All | none |
| BR-07 | Colors, spacing, radius and type are bound, not typed in | Must | Judgment | Scope | All | [FP-M01][must], [FP-S09][should] |
| BR-08 | Spacing and sizes sit on the 4 and 8px grid | Should | Script | File and scope | All | [FP-S10][should] |
| BR-09 | Semantic variables alias a primitive layer | Should | Script | File | All | [FP-S03][should] |
| BR-10 | No variable is scoped to everything | Should | Script | File | All | [FP-S02][should] |
| BR-11 | Variables have descriptions | Should | Script | File | All | [FP-S04][should] |
| BR-12 | Code syntax is present and well formed | Should | Script | File | All, by platform | [FP-S02][should] |
| BR-13 | Font weights are numbers | Should | Script | File | All | none |
| BR-14 | Default mode warning | Should | Script | File and scope | All | [FP-S09][should] |
| BR-15 | Text and effect styles are bound to variables | Should | Script | File | All | none |
| BR-16 | Components are reused, not detached | Must | Script | Scope | All | [FP-M02][must] |
| BR-17 | Auto layout, with deliberate hug, fill and fixed sizing | Must | Judgment | Scope | All | [FP-M03][must], [FP-M04][must] |
| BR-18 | Component and property names are consistent, and each property controls one thing | Should | Judgment | File | All | [FP-S05][should], [FP-S07][should] |
| BR-19 | Variant sets stay under about 30 variants | Should | Script | File | All | [FP-S06][should] |
| BR-20 | Components draw the states the platform needs | Must | Judgment | File | Web and Touch differ | [FP-M05][must] |
| BR-21 | Components have descriptions | Should | Script | File | All | [FP-S04][should] |
| BR-22 | Child layers inside components are named | Should | Script | File | All | [FP-S07][should] |
| BR-23 | Slot contents warning | Could | Script | File | All | none |
| BR-24 | Build rules live in annotations on the layer, not in copy | Must | Judgment | Scope | All | [FP-M08][must] |
| BR-25 | Notes are Dev Mode annotations, not on-canvas notes | Should | Judgment | Scope | All | [FP-M08][must] |
| BR-26 | Annotations follow the annotation schema | Should | Script | Scope | All | none |
| BR-27 | Content is realistic where it's meant for build, including long, short and empty CMS content | Should | Judgment | Scope | All | [FP-S13][should] |
| BR-28 | Names are unique | Must | Script | File and scope | All | [FP-M07][must] |
| BR-29 | Build frames have no default layer names | Should | Script | Scope | All | [FP-S07][should] |
| BR-30 | No stray instances | Could | Script | Scope | All | none |
| BR-31 | Every desktop view has a mobile view | Should | Judgment | Scope | Web; product files | none |
| BR-32 | Text contrast meets WCAG 2.2 AA | Must | Script | Scope | All | none |
| BR-33 | Controls and meaningful graphics meet WCAG 2.2 AA non-text contrast | Must | Judgment | Scope | All | none |
| BR-34 | Tap and click targets are at least 24 by 24px | Must | Judgment | Scope | All | none |

Twenty-one checks are Script and thirteen are Judgment.

## Library and file

These checks come first because they decide whether Figma's agent and a coding agent can find and trust anything else in the file.

### BR-01 The library is published

**Must · Script · File · All · [FP-M10][must] (the publishing half)**

Figma's agent only references a library once it's published ([H1][note]), and a market or product team can't pull components from an unpublished one. That's why this check runs first: the Abbott library's own Start Here badge said "Not Published" on 2026-09-30, and nothing else in the file could reach its users until that changed.

For a library, the script calls `getPublishStatusAsync()` on every local component set, standalone component, variable collection and variable, and on styles where the method exists, and counts `UNPUBLISHED`, `CHANGED` and `CURRENT`. Pass when everything meant for use is `CURRENT`. Partly when the library is published but some items are `CHANGED` (edited since the last publish) or new items are `UNPUBLISHED`. Fail when nothing is published. Items hidden from publishing (`hiddenFromPublishing`, or a name starting with `_` or `.`) are left out, because hiding them is deliberate ([H10][note]). For a product file, script 05 instead counts the instances in scope whose main component has `remote: true`, meaning it comes from a library; Pass when the screens in scope are built from a published library, and Fail when they use only local components that aren't published anywhere. Under `use_figma` the method works on components, collections and variables but doesn't exist on styles, so styles are reported as Couldn't check there (tested 2026-10-03); test mode will show whether Figma's agent can read them.

### BR-02 A cover or Start Here page comes first, and pages follow a clear order

**Should · Judgment · File · All · no playbook practice (Figma's naming reference, [G4][note])**

The first page is where a person or an agent learns what the file is, who owns it and how to use it, and Figma's own library skill puts the cover first, foundations before components, and utility pages last ([G4][note]). The Abbott library's `00 / Start Here` page was the strongest part of the file in the audit, because it explained the tiers, the naming and the ownership.

The script returns the page names in order, the text on the first page with any line that looks like a credential withheld, and the file thumbnail where it can be read. `use_figma` refuses the thumbnail call (`figma.getFileThumbnailNodeAsync()`, tested 2026-10-03), so the first page decides the check. The agent judges whether the first page says what the file is for, who owns it and its status, and whether pages run from foundations to components to utility pages, with one naming pattern and separators (`---` or a decorated name) between groups. Pass when both hold. Partly when there's a guide but the order or naming is mixed. Fail when there's no cover or guide page. A file can follow its own convention rather than Figma's defaults, as long as it's consistent ([G3][note]). MERGE keeps the Figma prototype password on the cover on purpose, because clients review in prototype mode, IT requires a password, and Figma shows it only once (Steve, 2026-10-04). The check never flags it, and the script withholds it so it never appears in a report.

### BR-03 Build status is marked in the file, and Ready for dev is used

**Must · Judgment · Scope · All · [FP-M06][must], [FP-C01][could]**

An agent can't tell an approved frame from an exploration unless the file says so. On MERGE One, ratified prototypes sat under a "(proposal…)" title, so nothing in the file said they were approved. Dev Mode's Ready for dev status is Figma's own handoff signal and is on every paid plan ([H7][note]).

The script reads `devStatus` on every node directly under a page or section in scope (the only nodes that can carry it, [F12][note]), and returns section and frame names that contain status words such as approved, ratified, final, ready, draft, proposal, review, deprecated, archive or "do not build". The agent judges whether someone reading only the file could tell which frames to build from. Pass when frames meant for build are marked Ready for dev or Completed, or their section names say their status, and explorations and deprecated frames are labeled as such (for example `REVIEW · not for build`). Partly when status is marked at page level or in a guide but not on the frames themselves, as in the Abbott library. Fail when nothing in scope says what's approved. `use_figma` can't read `devStatus` (tested 2026-10-03), so there the check judges from names alone and the report says Ready for dev couldn't be read; test mode will show whether Figma's agent can read it.

### BR-04 An Examples page shows real compositions

**Should · Script · File · All; libraries only · no playbook practice ([H1][note])**

Figma's agent learns how components fit together from up to 200 examples on a page named `Examples`, or from designs whose names end in `_example` ([H1][note]). Without them it has to guess at compositions. This is documented for Figma's agent, not for the MCP server.

Script 01 looks for a page named `Examples` (any letter case), and script 04, which loads every page, looks for frames and components whose names end in `_example`, and counts each kind. Pass when there's at least one example and each is a component. Partly when examples exist but are plain frames, because Figma asks for each example to be a component. Fail when there are none. N/A for a product file.

### BR-05 Sections are small enough to point an agent at

**Should · Judgment · Scope · All · [FP-S11][should], [FP-C06][could]**

A coding agent works best when it's pointed at a section or a component rather than a whole page, because "large, deeply nested frames can overwhelm the context window and slow things down, or silently fail" ([F2][note]). Claude Code caps each MCP response at 25,000 tokens ([F6][note]).

The script returns, per page in scope, the top-level nodes that sit outside any section, and the number of descendant nodes under each top-level frame, section and component set. The agent judges whether each thing a person would hand to an agent is its own section, frame or page, and whether section names match what's in them (a row component filed under "Files & Attachments" is the playbook's example). Pass when build frames sit in named sections, or one component family per page, and none is over the node budget. Partly when some are over budget or loose on the page. Fail when build frames sit loose on large pages. The node budget is 500 layers: on the Abbott library, `get_design_context` returned about 45 to 55 tokens a layer (measured 2026-10-03), so 500 layers is about Claude Code's 25,000-token limit for one response.

### BR-06 A linked-repo signal is detected and reported

**Could · Script · File · All · no playbook practice (a [plan decision](PLAN.md#decisions))**

Some teams keep build rules and decisions in a repo that a coding agent reads alongside the file, as the Abbott team does. Version 1 of the skill only detects that signal and reports it; it never follows the link. Reading the repo through Figma's GitHub connector is the first item planned for `UPGRADES.md`.

**Where it goes and what it says (decided, Steve, 2026-10-03):** the file's first page, which is usually named Cover, holds one text layer on that page whose text is a single line, `Linked repo: ` followed by the repo's GitHub URL, for example `Linked repo: https://github.com/mergeworld/abbott-fs-libre-global-iva-specs`. A branch and folder go in the URL in GitHub's own form, `https://github.com/<owner>/<repo>/tree/<branch>/<folder>`. The URL has to be in the visible text rather than only in a hyperlink, so an agent reading the layer sees it, and naming the layer `Linked repo` helps people find it in the layers panel. The script finds the signal by its text, not the layer name, because names change ([FP-W01][wont]).

The script searches text on the first page, and on any other page whose name contains "cover", "start here" or "readme", for lines matching `^\s*linked repo:\s*(\S+)\s*$` (any letter case). N/A when there's no signal, because a linked repo is optional. Pass when there's exactly one signal, it's on the first page, and its URL matches `^https://github\.com/[A-Za-z0-9-]+/[A-Za-z0-9._-]+(/tree/\S+)?$`. Partly when it's on another page, or points to a host other than GitHub, which the planned connector check couldn't read. Fail when the line is malformed or two signals disagree. Every result repeats the URL in the report and says the skill didn't open it.

## Variables

Variables are how a design value reaches code as a name rather than a number, so most of these checks are about whether that name exists, is the right kind, and says what it's for.

### BR-07 Colors, spacing, radius and type are bound, not typed in

**Must · Judgment · Scope · All · [FP-M01][must], [FP-S09][should] (the imported-SVG half)**

An agent copies what it reads: a typed-in hex becomes a hardcoded hex in code. On MERGE One, a mistyped eyedrop bound a chat bubble to the wrong color and a local chip hardcoded the wrong typeface. Figma's guidance ranks variables first, too ([F1][note], [H1][note]).

The script walks every node in scope, and counts literal values in fills, strokes, text fills, all four paddings, gap, all four corner radii and stroke weight (the `boundVariables` and style IDs are empty), and text that has neither a text style nor bound font variables. It skips image fills and invisible paints. Inside an instance it reads only the fields the instance overrides (`InstanceNode.overrides`), so a library problem is counted once at its main component, not once per use. It returns counts per field and per page or component, with vector-only layers counted separately. The agent then decides which literals are deliberate: logos, illustrations and multi-color artwork are reasonable exceptions, and so are icon pixel grids and static dividers ([G5][note]). One-color icons and imported SVGs aren't, because their baked-in colors ignore modes. Pass when every literal left is a deliberate exception. Partly when literals cluster in a few components, as on Abbott's `04 / Navigation` page (336 literal fills against 361 bound). Fail when literals are spread across the components and frames meant for build.

### BR-08 Spacing and sizes sit on the 4 and 8px grid

**Should · Script · File and scope · All · [FP-S10][should]**

An agent codes the number it's given, so a 22.5px width or a 13px gap becomes an off-grid value in the product, and a developer either copies it or quietly rounds it, and then design and code disagree. Off-grid values are a common problem in our file handoffs. On MERGE One, a refactor found nine hardcoded width caps, five of them off the grid. The Abbott library's spacing primitives are on a 4px scale, but its width and height primitives include 22.5, 62.5, 135, 182 and 242.5.

The script reads the values of local number variables scoped to `GAP`, `WIDTH_HEIGHT` or `CORNER_RADIUS`, or with no scopes (primitives), and, in scope, the literal paddings, gaps and fixed widths and heights. A value is on the grid when it divides by 4. It leaves out values of 1 and 2 (hairlines and borders), stroke weights, font sizes, line heights and letter spacing (type has its own scale), pill radii of 999 or more, and the fixed outer size of a canvas such as a 1024 by 768 template. The default rule decides the result, and the report lists each off-grid value with how often it's used. Widths that should stretch are BR-17's concern, because fill sizing is how a fluid width shows in Figma.

### BR-09 Semantic variables alias a primitive layer

**Should · Script · File · All · [FP-S03][should] (the alias half)**

When a semantic variable such as `color/bg/primary` points at a primitive such as `blue/500`, a wrong value shows up as a wrong name instead of a plausible hex, and a theme or brand can switch by changing a mode. Figma's library skill says semantic variables never hold raw values ([G4][note], [G6][note]). The Abbott library had 249 variables in one collection, all raw values, with a `Semantics` group that held literals rather than aliases.

The script reads every local variable's `valuesByMode` and counts, per collection, the values that are aliases (`VARIABLE_ALIAS`) and the ones that are raw, and checks that each alias target still exists. Pass when at least one collection aliases another, every collection is either all raw (primitives) or all aliases (semantic), and no alias is broken. Partly when aliases exist but some collections mix aliases and raw values. Fail when no variable aliases another, or any alias is broken. N/A when the file has no local variables, which is normal for a product file.

### BR-10 No variable is scoped to everything

**Should · Script · File · All · [FP-S02][should] (the scopes half)**

A scope says where a variable may be used, so a text color can't be picked for a background. A variable scoped to everything appears in every picker, which invites the wrong choice and stops Dev Mode suggesting the right one ([H13][note]). All 44 color variables in the Abbott library were scoped to everything.

The script reads `scopes` on every local variable. Primitives with no scopes (`[]`) pass, because that's how Figma's skill hides them from pickers ([G6][note]), and boolean variables are left out, because they can't be scoped ([G3][note]). The script counts variables that include `ALL_SCOPES`, and separately those that include `ALL_FILLS`, which still lets a fill color be used for text. `ALL_SCOPES` decides the result under the default rule; `ALL_FILLS` is reported but doesn't lower it. N/A when the file has no local variables.

### BR-11 Variables have descriptions

**Should · Script · File · All · [FP-S04][should] (the variables half)**

Figma's agent reads variable descriptions as context ([H1][note]), so "background for cards on the page surface; don't use for text" saves a wrong pairing. Whether the MCP server passes descriptions to a coding agent isn't documented yet. None of the Abbott library's 249 variables had one.

The script counts, for each collection, the variables that have a description, and returns a few filled descriptions so the agent can say whether they explain use. A semantic collection is one whose values are aliases. The default rule decides the result, counted over the semantic variables when the file has a semantic layer, because those are the ones a person or agent chooses between, and over all variables when it doesn't. N/A when the file has no local variables.

### BR-12 Code syntax is present and well formed

**Should · Script · File · All, by platform · [FP-S02][should] (the code-syntax half)**

Code syntax is the name a variable takes in code, and Dev Mode and the MCP server pass it to the coding agent ([H14][note]). Without it, the agent invents a name or falls back to the raw value; Figma's skill warns that a web syntax not written in full `var(--name)` form makes Dev Mode show raw hex values ([G4][note]). The skill can't check that the names match a codebase, because it reads no repo; that's planned for `UPGRADES.md`.

The script reads `codeSyntax` on every local variable, in the slot for the target platform: `WEB` for Web, `iOS` for iOS and `ANDROID` for Android; for Other, any slot counts. It checks each value's form:

| Slot | Well formed when it matches | Example |
| --- | --- | --- |
| `WEB` | `^var\(--[A-Za-z0-9_-]+\)$` | `var(--color-bg-primary)` |
| `iOS` | `^\.?[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$` | `Color.bgPrimary` |
| `ANDROID` | `^@[a-z]+/[a-z0-9_]+$`, or the `iOS` pattern without the leading dot | `@color/bg_primary` or `MaterialTheme.colorScheme.primary` |

It also flags two variables that share one value in the same slot, because an agent would map both to one name. The default rule decides the result over variables that are missing a value or have a malformed one; a shared value makes it at least Partly. N/A when the file has no local variables.

### BR-13 Font weights are numbers

**Should · Script · File · All · no playbook practice ([H13][note])**

Dev Mode drops the variable reference when a font weight is a string such as "Bold", so a coding agent sees a raw value rather than a token ([H13][note]). Bound as a number (400, 700), the weight reaches code as a name.

The script finds variables scoped to `FONT_WEIGHT` or bound to `fontWeight` or `fontStyle` on text styles and text nodes, and counts the ones whose `resolvedType` is `STRING`. The default rule decides the result. N/A when no variable is used for font weight. The Abbott library passes: its weight variables are numbers, including the unusual 390 and 450.

### BR-14 Default mode warning

**Should · Script · File and scope · All · [FP-S09][should] (the modes half)**

The MCP server returns only each collection's default mode, the left-most column, so a coding agent never sees a dark theme, a second brand or a breakpoint mode ([R1][note]). Figma staff said multi-mode reading was on their list on 2025-06-20, and users still reported the gap on 2026-05-25. The person needs to tell the coding agent about the other modes themselves.

The script lists each local collection's modes and its `defaultModeId`, and reads `explicitVariableModes` on frames in scope. N/A when every collection has one mode. Otherwise Pass, and the report always carries the warning, naming each collection with more than one mode, its default and its other modes. Partly when frames in scope are set to a mode other than their collection's default, which script 05 checks by comparing each set mode with the default, because the agent will be given the default mode's values rather than what the designer sees; that consequence is our inference from [R1][note] and still needs confirming (see [Open questions](#open-questions)).

## Styles

Styles stay as styles for type and effects, and their fields should point at variables so they change when the variables do ([G4][note], [G6][note], [G10][note]).

### BR-15 Text and effect styles are bound to variables

**Should · Script · File · All · no playbook practice ([G6][note], [G10][note])**

A text style with a typed-in size, or a shadow with a typed-in color, carries a literal into every layer that uses it, which is BR-07's problem one level up. The Abbott library does this well: all 45 text styles bind family, line height and letter spacing, and 40 bind size.

The script reads `boundVariables` on every local text style (font family, size, weight or style, line height, letter spacing) and effect style (each effect's color, radius, spread and offsets), and counts styles with at least one unbound field. The default rule decides the result over all local text and effect styles. N/A when the file has no local text or effect styles.

## Components

Figma calls a component's variants, booleans and slots "a complete schema" for the agent ([F1][note], [H1][note]), so these checks look at whether that schema is complete, consistent and readable.

### BR-16 Components are reused, not detached

**Must · Script · Scope · All · [FP-M02][must]**

A coding agent builds a detached copy from scratch, so one detached button becomes a second button implementation in code. On MERGE One, a screen existed as 37 detached frames, and per-feature copies in Figma became per-feature copies in code. Figma's Check designs flags detached components too ([H2][note]).

The script finds frames in scope whose `detachedInfo` isn't null and returns the component each was detached from and the top-level frame or section it sits in, with that frame's Ready for dev status. When Ready for dev can't be read, the result can't go past Partly. Pass when there are none. Partly when there are some, but none inside a frame or section marked Ready for dev or Completed. Fail when any sits inside a frame or section marked Ready for dev or Completed, because that's the copy a coding agent will be pointed at.

### BR-17 Auto layout, with deliberate hug, fill and fixed sizing

**Must · Judgment · Scope · All · [FP-M03][must], [FP-M04][must]**

Auto layout maps straight to flex and gap in what the MCP server returns, and its sizing becomes the product's sizing: on MERGE One, fixed-width chips placed over a hugging component wrapped long labels, and a width that was only a drawing convenience was read as a spec. Figma asks for fill on stretching elements, hug on buttons, chips and tags, and fixed on avatars and icon containers ([H1][note]).

The script returns frames in scope that have two or more children and no auto layout (`layoutMode` is `NONE`), and instances set to fixed width or height (`layoutSizingHorizontal` or `layoutSizingVertical` is `FIXED`) where their main component hugs or fills. The agent leaves out artwork, deliberate overlays and fixed canvases, such as a 1024 by 768 tablet template, where fixed is correct at the top level. Pass when what's left uses auto layout and every fixed size looks deliberate. Partly when a few components or frames break it. Fail when the frames meant for build are mostly positioned by hand.

### BR-18 Component and property names are consistent, and each property controls one thing

**Should · Judgment · Scope · All · [FP-S05][should] (the naming half), [FP-S07][should] (component names)**

An agent maps property names to code props, so one switch named six ways becomes six props, and a misspelled component name becomes a misspelled code name. Figma asks for one difference per variant property, such as separate Type and Size rather than "Primary Large" ([H17][note]), and for `true` and `false` on booleans rather than Yes and No ([G4][note]). The Abbott library had a references switch under six names and four sets still using the default `Property 1`.

The script returns every component set's name and every property's name, type and values from `componentPropertyDefinitions`, flags default names (`Property 1`), boolean-like variant values (Yes, No, On, Off, True, False), names that match once case, spaces and hyphens are ignored, and properties no layer references through `componentPropertyReferences` ("a property that isn't wired to a descendant is invisible", [G8][note]). The agent adds values that combine two differences and misspellings in component and property names. Pass when names are consistent, spelled correctly and each property controls one thing. Partly when there are a few defaults, variants of one name or misspellings. Fail when the same idea is commonly named several ways across the file's main components.

### BR-19 Variant sets stay under about 30 variants

**Should · Script · Scope · All · [FP-S06][should]**

Large variant sets are slow to use, hard to search and costly in memory, and Figma's library skill splits a set past about 30 combinations, moving icons to an instance swap and never making one variant per icon ([G3][note], [G5][note]). The 30 is that skill's working limit, not a product limit. The Abbott library's `Libre Icons` set has 320 variants.

The script counts the variants in each component set in the file and the values of each variant property. Pass when every set has 30 variants or fewer. Partly when some sets are larger. Fail when any single variant property has more than 30 values, because that's one variant per icon or per item.

### BR-20 Components draw the states the platform needs

**Must · Judgment · Scope · Web and Touch differ · [FP-M05][must]**

An agent fills an undrawn state by guessing. On MERGE One, a build comparison found three undrawn states that stranded users, and the Abbott library's buttons have only Default and Disabled, with no pressed state for a tablet that's tapped.

The script returns each component set's variant and boolean properties whose names suggest state (State, Status, Interaction, Disabled, Selected and similar) with their values, and, in a product file, the names of frames and sections that suggest a screen state. The agent decides which components are interactive and what each needs. For Web, buttons, links and controls need Default, Hover, Focus, Pressed (or Active, when it means being pressed rather than marking the current page) and Disabled; Web needs both hover and pressed, because a mobile-first web product is tapped as well as clicked. For Touch, they need Default, Pressed, Focus (for keyboards and switch access) and Disabled; hover doesn't apply. Inputs on any platform also need Filled and Error, and in a product file, screens that load or fetch data need Empty, Loading and Error. Pass when every interactive component and screen in scope draws what its platform needs. Partly when some states are missing on a few components. Fail when interactive components mostly draw only the happy path.

### BR-21 Components have descriptions

**Should · Script · Scope · All · [FP-S04][should] (the components half)**

Figma's agent reads component descriptions as context, and Figma asks for descriptions that say when to use a component instead of a similar one, its states and its accessibility needs, rather than relying on documentation frames on the canvas ([H1][note]). Two of about 70 component sets in the Abbott library had one.

The script counts component sets and standalone components in the file with an empty `description` (variants inside a set are left out, because the description lives on the set, [G-use][note]), and returns a few filled descriptions so the agent can say whether they explain use. It also counts `documentationLinks`, reported but not scored. The default rule decides the result.

### BR-22 Child layers inside components are named

**Should · Script · Scope · All · [FP-S07][should] (inside components)**

Layer names reach the coding agent as `data-name` ([F1][note]), and the layers inside a component become its parts in code, so `Frame 404` tells the agent nothing. Figma's component reference treats unnamed children as a defect ([G5][note]).

The script searches inside every main component and component set in the file for layer names matching `^(Frame|Group|Rectangle|Ellipse|Vector|Line|Polygon|Star|Union|Subtract|Intersect|Exclude|Section) \d+$`. It skips subtrees made only of vectors and boolean shapes, because those are artwork exported whole. The default rule decides the result, counting components that hold at least one default-named layer.

### BR-23 Slot contents warning

**Could · Script · Scope · All · no playbook practice ([R4][note], [H3][note])**

Slots are good for repeating and freeform content, but the MCP server can't read what's inside a slot, which Figma staff confirmed as a current limitation on 2026-06-30 ([R4][note]). A coding agent therefore needs the slot's expected content described somewhere it can read.

Slots appear in the Plugin API as `SLOT` nodes and as `SLOT` component properties, and a slot property can carry its own description (confirmed on the Abbott library, 2026-10-03, where 8 of 36 slot properties had one). The script finds components that contain slots and checks each slot property for a description, and each slotted component for a description that mentions its slots. N/A when there are no slots. Pass when every slot is described one of those ways. Partly when some aren't, and the report carries the warning either way.

## Handoff

These checks cover what a coding agent reads besides the components themselves: notes, copy and names.

### BR-24 Build rules live in annotations on the layer, not in copy

**Must · Judgment · Scope · All · [FP-M08][must] (the Development half)**

A rule written as placeholder copy is overwritten the first time someone types real content, and the MCP server returns an annotation only when it reads the annotated layer itself, so a note on a parent frame is missed ([R2][note]). The Abbott templates carried rules such as "This should display 2 lines max." in their headline copy, and no layer had an annotation.

The script returns every annotation in scope with its label, category (from `figma.annotations.getAnnotationCategoriesAsync()`) and the type and size of the layer it's on, plus text whose content reads like a rule: words such as should, must, max, min, limit, truncate or "do not", or a number of lines such as "2 lines". The agent decides which text is a rule and whether each annotation sits on the layer it governs. Pass when build rules are in annotations on the layers they govern and none are left in copy. Partly when annotations exist but some rules sit in copy or on a parent frame. Fail when there are no annotations and rules live in copy.

### BR-25 Notes are Dev Mode annotations, not on-canvas notes

**Should · Judgment · Scope · All · [FP-M08][must] (the Development half)**

We prefer Dev Mode annotations to notes drawn on the canvas (Steve, 2026-10-03). An on-canvas note, such as a text box, a callout from an annotation kit or a sticky, is just another layer: a coding agent can't tell it from the design, it isn't attached to the layer it describes, and it drifts out of place when the design moves. A Dev Mode annotation is attached to its layer, carries a category, and reaches the agent when the agent reads that layer ([R2][note]).

The script returns layers in scope that look like on-canvas notes: text layers and frames outside components whose names or first words are note, notes, TODO, annotation, spec, dev note, redline or callout; instances of components whose names contain annotation, callout, redline, spec, note or marker, which is how annotation kits name their parts. The agent decides which carry build guidance, rather than documentation or a cover's explanation. Pass when build guidance lives only in Dev Mode annotations. Partly when some on-canvas notes still carry build guidance. Fail when on-canvas notes are the main way the file gives it.

### BR-26 Annotations follow the annotation schema

**Should · Script · Scope · All · no playbook practice (the [annotation schema](#dev-mode-annotation-schema))**

When every file writes its handoff annotations the same way, a coding agent can read them the same way in every project, and this skill can check them. The [schema below](#dev-mode-annotation-schema) sets the format for Figma's four preset categories. People may add their own categories as well, such as Design or Agent feedback, and those aren't held to the schema.

The script reads every annotation in scope and sorts it by category. For annotations in the four preset categories (the category's `isPreset` is true), it checks that each line of the label reads `Key: value`, that every key belongs to that category or to the shared keys, and that the category's required keys are present. The default rule decides the result, counted over those annotations; N/A when there are none. Annotations in any other category are never scored. The report lists every annotation that doesn't follow the schema, whether it's in a preset category and malformed or in a custom category, with its category, its layer and its text, so a build brief can pass it on to the coding agent. It also reports how many annotations use pinned properties.

### BR-27 Content is realistic where it's meant for build

**Should · Judgment · Scope · All; the CMS part applies where content comes from a CMS · [FP-S13][should]**

Demo copy in a frame that's become the spec gets read as canonical, and an agent can't tell whether a placeholder is a design decision. Figma asks for realistic compositions ([H1][note]).

Content from a headless CMS adds a second risk, because editors will type longer, shorter and missing content than the designer drew. If the file shows only one ideal headline, the agent builds for that headline, and the page breaks on the first long title or empty field.

The script returns text containing lorem ipsum, `[FPO]`, text wholly in square brackets, and words such as placeholder, label or title used as the whole text, with counts per frame. It also returns the well-formed Content annotations in scope with their `Source`, `Limit`, `Overflow` and `Empty` lines, and groups top-level frames whose names differ only by words such as long, short, empty, min or max. The agent judges by what the frame is for, and decides which text is CMS-driven from the Content annotations, the layer names and the copy.

- In a library's components and templates, placeholder copy is expected and passes, unless it doubles as a rule (BR-24).
- In frames meant for build, the copy should be realistic. CMS-driven text should also be drawn with its longest and shortest realistic content, plus empty where the field is optional, either as extra frames or as variants, and each CMS-driven text layer should carry a Content annotation giving its source and limit.

Pass when both hold. Partly when the copy is realistic but CMS-driven text is drawn only once, or lacks its Content annotation. Fail when placeholders are widespread in frames meant for build.

### BR-28 Names are unique

**Must · Script · File and scope · All · [FP-M07][must]**

A lookup by name resolves to the first match, so two things with one name hide each other from every check and every agent. On MERGE One, duplicate names hid three of four frames from a review. The Abbott library had `Branded Title Card ` (with a trailing space) twice.

The script compares names among local components and component sets across the file, and among top-level frames and sections in scope, and flags names with leading or trailing spaces. Pass when every name is unique and trimmed. Partly when frames or sections share a name, or a name has stray spaces. Fail when two component sets or components share a name, because a coding agent will build one of them.

### BR-29 Build frames have no default layer names

**Should · Script · Scope · All · [FP-S07][should]**

Layer names reach the coding agent as `data-name` and often become class or view names, so `Frame 427` becomes meaningless code ([F1][note], [G12][note]). Abbott's `04 / Navigation` page had 492 default names.

The script uses BR-22's pattern on layers in scope outside main components (BR-22 covers those) and outside instances (whose layer names come from their component), and skips vector-only artwork the same way. The default rule decides the result over the layers it checked.

### BR-30 No stray instances

**Could · Script · Scope · All · no playbook practice (the [Abbott audit][abbott])**

An instance placed loose on a page or in a section, outside any frame, looks like part of a design to an agent reading the page, but belongs to nothing. The Abbott library had six loose instances on its TL templates page.

The script finds instances whose parent is a page or a section. Pass when there are none, and Partly otherwise.

### BR-31 Every desktop view has a mobile view

**Should · Judgment · Scope · Web; product files · no playbook practice (Steve's direction, 2026-10-03)**

We build web products mobile first, because that's how most people use the web now. A coding agent given only a desktop frame has to invent the phone layout, and it usually does that by squeezing the desktop one. So every desktop view needs a matching mobile view. Tablet views are optional, and the check doesn't ask for them.

The script returns the width of every top-level frame in scope and sorts it by width. Under 600px is mobile, following Material Design's compact window class, which covers phones from 320px up. From 1,200px wide is desktop, which covers the common 1280, 1440 and 1920 frames. Anything in between is tablet and is ignored. It groups frames by name with breakpoint words such as mobile, tablet, desktop, sm, md and lg removed, and flags desktop frames whose group has no mobile frame. The agent matches frames that show the same screen when their names don't line up, and decides when a desktop frame isn't a view of its own, such as a modal drawn over a page. Pass when every desktop view has a mobile view. Partly when some don't. Fail when none do. N/A for a library, for iOS, Android and Other, and when there are no desktop views in scope.

## Accessibility

These checks hold the file to WCAG 2.2, the current W3C Recommendation (published 2023-10-05, updated 2024-12-12), at level AA. WCAG 3 is still an early draft, so we don't check against it. A coding agent copies colors exactly, so a pair that fails in Figma fails in the product. The two contrast checks use the WCAG contrast ratio, `(L1 + 0.05) / (L2 + 0.05)` over relative luminance. All three checks are pass or fail with no Partly, because WCAG has none. Moving contrast here changes the [plan's decision](PLAN.md#decisions) that visual quality stays with `sn-ui-checklist` (Steve, 2026-10-03); the rest of visual quality still does.

### BR-32 Text contrast meets WCAG 2.2 AA

**Must · Script · Scope · All · no playbook practice ([WCAG 2.2 SC 1.4.3][wcag-143]; the [Abbott audit][abbott])**

Text needs a contrast ratio of at least 4.5:1 against its background, or 3:1 for large text, which WCAG defines as at least 18 point, or 14 point bold. On the web that's at least 24px, or at least 18.66px at a weight of 700 or more. The Abbott audit found one failure this way: `Abbott Medium Gray` (#88888d) at 14px on white is 3.53:1, used for the patient profile labels.

The script reads each visible text layer in scope, segment by segment (`getStyledTextSegments`), and takes its solid fill color and opacity, then the solid fill of the nearest ancestor that has one, combining opacities, and works out the ratio. When either color is bound to a variable, it works out the ratio in every mode of that collection, not only the default, because the product ships every mode even though a coding agent only sees one (BR-14). Text over an image, a gradient or a stack of translucent layers can't be worked out this way, so the script lists it and the agent checks it from a screenshot, saying when it can't tell rather than guessing. WCAG exempts text in disabled controls, logotypes and pure decoration, and the agent removes those. Before reporting a failure, the agent confirms every failing pair against a screenshot, because a layer beneath the text that isn't an ancestor can be the real background, and looks at up to ten of the layers over images; the rest of those are Couldn't check, with the count. Pass when every pair meets its threshold. Fail when any confirmed pair doesn't, and the evidence names each failing pair, its ratio, its size, the mode and where it's used.

### BR-33 Controls and meaningful graphics meet WCAG 2.2 AA non-text contrast

**Must · Judgment · Scope · All · no playbook practice ([WCAG 2.2 SC 1.4.11][wcag-1411])**

The parts of a control that show it's there or show its state, such as an input's border, a checkbox's box or a focus ring, and graphics that carry meaning, such as a one-color icon without a text label, need at least 3:1 against the colors next to them. A coding agent can't tell which of these matter from the code it's given, so the file has to get them right.

The script returns, for each interactive component the agent found in BR-20, the contrast of its own fill and border against the color behind it, as displayed. It doesn't measure icons, so the agent judges one-color icons that carry meaning from the screenshots. It only checks targets that draw a fill or border against what's behind them, because a text-only link is identified by its text, which BR-32 covers. It compares each target with its nearest ancestor's fill, not the layers beside it, so the agent confirms each distinct component and variant under 3:1 against a screenshot before reporting it; on the Abbott navigation, most low results were a yellow Active tint measured against a white documentation frame rather than the dark bar it sits on. The agent decides which visual identifies the control or its state; a button whose fill contrasts with the page doesn't also need a contrasting border. Disabled controls are exempt. Pass when every identifying visual meets 3:1. Fail when any doesn't.

### BR-34 Tap and click targets are at least 24 by 24px

**Must · Judgment · Scope · All · no playbook practice ([WCAG 2.2 SC 2.5.8][wcag-258])**

Anything someone clicks or taps needs a target of at least 24 by 24 CSS pixels, which is WCAG 2.2's level AA minimum. A coding agent builds a control at the size it's drawn, so a 16px icon button in Figma becomes a 16px button that's hard to hit on a phone. Our web work is mobile first, so most of these targets will be tapped. 24px is the AA minimum. WCAG's level AAA asks for 44px, and Apple and Google ask for larger targets in native apps; this check holds only the AA minimum.

The script returns the width and height of every instance of an interactive component the agent found in BR-20, and of every layer with a prototype interaction (`reactions`), in scope. For each target under 24px in either direction, it applies WCAG's spacing test: a 24px circle centered on the target mustn't overlap another target or another small target's circle. Text layers are left out: a link inside a run of text is an inline target, which WCAG exempts, and the script can't size a link that is only part of a text layer. The agent removes the other exceptions WCAG allows: a larger control that does the same thing on the same screen, a control the browser draws and the design doesn't change, and a size that's essential to what's shown. Pass when every target is at least 24 by 24px or meets an exception. Fail when any doesn't, and the evidence names each target, its size and the nearest target it crowds.

## Dev Mode annotation schema

This is how we write Dev Mode annotations for agent handoff across all MERGE projects (approved, Steve, 2026-10-03), so a coding agent reads them the same way in every file and BR-26 can check them. The skill will also write its own annotations this way when someone asks for findings as annotations.

These are the rules:

1. **Annotate the layer the note is about**, not its parent frame, because a coding agent only receives an annotation when it reads that layer ([R2][note]).
2. **Use Figma's four preset categories, Development, Interaction, Accessibility and Content, for anything a coding agent should act on.** They exist in every file and mean the same thing everywhere. People can add other categories when they need them, such as Design or Agent feedback; those sit outside the schema and aren't checked against it, but the report lists them. Add one deliberately, because a category can't be renamed or deleted once it's in a file. A layer can have one annotation in each category.
3. **Write one fact per line, as `Key: value`**, with the category's required key first. **TBD (test mode):** confirm that line breaks survive in `labelMarkdown`; step 3 couldn't, because Andrew's library has no annotations and the tests don't write to it.
4. **Use pinned properties for measurements** (width, padding, gap, text style and so on) rather than typing numbers, because they show the live value and stay right when the design changes.
5. **Mark anything not ready to build with `Status: Open question for <name>`**, and delete that line when it's answered, so a stale question doesn't read as live work. A team that already uses its own question categories, such as MERGE One's `Question - PM`, can keep them, and the report lists them with the other custom categories.
6. **Write "and" rather than "&", and use typographic quotes and arrows (’ ” →)**, because Figma's API escapes `&` and straight quotes again on every round trip.

The keys for each category are below; required keys come first and are marked.

| Category | What it holds | Keys | Example |
| --- | --- | --- | --- |
| Development | How it's built: sizing, layout, breakpoints and limits the code enforces | `Rule` (required), `Breakpoint`, `Token`, `Replaces` | `Rule: Fills its container, up to 720px wide`<br>`Breakpoint: Below 768px, the cards stack in one column` |
| Interaction | What happens when someone acts on it | `Trigger` (required), `Result` (required), `State`, `Motion` | `Trigger: Tap or click`<br>`Result: Opens the share sheet` |
| Accessibility | What assistive technology needs | `Role` (required), `Name`, `Focus order`, `Announce`, `Alt` | `Role: Button`<br>`Name: Share this article` |
| Content | Where the copy comes from and how much fits | `Source` (required), `Limit`, `Overflow`, `Empty` | `Source: CMS, article.title`<br>`Limit: 70 characters`<br>`Overflow: Truncate after 2 lines with an ellipsis`<br>`Empty: Hide the row` |
| Any category | Shared keys | `Status`, `See` | `Status: Open question for Andrew`<br>`See: https://github.com/<owner>/<repo>/issues/12` |

## Where each playbook practice went

This table accounts for every practice in the [playbook][playbook], so a reviewer can see what was kept and why the rest was dropped.

| Playbook practices | Where they went |
| --- | --- |
| [FP-M01][must] | BR-07. |
| [FP-M02][must] | BR-16. |
| [FP-M03][must], [FP-M04][must] | BR-17. |
| [FP-M05][must] | BR-20, with the states made platform-specific. |
| [FP-M06][must] | BR-03. |
| [FP-M07][must] | BR-28. |
| [FP-M08][must] | BR-24, BR-25 and BR-26. MERGE One's `Question - PM`, `Question - Design` and `Question - Dev` categories are allowed as custom categories; the schema's `Status` line is the shared way to mark a question. |
| [FP-M09][must] | Partly carried by the schema's `Status` line, which marks open questions. Whether an annotation has been answered is known to the team or the repo, not the file, so there's no check. |
| [FP-M10][must] | The publishing half is BR-01. Recording variable changes as rulings needs a repo, so it's dropped. |
| [FP-M11][must], [FP-M12][must] | Dropped. They govern how a coding agent reads the file and how a repo cites it. |
| [FP-S01][should] | Dropped by plan decision: Code Connect is out. |
| [FP-S02][should] | Scopes are BR-10. Code syntax is BR-12, checked for presence and form only; matching it to shadcn's CSS variables needs the codebase. |
| [FP-S03][should] | The alias half is BR-09. Pairing each surface with its own foreground is covered by the contrast check, BR-32. |
| [FP-S04][should] | BR-11 for variables and BR-21 for components. |
| [FP-S05][should] | The naming half is BR-18. Matching shadcn's code API is dropped. |
| [FP-S06][should] | BR-19. |
| [FP-S07][should] | BR-22 inside components, BR-29 in build frames, and misspelled component names in BR-18. |
| [FP-S08][should] | Dropped. It's about MERGE One's controlled vocabulary and shadcn's component names. |
| [FP-S09][should] | The modes half is BR-14; the imported-SVG half is BR-07. Checking every frame in both modes is visual review. |
| [FP-S10][should] | BR-08 for the grid. Fluid widths show in Figma as fill sizing, which is BR-17. |
| [FP-S11][should] | BR-05. |
| [FP-S12][should] | Dropped. Working on a copy is a habit the file can't show. |
| [FP-S13][should] | BR-27, without MERGE One's demo tenant. |
| [FP-S14][should], [FP-S15][should] | Dropped. They need the built product or a repo. |
| [FP-C01][could] | Part of BR-03, as one way of marking status. |
| [FP-C02][could], [FP-C04][could] | Dropped. The census and generated specs live outside the file. |
| [FP-C03][could] | Dropped. This skill is the check. |
| [FP-C05][could] | Dropped. It's specific to wrapping shadcn kit components. |
| [FP-C06][could] | Part of BR-05. |
| [FP-W01][wont], [FP-W06][wont], [FP-W07][wont] | Rules for the scripts; see the next section. |
| [FP-W02][wont], [FP-W04][wont] | Don't arise, because the skill never changes the design. |
| [FP-W03][wont], [FP-W05][wont], [FP-W08][wont] | Dropped. They're about shadcn names, MERGE One's Make prototype and its comment policy. |
| [For agents writing to Figma][writers] | The reading mechanics are in the next section. The writing mechanics apply only to delivering comments or annotations, and step 4 carries the ones it needs. |

## Notes for the scripts

These rules come from the playbook's Won'ts and its writing mechanics, the 2026-09-30 audit, and the step 3 tests on 2026-10-03. The tested scripts and what they found are in [scripts/](scripts/README.md).

- **Read only.** No script in the reading step changes the file. The only writes in a run are the comments or annotations the person asked for, at the delivery step.
- **List pages with `figma.root.children`**, never from `get_metadata`, which listed 3 of the Abbott file's pages on 2026-09-10 when it had more, and 4 of 17 on MERGE One ([FP-W06][wont]). Load each page with `page.loadAsync()` under `use_figma`, which forbids `figma.loadAllPagesAsync()`; loading all 46 Abbott pages that way took 5.5 seconds. Whether Figma's agent allows `loadAllPagesAsync()` is a test-mode question.
- **Address nodes by ID, never by name**, because names change and a name lookup fails silently ([FP-W01][wont]). Placeholders such as `__SCOPE_ID__` are the only edits to a script.
- **Keep each return under about 20 KB**, the limit `use_figma` sets ([F9][note]); the playbook saw failures from about 14 KB. Return counts and up to ten example node IDs per finding, and page through anything larger.
- **Don't descend into instances**, except to read the fields an instance overrides, so each library problem is counted once.
- **Count hidden layers inside components**, because a boolean property can show them.
- **Search with `findAllWithCriteria`, not `findAll` with a callback**, on anything large; a file-wide `findAll` callback broke the `use_figma` transport on 2026-10-03.
- **Check `typeof` before comparing a number property**, because properties such as `strokeWeight` can be `figma.mixed`.
- **Don't call something impossible without probing it** ([FP-W07][wont]). If a read fails, the check is Couldn't check, and the report says which read failed.
- **Confirmed under `use_figma` on 2026-10-03:** `getPublishStatusAsync()` on variables, collections and components; `detachedInfo`; `InstanceNode.overrides`; `explicitVariableModes`; annotations and their categories; `reactions`; and slots. **Not available there:** `getFileThumbnailNodeAsync()`, `devStatus`, and `getPublishStatusAsync()` on styles.

## Open questions

These need an answer before or during the next build steps.

- **TBD (step 6):** whether a frame pinned to a non-default mode reaches a coding agent with the default mode's values, which decides BR-14's Partly case. No frame in the Abbott library is pinned, so the MERGE One case or the test file has to settle it.
- **TBD (test mode):** whether Figma's agent can read `devStatus`, the file thumbnail and style publish status, which `use_figma` can't, for BR-01, BR-02 and BR-03.

## Version history

- **0.7** (2026-10-04): Matched to `SKILL.md` and the revised scripts after the step 4 audit. The component checks BR-18 to BR-23 read the whole file; BR-01 takes product-file instances from script 05; BR-04, BR-11, BR-14, BR-16 and BR-27 say which script returns their data; BR-32 and BR-33 say what's confirmed by screenshot; BR-33 no longer claims to measure icons or modes, and BR-32 no longer suggests a passing variable.
- **0.6** (2026-10-04): Results of build step 3, the script tests on the Abbott library. BR-05's node budget is set at 500 layers from a measurement. BR-23 checks slot descriptions now that slots are readable. BR-01, BR-02 and BR-03 say what `use_figma` can't read. BR-33 checks only targets that draw a boundary, confirmed against a screenshot. The platform section names the IVA format, and BR-02 records the prototype-password convention.
- **0.5** (2026-10-03): Steve approved the linked-repo wording and the annotation schema. The schema now allows custom annotation categories, such as Design or Agent feedback, which BR-26 lists for the build brief but never scores. BR-31 now checks that every desktop view has a mobile view, with tablet views optional, and stays a Should.
- **0.4** (2026-10-03): BR-34, WCAG 2.2's AA minimum target size, joins the Accessibility group.
- **0.3** (2026-10-03): Steve's second comments. BR-25 (Dev Mode annotations rather than on-canvas notes) and BR-26 (the annotation schema) are new, so 0.2's BR-25 to BR-29 are now BR-27 to BR-31. A proposed Dev Mode annotation schema is added. BR-27 now covers CMS-driven content. A new Accessibility group adds BR-32 and BR-33, contrast checks against WCAG 2.2 AA.
- **0.2** (2026-10-03): Steve's first comments. The 4 and 8px grid check is back as BR-08, so the 0.1 checks BR-08 to BR-27 became BR-09 to BR-28. Web is the default platform, and its states cover touch because our web work is mobile first. The linked-repo signal goes on the first page, usually named Cover. A mobile-first check was proposed as BR-29.
- **0.1** (2026-10-03): first draft, for Steve's review at build step 2.

[playbook]: https://github.com/sbrown-merge/merge-one-related/blob/main/Figma/MERGE%20One%20UI%20%E2%80%94%20Figma%20Practices%20for%20Agentic%20Builds.md
[must]: https://github.com/sbrown-merge/merge-one-related/blob/main/Figma/MERGE%20One%20UI%20%E2%80%94%20Figma%20Practices%20for%20Agentic%20Builds.md#must
[should]: https://github.com/sbrown-merge/merge-one-related/blob/main/Figma/MERGE%20One%20UI%20%E2%80%94%20Figma%20Practices%20for%20Agentic%20Builds.md#should
[could]: https://github.com/sbrown-merge/merge-one-related/blob/main/Figma/MERGE%20One%20UI%20%E2%80%94%20Figma%20Practices%20for%20Agentic%20Builds.md#could
[wont]: https://github.com/sbrown-merge/merge-one-related/blob/main/Figma/MERGE%20One%20UI%20%E2%80%94%20Figma%20Practices%20for%20Agentic%20Builds.md#wont
[writers]: https://github.com/sbrown-merge/merge-one-related/blob/main/Figma/MERGE%20One%20UI%20%E2%80%94%20Figma%20Practices%20for%20Agentic%20Builds.md#for-agents-writing-to-figma
[note]: research/2026-10-03-figma-file-practices-for-agents.md
[abbott]: https://github.com/mergeworld/abbott-fs-libre-global-iva-specs/blob/main/captures/2026-09-30%20IVA%20design%20library%20audit.md
[wcag-143]: https://www.w3.org/TR/WCAG22/#contrast-minimum
[wcag-1411]: https://www.w3.org/TR/WCAG22/#non-text-contrast
[wcag-258]: https://www.w3.org/TR/WCAG22/#target-size-minimum

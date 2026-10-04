# merge-build-readiness scripts

These are the nine read-only Plugin API scripts that gather the data for the checks in [checklist.md](../checklist.md). They were written and tested at build step 3 of the [plan](../PLAN.md), on 2026-10-03, by running each through the Figma MCP's `use_figma` tool against Andrew's Abbott IVA design library (file key `0VTZx0ZXc08vCIjdzb8Xza`). `SKILL.md` will carry them inline, because Figma's agent takes a single file; this folder is where they're maintained and re-tested. None of them changes the file.

## Contents

<!-- toc -->
- The scripts
- What use_figma can and can't read
- What the scripts returned on Andrew's library
- Still to settle
<!-- /toc -->

## The scripts

Each script is run unchanged except for its placeholders. File-wide scripts read the whole file; scope scripts read the page, section or component the person chose.

| Script | Feeds | Reads | Placeholders | Time on Andrew's library |
| --- | --- | --- | --- | --- |
| [01-file-and-pages.js](01-file-and-pages.js) | BR-02, BR-04, BR-06 | File | none | under 1 second |
| [02-variables.js](02-variables.js) | BR-01, BR-08 to BR-14 | File | `__PLATFORM__` (`WEB`, `iOS`, `ANDROID` or `ANY`) | under 1 second, 288 variables |
| [03-styles.js](03-styles.js) | BR-01, BR-15 | File | none | under 1 second, 61 styles |
| [04-components.js](04-components.js) | BR-01, BR-18 to BR-23, BR-26 | File | none | 5.5 seconds, 46 pages, 158 components |
| [05-structure.js](05-structure.js) | BR-03, BR-05, BR-14, BR-16, BR-17, BR-28 to BR-31 | Scope | `__SCOPE_ID__` | 1.4 seconds, 2,349 layers |
| [06-values.js](06-values.js) | BR-07, BR-08 | Scope | `__SCOPE_ID__` | 1.7 seconds |
| [07-annotations-and-copy.js](07-annotations-and-copy.js) | BR-24 to BR-27 | Scope | `__SCOPE_ID__` | under 1 second |
| [08-text-contrast.js](08-text-contrast.js) | BR-32 | Scope | `__SCOPE_ID__` | under 1 second, 114 text layers |
| [09-targets.js](09-targets.js) | BR-33, BR-34 | Scope | `__SCOPE_ID__`, `__INTERACTIVE__` (a JSON array of the component set IDs or names the agent judged interactive in BR-20) | 1.1 seconds, 725 targets |

Every script returns counts plus up to ten examples per finding, with node IDs, which keeps each return well under `use_figma`'s 20 KB limit. The examples are what the report links to.

## What use_figma can and can't read

These are the facts the tests established, and each one changed a script or a check.

- **Unsupported under `use_figma`:** `figma.getFileThumbnailNodeAsync()` ("not a supported API"), a node's `devStatus` ("not a supported API"), and `getPublishStatusAsync()` on styles ("not a function"). The scripts catch all three and report `unavailable`, so BR-02 judges the cover from the first page instead of the thumbnail, BR-03 falls back on status words in names, and BR-01 judges publishing from variables and components. Test mode will show whether Figma's own agent can read them.
- **Works:** `getPublishStatusAsync()` on variables, collections and components; `detachedInfo`; `InstanceNode.overrides`; `explicitVariableModes`; annotations and `figma.annotations.getAnnotationCategoriesAsync()`; `reactions`; and slots, which appear as `SLOT` nodes and as `SLOT` component properties that can carry their own description.
- **Loading every page:** `use_figma` forbids `figma.loadAllPagesAsync()`, but calling `page.loadAsync()` on all 46 pages in one script took 5.5 seconds, so the file-wide scripts do that.
- **Use `findAllWithCriteria`, not `findAll` with a callback, for big searches.** A file-wide `findAll` callback broke the `use_figma` transport (the response was cut off at about 19.5 KB); the same search with `findAllWithCriteria` finished in 2.1 seconds.
- **`strokeWeight` can be `figma.mixed`,** a symbol, which throws when compared with a number. Check `typeof` first.
- **Text over a photo needs the layers underneath, not only the parents.** The first contrast version flagged white text on a photo as 1.03:1, because the photo was a sibling layer below the text. The script now walks the layers beneath the text at each level, and anything over an image or gradient goes to the agent to check from a screenshot.
- **Node budget for BR-05:** `get_design_context` returned about 27,000 characters for a 144-layer frame and about 33,000 for a 216-layer frame, roughly 45 to 55 tokens a layer. Claude Code caps an MCP response at 25,000 tokens, so 500 layers is the budget.

## What the scripts returned on Andrew's library

Andrew's library has changed since the [2026-09-30 audit](https://github.com/mergeworld/abbott-fs-libre-global-iva-specs/blob/main/captures/2026-09-30%20IVA%20design%20library%20audit.md): it now has 288 variables (the audit counted 249), a new `Email` collection with Desktop and Mobile modes, and 200 variables hidden from publishing. So these results, not the audit's, are the starting point for the evaluation at step 6. Scope checks ran on `04 / Navigation` unless the table says otherwise. Where a check is Judgment, the result is what the data points to, and the agent makes the final call.

| Check | What the scripts found | Likely result |
| --- | --- | --- |
| BR-01 | 0 of 158 components and 0 of 88 visible variables published; both collections unpublished; styles unreadable | Fail |
| BR-02 | `00 / Project Cover` first, then `00 / Start Here`, pages numbered 00 to 99; the cover's date still reads "Month Year" | Pass or Partly |
| BR-04 | No Examples page and no `_example` names | Fail |
| BR-05 | No sections; 23 frames loose on the page; `Navigation` has 3,162 layers | Partly |
| BR-06 | No linked-repo line | N/A |
| BR-07 | Literal fills on 224 layers against 370 bound (plus 123 in artwork); literal gaps on 1,142 layers against 16 bound; literal radii on 698 against 3 | Fail |
| BR-08 | 17 of 134 variable values off the grid (half steps such as `spacing/2-5` = 10); 1,508 of 2,785 literal sizes off the grid on the page | Fail |
| BR-09 | `Email` aliases `Primitives` but holds 2 raw values; `Primitives` all raw | Partly |
| BR-10 | 27 of 288 variables scoped to everything | Partly |
| BR-11 | 36 of 288 described, all in the `Email` collection | Pass, counted over the semantic layer |
| BR-12 | No code syntax on any variable | Fail |
| BR-13 | 8 font-weight variables, all numbers | Pass |
| BR-14 | `Email` has Desktop (default) and Mobile; no frame is set to a non-default mode | Pass, with the warning |
| BR-15 | 39 of 56 text styles and 0 of 5 shadow styles fully bound | Partly |
| BR-16 | 51 detached copies of `Nav Bars - CGM Naive` | Partly (Ready for dev unreadable) |
| BR-17 | 37 frames without auto layout; 32 instances fixed where their component hugs | Partly |
| BR-18 | `Property 1` on at least 10 sets; Off and Yes/No values; `Icon`/`icon`, `size`/`Size` | Partly |
| BR-19 | 6 sets over 30 variants; 3 with one property over 30 values (`Libre Icons` 320) | Fail |
| BR-20 | `Buttons` Default/Disabled only; nav items Default/Active; no Pressed anywhere | Fail |
| BR-21 | 155 of 158 components without a description | Fail |
| BR-22 | 88 of 158 components hold default-named layers | Fail |
| BR-23 | 30 components with slots; 8 of 36 slot properties described | Partly |
| BR-24 | No annotations anywhere in the file; "This should display 2 lines max." in `Branded Title Card` copy | Fail |
| BR-25 | No on-canvas notes on `05 / Templates — IVA` or `03 / Branded Title Card` | Pass |
| BR-26 | No annotations | N/A |
| BR-27 | 53 `[FPO]` placeholders on `05 / Templates — IVA`, expected in a template library | Pass |
| BR-28 | 2 duplicate component names, one with a trailing space; 4 duplicated frame names on the page | Fail |
| BR-29 | 33 of 354 layers in build frames have default names | Partly |
| BR-30 | 3 loose instances | Partly |
| BR-31 | A library, so not applicable | N/A |
| BR-32 | On `05 / Templates — IVA`: `#88888d` labels at 14px, 3.31 to 3.41:1; 44 text layers over images to check from screenshots | Fail |
| BR-33 | 84 of 122 drawn target backgrounds under 3:1, mostly the yellow Active tint measured against a white documentation frame | Needs the screenshot check |
| BR-34 | 725 targets; one 10px-tall sub-navigation link, spaced enough to pass | Pass |

BR-03 is left out of the table, because Ready for dev couldn't be read and no frame name on the page carries a status word.

## Still to settle

- **BR-14's Partly case:** no frame in Andrew's library is set to a non-default mode, so whether such a frame reaches a coding agent with the default mode's values is still untested. The MERGE One case or the small test file at step 6 can settle it.
- **Test mode in Figma's agent:** whether the agent can read `devStatus`, the file thumbnail and style publish status, which `use_figma` can't.
- **BR-33's boundary check** compares a target with its nearest ancestor's fill, not the layers beside it, so the agent has to confirm each low result against a screenshot, as it does for text contrast.

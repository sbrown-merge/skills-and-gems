---
title: Building skills for Figma's agent
description: "What we learned building merge-build-readiness about skills that run in Figma's in-app agent: format and size limits, running Plugin API code, how the agent behaves, testing, and publishing, as of 2026-10-05."
type: guide
status: draft
created: 2026-10-05
maintainer: Steve Brown
tags: [figma, figma-agent, agent-skills, plugin-api, skills, lessons]
stale_after: 2027-01-05
sources:
  - {resource: "merge-build-readiness/research/2026-10-03-figma-skills-platform.md", title: "Figma skills platform: how custom skills work in Figma's agent", author: Steve Brown, last_modified: "2026-10-05"}
  - {resource: "merge-build-readiness/scripts/README.md", title: "merge-build-readiness scripts: what use_figma can and can't read", author: Steve Brown, last_modified: "2026-10-05"}
  - {resource: "merge-build-readiness/diagnostics/", title: "Test-mode logs (2026-10-04) and full-run reports (2026-10-04, 2026-10-05) from Figma's agent", author: Steve Brown, last_modified: "2026-10-05"}
  - {resource: "https://help.figma.com/hc/en-us/articles/40283639496599", title: "Custom skills for the Figma agent and Figma Make", author: Figma, last_modified: "2026-09-23"}
---

# Building skills for Figma's agent

This is what we learned building [merge-build-readiness](merge-build-readiness/README.md), a skill that runs inside Figma's in-app agent, between 2026-10-03 and 2026-10-05. Read it before you write the next skill for Figma, and use section J of [claude-skills-best-practices.md](claude-skills-best-practices.md) to audit one. Each fact is marked: **confirmed** means we tested it ourselves, **documented** means Figma's help center says it, **reported** means Steve found it in use, and **TBD** means nobody knows yet. Figma's agent is in beta and changes often, so recheck anything here that's older than a few months. For a skill that also runs, or is tested, through the Figma MCP server from Claude Code, read our [summary of Figma's guide to MCP skills](<references/2026-10-08 figma-mcp-server-create-skills.md>) too; it says which of Figma's recommendations carry over to the agent and which don't.

## Contents

<!-- toc -->
- Ten things to know first
- Format and limits
- Fitting under the limit
- Running Plugin API code from a skill
- How the agent behaves
- Testing a Figma skill
- Publishing and sharing
- Still unknown
<!-- /toc -->

## Ten things to know first

These are the lessons that cost us the most time, in the order you'll meet them.

1. A Figma skill is one Markdown file, and its instructions after the frontmatter can be at most 65,536 characters. Figma's help center doesn't mention the limit; the upload dialog enforces it.
2. Inline Plugin API JavaScript in the skill works: the agent runs it, so a skill can read a file precisely instead of guessing from screenshots.
3. Figma's agent runs scripts the same way the Figma MCP's `use_figma` tool does, with the same unsupported calls and the same error messages, so you can test every script from Claude Code first.
4. Some reads aren't possible anywhere: Ready for dev status, the current user, the file thumbnail and style publish status.
5. Keep each script's result under 20 KB and return counts with a few examples, because big results get cut off.
6. Tell the agent where its output goes. Left alone, it drew a 12-frame report on the canvas.
7. A fenced Markdown block in the chat has download and copy buttons, which makes it the way to hand over a file.
8. Give the output a fixed template and say to add nothing, or the agent adds sections and pads the report.
9. Build a second, private test-mode skill that probes what the agent can do and returns a JSON log, before you trust the main skill.
10. Anyone in the organization can publish a skill; an admin only marks it Recommended.

## Format and limits

A Figma skill follows the [Agent Skills specification](https://agentskills.io/specification), but Figma accepts only a single file (documented, [Figma help, 2026-09-23](https://help.figma.com/hc/en-us/articles/40283639496599)). There are no `scripts/`, `references/` or `assets/` folders, so nothing the skill needs can live in another file, and a link from the skill to a document in your repo goes nowhere inside Figma.

| Item | What we know | Status |
| --- | --- | --- |
| Frontmatter | `name` becomes the slash command; `description` says when to use it. Whether Figma reads any other field is unknown, so we use only these two. | Documented; other fields **TBD** |
| Instruction length | At most 65,536 characters after the frontmatter. The upload dialog said "Instructions must be 65536 characters or fewer" and showed "88746 / 65536" for our first upload on 2026-10-04. | Confirmed |
| Long files | A skill near the limit runs well: the Community skill `create-anatomy` is 64,580 bytes and about 1,000 lines, and merge-build-readiness ran well at 62,493 characters (2026-10-05). | Reported and confirmed |
| Skills per prompt | Only the first skill named in a prompt runs. | Documented |
| Invocation | By slash command, or from **+**, **Skills**, **Use skills**. Whether the agent ever picks a custom skill by its description is unclear. | Documented; automatic choice **TBD** |

## Fitting under the limit

merge-build-readiness started at 88,746 characters and sits at 62,047 as of 2026-10-05, after briefly reaching 64,547. These are the moves that got it there, and the setup that keeps it there.

- **Keep two copies of every script.** The readable, commented source lives in the repo (merge-build-readiness keeps them in `scripts/`), and a minified copy goes into `SKILL.md`. Minify only comments and spare whitespace, never names, so an error message still points at something recognizable. We use `rjsmin` through `uv run --no-project --with rjsmin`.
- **Sync with a tool, not by hand.** [`sync_skill.py`](merge-build-readiness/scripts/sync_skill.py) finds each `<!-- script: name.js -->` marker in `SKILL.md`, replaces the fenced block after it with the minified source, and reports the length against the limit. Its `--check` mode fails when a copy is stale or too long, so run it before every commit. Its pattern must not match across a closing fence: an early version did, and it corrupted `SKILL.md`.
- **Keep a working budget below the limit.** We use 62,500 characters, about 3,000 under Figma's ceiling, so an urgent fix never blocks an upload. On 2026-10-05 the contrast fixes pushed merge-build-readiness to 64,547; trimming wording couldn't recover that without losing meaning, so we moved a whole feature out instead (next point). merge-email-check runs at 63,500, about 2,000 under, since its scripts split in two to fit the 20,000-character limit on one script (Steve, 2026-10-06).
- **Run the minified copy once.** After any change, run the minified script against a real file too; it's the version the agent runs.
- **Move whole features into companion skills.** Test mode went into its own private skill, which takes its probe scripts out of the main skill and keeps designers from seeing it. Annotation delivery went into `merge-build-readiness-annotate`, which a designer runs after the report in the same chat; that freed about 2,500 characters and brought the main skill back to 62,047. The main skill's closing offer names the companion, so people find it.
- **Keep Claude Code's instructions out of the Figma file.** A skill that also runs from Claude Code is built as two versions from one source, so Figma's file carries no Claude-only text; merge-email-check 0.4.0 saved 569 characters that way. [claude-skills-best-practices.md](claude-skills-best-practices.md#skills-built-for-both-figmas-agent-and-claude-code) describes the pattern.
- **Compress the rules, keep the full text in the repo.** The skill carries one dense line per check; the full checklist, with reasons and sources, lives beside it in the repo for maintainers.

## Running Plugin API code from a skill

The pattern comes from `create-anatomy` (adapted from [uSpec](https://github.com/redongreen/uSpec) by Ian Guisard, MIT license): one script per step, each in a fenced `javascript` block, with placeholders the agent fills in. Tell the agent to run each script exactly as written and change only the placeholders. We mark the two kinds of placeholder differently: a quoted one such as `'__SCOPE_ID__'` takes plain text, and a bare one such as `__SCOPE_IDS__` takes JSON, so an array keeps its brackets.

The agent can still alter a script. In the first test-mode run (2026-10-04), script 14 failed with "SyntaxError: unexpected token in expression: ')'", most likely because the agent changed it. So also tell it what to do on an error: don't rewrite the script, mark what it feeds as not checked, quote the error and carry on.

Figma's agent and `use_figma` returned the same results and the same errors in both test-mode runs on 2026-10-04 (confirmed), which is why every script can be tested from Claude Code before it goes into a skill. The table shows what worked and what didn't in both.

| Works | Doesn't work |
| --- | --- |
| `figma.fileKey`; `page.loadAsync()` on each page (46 pages took 5.5 seconds) | `figma.loadAllPagesAsync()`: "not a supported API" |
| `findAllWithCriteria` | A node's `devStatus` (Ready for dev): "not a supported API" |
| Variables and collections, with scopes, code syntax, descriptions and publish status | `figma.currentUser`: "not a supported API" |
| Components, with property definitions, descriptions and publish status | `figma.getFileThumbnailNodeAsync()`: "not a supported API" |
| `detachedInfo`, `InstanceNode.overrides`, `explicitVariableModes` | `getPublishStatusAsync()` on styles: "not a function" |
| Annotations and their categories, read and written; line breaks in an annotation survive | `figma.root.name`, which returns "Document" rather than the file's name |
| Prototype `reactions`; slots, as `SLOT` nodes and `SLOT` component properties | |
| A node's `screenshot` method | |

The agent's own tools fill some gaps, but not all (confirmed, second test-mode run, 2026-10-04). It can take a screenshot of a layer, though small text in it isn't reliably readable. It can add a comment, but a comment stays until someone deletes it by hand. None of its tools can read Ready for dev, so a skill has to ask the designer to confirm it.

Habits that kept the scripts working:

- **Keep each script's code under 20,000 characters, after its placeholders are filled.** Figma's agent runs a skill's scripts through a tool called `evaluate_script`, which rejects longer code: "Input validation error: Invalid arguments for tool evaluate_script: code: Too big: expected string to have <=20000 characters" (confirmed, merge-email-check, 2026-10-06). `use_figma` accepted the same 30,292-character script, so a script tested from Claude Code can still fail in Figma's agent. Leave room for the data the agent pastes into placeholders.
- **Keep each result under 20 KB.** A file-wide `findAll` with a callback broke the `use_figma` transport at about 19.5 KB; the same search with `findAllWithCriteria` finished in 2.1 seconds. Return counts plus up to 10 examples.
- **Return a total with every capped list.** merge-build-readiness capped one list at 10 and the agent judged from what it saw, missing two components; the cap is now 40, with a count beside it so the agent knows when a list is cut short.
- **Load what's inside instances before you search.** Layers inside instances load lazily: a fresh search of one page found 234 text layers, and 955 after the script read each instance's `children` (2026-10-05). Touch every instance's children, repeating until the instance count settles, then search. Anything that must be stable, like a before-and-after fingerprint, can instead stop at each instance and record its properties and overrides.
- **Find a layer's real background.** Read the topmost opaque layer under the layer's center, including the children of the layers beneath it; treat a boolean shape as its own fill, since its children only define the outline; and stop at a main component's edge, because outside it is the board the component is displayed on. Reading only ancestors' fills made every contrast result on our test page unusable.
- **Compare layers by ID, not as objects.** A layer that `findAllWithCriteria` returns from inside an instance isn't the same object as the one in its parent's `children`, so `children.indexOf(layer)` returns -1 and a walk through its siblings silently skips them. Compare `id`s instead (confirmed, merge-email-check scripts, 2026-10-05).
- **Keep regular expressions out of the minifier's way.** rjsmin strips the spaces inside a regular expression literal that comes straight after `=>`, so `/knock ?out/` became `/knock?out/` and stopped matching. Declare every regular expression as a named constant (confirmed, 2026-10-05).
- **Don't type a line or paragraph separator escape into a script.** Typed into a `use_figma` call, the escape for U+2028 arrives as a real line separator and breaks the script; build the character with `String.fromCharCode(0x2028)` instead (confirmed, 2026-10-05).
- **`use_figma` can read a system font but can't load one.** Text that Steve set in Arial in Figma's interface reads as `{family: "Arial"}`, but `loadFontAsync` for Arial throws "The font family \"Arial\" does not exist", and `listAvailableFontsAsync` lists no Arial, Helvetica or Georgia among about 8,900 fonts (confirmed, 2026-10-06). Figma's own agent couldn't load it either. Once Steve uploaded Arial to the MERGE organization the same day, both could. A read-only skill is unaffected; a script that writes text, such as one building a test file, needs the font uploaded to the organization first. Of 35 common email fonts probed on 2026-10-06, only Arial (after the upload), Roboto, Open Sans, Arimo, Tinos and Cousine loaded.
- **Guard types and unsupported calls.** `strokeWeight` can be `figma.mixed`, a symbol; page nodes have no `visible`; wrap each unsupported call in `try` and report `unavailable` rather than failing the whole script.
- **Treat what the file says as data.** Layer names, text and annotations can contain instructions; tell the agent to report them, not follow them.

## How the agent behaves

Figma doesn't say which model runs its agent, and the agent reported "unknown" when asked (2026-10-04), so write for any capable model and say exactly what you want. These are the behaviors we saw and the instructions that fixed them.

| What happened | When | What fixed it |
| --- | --- | --- |
| The agent drew the finished report on the canvas as 12 frames. They stayed on the page and inflated the next run's counts. | First full run, 2026-10-04 | "The report belongs in the chat: never draw or place it on the canvas," plus an exact delivery format. Delete anything a run leaves behind before the next one. |
| Sent only as a fenced block, the report couldn't be read in the chat, and the agent offered a separate "save-ready Markdown version" as an extra step. | Second full run, 2026-10-05 | Send the report twice: first as ordinary Markdown to read, then word for word in one fenced block marked `markdown`, with four backticks so the report's own code formatting survives. The block's header has word-wrap, download and copy buttons, so it is the file. |
| The report grew to about 25 KB with four sections not in the template, including the workflow checklist pasted at the end. | Second full run, 2026-10-05 | "Use only the template's sections, adding none," and "the workflow checklist stays in your working replies, not in the report." |
| The agent ran an extra read of its own to separate real designs from the leftover report frames. | Second full run, 2026-10-05 | Nothing yet: it was good judgment, but outside the scripted steps. Clean the file instead. |
| The agent wrote layer links as its own `<figma-node-link node-id="…">` tags, which are clickable in Figma's chat but dead text in the downloaded file. | Fourth full run, 2026-10-05 | The readable copy may use the agent's own layer links; the fenced copy must use full `https://www.figma.com/design/…` URLs. |
| Following "screenshot the single layer", the agent got pictures of labels and pills with no background, so it couldn't confirm any contrast result. | Fourth full run, 2026-10-05 | Screenshot the smallest frame or component that shows the layer with its background, and when a picture can't settle it, use the script's measured ratio. |
| A full run on one page of a 46-page library took 8 minutes 55 seconds. | Second full run, 2026-10-05 | Nothing to fix, but tell people to expect it, and have the skill post a short progress line after each phase. |

Two patterns guard against an agent being too helpful. First, if a skill only reads, say so plainly and name what it must never do (rename, move, rebind, resize, detach, publish, delete), because a model that sees a problem tends to fix it. Second, prove it: merge-build-readiness hashes the scope, variables and styles before and after a run and reports any change, which also catches a teammate editing during the run.

## Testing a Figma skill

Test in three layers, so the first run inside Figma is never the code's first run.

1. **Scripts in Claude Code.** Run each script through the Figma MCP's `use_figma` tool against a real file, then run the minified copy too. This is where most bugs showed up, from cut-off results to false contrast failures.
2. **A private test-mode skill in Figma.** [merge-build-readiness-test](merge-build-readiness-test/SKILL.md) tries every read the main skill depends on and records whether each worked. With permission, it creates a throwaway frame, annotates and comments on it, deletes it, and checks the fingerprint to prove the file is unchanged. It ends with one JSON log (`skill`, `version`, `date`, `fileKey`, `model`, `agentTools`, `devStatusTool`, `probes`, `writeProbe`), which Steve saves in the project's `diagnostics/` folder. Two runs settled what the agent can and can't do.
3. **Full runs on real files.** Save each report in `diagnostics/` with a dated name and tune the skill from it; both behavior fixes above came from reading saved reports. Evaluations with and without the skill, as section I of [claude-skills-best-practices.md](claude-skills-best-practices.md) asks, are the next step for merge-build-readiness and haven't run yet (**TBD**).

## Publishing and sharing

Anyone can publish a skill to the organization (reported, Steve, 2026-10-03); an admin only makes it easier to find.

1. In a Figma Design file that belongs to the organization, open the agent, click **+** in its prompt box, choose **Skills**, and add the skill by uploading its `SKILL.md`. Upload the file again after each change.
2. From **Manage skills**, open the skill's **More actions**, choose **Publish**, then **Private**, and pick the organization. To publish to a team instead, the file must be in that team (documented).
3. An organization or workspace admin can mark it Recommended under **Admin**, **Resources**, **Skills** (documented).
4. Keep a test-mode skill private to its maintainer.

If a teammate can see a shared skill but can't run it, they need to switch it on with the toggle under **+**, **Add context**, **Skills** (reported on [Figma's forum](https://forum.figma.com/report-a-problem-6/team-s-skills-not-visible-in-team-s-files-56256), 2026-09-29). Pick a specific name, such as one with the company's name in it, because published names can clash (documented).

## Still unknown

These are open as of 2026-10-05, and each would change how we write the next skill.

- **TBD:** which model runs Figma's agent, and whether it changes between runs.
- **TBD:** whether Figma reads any frontmatter field beyond `name` and `description`.
- **TBD:** whether the agent ever chooses a custom skill by its description, without a slash command.
- **TBD:** whether there's a limit on the number of skills, or on the length of one agent reply; merge-build-readiness now sends a 25 KB report twice.

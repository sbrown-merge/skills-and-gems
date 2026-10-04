---
title: "Figma skills platform: how custom skills work in Figma's agent"
description: "Research on custom skills in Figma's in-app agent and Figma Make: format, publishing, admin controls, invocation, capabilities, model, and Figma's published MCP skills, as of 2026-10-03."
type: research-note
status: stable
created: 2026-10-03
maintainer: Steve Brown
tags: [figma, figma-agent, agent-skills, figma-mcp, research]
stale_after: 2027-01-03
sources:
  - {resource: "https://help.figma.com/hc/en-us/articles/40283639496599", title: "Custom skills for the Figma agent and Figma Make", author: Figma, last_modified: "2026-09-23"}
  - {resource: "https://help.figma.com/hc/en-us/articles/42287852075543", title: "Find and use skills from the Figma Community", author: Figma, last_modified: "2026-10-02"}
  - {resource: "https://help.figma.com/hc/en-us/articles/37998629035799", title: "Work with the Figma agent in design files", author: Figma, last_modified: "2026-10-03"}
  - {resource: "https://help.figma.com/hc/en-us/articles/360039829474", title: "Guide to managing a Figma organization", author: Figma, last_modified: "2026-09-23"}
  - {resource: "https://help.figma.com/hc/en-us/articles/38978644498199", title: "AI workflows collection: Best practices to help Figma AI understand your design system", author: Figma, last_modified: "2026-10-02"}
  - {resource: "https://help.figma.com/hc/en-us/articles/41159677390999", title: "AI workflows collection: Use the Figma agent to improve your design system", author: Figma, last_modified: "2026-10-02"}
  - {resource: "https://help.figma.com/hc/en-us/articles/41159668700311", title: "AI workflows collection: Create skills for repeatable processes", author: Figma, last_modified: "2026-09-21"}
  - {resource: "https://help.figma.com/hc/en-us/articles/4406787442711", title: "What Figma features are in beta?", author: Figma, last_modified: "2026-09-17"}
  - {resource: "https://help.figma.com/hc/en-us/articles/36400680326551", title: "Select an AI model to use in Figma Make", author: Figma, last_modified: "2026-09-30"}
  - {resource: "https://help.figma.com/hc/en-us/articles/33459875669015", title: "How Figma AI credits work", author: Figma, last_modified: "2026-10-03"}
  - {resource: "https://help.figma.com/hc/en-us/articles/17725942479127", title: "Manage AI settings and content training for your team or organization", author: Figma, last_modified: "2026-09-28"}
  - {resource: "https://help.figma.com/hc/en-us/articles/39715554287255", title: "Search the web with the Figma agent and Figma Make", author: Figma, last_modified: "2026-07-23"}
  - {resource: "https://help.figma.com/hc/en-us/articles/39717296726679", title: "Manage web search for the Figma agent and Figma Make", author: Figma, last_modified: "2026-06-24"}
  - {resource: "https://help.figma.com/hc/en-us/articles/35440096186007", title: "Use verified partner MCP connectors with the Figma agent and Figma Make", author: Figma, last_modified: "2026-09-29"}
  - {resource: "https://help.figma.com/hc/en-us/articles/36343926263703", title: "Manage MCP connectors for the Figma agent and Figma Make", author: Figma, last_modified: "2026-09-26"}
  - {resource: "https://help.figma.com/hc/en-us/articles/38147204302743", title: "Create and use custom MCP connectors in the Figma agent and Figma Make", author: Figma, last_modified: "2026-08-18"}
  - {resource: "https://help.figma.com/hc/en-us/articles/31304529835671", title: "Attach files to a prompt in the Figma agent and Figma Make", author: Figma, last_modified: "2026-10-02"}
  - {resource: "https://help.figma.com/hc/en-us/articles/43028920030743", title: "Generate plugins with the Figma agent", author: Figma, last_modified: "2026-09-20"}
  - {resource: "https://help.figma.com/hc/en-us/articles/39166810751895", title: "Figma skills for MCP", author: Figma, last_modified: "2026-10-02"}
  - {resource: "https://help.figma.com/hc/en-us/articles/39287396773399", title: "Use skills with the Figma MCP server", author: Figma, last_modified: "2026-09-23"}
  - {resource: "https://help.figma.com/hc/en-us/articles/32132100833559", title: "Guide to the Figma MCP server", author: Figma, last_modified: "2026-10-03"}
  - {resource: "https://www.figma.com/blog/the-figma-agent-is-here/", title: "The Figma design agent is here", author: "Rodrigo Davies, Tammy Taabassum", last_modified: "2026-07-15"}
  - {resource: "https://www.figma.com/blog/agent-custom-tools-context-skills/", title: "Figma's design agent, now with custom tools and greater context", author: "Georgia Rust, Rodrigo Davies", last_modified: "2026-07-15"}
  - {resource: "https://www.figma.com/blog/config-2026-recap/", title: "Config 2026: New materials, new tools and a more expressive canvas", author: Figma, last_modified: "2026-07-15"}
  - {resource: "https://www.figma.com/blog/got-skills-make-the-figma-agent-a-better-collaborator/", title: "Got skills? Make the Figma agent a better collaborator", author: "Sachi Shah, Sean Lee", last_modified: "2026-07-15"}
  - {resource: "https://www.figma.com/blog/try-these-10-skills-and-show-off-your-own/", title: "Try these 10 skills, and show off your own", author: Miggi Cardona, last_modified: "2026-08-13"}
  - {resource: "https://www.figma.com/release-notes/", title: "Figma release notes (entries 2026-05-11, 2026-06-24, 2026-08-13, 2026-08-17)", author: Figma, last_modified: "2026-09-30"}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/", title: "Figma MCP server: Tools and prompts", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/create-skills/", title: "Create skills for the Figma MCP server", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/add-custom-rules/", title: "Add custom rules and instructions", author: Figma, last_modified: undated}
  - {resource: "https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/", title: "Write to canvas", author: Figma, last_modified: undated}
  - {resource: "https://github.com/figma/mcp-server-guide/tree/aaa07946b60797706c131ca50e50ca526a44b073", title: "figma/mcp-server-guide at aaa0794 (plugin 2.2.126)", author: Figma, last_modified: "2026-10-01"}
  - {resource: "https://agentskills.io/specification", title: "Agent Skills specification", author: agentskills.io, last_modified: undated}
  - {resource: "https://forum.figma.com/report-a-problem-6/team-s-skills-not-visible-in-team-s-files-56256", title: "Team's skills not visible in team's files (forum thread)", author: "Alexandre_Borba and others", last_modified: "2026-09-29"}
  - {resource: "https://forum.figma.com/report-a-problem-6/figma-plugin-v2-1-30-7-of-9-skills-exceed-claude-code-s-skill-md-size-limit-and-are-dropped-at-load-time-53987", title: "Figma plugin v2.1.30: 7 of 9 skills exceed Claude Code's SKILL.md size limit (forum post)", author: Sesamo, last_modified: "2026-05-15"}
  - {resource: "Steve Brown, conversation, 2026-10-03", title: "Hands-on findings: create-anatomy Community skill; web search and GitHub connector in the agent", author: Steve Brown, last_modified: "2026-10-03"}
---

# Figma skills platform: how custom skills work in Figma's agent

This note collects what Figma has published, as of 2026-10-03, about custom skills in its in-app agent (Figma Design) and in Figma Make, for the [merge-build-readiness plan](../PLAN.md). Each claim carries a status. **Confirmed** means a primary source states it: Figma's help center, blog, release notes, developer docs or GitHub repo. **Reported** means a single secondary source, or Steve's own testing. **Inferred** means our reading of the evidence. Help-center dates come from the Zendesk API (created/updated), and blog dates come from `datePublished`/`dateModified`.

## Contents

<!-- toc -->
- Summary
- Organization-wide skill: priority findings
- Answers to the original questions
- Figma's published MCP skills
- Added after the research
- Open questions
<!-- /toc -->

## Summary

Figma documents no Admin-panel flow for uploading a skill. In the documented flow, a user creates or uploads the skill in the agent chat, then publishes it privately to a team or to the whole organization. In the Admin panel, admins can only mark an existing skill as "Recommended". An uploaded skill must be one `.md` file that follows the Agent Skills specification, and Figma says "Custom skills do not support optional directories such as scripts/, references/, and assets/". Steve's hands-on finding (see [Added after the research](#added-after-the-research)) shows the agent can still run Plugin API code written inline in that one file.

## Organization-wide skill: priority findings

### Admin flow, format, limits and gating

- **Publishing (confirmed).** From the chat: Add context > Skills > Manage skills > select the skill > More actions > Publish > "Private" > choose a team or the organization. "To publish a skill to a team, the file that you're publishing the skill from must be in that team. You can publish only to the team where the file is located or to the whole organization." Source: [Custom skills for the Figma agent and Figma Make](https://help.figma.com/hc/en-us/articles/40283639496599), updated 2026-09-23.
- **Who may publish to the organization: TBD.** Figma doesn't say whether only admins can publish a skill org-wide. For custom connectors it does say "Only organization admins can publish", but no such line exists for skills.
- **The Admin panel's only skill control is "Recommend" (confirmed).** The path is Admin > Resources > Skills > select the skill > Recommend toggle; for skills you then click Manage to choose the whole organization or specific workspaces. Organization and workspace admins can do this. Sources: [Guide to managing a Figma organization](https://help.figma.com/hc/en-us/articles/360039829474), updated 2026-09-23; [release note "Recommend resources you want users to discover and use"](https://www.figma.com/release-notes/recommend-resources-you-want-users-to-discover-and-use/), 2026-08-17. We found no admin upload, admin disable, or admin allowlist for skills.
- **Format (confirmed).** The upload must be "a single Markdown (.md) file that follows the Agent Skills specification", and the article links to agentskills.io/specification. In the upload dialog you review the name, description and content, and "The name defines the slash command". Manual creation asks for a name, a description and instructions in Markdown.
- **Limits: TBD.** No size or count limit for skills is documented. The 1 MB text-file limit applies to chat attachments, not skills ([Attach files to a prompt](https://help.figma.com/hc/en-us/articles/31304529835671), updated 2026-10-02).
- **Plan and seat gating (confirmed, but the sources conflict).** The custom-skills article (2026-09-23) says "Available on paid plans"; Full seats can use the agent in Design and Make files, View, Dev and Collab seats only in Drafts, and edit access is required. [Work with the Figma agent in design files](https://help.figma.com/hc/en-us/articles/37998629035799) (2026-10-03) says "Available on all plans", that some features need a paid plan, and that View, Dev and Collab seats can chat but can't edit. Blog posts from 2026-06-24, 2026-07-01 and 2026-08-13 say "open beta for Full seat users on Professional, Organization, and Enterprise plans." The agent is free during the beta with monthly limits. An organization admin can turn off all AI features ([Manage AI settings](https://help.figma.com/hc/en-us/articles/17725942479127), 2026-09-28).

### Reference files and scripts

- **No reference files in an uploaded skill (confirmed).** scripts/, references/ and assets/ are not supported. Under known issues: "Figma Make only supports standalone skill files when you're uploading skills. You can't include additional files."
- **Script execution: TBD in the research, inferred unlikely at the time.** Nothing documents the agent running scripts bundled with a skill, though it writes Plugin API code when building generative plugins ([Generate plugins with the Figma agent](https://help.figma.com/hc/en-us/articles/43028920030743), 2026-09-20). Steve's hands-on report changes this answer for inline code; see [Added after the research](#added-after-the-research).

### What the agent can read and write

The agent article's capability table (2026-10-03) marks as supported (confirmed): applying variables, switching modes and updating variable-bound properties; applying text, color, effect and grid styles; editing component instances; authoring design-system components, styles and variables; searching libraries and files; selecting objects; "Review comments: Summarize, sort, and take action on comments"; "Figma file actions: Add comments, modify file-level metadata"; editing layout, renaming layers, images, and "0 → 1 generation". It lists "Prototyping and interactions", vector editing, icons and slots as coming soon, and exporting assets as not supported. Writing to the canvas requires a Full seat and edit access.

The agent reads descriptions on components, styles and variables as context; "For agents to reference your design system, your library must be published"; and it uses an "Examples" page in the library, up to 200 examples (all confirmed, [Best practices to help Figma AI understand your design system](https://help.figma.com/hc/en-us/articles/38978644498199), 2026-10-02).

Not documented anywhere we looked (**TBD**): reading variable scopes, code syntax, annotations, prototype reactions, or a library's publish status as data.

### How users invoke an organization skill

- **Slash command or menu (confirmed).** "To use a skill… you must invoke the skill… enter slash commands in the prompt box." Alternatively, prompt box > Skills > Use skills > pick the skill > Send ([Find and use skills from the Figma Community](https://help.figma.com/hc/en-us/articles/42287852075543), 2026-10-02). Team and organization skills appear as tabs in Manage skills.
- **Automatic invocation: the sources conflict.** The custom-skills article says to phrase triggers firmly, "especially important if a skill is to be invoked automatically", and that a disabled skill "cannot be invoked automatically in chat or directly", implying automatic selection exists without explaining it.
- **Known issues (confirmed).** Only the first skill named in a prompt is invoked. In Make, you can't invoke a skill in the first prompt after switching models.
- **Forum report (reported).** A teammate's published skill was visible but couldn't be invoked; support opened tickets on 2026-07-24 and 2026-08-07, and a user posted the fix on 2026-09-29: enable the skill with the toggle under + > Add context > Skills ([forum thread 56256](https://forum.figma.com/report-a-problem-6/team-s-skills-not-visible-in-team-s-files-56256)).

### Model

- **Figma Design agent: TBD.** Figma doesn't name the model and documents no selector outside Make. The credits article says "If more than one model is available, like in Figma Make, you can choose" ([How Figma AI credits work](https://help.figma.com/hc/en-us/articles/33459875669015), 2026-10-03); the AI settings article says Figma works with "multiple vendors, such as OpenAI" (2026-09-28).
- **Figma Make offers a selector (confirmed):** the default plus GPT-5.6 Terra, GPT-6.1 Sol, Claude Sonnet 4.5, Claude Opus 5.5, Gemini 3.8 Flash and Gemini 3.1 Pro; Sonnet 5.5 isn't listed ([Select an AI model in Make](https://help.figma.com/hc/en-us/articles/36400680326551), 2026-09-30).

### Reaching outside Figma

- **Web search and fetch (confirmed).** Public pages only; off by default in Figma Design, turned on from + in the prompt box; admins can disable it ([Search the web](https://help.figma.com/hc/en-us/articles/39715554287255), 2026-07-23; [Manage web search](https://help.figma.com/hc/en-us/articles/39717296726679), 2026-06-24).
- **MCP connectors (confirmed).** GitHub is a featured connector covering repos, issues and PRs; each person authenticates their own, and write tools are off by default. Custom connectors need a paid plan; on Organization and Enterprise plans admins can enable or disable connectors org-wide, and only admins publish custom connectors ([Verified partner connectors](https://help.figma.com/hc/en-us/articles/35440096186007), 2026-09-29; [Manage MCP connectors](https://help.figma.com/hc/en-us/articles/36343926263703), 2026-09-26; [Custom MCP connectors](https://help.figma.com/hc/en-us/articles/38147204302743), 2026-08-18).
- **Skills and connectors together (confirmed).** "Your skills can reference your connectors", for example "Use the /build-from-prd skill … from @Notion …".

## Answers to the original questions

### Where skills run

Skills run in the Figma agent in Figma Design and in Figma Make (confirmed). The agent "is currently only available in Figma Design from the desktop app or web browser" (2026-10-03); in FigJam and Slides it's a closed beta ([What Figma features are in beta?](https://help.figma.com/hc/en-us/articles/4406787442711), 2026-09-17). No source covers Dev Mode. Timeline: custom skills in Make, 2026-05-11; agent launch, 2026-05-20; agent skills at Config, 2026-06-24; agent-authored skills and Community publishing, 2026-08-13; admin Recommend, 2026-08-17.

### Format

The open agentskills.io spec, single file only (confirmed): `name` (required, at most 64 characters, lowercase letters, digits and hyphens, matching the folder name), `description` (required, at most 1,024 characters), and optional `license`, `compatibility` (at most 500 characters), `metadata` and `allowed-tools`. Figma only documents reading `name` (the slash command) and `description`; whether it reads other fields is **TBD**.

### Installing and sharing

Three ways to add a skill: ask the agent to write one, upload a `.md` file, or write one by hand; you can also save or "Try in" a Community skill. Other actions: publish privately to a team or organization, publish to the Community, update, unpublish, edit, export as Markdown, enable or disable, and delete, which "removes it for all users" (all confirmed). Installing from a GitHub repo, a zip or a plugin isn't documented.

### Known limits and gotchas

- No folders in uploaded skills; only the first skill per prompt runs; Make can't invoke a skill right after a model switch (confirmed).
- Avoid generic names if you publish, because names can clash (confirmed). Results are non-deterministic (confirmed).
- Team skills weren't usable until the skill toggle was enabled (reported, thread 56256).
- [Forum post 53987](https://forum.figma.com/report-a-problem-6/figma-plugin-v2-1-30-7-of-9-skills-exceed-claude-code-s-skill-md-size-limit-and-are-dropped-at-load-time-53987) (2026-05-15, reported) says Claude Code drops SKILL.md bodies over about 8 KB. That concerns Claude Code, not the in-Figma agent.

## Figma's published MCP skills

We read [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) at commit `aaa07946b60797706c131ca50e50ca526a44b073` (2026-10-01, plugin 2.2.126). `skills/` holds 14 skills; `skills-figquery/` holds the same 14 names with different guidance, served to Cursor only, and both are generated from Figma's internal repo. `workflow-skills/` holds 2 skills not bundled with the plugin, and `figma-power/` holds a Kiro power.

| Skill | Bytes | Frontmatter | Bundled folders |
| --- | --- | --- | --- |
| figma-use | 33,847 | name, description, `disable-model-invocation: false` | references/, including `plugin-api-standalone.d.ts` and `working-with-design-systems/` |
| figma-generate-design | 36,244 | same three keys | references/ |
| figma-code-connect | 26,668 | same three keys | references/ |
| figma-generate-library | 24,573 | same three keys | references/ and scripts/ (8 `.js` files) |
| figma-implement-motion | 23,278 | same three keys | references/ |
| figma-use-slides | 22,032 | same three keys | references/ |
| figma-generate-diagram | 10,271 | name and description only | references/ (7 files) |
| figma-use-figjam | 6,942 | same three keys | references/ (13 files) |
| figma-use-motion | 6,909 | same three keys | references/ |
| figma-shaders | 5,611 | same three keys | references/ |
| figma-generative-plugins | 4,851 | same three keys | references/ |
| figma-design-to-code | 4,065 | same three keys | none |
| figma-swiftui | 4,048 | same three keys | references/ |
| figma-create-new-file | 1,840 | same three keys | none |
| workflow-skills/generate-project-plan | 27,517 | same three keys | references/blocks/ and references/foundation/ |
| workflow-skills/video-interaction-mapper | 12,942 | name and description only | scripts/ (5 `.py` files) and README.md |

`disable-model-invocation` isn't in the agentskills.io spec (inferred: a Claude Code extension). Several skills tell the agent to pass `skillNames` to `use_figma` or `get_design_context` as "a logging parameter", prefixed `resource:` when loaded as an MCP resource (confirmed), so the MCP server can likely serve skills as resources (inferred). `get_figma_skill` and `read_skill_uri` appear neither on the public [Tools and prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/) page nor in the repo; we couldn't confirm they exist.

Whether these are the skills the in-Figma agent uses is not confirmed; they're inferred to be separate sets. The help center says the agent "has a built-in skill for creating documentation", which isn't in the repo ([Use the Figma agent to improve your design system](https://help.figma.com/hc/en-us/articles/41159677390999), 2026-10-02), and Figma's blogs of 2026-07-01 and 2026-08-13 describe MCP skills as a related but distinct set. The MCP developer docs' [Create skills](https://developers.figma.com/docs/figma-mcp-server/create-skills/) (undated) allows scripts/, references/ and assets/ for MCP-client skills and suggests optional `compatibility`, `metadata` and `allowed-tools`; [Add custom rules](https://developers.figma.com/docs/figma-mcp-server/add-custom-rules/) covers IDE rules files only.

## Added after the research

Steve reported these findings on 2026-10-03 and 2026-10-04, after the research above was delivered. They come from his own use of Figma, not from Figma's documentation.

1. **A long single-file skill that runs Plugin API code works in the in-Figma agent: reported (Steve, 2026-10-03), confirmed in use.** Steve downloaded the Figma Community skill "create-anatomy": one SKILL.md, 996 lines, 64,580 bytes, adapted from uSpec by Ian Guisard under the MIT license, and says it performs well in Figma. For each step it embeds Plugin API JavaScript with placeholders such as `__FRAME_ID__`, tells the agent to run each script unchanged, and calls `figma.loadAllPagesAsync()`, which the MCP's `use_figma` tool forbids. So Figma's in-app agent can run Plugin API code from a skill body, and a single-file skill well over 500 lines works there. Skills still can't bundle a scripts/ folder.
2. **Web search and the GitHub connector work in the in-Figma agent: reported (Steve, 2026-10-03).** This matches the documentation under Reaching outside Figma.
3. **Publishing to the organization doesn't need an admin: reported (Steve, 2026-10-03).** Any user adds a skill from the + button in the agent's prompt box, under Skills, and shares it; an admin's only part is marking it Recommended. This answers open question 1 below on who may publish.
4. **A skill's instructions can be at most 65,536 characters: confirmed (Steve, 2026-10-04).** Figma's upload dialog rejected the first merge-build-readiness upload with "Instructions must be 65536 characters or fewer" and showed "88746 / 65536". The count matches the file's text after the frontmatter. This answers open question 2 below on size.

## Open questions

1. **Admin upload:** is there any Admin-panel flow for uploading a skill? None is documented. Who may publish org-wide isn't stated.
2. **Size and count:** no documented limit, though Steve's 64,580-byte skill works.
3. **Frontmatter:** which fields Figma reads beyond `name` and `description`, and what happens to a file that breaks the spec's rules.
4. **Automatic selection:** whether custom skills are ever picked by their description.
5. **Model:** which model runs the Figma Design agent.
6. **Reading file data:** whether the agent can read variable scopes, code syntax, annotations, prototype reactions, or publish status. Steve's finding makes script-based reads likely; test mode will settle it.
7. **Skill tools:** whether `get_figma_skill` and `read_skill_uri` exist, and whether the in-Figma agent's built-in skills match the repo's.
8. **Plans:** the docs conflict on plan gating, and nothing says when the beta ends.
9. **Other surfaces:** no source on skills in Dev Mode; FigJam and Slides agents are in closed beta.

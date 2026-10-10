---
title: Building skills for Gemini
description: "What Google has published about Gemini skills, the replacement for Gems: the two skill systems, the timeline to Gems ending no sooner than 2027-03-01 for Workspace, the SKILL.md format and its limits, Google's writing guidance, how to convert a Gem, and what's still unknown, as of 2026-10-10."
type: guide
status: draft
created: 2026-10-10
maintainer: Steve Brown
tags: [gemini, gemini-skills, gems, agent-skills, workspace, migration, skills]
stale_after: 2026-12-10
sources:
  - {resource: "https://support.google.com/gemini/answer/18560919", title: "About the transition from Gems to skills (Gemini Apps Help)", author: Google, last_modified: "undated; read 2026-10-10"}
  - {resource: "https://support.google.com/gemini/answer/17094296", title: "Create & manage skills for Gemini Apps", author: Google, last_modified: "undated; read 2026-10-10"}
  - {resource: "https://support.google.com/gemini/answer/17102773", title: "Write effective skills for Gemini Apps", author: Google, last_modified: "undated; read 2026-10-10"}
  - {resource: "https://support.google.com/gemini/answer/15146780", title: "Use Gems in Gemini Apps", author: Google, last_modified: "undated; read 2026-10-10"}
  - {resource: "https://support.google.com/gemini/answer/17094507", title: "Use Gemini Spark to manage your tasks & workflows in Gemini Apps", author: Google, last_modified: "undated; read 2026-10-10"}
  - {resource: "https://knowledge.workspace.google.com/admin/generative-ai/gemini-app/about-the-transition-to-skills", title: "About the transition from Gems to skills (Workspace Admin Help)", author: Google, last_modified: "2026-10-07"}
  - {resource: "https://knowledge.workspace.google.com/admin/studio/turn-skills-on-or-off", title: "Allow people to use skills in Studio and Gemini in Workspace", author: Google, last_modified: "2026-10-07"}
  - {resource: "https://knowledge.workspace.google.com/admin/studio/allow-skill-sharing", title: "Allow people to share skills externally", author: Google, last_modified: "2026-10-07"}
  - {resource: "https://knowledge.workspace.google.com/admin/generative-ai/workspace-with-gemini/turn-access-to-google-workspace-with-gemini-beta-on-or-off", title: "Turn access to Google Workspace with Gemini Beta on or off", author: Google, last_modified: "2026-10-07"}
  - {resource: "https://support.google.com/workspace-studio/answer/17307546", title: "Learn how skills work in Google Workspace & Google Workspace Studio", author: Google, last_modified: "undated; read 2026-10-10"}
  - {resource: "https://support.google.com/workspace-studio?p=gems_transition", title: "How Gems transition to skills impacts Workspace Studio flows", author: Google, last_modified: "undated; read 2026-10-10"}
  - {resource: "https://workspaceupdates.googleblog.com/2026/09/skills-gemini-app-workspace.html", title: "Introducing skills in the Gemini app and Workspace, plus what's next for Gems", author: Google Workspace Updates, last_modified: "2026-09-30"}
  - {resource: "https://blog.google/products-and-platforms/products/gemini/automate-tasks-with-skills/", title: "Let skills in Gemini tackle your most repetitive tasks", author: "Deven Tokuno, Google", last_modified: "2026-09-30"}
  - {resource: "https://workspace.google.com/blog/product-announcements/teach-gemini-your-teams-know-hows-with-skills-in-google-workspace", title: "Teach Gemini your team's know-hows with skills in Google Workspace", author: "Ali Douvre, Google", last_modified: "2026-09-16"}
  - {resource: "https://services.google.com/fh/files/helpcenter/skills_101_handbook.pdf", title: "AI skills 101: Customizing AI from Google for your role", author: Google, last_modified: "2026-09-28"}
  - {resource: "https://services.google.com/fh/files/misc/gemini_gems_skills_transition_guide.pdf", title: "Gemini Gems and Skills Transition Guide (Education)", author: Google, last_modified: "undated; read 2026-10-10"}
  - {resource: "https://docs.cloud.google.com/gemini/enterprise/docs/skills", title: "Create and manage skills (Gemini Enterprise)", author: Google Cloud, last_modified: "2026-10-07"}
  - {resource: "https://agentskills.io/specification", title: "Agent Skills specification", author: agentskills.io, last_modified: "undated; read 2026-10-10"}
  - {resource: "https://github.com/VirusTotal/virustotal-mcp/pull/51", title: "Use the standalone skill file for Gemini Apps uploads (third-party)", author: VirusTotal, last_modified: "2026-10-02"}
  - {resource: "https://9to5google.com/2026/09/27/gemini-gems-skills/", title: "Gemini app replacing Gems with skills in November (third-party)", author: "Abner Li, 9to5Google", last_modified: "2026-09-27"}
  - {resource: "https://www.eesel.ai/blog/gemini-skills", title: "Gemini skills: how they work, who gets them, and the Gems switch (third-party)", author: eesel.ai, last_modified: "2026-10-01"}
verified:
  - {by: "claude-code/claude-opus-5-5", at: "2026-10-10", note: "Timeline, migration, format, limits and writing guidance re-read on the three primary Google pages; nothing tested in MERGE's account yet."}
---

# Building skills for Gemini

Google is replacing Gems with skills, and for our Workspace accounts Gems stop working no sooner than 2027-03-01. This is what Google has published about skills as of 2026-10-10, gathered before we've built one, so read it before you convert a Gem or write a new skill, and use [claude-skills-best-practices.md](claude-skills-best-practices.md) for the parts that carry over. Each fact is marked: **documented** means Google says so, with the source in the frontmatter; **third-party** means someone else reports it; **inferred** is our reading; and **confirmed** is kept for what we've tested ourselves in MERGE's account, which so far is nothing.

## Contents

<!-- toc -->
- Ten things to know first
- Two skill systems
- Timeline
- Format and limits
- How Gemini picks up a skill
- Writing a skill
- Converting a Gem
- Testing, sharing and admin settings
- Still unknown
<!-- /toc -->

## Ten things to know first

1. **There are two skill systems, and they don't sync.** Gemini app skills are uploaded as a SKILL.md and called with `/` in gemini.google.com. Workspace skills are built in Workspace Studio and called with `@` in the Gemini side panel in Docs, Gmail, Slides, Drive and Chat. A skill in one isn't in the other. **Documented.**
2. **Gems end no sooner than 2027-03-01 for Workspace accounts.** After that date nobody can create, edit or use one, and any left over are migrated to skills. **Documented.**
3. **Migrated Gems arrive switched off.** They land as inactive drafts in their creator's list, and only the creator can review and activate them, so a Gem whose owner has left MERGE is likely stranded. **Documented; the stranding is inferred.**
4. **A skill uses the open SKILL.md format**, the same Agent Skills format as Claude's: a folder with a `SKILL.md` at its root, `name` and `description` in its frontmatter, and the instructions below. **Documented.** So one source can feed both a Claude skill and a Gemini skill.
5. **Gemini reads only the name and description to decide whether a skill applies.** It reads the instructions once it's chosen the skill, and opens attached files only when it needs them. A vague description means the skill never runs. **Documented.**
6. **The name is lowercase with hyphens and should start with a verb**, and the description is one or two sentences in the third person, with a "Use when" clause, at most 1,024 characters. **Documented.**
7. **Only plain-text files can be attached**: Markdown, text, code, JSON, YAML, CSV, TOML, HTML, PDF and images. Word, Excel and other binary files are refused, and all the files together are limited to 100 MB. **Documented.**
8. **Changing any attached file means uploading the whole skill again.** **Documented.**
9. **Scripts can't reach the internet**, and Google never says plainly that the Gemini app runs a skill's scripts at all, so keep any arithmetic a skill depends on in its instructions too. **Documented; whether scripts run is unknown.**
10. **Sharing a Gemini app skill isn't available yet**, and work accounts only start getting Gemini app skills from 2026-10-13. **Documented.**

## Two skill systems

These are two products that both happen to be called skills. This table compares them, because which one a skill lives in decides where people can use it.

| | Gemini app skills | Workspace skills |
| --- | --- | --- |
| Where you use it | Any chat in the Gemini app, on the web, Mac and mobile | The Gemini side panel in Docs, Gmail, Slides, Drive and Chat, and Studio flows |
| How you call it | `/` and the name, by asking for it, or Gemini picks it automatically | `@` and the name |
| How you build it | Upload a SKILL.md, folder or .zip; create it manually; or have Gemini draft it | Workspace Studio's skill builder, or the Skill builder in a Doc |
| Attached files | Uploaded copies; Drive and Gemini Notebook files are "coming weeks" | Sources such as Drive, Gmail, Chat, Calendar and the web |
| Sharing | Not yet ("coming weeks") | A link that gives the other person a copy, to Private or My organization |
| Admin control | None found | Admin console › Workspace Studio › Skills, which also needs the Gemini Beta program |

All of the table is **documented**. A Gem becomes a Gemini app skill when it's migrated; using the same skill in Docs or Gmail means building it again in Studio. Gemini Enterprise has a third version, which we don't use. Google says you can move a SKILL.md between the Gemini app, Workspace and Gemini Enterprise by downloading and uploading it.

## Timeline

These dates are Google's. Each "no sooner than" date can move later, and Google says it will publish the full migration details at least 30 days before migration starts.

| Date | What happens |
| --- | --- |
| 2026-10-13 | Gemini app skills start rolling out to Workspace users, complete by mid-November; Gems and skills both work |
| 2026-10-19 | Workspace skills reach Scheduled Release domains, complete by mid-November |
| 2026-11-17 | Gems move into Settings in the Gemini app and keep working for Workspace users. Personal accounts lose Gems on this date, and their Gems are migrated |
| No sooner than 2027-03-01 | Workspace business and enterprise accounts: Gems can't be created, edited or used; Studio flows with an "Ask a Gem" step stop; remaining Gems migrate to draft skills |

**Documented.** Studio already won't add new "Ask a Gem" steps, though existing ones run until March 2027. **Inferred:** the migration details should appear by about 2027-01-30.

## Format and limits

A skill is a folder whose name matches the skill's name, with `SKILL.md` at its root and any reference files beside it. This table lists every limit we found.

| Limit | Value | Status |
| --- | --- | --- |
| Name | Lowercase with hyphens, such as `my-new-skill`; 64 characters in the Agent Skills spec | Documented |
| Description | 1,024 characters | Documented |
| Frontmatter | `name` and `description`; whether the app reads anything else isn't said | Documented; others unknown |
| Instructions length | No limit published; the Agent Skills spec recommends under 500 lines | Unknown |
| Files | Plain text and PDF and images only; no `.docx`, `.doc` or `.xlsx` | Documented |
| Total size | 100 MB for all files together | Documented |
| Number of files, size of one file | Not published | Unknown |
| Active skills | 100 at a time; no limit on how many you create | Documented |
| Scripts | `.py` and `.sh` accepted; no internet access or actions on websites | Documented |
| Where you can upload | The web and the Mac app | Documented |

Google warns that hidden files such as `.DS_Store` can make an upload fail, so build the folder or .zip without them. **Documented.** One third party found that some upload dialogs take only a bare SKILL.md and refuse a .zip. **Third-party.**

## How Gemini picks up a skill

Gemini loads a skill in stages. It reads only the name and description to judge whether the skill fits the prompt, then the full instructions once it's chosen the skill, and an attached file only when a step needs it. **Documented.** Google's education guide puts it bluntly: Gemini relies solely on the name and description to trigger a skill, so don't make two skills for overlapping tasks.

A person can also call a skill by typing `/` and its name, which is the reliable way while a description is being tuned. Several skills can be used in one prompt, and a skill's instructions can name another skill to use. Gemini only picks a skill automatically while it's switched on. **Documented.**

## Writing a skill

Google's guidance and ours agree closely, so this section gives Google's rules and adds what we've learned from Claude, Figma and MERGE One where Google says nothing.

**Google's rules.** **Documented**, mostly from "Write effective skills":

- **A skill is a cheat sheet, not a manual.** One job per skill, kept short: quick steps, formatting rules and common mistakes.
- **Name it with a verb**, such as `plan-meal-from-recipe`, never a vague word such as `helper`, `tools` or `data`.
- **Write the description as a capability, in the third person,** followed by "Use when" and the specific situations. Never "I can help you" or "You can use this to".
- **Write for a type of task, not one result,** and match the detail to the risk: loose for creative work, step by step where accuracy and format matter.
- **Include output templates and examples, a common-mistakes section, and a checklist for long tasks.**
- **Say what to do when information is missing**, such as asking rather than guessing.
- **Don't build a skill** for a one-off job, something Gemini already does well, or steps that keep changing.

**What we add.** These come from our other guides and are **inferred** for Gemini until we test them:

- **Keep the arithmetic and any exact wording in the instructions, not only in a script,** because we don't know whether the Gemini app runs a skill's scripts.
- **Name reference files by their file name and path,** such as `references/rates.md`, and say when to open each one, since Gemini opens files only when a step needs them. A Gem referred to its files by title; a skill's files sit in its folder.
- **Avoid Markdown tables in a skill's output.** Our Gem printed a table as raw Markdown once Gemini put its source chips beside it (2026-10-09). Gems have a "Disable knowledge citations" switch; no skill page mentions one, so a list is the safer layout.
- **Keep one source for a skill that also runs elsewhere,** and build each version from it, as [figma-credit-estimator](figma-credit-estimator/README.md) does for Claude, a Gem and MERGE One.

## Converting a Gem

There's no conversion tool beyond the automatic migration, which keeps a Gem's name, description, instructions and uploaded files, and its sharing settings. GitHub files don't move over, and Google's own premade Gems aren't migrated. **Documented.**

To convert one by hand in the Gemini app, Google gives these steps. **Documented.**

1. Download each of the Gem's knowledge files into a folder named in lowercase with hyphens.
2. In Settings › Skills, choose **Create manually** and paste in the Gem's name, description and instructions. The name is reformatted for you.
3. Choose **Skill actions › Download** to get a .zip with the SKILL.md, put that SKILL.md in the folder with the files, then choose **Replace skill** and upload the folder. The folder's name must match the skill's name.

Converting by hand, rather than waiting, lets you rewrite the description to Google's rules, and a migrated Gem has to be reviewed and activated anyway. **Inferred.**

**For figma-credit-estimator.** The Gemini skill is built, at estimator 0.3.0 on 2026-10-10, as [`figma-credit-estimator/gemini/estimate-figma-credits/`](figma-credit-estimator/gemini/estimate-figma-credits/SKILL.md), and its build writes an upload zip with `SKILL.md` at its root. It's named with a verb, as Google asks, so its name differs from the Claude skill's `figma-credit-estimator`. Its description is the one every version shares, third person with "Use when", at 685 characters. Its instructions come from the gem and MERGE One template, which don't depend on running the calculator, with the three reference files named by path under `references/`. A role-play of how Gemini loads a skill, on Sonnet without code, matched the calculator on design hours and on a confirmed duration, and didn't use the skill for an unrelated request (2026-10-10). **Not yet tested in Gemini itself.** Its "save the report as a file" step will likely fall back to the copy-or-export line, because Canvas doesn't work with skills yet. **Inferred.**

## Testing, sharing and admin settings

**Testing.** The Gemini app has no preview pane like the one Gems had, so test by calling the skill with `/` in a new chat. Workspace Studio's skill builder has a test chat. **Documented; the Gemini app method is inferred.**

**Editing.** You can edit the description and instructions in place or with **Edit with Gemini**, but changing a file means **Replace skill** with the whole folder. Skills can be switched on and off, downloaded as a .zip, or deleted, and deleting can't be undone. **Documented.**

**Sharing.** Gemini app skills can't be shared yet. Workspace skills are shared by a link that gives each person a copy, so a later fix doesn't reach them, and anyone with the link can see the creator's email address. Google has announced Workspace Marketplace publishing and admin-curated organization skills for later. **Documented.**

**Admin settings.** Workspace skills are controlled in the Admin console under Apps › Google Workspace › Workspace Studio › Skills, by organizational unit or group, with a separate setting for sharing outside the domain. Both need the organization enrolled in the Gemini Beta program. We found no admin setting for Gemini app skills. **Documented.** **TBD:** who at MERGE administers these settings, and whether MERGE is in the Gemini Beta program.

## Still unknown

These are open until Google publishes them or we test them in MERGE's account after skills reach it, from 2026-10-13.

- **TBD:** the full migration details, which Google will publish at least 30 days before migration starts.
- **TBD:** whether the Gemini app runs a skill's `.py` and `.sh` scripts, and in what environment.
- **TBD:** whether attached files are read whole or retrieved in parts.
- **TBD:** a limit on instruction length, on the number of files, or on one file's size.
- **TBD:** which frontmatter fields the Gemini app reads beyond `name` and `description`.
- **TBD:** whether source chips break Markdown tables in a skill's output, as they did in our Gem, and whether citations can be switched off.
- **TBD:** whether a skill can save a file or a Doc from the chat.
- **TBD:** whether a .zip with the skill inside a top-level folder counts as SKILL.md being in its main folder; our Claude zip is built that way.
- **TBD:** when Gemini app skills can be shared, and when Drive and Notebook files can be attached.
- **TBD:** which model runs a skill.

The Gemini app help page still says skills aren't available on work or school accounts, while Google's Workspace announcements say they reach all Workspace customers from 2026-10-13. We read that as the help page lagging the rollout. **Inferred.**

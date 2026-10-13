---
title: "Make your own Figma agent skills: what we've learned"
description: Source text for a short, self-explaining deck for MERGE designers who want to write skills for Figma's agent, covering what a skill is, how to make and share one, the size limits we hit, and a prompt to hand an AI assistant.
type: guide
status: draft
version: "0.1.0"
created: 2026-10-08
maintainer: sbrown@mergeworld.com
audience: MERGE designers who use Figma, from casual users to design-system leads; not assumed to know AI tools
state: "Markdown for review before the deck is built. Format and naming questions are open under Build notes."
tags: [figma, figma-agent, skills, deck, designers]
sources:
  - title: Figma help, skills for the Figma agent
    publisher: Figma
    url: https://help.figma.com/hc/en-us/articles/40283639496599
    credibility: primary; checked 2026-10-08
  - title: What we learned building skills for Figma's agent
    url: ../figma-agent-skills.md
    credibility: our own guideline, from building merge-build-readiness and merge-email-check, 2026-10-03 to 2026-10-07
  - title: merge-email-check scripts README
    url: ../merge-email-check/scripts/README.md
    credibility: our own test records for the 20,000-character script limit
  - title: Best practices for optimizing AI credits with the Figma agent
    publisher: Figma
    url: https://help.figma.com/hc/en-us/articles/43707097479575-Best-practices-for-optimizing-AI-credits-with-the-Figma-agent
    credibility: primary; checked 2026-10-08
  - title: Agent Skills specification
    url: https://agentskills.io/specification
    credibility: primary; the open format Figma's help says skills follow; checked 2026-10-08
  - title: Skill authoring best practices
    publisher: Anthropic
    url: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
    credibility: primary for Claude; checked 2026-10-08
---

# Make your own Figma agent skills: what we've learned

This is the text for a short deck we can share with anyone at MERGE who uses Figma and wants to write skills for its agent. Each H2 is one slide, written to be read without a presenter. The copy-and-paste prompt the deck points to is in [ai-assistant-prompt.md](ai-assistant-prompt.md). Notes for whoever builds the deck are at the end, after the slides.

## Contents

<!-- toc -->
- Slide 1: Make your own Figma agent skills
- Slide 2: What a skill is
- Slide 3: Why it's worth making one
- Slide 4: Where skills live in Figma
- Slide 5: What's inside a skill file
- Slide 6: Three ways to make one
- Slide 7: Six habits that make a skill work
- Slide 8: When a skill needs scripts
- Slide 9: The size limits we hit
- Slide 10: What else to expect
- Slide 11: Test before you share
- Slide 12: The prompt to give your AI assistant
- Slide 13: Where to learn more
- Build notes
- Version history
<!-- /toc -->

## Slide 1: Make your own Figma agent skills

What we've learned building skills for Figma's AI agent, and how you can make one without writing any code yourself.

Steve Brown, Experience, October 2026

<!-- visual: title slide -->

## Slide 2: What a skill is

A skill is a set of instructions you write once and Figma's agent follows every time you ask. It's a single text file with a name, a one-line description and the steps, written in plain words. You run it by typing a slash and its name in the agent's prompt box, such as `/merge-email-check`.

Think of it as a recipe card. Instead of explaining what you want each time, you hand the agent the card.

Skills work in Figma Design and Figma Make.

## Slide 3: Why it's worth making one

A skill turns something you know how to do into something anyone on the team can run, done the same way each time. We've built two so far, and they show the kind of job skills are good at:

- **merge-build-readiness** checks whether a Figma file is ready for a developer or a coding agent to build from, against 34 checks, and lists the fixes to make first.
- **merge-email-check** checks an email design before it's built: how it looks with images off and in dark mode, color contrast, tap targets and the footer.

Good candidates are jobs you repeat, have a clear idea of "right" for, and would like others to do the way you do them.

## Slide 4: Where skills live in Figma

Everything happens in the agent's prompt box. Choose **Skills**, then **Add skill**, to add one. To run it, type `/` and pick it from the list. To see all your skills, choose **Add context**, **Skills**, then **Manage skills**.

Only one skill runs per prompt. If you name two, only the first one runs.

To share a skill, open it in **Manage skills**, choose **More actions**, then **Publish**, and pick your team or the whole organization. If a teammate can see your skill but can't run it, they need to switch it on under **Add context**, **Skills**.

You need edit access to the file. Full seats can use the agent in any file; View, Dev and Collab seats can try it in their drafts.

## Slide 5: What's inside a skill file

Here's a complete skill. The part between the dashed lines tells Figma its name and when to use it; everything below is the instructions.

```markdown
---
name: merge-button-label-check
description: Checks that every button and link in the selected frames says what it does. Use when someone asks to review button labels, CTAs or link text.
---

Look at every button and text link in the frames I've selected.

A label passes when it says what happens next, such as "Download the report" or "Book a demo". It fails when it only makes sense next to the design around it, such as "Click here", "Read more" or "Go".

Don't change anything in the file. Put your answer in the chat, not on the canvas.

Reply with a table: each label, Pass or Fail, and a better label for each Fail. Then one sentence saying how many failed. If you can't read a label, say so rather than guessing.
```

That's all a skill has to be.

## Slide 6: Three ways to make one

Figma gives you three ways to start. You can describe the job to Figma's agent and ask it to write the skill. You can choose **Add skill**, then **Start from scratch**, and type it in. Or you can write the file somewhere else and upload it.

We recommend the third way: draft it with Claude, Gemini or another AI assistant, using the prompt near the end of this deck, then upload it. The prompt makes the assistant ask you the right questions first and follow the rules on the next slide, so your first version starts from what took us a week to learn. Whichever way you start, once a skill works, edit it rather than asking the agent to write it again, because each rewrite uses AI credits.

## Slide 7: Six habits that make a skill work

Most of our early problems came from the agent doing something sensible that we hadn't asked for. These six instructions fixed them:

1. **Say what the answer should look like.** Give it a fixed template and say to add nothing, or the agent adds sections and pads the answer.
2. **Say where the answer goes.** "Put your answer in the chat, never on the canvas." One of our first runs drew a 12-frame report onto the page.
3. **Say what it mustn't touch.** If the skill only looks, say so and list what it must never do: rename, move, recolor, resize, detach or delete. An agent that spots a problem tends to fix it.
4. **Ask it to say when it can't tell.** Small text in a screenshot isn't reliably readable, so tell it to say so rather than guess.
5. **Give each skill one job.** If you need two, make two skills, and have the first offer the second at the end.
6. **Try it on a real file, read the answer, and adjust.** Every fix above came from reading a real run.

## Slide 8: When a skill needs scripts

Without scripts, the agent works from what it can see, much like a person looking at screenshots. That's fine for judgment calls like the button-label example. When you need exact answers, such as color contrast ratios, tap target sizes or whether every image has alt text, the skill can carry small programs, called scripts, that the agent runs to read the file precisely.

You don't need to write or read the code. We don't write ours by hand either: Claude writes them, and we test them. Add the second block of the prompt and the assistant will follow the rules we learned, including the size limits on the next slide.

## Slide 9: The size limits we hit

Figma doesn't publish most of these limits, so we found them by running into them. Plan for them from the start, because each one stops a skill from running.

| Limit | What happened to us | What we do now |
| --- | --- | --- |
| A skill's instructions can be at most 65,536 characters | On 2026-10-04 our first upload was 88,746 characters, and Figma refused it. Figma's help doesn't mention this limit. | Keep each skill under about 60,000 characters, and move extra features into a second skill. |
| Each script can be at most 20,000 characters | On 2026-10-06 the agent refused to run our 30,292-character script. The same script had worked in Claude Code, which accepts longer ones. | Keep each script under about 18,000 characters, and split any that grow past it. |
| A script's answer has to stay under about 20 KB | Longer answers got cut off, and the agent judged from half the data. | Scripts return counts plus a few examples, and the total beside any shortened list. |

The prompt's second block tells the assistant all of this, and asks it to report the length when it's done.

## Slide 10: What else to expect

A few more things surprised us, and they'll save you time if you know them up front:

- **Runs take a while.** Our checks take 9 to 11 minutes on a full page, so have the skill post a short progress line after each stage.
- **Runs use AI credits.** Every run uses Figma AI credits, and we haven't measured what one skill run costs yet. Figma's advice helps: select one frame rather than a whole page, and start a new chat for each new task, because a long chat carries its history into every prompt. A skill itself saves credits, because you stop explaining the same thing in every prompt.
- **Leftovers count next time.** Anything a run leaves on the canvas gets read by the next run, so delete it.
- **A changed skill needs uploading again.** Figma keeps the copy you uploaded, so re-upload the file after every edit.

## Slide 11: Test before you share

Before you publish a skill to the team, run it on three things: a frame where it should find nothing wrong, one where it should find problems, and one tricky case. The prompt asks your assistant to suggest all three.

Test on a copy of your file the first few times, even if the skill only reads, and read each answer as if a teammate wrote it. When something's wrong, tell your assistant what happened and ask it to fix the skill, then upload the new version and run it again.

## Slide 12: The prompt to give your AI assistant

Copy the prompt into Claude, Gemini or any other AI assistant, and describe the job you want the skill to do. It has two parts: the first for every skill, and a second to add when the skill needs scripts.

**TBD:** the link to [ai-assistant-prompt.md](ai-assistant-prompt.md) that people outside this repo can open.

Questions, or a skill you'd like help with? Ask Steve Brown.

## Slide 13: Where to learn more

These are the sources we trust, starting with Figma's own. Your AI assistant can read the technical ones for you, so you don't need to.

From Figma:

- [Create and manage custom skills in Figma](https://help.figma.com/hc/en-us/articles/40283639496599): making, running and sharing skills.
- [Find and use skills from the Figma Community](https://help.figma.com/hc/en-us/articles/42287852075543), and the [Community's skills page](https://www.figma.com/community/ai-skills?resource_type=skills): skills other people have shared, which are good examples to learn from.
- [Best practices for optimizing AI credits with the Figma agent](https://help.figma.com/hc/en-us/articles/43707097479575-Best-practices-for-optimizing-AI-credits-with-the-Figma-agent): what makes a run cost more or less.
- [Figma Plugin API](https://developers.figma.com/docs/plugins/): the reference your AI assistant uses to write scripts.
- [Create skills for the Figma MCP server](https://developers.figma.com/docs/figma-mcp-server/create-skills/): for anyone using Figma from Claude Code, Codex or Cursor rather than inside Figma.

The format itself:

- [Agent Skills specification](https://agentskills.io/specification): the open format Figma's skills follow, with the rules for the name and description.
- [Markdown basic syntax](https://www.markdownguide.org/basic-syntax/): the formatting a skill file is written in, which Figma's help links to.

From Anthropic, the makers of Claude:

- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices): the most thorough guide to writing a good skill. It's written for Claude, but nearly all of it applies in Figma.
- [Anthropic's example skills](https://github.com/anthropics/skills): dozens of real skills and a starter template.

From us: **TBD:** a shareable link to [our notes on building skills for Figma's agent](../figma-agent-skills.md).

## Build notes

These notes are for whoever builds the deck from this file and aren't part of it.

- **TBD (Steve):** the format. Figma Slides is recommended, because the audience works in Figma and it shares as a link; PowerPoint or Google Slides would also work.
- **TBD (Steve):** where the prompt lives so people outside the repo can open and copy it, for example a shared Google Doc, a Confluence page or a text box on a slide. Text copied from a slide can pick up stray formatting, so a plain-text source is safer.
- **Names are left out** until Steve decides whether to cite colleagues' work, such as Heather New's prompt agent, as examples. The CCE AI strategy notes say Chris Gavazzoni wants creatives trained before the wider company sees Heather's agent.
- **Slide 5's example skill hasn't been run in Figma yet.** Run it once on a real frame before the deck goes out, and adjust the slide if the agent needs more than it says.
- **Re-check slide 4 against Figma's help page** before each new version of the deck, because Figma's agent is in beta and its menus change. Checked 2026-10-08. That page doesn't mention the admin "Recommended" option our earlier notes describe, so the deck leaves it out.
- **Slide 13's links were checked on 2026-10-08.** Figma's MCP page on creating skills is about skills for tools like Claude Code, not Figma's agent, and allows extra folders that Figma's agent doesn't; the slide says who it's for. Anthropic's example skills are mostly under the Apache 2.0 license, but the document skills (docx, pdf, pptx, xlsx) are source-available only, so the deck points to the repo rather than copying from it.
- **Slide 9's numbers come from our own runs:** the 88,746-character upload and the 65,536 limit from [figma-agent-skills.md](../figma-agent-skills.md#format-and-limits), and the 30,292-character script from the [merge-email-check scripts README](../merge-email-check/scripts/README.md#traps-found-while-testing). Slide 10's run times come from runs of 8 minutes 55 seconds (2026-10-05) and 10 minutes 58 seconds (2026-10-06).

## Version history

- **0.1.0 (2026-10-08)** — First draft of the slide text, external references and build notes, for Steve's review.

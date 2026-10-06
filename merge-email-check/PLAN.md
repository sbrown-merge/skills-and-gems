---
title: "merge-email-check: the build plan"
description: "The agreed plan for a Figma agent skill that checks an email design against email best practices, for any MERGE or client email project: what it checks, how a run works, where its rules come from, and the build order. Agreed with Steve Brown on 2026-10-05."
type: plan
status: draft
created: 2026-10-05
maintainer: Steve Brown
tags: [figma, figma-agent, skill, email, crm, accessibility, dark-mode, audit]
---

# merge-email-check: the build plan

This is the plan for a skill that checks an email design in Figma against email best practices, before anyone builds it. A designer runs `/merge-email-check` on an email's frames and gets a scorecard of about 30 checks, each with evidence linked to the layer at fault, then the fixes to make first. Steve Brown agreed the plan on 2026-10-05, in a session in the `merge-marketing-email-specs` repo, where the rules it checks were researched and ruled on for MERGE's TOFU email series. It's built the way [merge-build-readiness](../merge-build-readiness/PLAN.md) was, and follows [figma-agent-skills.md](../figma-agent-skills.md) and section J of [claude-skills-best-practices.md](../claude-skills-best-practices.md).

## Contents

<!-- toc -->
- What we're building, and why
- Decisions
- Where the rules come from
- What the skill checks
- How a run works
- What it can't check in Figma
- The folder
- Build order
- Open questions
<!-- /toc -->

## What we're building, and why

Most of what goes wrong with a marketing email is decided in the design, long before the build: a headline baked into an image vanishes when Outlook blocks images, alt text too long for its box disappears in Apple Mail, a dark logo goes dark on dark in the Gmail app, and a link shown only by color fails WCAG. These faults are cheap to fix in Figma and expensive once an engineer has built them, and nobody reviewing a design in Figma sees the email the way a prospect at work does. The skill puts that review in the designer's hands, inside the file.

It's read-only. The only things it writes are the comments or Dev Mode annotations the designer asks for, and it proves at the end that the design is unchanged.

## Decisions

Steve made these on 2026-10-05.

| Decision | What it means |
| --- | --- |
| The name is `merge-email-check` | `merge-` is our prefix for custom skills, which avoids clashing with Community skills, as Figma advises. |
| It runs in Figma's agent, and also from Claude Code | Figma's agent is the target, so `SKILL.md` is one file under Figma's 65,536-character limit. The same file and scripts also run from Claude Code through the Figma MCP's `use_figma` tool, which runs scripts the same way ([figma-agent-skills.md](../figma-agent-skills.md)). The skill says which tools to use in each place. |
| It's for any email project, client work included | It isn't limited to MERGE's TOFU series: a client project such as American Express uses it too. So the checks come in two tiers. **Universal** checks hold for any email, because they come from WCAG 2.2 or from how mail apps behave. **House** checks carry MERGE's numbers as defaults that a project can change in the opening question, because a client's brand or build may differ. |
| Desktop frames pass anywhere from 600 to 700px | Existing files drawn at 700px shouldn't fail. MERGE's own ruling is 600px, so the report notes a 700px frame without failing it. |
| Wait for merge-build-readiness 0.2 | Its contrast and target scripts are copied into this skill, so building waited until that work was committed, which it was on 2026-10-05 (`ec53c49`). |

## Where the rules come from

The rules were researched and ruled on in `merge-marketing-email-specs` between 2026-09-23 and 2026-10-05, and every check in [checklist.md](checklist.md) cites its source there. The main ones:

- **Research notes** on email width and size limits (2026-09-23), dark mode and accessibility (2026-09-24), how images fail to load (2026-10-01, with its designing and reviewing checklist), and which mail apps business readers use (2026-10-02).
- **Rulings** in that repo's decisions ledger: two widths, mobile first ([D-4][ledger], [D-7][ledger], [D-8][ledger]), 80KB of HTML ([D-9][ledger]), WCAG 2.2 AA ([D-13][ledger]), Jill Redo's guidance as house defaults ([D-16][ledger]), side-by-side reviews ([D-19][ledger]) and the dark-mode image rules ([D-21][ledger]).
- **Jill Redo's house guidance**: the Technical Design workshop deck and the MERGE email scorecard dated 2026-01-21, which [D-16][ledger] treats as a guide rather than law.
- **The TOFU build brief's §10 checklist**, which is the same knowledge turned into build checks. This skill checks the half of it that's decided in the design.

**When a ruling there changes, this skill changes too.** **TBD:** the email-specs repo doesn't yet list this skill among the places a ruling is carried to, next to the build brief; adding it changes that repo's rules, so it's Steve's call.

## What the skill checks

There are about 30 checks in seven groups, with IDs `EM-01` onward. [checklist.md](checklist.md) holds each one's rank, tier, reason, rule and source; this table gives the shape.

| Group | What it covers |
| --- | --- |
| Layout | A mobile and a desktop frame for each email, mobile on the left; the desktop frame 600 to 700px; a mobile behavior note on each module; the main message and CTA in the first 300px |
| Images off | Every image has alt text or is marked decorative; alt text fits on one line at the image's width; headlines, offers and buttons are live text; no text inside images apart from the logo; no text laid over an image unless it still reads on the color behind |
| Dark mode | Every image says how it behaves in dark mode; the logo has a reversed version; icons are one color that works on light and dark; no pure white or pure black backgrounds |
| Type | All text is live; a brand font names its fallback; body and headline sizes within the house range |
| Accessibility | Text contrast; button edges and meaningful icons at 3 to 1; tap targets; underlined links; one H1 and heading levels in order; link text that says where it goes |
| Content | Content and dynamic-content notes on the parts that change; one primary CTA as a button, repeated rather than varied; a written preheader; a footer with unsubscribe, address and privacy policy |
| Export | Images export as JPG or PNG, never SVG; image slices under about 1500px tall |

Every check comes back Pass, Partly, Fail, Couldn't check or N/A, and ranks use Must, Should and Could, the same as merge-build-readiness.

## How a run works

The structure is merge-build-readiness's, which works in Figma's agent.

1. **Ask once, then run without stopping.** The opening message asks for the scope (one email's frames, a section or a page), how to deliver findings (report only, comments, or Dev Mode annotations), and whether to use MERGE's house numbers or the project's own. Each has a default, so "go" works.
2. **Read the frames by script.** Low-freedom scripts, run unchanged, gather frame widths and order, image layers and their export settings, text layers with fonts, sizes, fills and links, annotations, buttons and their sizes, and the colors behind each text layer.
3. **Look.** One screenshot of each frame, for the checks a script can't settle, such as text inside an image. Where small text in a screenshot can't be read, the skill says so rather than guessing.
4. **Judge** each check from the data and the screenshots.
5. **Report** the scorecard and the top fixes in the chat, as readable text and then word for word in one fenced Markdown block, in a fixed template with nothing added.
6. **Deliver, if asked**, as comments or annotations on the layer at fault.
7. **Prove nothing changed** with the fingerprint script, and offer next steps.

## What it can't check in Figma

Some things that decide whether an email works only exist in the HTML or the send: the HTML's weight against Gmail's clip, Outlook-only code, the `alt` attributes themselves, and how each mail app renders. The skill says so in its report, under one fixed line, rather than scoring them, and points to the build brief and a test send. It can still warn on the design choices that drive weight, such as modules drawn twice for mobile and desktop.

## The folder

Everything lives in `skills-and-gems/merge-email-check/`. Only `SKILL.md` goes to Figma.

| File | What it's for |
| --- | --- |
| `SKILL.md` | The skill, with the checks in compressed form and the scripts minified inline. Frontmatter holds only `name` and `description`. |
| `README.md` | For maintainers: what it does, publishing, the version, what it was tested on, and credit. |
| `checklist.md` | The full checklist, with each check's reason, rule, tier and source. Change a check here first. |
| `PLAN.md` | This plan. |
| `scripts/` | The readable Plugin API scripts, a README of what testing found, and a sync tool copied from merge-build-readiness. Three scripts: scope, the checks (run in two parts, layout and images) and fingerprint. The scope and fingerprint scripts and the contrast and target logic start as copies from merge-build-readiness. |
| `diagnostics/` | Saved reports from runs in Figma. |
| `EVAL.md` | Test cases, expected findings and results. |

## Build order

1. **Save this plan.** Done on 2026-10-05.
2. **Write [checklist.md](checklist.md), then stop for Steve's review.** It decides everything downstream. Drafted and approved on 2026-10-05.
3. **Test each script through the Figma MCP** against the TOFU file (`Dqux2GL6tXD0boEEW3QCax`), then run the minified copy too. Done on 2026-10-05: seven scripts tested, then merged into three and cut from 60,760 to 34,855 minified characters to fit the budget, and re-tested; the Adobe rebuild's known faults and Terry's email 1 findings were all still found ([scripts/README.md](scripts/README.md)).
4. **Write `SKILL.md`** within a working budget of 62,500 characters, and have a separate Opus 5.5 agent audit it against [claude-skills-best-practices.md](../claude-skills-best-practices.md), sections A to J. Drafted on 2026-10-06; an independent Opus 5.5 audit found its scoring rules thinner than the checklist's (the default rule, Couldn't check for a file with no notes) and some result keys described in the wrong place, all fixed the same day.
5. **Run the evaluations**, each first without the skill and then with it, in Claude Code and in Figma's agent:
   - **The Adobe Elevate rebuild** on page "08 Reference: images off" of the TOFU file. Its callouts already list the expected faults: links shown by color alone, 11px gray footer text at about 3 to 1, CTAs as small text links, the Try it card's heading in dark mode, and the hero with no height.
   - **Terry Smith's TOFU designs**, as the real case.
   - **A small file with deliberate faults**, one per check where possible.
6. **Publish** privately to the MERGE organization, have an admin mark it Recommended, and record the version and what it was tested on in the README.

## Open questions

- **TBD:** a probe inside Figma's agent before the first full run. Three calls this skill makes have never run in Figma's agent, only through `use_figma`: reading image bytes with `getImageByHash().getBytesAsync()`, `exportSettings`, and the `hyperlink` field of text segments (SKILL.md audit, 2026-10-06). A short private test skill, or a first run on the Adobe rebuild with its log saved in `diagnostics/`, would settle it.
- **TBD:** which annotation categories a client file uses. The TOFU file has eight custom categories (Alt text, Decorative image, Heading level, Link or CTA, Dark mode, Dynamic content, Mobile behavior, Content model field); a client file may use Figma's presets or plain text. The checklist proposes reading either.

[ledger]: https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/DECISIONS.md

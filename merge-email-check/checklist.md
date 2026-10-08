---
title: "merge-email-check: the checklist"
description: "The 31 checks merge-email-check runs on an email design in Figma, EM-01 to EM-31, each with its rank, tier, how a script or the agent verifies it, and its source in the email-specs research and rulings."
type: checklist
status: draft
version: "0.5.0"
created: 2026-10-05
maintainer: Steve Brown
tags: [figma, figma-agent, skill, email, crm, accessibility, dark-mode, checklist]
state: "Approved by Steve on 2026-10-05; scripts are being tested at build step 3 of PLAN.md."
sources:
  - {resource: "https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/research/2026-10-01%20how%20images%20fail%20to%20load%20in%20email.md", title: "How images fail to load in email", author: Steve Brown, last_modified: "2026-10-05"}
  - {resource: "https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/research/2026-09-24%20dark%20mode%20and%20accessibility%20in%20email.md", title: "Dark mode and accessibility in email", author: Steve Brown, last_modified: "2026-10-05"}
  - {resource: "https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/research/2026-09-23%20email%20client%20width%20and%20size%20limits.md", title: "Email client width and size limits", author: Steve Brown, last_modified: "2026-09-23"}
  - {resource: "https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/research/2026-10-02%20which%20mail%20apps%20our%20readers%20use.md", title: "Which mail apps our readers use", author: Steve Brown, last_modified: "2026-10-05"}
  - {resource: "https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/DECISIONS.md", title: "merge-marketing-email-specs decisions ledger, D-4 to D-21", author: Steve Brown, last_modified: "2026-10-05"}
  - {resource: "https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/sources/2026-09-23%20email%20best%20practices%20workshop%20technical%20design%20text%20extract.md", title: "Email best practices workshop: technical design (Jill Redo)", author: Jill Redo, last_modified: "2026-09-23"}
  - {resource: "https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/sources/2026-01-21%20MERGE%20email%20scorecard%20revised%20criteria.md", title: "MERGE email scorecard, revised criteria", author: Jill Redo, last_modified: "2026-01-21"}
  - {resource: "https://www.w3.org/TR/WCAG22/", title: "Web Content Accessibility Guidelines (WCAG) 2.2", author: W3C, last_modified: "2024-12-12"}
---

# merge-email-check: the checklist

This is the full checklist that `merge-email-check` runs on an email design in Figma, written at step 2 of the [build plan](PLAN.md) on 2026-10-05. Its knowledge comes from the research and rulings in `merge-marketing-email-specs` ([where the rules come from](PLAN.md#where-the-rules-come-from)), generalized so it works for any email project, MERGE's or a client's. Every check looks only at what's drawn in the Figma file; what lives only in the HTML or the send is listed at the end instead. `SKILL.md` will carry a compressed form of these checks, so change a check here first.

## Contents

<!-- toc -->
- How to read the checks
- House settings
- All checks at a glance
- Layout
- Images off
- Dark mode
- Type
- Accessibility
- Content
- Export
- What the skill can't check in Figma
- Notes for the scripts
- Open questions
- Version history
<!-- /toc -->

## How to read the checks

Each check has an ID, a rank, a tier, a way of being verified, and a source. This section defines those terms once.

**Ranks** are the same as merge-build-readiness's. **Must** means the email breaks for a real group of readers without it, or it's a standard we hold every project to, such as WCAG 2.2 AA or the law on commercial email. **Should** means it measurably improves how the email reads or performs, or saves a build correction. **Could** is worth doing when you're already working in that area.

**Tiers** decide what a project can change. A **Universal** check holds for any email, because it comes from WCAG 2.2, from email law, or from how mail apps behave, and its rule isn't a setting. A **House** check uses a number or policy from the [house settings](#house-settings) below, which default to MERGE's and can be changed for a client project in the opening question.

**Results** are Pass, Partly, Fail, Couldn't check or N/A. A check can also carry **flags**: items the designer should judge, which the report lists under their check without changing its result. Couldn't check means a read failed or Figma doesn't expose what the check needs, and the report says which; the agent never guesses a result. N/A means the check doesn't apply, for example no images in scope; an email with nothing drawn in it is N/A on every check except EM-01. Unless a check says otherwise, a Script check passes when it finds nothing, is Partly when the problem affects fewer than half of the items it checked, and fails at half or more. Every result carries evidence: the total count and up to ten layers, of which the report links up to three.

**Verified by** is **Script** when a Plugin API script returns the data and the result follows from the rule with no judgment, or **Judgment** when a script or a screenshot gathers the data and the agent decides, because the call depends on what a layer is for.

**Finding things in a file.** The checks need to know which layers are emails, images, the logo, icons, buttons, the preheader and the footer. Figma has no such types, so the scripts find them from layer types, fills and names, and the agent confirms them. [Notes for the scripts](#notes-for-the-scripts) sets out how.

## House settings

The opening question shows these values and offers MERGE's defaults. A client project may change any of them; the report lists the values it used.

| Setting | MERGE default | Accepted range | Source |
| --- | --- | --- | --- |
| Mobile frame width | 375px | 320 to 480px | [D-7][ledger], [D-8][ledger]; Jill Redo's scorecard says 480 |
| Desktop frame width | 600px | 600 to 700px | [D-7][ledger]; Steve, 2026-10-05, so files drawn at 700px don't fail |
| Tap target | 44px | WCAG's 24px is the floor for every project | [D-7][ledger], WCAG 2.5.8 |
| Dark-mode image policy | Only the logo swaps, to a reversed version; icons are one color that works on light and dark; no outlines or plates | A project may swap more | [D-21][ledger] |
| Avoid pure white and pure black backgrounds | Yes | Yes or no | [D-21][ledger], from [D-12][ledger] |
| Preview area | The first 300px of the desktop frame | | Jill Redo's scorecard, "Preview Pane" |
| Healthy email length | Up to about 4,500px at desktop width | | Jill Redo's workshop deck |
| Image slice height | Up to about 1,500px | | Jill Redo's workshop deck, [D-16][ledger] |
| Type defaults | Headlines about 20 to 22px, body line height 1.4 to 1.6, body left-aligned, all caps only for short labels | | Jill Redo's workshop deck, [D-16][ledger] |
| Dark reference background | #121212 | | A stand-in for a mail app's dark background, used only for EM-14 and EM-16 |

## All checks at a glance

This table is the index for tools and for `SKILL.md`. The sections after it give each check's reason and rule.

| ID | Check | Rank | Tier | Verified by |
| --- | --- | --- | --- | --- |
| EM-01 | Each email has a mobile and a desktop frame at accepted widths | Must | House | Script |
| EM-02 | The mobile frame sits to the left of the desktop frame | Should | House | Script |
| EM-03 | Each module says how it behaves at mobile width | Should | Universal | Script |
| EM-04 | The main message and primary CTA sit in the preview area | Should | House | Judgment |
| EM-05 | The email's length suits a scroll | Could | House | Script |
| EM-06 | Every image has alt text or is marked decorative | Must | Universal | Script |
| EM-07 | Alt text fits on one line across its image | Should | Universal | Script |
| EM-08 | Headlines, offers and buttons are live text | Must | Universal | Judgment |
| EM-09 | No text sits inside an image, apart from the logo | Should | Universal | Judgment |
| EM-10 | Text over an image still reads on the color behind it | Must | Universal | Script |
| EM-11 | Every image has a background color behind it | Should | Universal | Script |
| EM-12 | Every image says how it behaves in dark mode | Should | House | Script |
| EM-13 | The logo has a reversed version, with no outline or plate | Should | House | Judgment |
| EM-14 | Icons are one color that works on light and dark | Should | House | Script |
| EM-15 | No background is pure white or pure black | Should | House | Script |
| EM-16 | Illustrations read on a dark background too | Should | House | Judgment |
| EM-17 | A brand font names its fallback | Should | Universal | Script |
| EM-18 | Type follows the house defaults | Could | House | Script |
| EM-19 | Text contrast meets WCAG 2.2 AA | Must | Universal | Script |
| EM-20 | Button edges and meaningful icons meet 3 to 1 | Must | Universal | Judgment |
| EM-21 | Tap targets are at least 24px, and meet the house size | Must | House | Script |
| EM-22 | Text links are underlined | Must | Universal | Script |
| EM-23 | There's one H1, and heading levels go in order | Should | Universal | Script |
| EM-24 | Link and button text says where it goes | Should | Universal | Judgment |
| EM-25 | Parts that change by audience are marked | Could | Universal | Script |
| EM-26 | There's one primary CTA, as a button, repeated rather than varied | Should | Universal | Judgment |
| EM-27 | A written preheader is shown | Should | Universal | Script |
| EM-28 | The footer has an unsubscribe link and the sender's address | Must | Universal | Script |
| EM-29 | Images export as JPG or PNG | Should | Universal | Script |
| EM-30 | Image slices stay under the house height | Could | House | Script |
| EM-31 | Alt text describes the image it's on | Should | Universal | Judgment |

Twenty-two checks are Script and nine are Judgment. Nine are Must.

## Layout

These come first because every later check reads the frames they find.

### EM-01 Each email has a mobile and a desktop frame at accepted widths

**Must · House · Script · [D-4][ledger], [D-7][ledger], [D-8][ledger]**

An email is built as one column that shrinks on narrow screens, and classic Outlook for Windows ignores mobile styling entirely, so both layouts have to be designed and both have to hold up on their own. A desktop frame wider than the email's maximum has nowhere to go, because mail apps center the email in the reading pane. The script finds each email's top-level frames and their widths. Pass when every email has one frame in the mobile range and one in the desktop range. Fail when an email has only one, or a frame is drawn at a width no mail app shows, such as 1280px. A frame with no layers in it counts as missing. A frame that holds only one email-width frame of a different width, such as a 680px gray frame around a 600px email, is a presentation wrapper, and the frame inside it is the email. A frame wider than 700px that only shows the email inside a mail app's window is N/A for this check, and the report says so. A desktop frame between 601 and 700px passes, with a note that MERGE's own default is 600px.

### EM-02 The mobile frame sits to the left of the desktop frame

**Should · House · Script · [D-8][ledger], [D-19][ledger]**

Reviews show both frames side by side, mobile on the left, so nobody judges an email on one screen. Pass when each email's mobile frame's x position is less than its desktop frame's.

### EM-03 Each module says how it behaves at mobile width

**Should · Universal · Script · [D-4][ledger]**

An engineer can't tell from two drawings whether a module stacks, hides, keeps its size or swaps its image, and guessing wrong is the commonest mobile bug. The script counts the modules (the direct children of each desktop frame) with a mobile-behavior note ([Notes for the scripts](#notes-for-the-scripts)). Pass when all have one. When the desktop frame is empty, the modules are read from the mobile frame instead. When more than half of a desktop frame's direct layers are loose text or shapes rather than frames, groups or instances, the email isn't grouped into modules, and the check fails with that reason, because there's nothing to attach a note to.

### EM-04 The main message and primary CTA sit in the preview area

**Should · House · Judgment · Jill Redo's scorecard, "Preview Pane"**

In desktop Outlook's reading pane, which is where most business readers first see an email, the first 300 or so pixels decide whether the rest is read. The script returns the text and buttons whose top edge is inside the preview area of each desktop frame; the agent decides whether the main message and the primary CTA, or a clear lead into it, are among them. Fail when the preview area holds only a logo and an image.

### EM-05 The email's length suits a scroll

**Could · House · Script · Jill Redo's workshop deck**

Long emails can perform well, but past about six desktop scrolls they need to work like a catalog, with clear sections and repeated CTAs. Pass when the desktop frame is no taller than the house length. Partly above it, and the report suggests sectioning and a repeated CTA rather than cutting content.

## Images off

Classic Outlook for Windows blocks images by default for any sender not on the reader's Safe Senders list, and so do new Outlook and Outlook on the web for work accounts. So for most business readers the email with images off is the first impression ([how images fail to load][images], [which mail apps][apps]).

### EM-06 Every image has alt text or is marked decorative

**Must · Universal · Script · WCAG 1.1.1; Jill Redo's scorecard**

Without alt text, a blocked image is an empty box and a screen reader says nothing useful. The script lists every layer with an image fill and checks each for an alt-text note or a decorative mark. Pass when every image has one. The skill can't see the HTML's `alt` attribute itself, only the design's note of what it should be.

### EM-07 Alt text fits on one line across its image

**Should · Universal · Script · how images fail to load, "What a blocked image looks like"**

Apple Mail, and reportedly Gmail and Yahoo, draw alt text on one line and drop it altogether when that line is wider than the image's box, even when the box is tall enough to wrap it. The reader sees an empty box. The script estimates the longest alt text that fits as the image's width divided by 8.8px, which is about 42 characters at 16px across a 375px box; the research note's estimate is 40 to 45. Alt text up to 10% over the estimate is a flag for the designer to judge, not a fault, because the estimate is deliberately cautious: the 46-character alt text in panel 2 of the TOFU file's alt text panels measures 362px at 16px and fits a 375px box. Fail beyond 10% over. This is an estimate, and the report says so (Steve, 2026-10-05). N/A when no image has an alt-text note.

### EM-08 Headlines, offers and buttons are live text

**Must · Universal · Judgment · how images fail to load, the designing checklist; Jill Redo's scorecard, "bulletproof CTAs"**

With images off, anything inside an image is gone, so the headline, the offer and every button have to be text the mail app draws. The script returns the text layers and the image layers in each frame; the agent checks, from a screenshot of each frame and of any image the frame leaves in doubt, that the email's message and its buttons are text layers, not parts of an image. Fail when the main headline, the offer or a button is an image.

### EM-09 No text sits inside an image, apart from the logo

**Should · Universal · Judgment · WCAG 1.4.5; [D-13][ledger]**

Text inside an image disappears with images off, can't be resized or read aloud, and isn't translated. The agent looks at each image layer, in its own screenshot or clearly enough in a frame's screenshot, and lists any that contain words, other than the logo. Small text in a screenshot isn't reliably readable, so the agent reports "possible text" rather than guessing, and the check tops out at Partly when it can't tell.

### EM-10 Text over an image still reads on the color behind it

**Must · Universal · Script · how images fail to load; Crystal Pacheco, Marketo, 2026-10-01**

Classic Outlook doesn't show background images without Outlook-only code, and Marketo's new email designer can't produce that code, so text laid over a background image sits on whatever color is behind the image. The script finds text layers whose box overlaps, by a fifth or more of its area, an image painted below it at any level, including inside an instance, and works out their contrast against the nearest solid fill behind the image. Pass when there's no such text, or when every one passes EM-19's contrast on that color alone. Fail otherwise.

### EM-11 Every image has a background color behind it

**Should · Universal · Script · how images fail to load, the designing checklist**

A blocked image shows its box, and a box with a color in it reads as a deliberate shape where an empty one reads as a hole. The script checks that each image layer, or the frame that holds it, has a solid fill. Pass when all do.

### EM-31 Alt text describes the image it's on

**Should · Universal · Judgment · WCAG 1.1.1; Steve, 2026-10-07**

Alt text is what a screen reader reads aloud and what Outlook shows when it blocks images, so words that describe a different picture mislead both. EM-06 checks that alt text exists and EM-07 that it fits; this check is whether it's right. The agent compares each image's screenshot with its alt-text note and lists the ones whose words don't describe what's shown. Images marked decorative are left out, and the check is N/A when no image has an alt note. Default rule over the images it looked at, topping out at Partly when some weren't looked at closely; an image seen clearly in a frame's screenshot counts as looked at, as for EM-09 (Steve, 2026-10-08). Where the image is plainly a placeholder, such as an abstract gradient standing in for a photo, the mismatch is a flag to confirm once the final image is in, not a fault. Added after two runs raised it unprompted on 2026-10-06: the run without the skill on the faults file, and the skill's run on the Control.

## Dark mode

Apple Mail and some Outlook apps show the email's own dark theme; the Gmail apps and classic Outlook for Windows recolor the email themselves and never swap an image. Images never invert, so an image made for a light background can vanish on a dark one ([dark mode and accessibility][dark], [D-21][ledger]).

### EM-12 Every image says how it behaves in dark mode

**Should · House · Script · [D-21][ledger]**

The engineer needs to know, per image, whether it has a dark version and what its file is called. The script checks each image layer for a dark-mode note, on the layer or on the nearest layer that holds it ([Notes for the scripts](#notes-for-the-scripts)). Pass when every image has one.

### EM-13 The logo has a reversed version, with no outline or plate

**Should · House · Judgment · [D-21][ledger]**

Under MERGE's policy the logo is the one image that swaps, to the brand's reversed logo, where the mail app supports it. An outline or a light plate behind the logo would make it work in the apps that don't swap, but it breaks the brand, so the policy accepts reduced contrast there instead. The agent finds the logo, by name, then from a note that mentions the logo, then as the first image or vector in the top 120px of the frame, because a logo is often a vector with a default name. It checks that its dark-mode note names a reversed version, or that a dark-mode frame shows one, and looks at it for an outline, a glow or a plate added for dark mode. Fail when there's no reversed version; Partly when one is named but an outline or plate is also present. A client project with a different policy changes this check's rule in the opening question.

### EM-14 Icons are one color that works on light and dark

**Should · House · Script · [D-21][ledger]; WCAG 1.4.11**

Icons don't swap under MERGE's policy, so each icon's color has to hold at least 3 to 1 against both the email's light background and a dark one. The script finds icon layers and computes each fill's contrast against the background behind it and against the dark reference background. Pass when every icon meets 3 to 1 on both. Icons that a project swaps, and say so in their dark-mode note, are left out.

### EM-15 No background is pure white or pure black

**Should · House · Script · [D-21][ledger], from [D-12][ledger]**

Pure white (#FFFFFF) and pure black (#000000) backgrounds set off Outlook.com's own recoloring, which can turn a carefully chosen color into one nobody designed. The script lists frames and shapes in scope whose solid fill is exactly either. Pass when there are none. N/A when a project turns this setting off.

### EM-16 Illustrations read on a dark background too

**Should · House · Judgment · [D-21][ledger]; the Adobe Elevate analysis, 2026-10-02**

A transparent illustration works in both modes only if it's bright enough to read on a dark background, as Adobe's Elevate email showed. If the file has a dark-mode frame, the agent looks at its illustrations there; if not, it views each transparent illustration on the dark reference background from a screenshot, and says it did. Fail when an illustration's main shapes disappear on dark.

## Type

### EM-17 A brand font names its fallback

**Should · Universal · Script · how images fail to load, "The other ways images and their surroundings fail"**

Custom fonts render only in Apple Mail; every other app uses the fallback, so most readers see the fallback and the layout has to work in it. The script lists the font families in use. Pass when every family is web-safe ([Notes for the scripts](#notes-for-the-scripts)), or each brand font has a note naming its fallback; a caption drawn on the canvas isn't a note. Partly when fallbacks are named but nothing in the file shows the email in them.

### EM-18 Type follows the house defaults

**Could · House · Script · Jill Redo's workshop deck, [D-16][ledger]**

These are house guidance, a guide and not law, so a design may depart from them with a reason. The script reports section headings outside the house range, body line heights outside 1.4 to 1.6, centered body paragraphs and all-caps text longer than a short label. The H1 is left out of the headline range, because it may be larger. Everything this check finds is a flag for the designer, so it never lowers a result (Steve, 2026-10-05).

## Accessibility

The target for every project is WCAG 2.2 AA, applied to everything the email controls ([D-13][ledger]).

### EM-19 Text contrast meets WCAG 2.2 AA

**Must · Universal · Script · WCAG 1.4.3; [D-13][ledger]**

Body text needs 4.5 to 1 against its background; large text, 24px regular or about 18.7px bold and up, needs 3 to 1. The script is merge-build-readiness's text-contrast script, which finds each text layer's real background. Logos are exempt under WCAG. Pass when every text layer passes; footer and legal text get no exemption, which is the commonest failure in marketing email. This check has no Partly: it fails when any confirmed pair fails, because a contrast failure isn't half acceptable (Steve, 2026-10-06).

### EM-20 Button edges and meaningful icons meet 3 to 1

**Must · Universal · Judgment · WCAG 1.4.11**

A reader has to be able to see where a button is and what an icon means. The script returns each button's fill and edge colors against what's around it, and each icon under 3 to 1; an icon carries meaning when it alone tells the reader something or what an action does, such as a social link, a play button or an icon-only button, and an icon beside text that says the same thing is decorative and exempt (Steve, 2026-10-08). A button whose fill contrasts with what's around it needs no contrasting edge. For icons this check uses the contrast against the background behind them; EM-14 covers the dark background.

### EM-21 Tap targets are at least 24px, and meet the house size

**Must · House · Script · WCAG 2.5.8; [D-7][ledger]; Jill Redo's scorecard says 40px**

The script is merge-build-readiness's target script, applied to buttons and linked text. Fail below 24px on any project, even where a small target has clear space around it: WCAG 2.5.8 excuses a spaced target, but Steve finds touch targets under 24px hard to hit regardless, so 24px is a hard minimum here (Steve, 2026-10-05). Partly between 24px and the house tap target. Pass at or above it.

### EM-22 Text links are underlined

**Must · Universal · Script · WCAG 1.4.1; [D-13][ledger]**

A link shown by color alone can't be found by a reader who can't tell the colors apart, and many mail apps recolor links anyway. The script finds text ranges with a hyperlink, or in a different color from the rest of their paragraph, and checks their decoration. Pass when every link inside body text, and every standalone text link such as a "Read now" CTA, is underlined. Buttons and a nav row of three or more links are exempt.

### EM-23 There's one H1, and heading levels go in order

**Should · Universal · Script · WCAG 1.3.1; the TOFU build brief, §10**

Screen reader users move through an email by its headings, so the design has to say which text is a heading and at what level. The script reads the heading-level notes. Pass when each email has exactly one H1 and no level is skipped going down the page. Partly when headings are styled as headings but carry no level note.

### EM-24 Link and button text says where it goes

**Should · Universal · Judgment · WCAG 2.4.4; Jill Redo's scorecard**

"Click here", "this link" and "read more" say nothing on their own, which fails screen reader users and performs worse for everyone. The agent reads every link and button text and lists any that doesn't make sense out of context, and the default rule applies over all of them, so vague wording shows in the scorecard (Steve, 2026-10-06).

## Content

### EM-25 Parts that change by audience are marked

**Could · Universal · Script · [D-11][ledger]; the TOFU build brief, §10**

Where an email has versions for different audiences, the engineer needs to know which parts change and which content field each piece of text comes from. The script counts dynamic-content and content-field notes. N/A when the person says in the opening question that the email has one version only, though the report still lists any merge tags and whether each has a content-field note, without changing the result (Steve, 2026-10-08). Otherwise Pass when the parts that change carry dynamic-content notes and their text carries content-field notes, and the report lists any merge tags it finds.

### EM-26 There's one primary CTA, as a button, repeated rather than varied

**Should · Universal · Judgment · Jill Redo's workshop deck, "CTA Repetition, Not CTA Variety"**

The same CTA, repeated where it fits, outperforms several competing ones. The agent lists the buttons and their text and checks that one action leads, is a button rather than a text link, and that any repeat says the same thing.

### EM-27 A written preheader is shown

**Should · Universal · Script · the TOFU build brief, §10**

Without a written preheader the inbox shows whatever text comes first, which is often "View in browser" or the logo's alt text. The script looks for a text layer or a note named as the preheader. Pass when each email has one. A note that only asks for a preheader doesn't count as one.

### EM-28 The footer has an unsubscribe link and the sender's address

**Must · Universal · Script · the US CAN-SPAM Act; the TOFU build brief, §10**

Commercial email in the US must carry a working way to opt out and the sender's physical postal address, and other countries' laws ask for at least as much. The script searches the footer's text for an unsubscribe link and an address. The unsubscribe's link is stated in a Link or CTA note rather than set as a Figma hyperlink, because the real URL is usually set by the developer; where the designer knows it, the note gives it (Steve, 2026-10-06). Fail when the unsubscribe or the address is missing. Partly when both are there but the unsubscribe has no Link or CTA note. Pass when both are there and the note is. The report also notes a missing privacy policy or preferences link, which is house practice rather than law, without changing the result.

## Export

### EM-29 Images export as JPG or PNG

**Should · Universal · Script · how images fail to load, "The other ways images and their surroundings fail"**

Mail apps show JPG, PNG and GIF; classic Outlook shows neither SVG, WebP nor AVIF. The script reads each image layer's export settings. Fail when any is set to SVG or PDF. Partly when some image layers have no export setting, since the engineer will then choose. Figma can't export a GIF, so an animation's first-frame rule is left to the build.

### EM-30 Image slices stay under the house height

**Could · House · Script · Jill Redo's workshop deck, [D-16][ledger]**

Very tall image slices render poorly and load slowly, especially on phones. The script lists image layers taller than the house slice height. Pass when there are none.

## What the skill can't check in Figma

Some things that decide whether an email works exist only in the HTML or the send, so the report lists them under one fixed line instead of scoring them, and points to the build brief and a real test send: the HTML's weight against Gmail's clip at about 102KB, Outlook-only code, the `alt` attributes themselves, the dark-mode code, tracked links, and how each mail app actually renders. The skill can still warn on a design choice that drives weight, such as a module drawn as two different designs for mobile and desktop, because both versions go into the HTML.

## Notes for the scripts

**Notes on a layer** are read from Dev Mode annotations in three ways, in this order, because projects differ. First, a category whose name matches one of the TOFU file's eight (Alt text, Decorative image, Heading level, Link or CTA, Dark mode, Dynamic content, Mobile behavior, Content model field), compared without case. Second, an annotation in any category whose text starts with one of those names followed by a colon, such as "Alt text: A doctor talking with a patient". Third, Figma's preset categories, where an Accessibility annotation mentioning "alt" counts as alt text. A note on the nearest layer that holds a layer counts as that layer's note, because a layer inside an instance can't carry its own. A note that only suggests something, such as one starting "Suggestion", counts toward Partly at most. A file that uses none of these gets Couldn't check on the annotation checks, and the report suggests the schema.

**Finding layers.** Images are layers with a visible image fill. The logo is an image or vector whose name contains "logo". Icons are vectors, or instances named "icon", no larger than 48px. Buttons are frames or instances whose name contains "button", "btn" or "cta", or that hold one short text layer on a filled, rounded shape. The preheader is a text layer or note named "preheader", and the footer is the last module in a frame, or one named "footer". The agent confirms each guess from a screenshot and says which it corrected.

**Web-safe fonts** for EM-17 are Arial, Helvetica, Georgia, Times New Roman, Verdana, Tahoma, Trebuchet MS and Courier New. Segoe UI and San Francisco are system fonts that only some readers have, so they count as brand fonts here.

**Reuse.** The scope and fingerprint scripts start from merge-build-readiness 0.2's scripts 00 and 10, and EM-19's and EM-21's logic from its scripts 08 and 09, without WCAG's spacing exception; the pass over every mode of a bound color variable was cut and then put back on 2026-10-05. They're copied, not shared, because a Figma skill is one file. The checks run from two scripts, `01-layout.js` and `02-images.js`, each carrying its own copy of the shared helpers, because Figma's agent rejects any script over 20,000 characters ([scripts/README.md](scripts/README.md))).

## Open questions

- **TBD:** whether EM-04's preview area should also apply to the mobile frame. Jill Redo's scorecard ties it to desktop and B2B readers.
- **TBD:** the dark reference background. #121212 is a stand-in; the real value differs by app and isn't published.

## Version history

- **0.5.0 (2026-10-08):** Steve's rulings on the questions from the Claude Code version's first run: EM-20 gains a test for which icons carry meaning; EM-25 is still N/A with one version but lists merge tags and their content-field notes; EM-09 and EM-31 count an image seen clearly in a frame's screenshot as looked at.
- **0.4.2 (2026-10-08):** A link to the scripts README that had been pasted twice is repaired, with no change in meaning.
- **0.4.1 (2026-10-08):** Clarifications from the Claude Code runs of cases 1 and 2, with no check changed in meaning: an empty email is N/A on everything but EM-01, EM-17 doesn't take a canvas caption as a note, and EM-31 is N/A with no alt notes.
- **0.4.0 (2026-10-07):** EM-31, alt text describes the image it's on, added at Steve's request, as a Should and Judgment check in the images-off group.
- **0.3.1 (2026-10-06):** The Reuse note describes the split into a layout script and an images script. No check changed.
- **0.3.0 (2026-10-06):** Steve's rulings of 2026-10-06: EM-19 has no Partly, EM-24 uses the default rule, and EM-28's unsubscribe link is stated in a Link or CTA note. Also aligned with SKILL.md after its first audit: EM-07 is N/A with no alt notes, EM-08 names the offer and how it's screenshotted, EM-13 accepts a dark-mode frame as evidence, EM-15 is N/A when the setting is off, EM-20 says a contrasting fill needs no edge, EM-25 gets a Pass rule, and the Reuse note records the color-mode pass coming back.
- **0.2.0 (2026-10-05, text aligned with the scripts 2026-10-06):** Changes from testing the scripts at build step 3 and Steve's three rulings. Flags are defined. EM-01 treats empty frames as missing and unwraps presentation frames; EM-03 fails emails not grouped into modules; EM-07's near misses are flags; EM-10's overlap rule is set and its open question closed; EM-12 and the other note checks accept a note on the holding layer, and suggestion notes count toward Partly at most; EM-13 finds unnamed logos; EM-18 leaves out the H1 and only flags; EM-21's 24px is a hard minimum; EM-22 covers standalone text links; EM-27 doesn't count a request for a preheader.
- **0.1.0 (2026-10-05):** First draft: 30 checks in seven groups, two tiers, and the house settings. Steve approved it the same day.

[images]: https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/research/2026-10-01%20how%20images%20fail%20to%20load%20in%20email.md
[apps]: https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/research/2026-10-02%20which%20mail%20apps%20our%20readers%20use.md
[dark]: https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/research/2026-09-24%20dark%20mode%20and%20accessibility%20in%20email.md

[ledger]: https://github.com/sbrown-merge/merge-marketing-email-specs/blob/main/DECISIONS.md

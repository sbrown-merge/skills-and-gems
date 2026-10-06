# Case 3a, without the skill, in Figma's agent, 2026-10-06

This is the baseline run for case 3a of [EVAL.md](../EVAL.md), page 01 Faults of the deliberate-faults file. Steve ran it in Figma's agent, in a fresh session, with the plain prompt from [eval-prompts.md](../eval-prompts.md) and the page as its scope. The model is undisclosed. The report the agent gave is first, word for word as Steve pasted it apart from the Figma link tags, which are shown here as the node IDs they pointed to. Our scoring against EVAL.md's expected results follows it.

## Scoring against the expected results

These scores are for Faults A, the email that carries nearly all the faults. A check counts as matched when the report names the same problem on the same layer; partly matched when it names the problem loosely or misses part of it; missed when it says nothing, or says the opposite.

| Result | Count | Checks |
| --- | --- | --- |
| Matched | 16 | EM-01 (Faults B and C), EM-06, EM-08, EM-09, EM-17, EM-18 (3 of its 4 flags; not the 32px heading), EM-19, EM-20, EM-21, EM-22, EM-23, EM-24, EM-25, EM-27, EM-29, EM-30 |
| Partly matched | 6 | EM-10 (says to test the white headline over the image, but not that it's white on white with images off), EM-13 and EM-16 (a general "check the logo and dark illustration in real clients"), EM-14 (the light-background icon only, not the one that fails on dark), EM-26 ("simplify competing actions"), EM-28 (the missing address, not the unsubscribe's missing link note) |
| Missed | 8 | EM-02 and EM-07, which the report rejects outright ("not an email best-practice violation", "length alone is not a failure"); EM-03 on Faults A; EM-04 (it reports the first prominent button at about 2,085px rather than what fills the first 300px); EM-05; EM-11; EM-12; EM-15 |

On the other emails it found Faults B's missing mobile frame and Faults C's empty desktop frame, treated the 1280px mail-app frame correctly as a shell, and noticed Faults D's loose layers but called them "not itself a rendering defect".

It also raised four things no EM check covers: the banner's "this week only" against the offer's "end of the month"; the source images totalling about 1.27MB, against Jill Redo's guidance of under about 500KB; alt texts that don't describe the placeholder artwork they sit on; and that a note saying an image works in both modes isn't evidence it does.

## What it means for the skill

The baseline does well on what a reviewer sees on the canvas, such as images with words, contrast, link styling and small targets, and it reads notes and export settings unprompted. What it misses are the checks that rest on MERGE's rulings and research: the mobile-left review order (D-19), alt text that Apple Mail drops when it's too long, mobile-behavior and dark-mode notes on every module and image, pure white backgrounds, the preview area and the house length. So the skill earns its place on those checks, and the run with the skill should show it.

Two of its extra findings are candidates for new checks: total image weight, which Jill Redo's deck sets at under about 500KB and which the agent measured from the image bytes, and alt text that doesn't describe its image. **TBD:** Steve decides whether either becomes a check.

## The report

> # Email Design Review
>
> I reviewed all email layouts on the selected page without changing them.
>
> **Overall recommendation:** Address the following before sending, especially in Faults A (6:2).
>
> ## Highest-Priority Fixes
>
> | Finding | Recommendation |
> |---|---|
> | **Image-dependent content and CTA.** The promotional banner (6:19) and Shop now button (6:26) contain baked-in text. | Use live text and an HTML button so the message and action survive blocked images. |
> | **Conflicting promotion deadlines.** The banner says "this week only"; the offer (6:20) says "before the end of the month." | Align the deadline and offer terms throughout. |
> | **Primary action appears late.** The first prominent button starts about 2,085 px down on desktop and 1,953 px on mobile. | Place one clear primary CTA immediately after the opening value proposition; simplify competing actions. |
> | **Footer readability and compliance gap.** The footer (6:65) lacks a postal address. Its legal text is 11 px with approximately **2.61:1 contrast**, below the 4.5:1 normal-text target. | Add the sender's valid postal address where required, increase text size, and darken it. Retain the unsubscribe link and confirm it works. |
> | **Personalization is unresolved.** The greeting (6:10) still reads "Hi [First Name],". | Document the sending-platform merge field and a safe fallback, such as "Hi there,". |
>
> ## Accessibility and Readability
>
> - **Links need clearer labels and styling.** In the intro (6:11), replace "Click here" with "Explore planning tools." Replace Read more (6:61) with a destination-specific label. Underline inline links rather than relying on blue alone.
> - **Some controls are small.** The Book a demo button (6:57) is 36 px tall; the event-calendar link (6:62) occupies a 20 px-high box. Aim for comfortable mobile hit areas around 44 px high.
> - **Body leading is tight.** The trial paragraph (6:12) uses 120% line height. Around 150% would improve reading comfort. Left-align the offer paragraph (6:22) and reduce all-caps copy.
> - **Heading semantics need correction.** Existing annotations identify the first section heading (6:14) as H3 and the offer heading (6:21) as another H1. Specify one main H1 followed by logical H2 sections.
> - **Alt-text handoff is incomplete.** The first gallery image (6:47) has no alt-text annotation; the second (6:48) has only a suggestion. Several descriptions do not match the visible placeholder artwork. Finalize accurate, purpose-based alt text—or empty alt text for decorative images. Length alone is not a failure.
> - **Contrast needs attention beyond text.** The calendar icon (6:37) is approximately 1.92:1 against white, and the outlined button border (6:59) is approximately 1.36:1. Strengthen meaningful visual cues. Also test the white hero headline across its varying image background.
>
> ## Assets and Email Compatibility
>
> - **Add a preheader.** The header (6:4) contains only a suggestion, not finalized preview copy.
> - **Plan font fallbacks.** Inter and Playfair Display are not consistently supported by email clients. Specify email-safe fallback stacks and check reflow.
> - **Optimize images.** The inspected unique source images total about **1.27 MB** before delivery optimization. The 600 × 1700 image slice (6:64) also lengthens the email substantially; replace meaningful content with smaller live-text modules.
> - **Correct asset export handoff.** One gallery image (6:52) is configured for SVG export, which has inconsistent email support; another (6:53) has no export setting. Supply optimized JPG/PNG assets.
> - **Dark mode remains unproven.** Notes saying the same image works in both modes are not test evidence. Check the logo, dark illustration, transparent areas, and buttons in actual clients.
>
> ## Other Layouts on the Page
>
> - Faults B desktop (8:5): no mobile counterpart. Its **640 px width is not inherently a failure**; responsive behavior matters more than an exact 600 px rule.
> - Faults C desktop (8:39): empty, so desktop coverage is missing.
> - Faults D desktop (8:59): mostly loose layers. Grouping into modules would improve handoff, but is not itself a rendering defect.
> - The mail-app preview (7:12) is a 1280 px shell containing a 600 px email—not an oversized email.
> - Placing the mobile design to the right on the canvas is **not an email best-practice violation**.
>
> ## What's Already Working
>
> - Desktop and mobile versions exist for the main email.
> - Most body copy is 16 px.
> - Mobile gutters are 20 px.
> - The gallery adapts from three columns to two.
> - Unsubscribe and privacy links are visible.
>
> ## Before Sending
>
> Test Gmail, Outlook, and Apple Mail with:
> - Mobile widths
> - Dark mode
> - Images disabled
>
> Final link destinations, actual HTML semantics, HTML clipping size, unsubscribe behavior, and deliverability cannot be confirmed from the design alone.

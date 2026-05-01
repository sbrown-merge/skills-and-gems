---
name: vibe-prompt-architect
description: >
  Guides the user through building a high-quality, structured prompt for vibe-coding tools
  like Claude Code, Figma Make, and Lovable. Use this skill whenever the user wants to
  generate, improve, or structure a UI prompt for any AI-powered prototyping or code-generation
  tool. Trigger on phrases like: "help me prompt", "write a vibe-coding prompt", "I want to
  build a UI with AI", "prompt for Figma Make / Lovable / Claude Code", "help me describe a
  screen", "create a prototype prompt", or any request to build or iterate on a UI using an
  AI tool. Also trigger when the user shares a rough idea for an interface and wants AI to
  build it — even if they don't mention prompting explicitly.
---

# Vibe Prompt Architect

A structured, three-phase workflow for turning a rough UI idea into a refined, copy-ready
prompt for vibe-coding platforms (Claude Code, Figma Make, Lovable, Cursor, v0, etc.).

---

## Workflow Overview

**Phase 1 — Gather:** Ask targeted questions to collect the inputs needed for a strong prompt.  
**Phase 2 — Clarify:** Identify gaps, ambiguities, or conflicts in the inputs and resolve them.  
**Phase 3 — Generate:** Synthesize inputs into a structured TC-EBC prompt in Markdown.

Work through the phases sequentially. Never skip to output until Phase 2 is complete.

---

## Phase 1: Gather Inputs

Introduce yourself briefly, then work through the questions below **one at a time**. Ask
one question, then stop and wait for the user's reply before moving to the next.

### Cadence Rules
- **One question per turn.** Never combine multiple questions in a single message.
- **Pre-populate from context.** If the user's opening message already answers a question,
  silently record that answer and skip to the next unanswered one.
- **Skip/next handling.** If the user replies with "next", "skip", "pass", "N/A", or
  anything clearly indicating they want to move on, acknowledge briefly and advance to the
  next question without pressing for an answer. Mark that input as unspecified.
- **Clarify in-line.** If a reply is ambiguous, ask a single follow-up before moving on —
  don't stockpile ambiguities for later.
- **No backtracking pressure.** If a user skips a question, don't return to it unless they
  raise it themselves.

### Question Sequence

Ask these in order. The question text below is a guide — adapt the wording naturally to
the conversation; don't read it verbatim.

1. **Platform** — Which tool will receive this prompt? *(Claude Code, Figma Make, Lovable,
   Cursor, v0, or another tool?)*
2. **UI Type** — What kind of interface are you building? *(A screen, component, flow,
   modal, widget — or something else?)*
3. **Product & User** — What kind of app or product is this for, and who is the user?
4. **User Moment** — What just happened before the user arrives at this screen, and what
   do they do next?
5. **Required Elements** — What specific UI components, content, or features must be
   present? *(List everything you know is required.)*
6. **Behaviors** — How should the UI respond to interaction? *(States, transitions,
   conditional logic, animations?)*
7. **Constraints** — Any rules to lock in? *(Platform — iOS/Android/Web, grid, spacing,
   accessibility needs, brand rules?)*
8. **Design System / Tokens** — Do you have a component library, UI kit, or design tokens
   to reference? *(Name it if so.)*
9. **Make Kit** *(ask only if Platform = Figma Make)* — Does this Figma Make project have
   a Make Kit attached? *(A Make Kit bundles components, styles, tokens, and explicit usage
   instructions that Figma Make is designed to follow. If one is attached, it becomes the
   authoritative source for all design decisions.)*
10. **Reference Images** — Do you have any screenshots, existing screens, or inspiration
    images to attach alongside the prompt?
11. **Scope** — Are you targeting a single component, one screen, or a multi-screen flow?
12. **Prototype Type** — Are you building a functional prototype (real interactions, logic,
    and data) or a design mockup (visual fidelity and click-through flows)?
13. **Acceptance Criteria** — How will you know the output succeeded? Are there specific
    layout, behavior, or functional requirements you'd use as a pass/fail checklist?
    *(If they're unsure, offer to derive AC from the Elements, Behavior, and Constraints
    they've already described.)*

After the final question, confirm the full picture back to the user in a brief summary
before moving to Phase 2.

**Prompt-drift prevention note:** When Platform is Figma Make or another metered tool,
mention once — naturally, not as a formal warning — that refining the prompt here saves
credits later.

---

## Phase 2: Clarify and Analyze

After gathering inputs, review them before generating. Look for:

### Ambiguity Flags
- Vague adjectives: "modern", "clean", "professional" → ask for specifics ("16px radius
  corners and a muted surface palette" beats "clean")
- Missing user context: who is performing the action, and why?
- Underspecified behaviors: "a form" without describing what happens on submit
- Conflicting constraints: dark mode requested but brand colors not adapted

### Scope Flags
- Too broad: "design the whole app" → prompt for one screen at a time
- Too narrow: single button with no surrounding context → suggest minimal screen frame

### Design System Flags
- If a design system exists but wasn't mentioned: prompt the user to reference it explicitly,
  since referencing library components and tokens dramatically improves output fidelity
- If no design system: note that the AI will make stylistic choices freely; suggest setting
  at least a color and type constraint to avoid generic output

### Make Kit Flag *(Figma Make only)*
- If the target is Figma Make, always ask: **"Does this project have a Make Kit attached?"**
- If yes: the Make Kit is the single source of truth for all components, styling values,
  and usage rules. The generated prompt must instruct Figma Make to use the Make Kit
  exclusively and never override its explicit instructions.
- If no: treat the project's linked Figma component library and variables as the fallback
  source of truth, and note that styling will be at AI discretion beyond what's linked.

### Acceptance Criteria Flags
- If the user provided AC: check that every criterion is **binary and verifiable** — it
  must be possible to look at the output and say yes or no. Flag anything vague ("looks
  polished," "feels right") and help restate it as a checkable condition.
- If the user skipped AC: derive a starter set from the most critical items in Elements,
  Behavior, and Constraints. Present these to the user for confirmation before generating.
- **Functional prototype AC** should include interaction checks: does the logic fire
  correctly, do states transition as specified, does conditional behavior work?
- **Design mockup AC** should focus on visual inspection: are all elements present, do
  spacing and tokens match the spec, are states visually distinguishable?
- Every AC item must be traceable back to a specific Element, Behavior, or Constraint.
  If it can't be traced, it's either a missing requirement or out of scope — clarify which.

### Platform Flags
- iOS vs. Android vs. Web have different safe areas, navigation patterns, and interaction
  conventions — confirm which is intended if ambiguous
- If targeting Figma Make: confirm whether a Make Kit is attached — it supersedes all
  other design decisions when present

Ask any clarifying questions in a single message. Summarize what you understood, flag what's
unclear, and wait for the user to confirm before proceeding.

---

## Phase 3: Generate the TC-EBC Prompt

Once inputs are confirmed, synthesize a structured prompt using the TC-EBC framework.

### TC-EBC Framework

The TC-EBC framework turns vague UI ideas into precise, executable instructions.

**T — Task**  
One clear sentence. What should the AI build? Avoid adverbs and fluff.  
Format: `[Action] a [UI type] for [product/context].`

**C — Context**  
Where does this screen live in the product flow? Who is the user and what do they want?  
Include: user type, prior step, emotional state if relevant, and what success looks like.

**E — Elements**  
List every required UI component explicitly. If a component is absent from this list, the AI
may omit it or invent an alternative. Be exhaustive.  
Include: named components, content (real or placeholder), hierarchy, and any icon or imagery needs.

**B — Behavior**  
Describe the interaction logic. What happens on tap, hover, scroll, or input?  
Include: interactive states (default, hover, active, disabled, error, loading), transitions,
conditional logic (e.g., "button only active when field is valid"), and any animations.

**C — Constraints**  
Define the rules. This is where design system references, grid systems, and brand tokens go.  
Include: platform, viewport/breakpoint, grid and spacing units, accessibility requirements,
color/type/elevation rules, and any explicit prohibitions.

---

### Output Format

Deliver the prompt as a native Markdown code block, ready to copy into any code editor or
vibe-coding tool. Use this structure exactly:

````markdown
# Vibe-Coding Prompt
**Target platform:** [tool name]
**Scope:** [screen / component / flow]
**Prototype type:** [Functional prototype / Design mockup]

---

## Task
[One sentence describing what to build.]

## Context
[2–4 sentences: product type, user, prior step, goal of this screen.]

## Elements
- [Component or content item]
- [Component or content item]
- [Continue for all required elements]

## Behavior
- [Interaction or state description]
- [Interaction or state description]
- [Continue for all behaviors]

## Constraints
- **Platform:** [iOS / Android / Web / Responsive]
- **Grid:** [e.g., 8pt grid, 24px margins]
- **Design system:** [e.g., shadcn/ui, Material 3, custom — or "none specified"]
- **Tokens:** [e.g., primary #0057FF, type scale: Inter 14/20 body — or "AI discretion"]
- **Accessibility:** [e.g., WCAG AA contrast, tap targets ≥ 44px]
- [Any additional constraints or explicit prohibitions]

<!-- Include the following block only when target is Figma Make AND a Make Kit is attached -->
## Make Kit (Figma Make only)
Use the Make Kit attached to this project as the single source of truth for all design
decisions. Specifically:
- Use only components defined in the Make Kit. Do not introduce components from outside it.
- Apply only the styling values (color, typography, spacing, elevation, radius) defined in
  the Make Kit. Do not override these values with your own defaults.
- Follow the explicit usage instructions in the Make Kit exactly. Where the Make Kit
  specifies how a component should be used, applied, or combined, treat those instructions
  as non-negotiable rules — not suggestions.
- If a required element has no Make Kit equivalent, flag it rather than substituting a
  generic component.

## Acceptance Criteria
<!--
  Functional prototype: mix of interaction checks and visual checks.
  Design mockup: visual inspection checks only.
  Every item must map to a specific Element, Behavior, or Constraint above.
  Write each as a binary, checkable statement — pass or fail, no gradients.
-->
- [ ] [Checkable condition — visual, behavioral, or functional]
- [ ] [Checkable condition]
- [ ] [Continue for all critical requirements]

---

*Generated with the TC-EBC framework. Refine in a text editor before running in [tool name].*
````

---

## Post-Generation Guidance

After delivering the prompt, offer the following in a brief note (not a wall of text):

1. **Scope tip:** If this is a multi-screen flow, suggest splitting into one prompt per screen.
2. **Design system tip:** If they have a component library or token file, suggest referencing
   it explicitly by name in the Constraints block.
3. **Iteration tip:** After the first AI output, use "Point-and-Edit" or inline feedback rather
   than re-running the full prompt — most tools treat targeted edits as cheaper operations.
4. **Reference image tip:** If they have a screenshot or inspiration image, suggest attaching
   it alongside the prompt — visual context beats verbal description for layout fidelity.
5. **AC tip:** Before iterating on the output, run down the Acceptance Criteria checklist
   first. Identify exactly which items passed and which failed — then write the next prompt
   as a targeted fix for the failures, not a general revision.

---

## Key Principles (always in effect)

- **Specificity beats style.** "Inter 16px/24px medium weight" beats "modern typography."
- **Elements list is exhaustive.** Anything not listed may be omitted or hallucinated.
- **One screen at a time.** Break multi-screen flows into sequential prompts.
- **Design system = ingredient list.** If a system exists, the AI should cook from it, not
  freestyle.
- **Make Kit is law.** For Figma Make projects with an attached Make Kit, it is the
  non-negotiable source of truth for components, styling values, and usage rules. The
  prompt must state this explicitly and prohibit any override.
- **AC makes iteration precise.** Vague dissatisfaction leads to vague reruns. A checklist
  of binary criteria turns "something's off" into a specific, fixable list of failures.
- **Prototype type shapes AC.** Functional prototype criteria include interaction and logic
  checks; design mockup criteria focus on visual inspection. Both use the same binary
  format — the subject matter differs, not the standard.
- **Prompt drift is real.** In metered tools, refine before running, not after.
- **Platform matters.** iOS, Android, and Web have different safe zones, nav patterns, and
  touch targets — always confirm.

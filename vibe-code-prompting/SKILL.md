---
name: vibe-prompt-architect
description: >
  Guides the user through building a high-quality, structured prompt for vibe-coding tools
  like Claude Code, Figma Make, Google Stitch, and Lovable. Use this skill whenever the user wants to
  generate, improve, or structure a UI prompt for any AI-powered prototyping or code-generation
  tool. Trigger on phrases like: "help me prompt", "write a vibe-coding prompt", "I want to
  build a UI with AI", "prompt for Figma Make / Lovable / Claude Code / Stitch", "help me describe a
  screen", "create a prototype prompt", or any request to build or iterate on a UI using an
  AI tool. Also trigger when the user shares a rough idea for an interface and wants AI to
  build it — even if they don't mention prompting explicitly.
---

# Vibe Prompt Architect

A structured, three-phase workflow for turning a rough UI idea into a refined, copy-ready
prompt for vibe-coding platforms (Claude Code, Figma Make, Google Stitch, Lovable, Cursor,
v0, etc.).

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

### Raw Value Translation

Apply this logic continuously throughout Phase 1. Whenever a user's reply contains a raw
design value — a hex color, an rgba/hsl expression, a pixel or point measurement, a named
font size, or a hard-coded radius — intercept it, translate it to the closest semantic
token name, and inform the user before moving to the next question.

**What to detect:**
- **Color** — hex codes (`#0057FF`, `#fff`), `rgb()`, `rgba()`, `hsl()`, named CSS colors (`coral`, `steelblue`)
- **Typography** — raw font sizes (`16px`, `1rem`, `14pt`), raw line heights (`24px`, `1.5`), font weight numbers (`700`, `400`)
- **Spacing** — raw margin, padding, gap, or grid values (`8px`, `24pt`, `1.5rem`)
- **Radius** — raw border-radius values (`4px`, `8px`, `50%`, `9999px`)

**How to translate — use this closest-match logic:**

*Color:* Map to a semantic role based on perceived visual function in context:
- Dominant brand color → `--color-primary`
- Lighter/secondary brand color → `--color-secondary`
- Page/component background → `--color-surface` or `--color-background`
- Text on light backgrounds → `--color-on-surface`
- Text on dark/colored backgrounds → `--color-on-primary`
- Error or destructive states → `--color-error`
- Success states → `--color-success`
- Warning states → `--color-warning`
- Borders and dividers → `--color-border`
- Muted/placeholder text → `--color-text-subtle`

*Typography:* Map by relative scale position rather than absolute value:
- ≤ 11px / 0.6875rem → `--font-size-xs`
- 12–13px / 0.75–0.8125rem → `--font-size-sm`
- 14–15px / 0.875–0.9375rem → `--font-size-md`
- 16px / 1rem → `--font-size-base`
- 18–20px / 1.125–1.25rem → `--font-size-lg`
- 22–26px / 1.375–1.625rem → `--font-size-xl`
- 28–36px / 1.75–2.25rem → `--font-size-2xl`
- ≥ 40px / 2.5rem → `--font-size-3xl`
- Line heights: numeric ratios map to `--line-height-tight` (≤1.3), `--line-height-normal` (1.4–1.6), `--line-height-relaxed` (≥1.7)
- Font weights: 300–400 → `--font-weight-regular`, 500–600 → `--font-weight-medium`, 700+ → `--font-weight-bold`

*Spacing:* Map to a T-shirt scale based on an 8pt grid:
- 2–3px → `--space-2xs`
- 4px → `--space-xs`
- 8px → `--space-sm`
- 12px → `--space-md`
- 16px → `--space-lg`
- 24px → `--space-xl`
- 32px → `--space-2xl`
- 40–48px → `--space-3xl`
- ≥ 64px → `--space-4xl`

*Radius:* Map to semantic scale:
- 0px → `--radius-none`
- 2–3px → `--radius-xs`
- 4px → `--radius-sm`
- 6–8px → `--radius-md`
- 10–16px → `--radius-lg`
- 20–28px → `--radius-xl`
- 50% or 9999px (pill/circle) → `--radius-full`

**How to notify the user:**
After receiving a reply containing raw values, show the translations inline — before
asking the next question — in this format:

> I've translated your raw values to token names for the prompt:
> - `#0057FF` → `--color-primary`
> - `16px` → `--font-size-base`
> - `24px` margins → `--space-xl`
>
> Let me know if any of these don't match what you intended, otherwise I'll move on.

**Important edge cases:**
- If the user has named a design system (e.g., shadcn/ui, Material 3, Tailwind), prefix token names to match that system's conventions where known (e.g., Tailwind: `text-base`, `bg-primary`, `rounded-md`, `p-6`; Material 3: `md-sys-color-primary`, `md-sys-typescale-body-large`).
- If no design system is named, use the generic `--token-name` CSS variable convention above.
- If a raw value is genuinely ambiguous (e.g., `#888888` could be border, muted text, or disabled state), ask the user which semantic role it plays before assigning a token name.
- Never silently discard a raw value. Always translate or ask.

### Grid Conformance

Apply this logic alongside Raw Value Translation throughout Phase 1. All spacing and radius values — whether entered as raw pixels or as values that will map to spacing/radius tokens — must conform to an **8px base grid**. A **4px microgrid** is also acceptable for fine-grained spacing (e.g., internal component padding, icon gaps).

**What is grid-conformant:**
- Any multiple of 8px: 8, 16, 24, 32, 40, 48, 64, 72, 80... ✅
- Any multiple of 4px (microgrid): 4, 12, 20, 28, 36, 44, 52... ✅
- `0` and `50%` / `9999px` (pill/full radius) ✅
- Token names already in the spacing or radius scale ✅ (no check needed — the scale is pre-aligned)

**What is not grid-conformant:**
- Any spacing or radius value that is not a multiple of 4px: 3px, 5px, 7px, 10px, 13px, 15px, 17px, 22px, 25px... ❌
- Unitless values used as spatial measurements that don't land on a 4px multiple ❌

**How to correct off-grid values:**
Round to the nearest 4px multiple (using standard rounding — .5 rounds up). Then translate the corrected value to its token name using the spacing or radius mapping table. Never translate the original off-grid value directly — always correct first, then tokenise.

Rounding examples:
- `3px` → nearest 4px multiple is `4px` → `--space-xs`
- `5px` → nearest 4px multiple is `4px` → `--space-xs`
- `6px` → nearest 4px multiple is `8px` → `--space-sm`
- `10px` → nearest 4px multiple is `8px` (not on 8px grid but on 4px microgrid — keep as `12px` if closer) → `--space-md`
- `13px` → nearest 4px multiple is `12px` → `--space-md`
- `15px` → nearest 4px multiple is `16px` → `--space-lg`
- `22px` → nearest 4px multiple is `24px` → `--space-xl`
- `25px` → nearest 4px multiple is `24px` → `--space-xl`
- `5px` radius → nearest 4px multiple is `4px` → `--radius-sm`
- `10px` radius → nearest 4px multiple is `8px` → `--radius-md`

**Prefer 8px-grid values over 4px-microgrid values for primary layout spacing.** Reserve 4px microgrid values for fine-grained contexts: internal component padding, gap between icon and label, inline spacing between small elements.

**How to notify the user:**
Bundle the grid correction and the token translation into a single notification. Show the original value, the reason it was corrected, the corrected value, and the resulting token:

> I noticed some spacing values that aren't on the 8px grid. I've rounded them to the nearest grid-conformant value and translated them to tokens:
> - `13px` margin → not on 4px grid → rounded to `12px` → `--space-md`
> - `22px` padding → not on 4px grid → rounded to `24px` → `--space-xl`
> - `5px` radius → not on 4px grid → rounded to `4px` → `--radius-sm`
>
> Using an 8px base grid (with 4px microgrid for fine details) keeps spacing consistent and predictable across the design. Let me know if you'd like to adjust any of these.

**Proactive grid guidance (Q7 — Constraints):**
When the user answers Q7 (Constraints), if they have not specified a grid system, add a brief note recommending the 8px grid before moving to Q8:

> Just to note — if you haven't locked in a grid system yet, I'd recommend an 8px base grid (with 4px microgrid for fine details). It's the most widely used spacing convention in production design systems and keeps your layout consistent. I'll apply it to any spacing values you give me. Want to use that, or do you have a specific grid in mind?

### Guidelines File Support

When the user indicates they have a **DESIGN.md**, a platform guidelines file, or any other
agent-readable design rules file, treat it as the authoritative source for token values.
Do not ask the user to re-enter token values manually — instead, instruct the generated
prompt to read them from the file.

**DESIGN.md — structure and token hierarchy:**

DESIGN.md (Google Stitch's open-source format, Apache 2.0) has two parts:

1. **YAML front matter** — machine-readable design tokens in three tiers:
   - *Primitive tokens* — raw values: `colors.brand-blue-60: "#1A73E8"`, `spacing.4: 16px`
   - *Semantic tokens* — role-mapped references: `colors.primary: {colors.brand-blue-60}`, `spacing.lg: {spacing.4}`
   - *Component tokens* — component-scoped assignments: `components.button.background: {colors.primary}`
   - Also includes: `rounded` (border-radius scale: xs/sm/md/lg/xl/full), `typography` (h1–caption with fontFamily, fontSize, fontWeight, lineHeight, letterSpacing), `name`, `version`, `description`

2. **Markdown body** — human-readable "vibe" sections explaining design rationale:
   - Overview / Brand & Style, Colors, Typography, Layout & Spacing, Elevation & Depth, Shapes, Components, Do's and Don'ts
   - Prose may use descriptive names ("Midnight Forest Green") that correspond to YAML token names (`colors.primary`)

**Token reference convention in DESIGN.md:**
Cross-references use `{path.to.token}` syntax: `{colors.primary}`, `{spacing.lg}`, `{rounded.md}`.
When writing a prompt that references a DESIGN.md, use this dot-path syntax rather than
CSS variable `--token-name` convention.

**DESIGN.md token naming in prompts:**
| Category | DESIGN.md convention | CSS variable equivalent |
|---|---|---|
| Color | `colors.primary` | `--color-primary` |
| Spacing | `spacing.lg` | `--space-lg` |
| Radius | `rounded.md` | `--radius-md` |
| Typography | `typography.h1` | `--font-size-h1` / `--line-height-h1` |
| Component | `components.button.background` | `--button-background` |

**Raw Value Translation interaction:**
If a DESIGN.md is confirmed, skip manual token translation for values already defined in
the file. If the user enters a raw value that conflicts with a DESIGN.md token, flag the
conflict and ask which should take precedence — the file or the manual override.

**Other guidelines files:**
- Cursor `.cursorrules`, Claude Code `CLAUDE.md`, or similar: instruct the prompt to
  reference design rules from those files by name, using the same "read before generating"
  instruction pattern.
- Platform-specific guidelines (Apple HIG, Material Design): reference by name in
  Constraints; no special token syntax required.

### Accessibility Requirements

Apply this logic to every generated prompt, regardless of whether the user mentions
accessibility. WCAG 2.2 AA is the unconditional baseline. AAA is opt-in (see Q14).

**Standing AA requirements — always include in every prompt's Constraints block:**

*Contrast:*
- Normal text (< 18pt / < 24px regular, or < 14pt / < 18.67px bold): minimum **4.5:1** contrast ratio against background
- Large text (≥ 18pt / ≥ 24px regular, or ≥ 14pt / ≥ 18.67px bold): minimum **3:1**
- UI components and focus indicators (borders, icons, state indicators): minimum **3:1** against adjacent colours

*Touch and pointer targets:*
- Minimum target size: **24×24px** (WCAG 2.2 AA, criterion 2.5.8)
- Recommended target size for comfortable interaction: **44×44px** (matches iOS HIG and Android guidelines)

*Focus:*
- All interactive elements must have a **visible focus indicator** (2.4.7)
- Focused elements must not be entirely hidden behind sticky headers, banners, or overlays (2.4.11)

*Text and layout:*
- Text must remain readable when resized to **200%** without loss of content or function (1.4.4)
- Content must reflow at **320px viewport width** without requiring horizontal scrolling (1.4.10)
- Text spacing must be overridable: line height ≥ 1.5×, letter spacing ≥ 0.12em, word spacing ≥ 0.16em, paragraph spacing ≥ 2× font size — without loss of content (1.4.12)

*Structure and labelling:*
- Visible label text must match or be contained in the accessible name of its control (2.5.3)
- All non-text content (images, icons used as controls) must have a text alternative (1.1.1)
- Information conveyed by visual structure (headings, lists, tables) must be expressed in semantics (1.3.1)

**Conditional AAA requirements — include only if user selects AAA at Q14:**

*Enhanced contrast:*
- Normal text: minimum **7:1** contrast ratio (1.4.6)
- Large text: minimum **4.5:1** (1.4.6)

*Target size:*
- Minimum **44×44px** for all interactive targets (2.5.5 — AAA in WCAG 2.2)

*Focus:*
- Focused element must not be hidden even partially by sticky content (2.4.12 enhanced)

*Text presentation:*
- No images of text except for decorative or essential cases (1.4.9)
- Users can adjust foreground/background color, font, size, line spacing, and text alignment for blocks of text (1.4.8)

**How to apply:**
When generating the prompt, populate the Accessibility constraint row with the specific
requirements above, not a vague reference to "WCAG AA". The AI tool receiving the prompt
must be given enough detail to make compliant decisions without needing to look up the
standard itself.

### CTA Hierarchy

Apply this logic to every generated prompt. Screens with unclear or competing calls to action produce hesitation and friction — users slow down when they can't immediately identify the right next step. The goal is self-evident UI: the correct action should be obvious without helper text, tooltips, or walkthroughs explaining it.

**Standing rules — always apply when generating:**

*One primary CTA per screen or view.*
Every screen must have exactly one primary action — the thing the user is most likely to want to do next. If the user lists multiple "primary" actions, that is a design problem to resolve before generating, not a layout problem to solve with visual treatment.

*Clear visual hierarchy across CTA tiers.*
Define and enforce a strict visual weight order:
- **Primary** — highest visual weight: filled button in `--color-primary`, full-width on mobile or prominent fixed width on desktop, positioned at the natural endpoint of the reading flow (bottom of content on mobile, inline with form on desktop).
- **Secondary** — medium weight: outlined or ghost button, or a tonal button in a lighter surface color. Clearly subordinate to primary — never the same weight or size.
- **Tertiary** — lowest weight: text link or icon button, used for escape hatches (cancel, skip, go back), supplemental navigation, or low-commitment options.
- **Destructive** — styled distinctly using `--color-error` or equivalent; always secondary or tertiary in weight, never primary unless the screen's sole purpose is confirming a destructive action.

*Self-evident design over compensatory affordances.*
If a user mentions helper text, tooltips, product tours, walkthroughs, or onboarding overlays to explain what a CTA does, treat this as a signal that the CTA itself is unclear. Push back and ask whether the label, context, or layout can be improved instead. Helper text is acceptable for form field guidance (e.g., password requirements); it is not acceptable as a substitute for clear action labelling.

*CTA labels must be specific and action-oriented.*
Vague labels ("Continue", "Submit", "OK") should be replaced with labels that name the outcome: "Create account", "Place order", "Send message", "Delete project". The label should answer the question: "If I tap this, what happens?"

*No competing equal-weight CTAs.*
Two filled primary buttons on the same screen is always wrong. Two outlined buttons of identical size and weight on the same screen is almost always wrong. If the user describes a screen with competing actions, ask which one is the primary goal of this screen and subordinate or defer the other.

*Defer low-priority actions.*
If a screen has many possible actions, the prompt should instruct the AI to defer low-priority ones to a secondary surface (overflow menu, settings, contextual menu on long-press) rather than surfacing them all at once.

**How to apply:**
When generating the Elements block, require that every CTA be labelled with its tier: `[Primary]`, `[Secondary]`, `[Tertiary]`, or `[Destructive]`. When generating the Constraints block, include a CTA hierarchy rule that summarises the tier assignments and prohibits equal-weight competing actions.

### L10n / I18n Requirements

Apply this logic when the user confirms localisation is required at Q15. When it is not
required, omit the Localisation section from the generated prompt entirely.

**Why localisation affects layout and not just content:**
Translated strings are not the same length as their English source. Layouts that work for
English will clip, truncate, or overflow in other languages if containers are sized to the
English string. Font stacks that work for Latin scripts silently fail for Arabic, CJK, or
Devanagari. RTL languages flip the entire spatial logic of the screen, not just text
alignment. These are design constraints, not engineering afterthoughts, and they must be
specified in the prompt so the AI generates layouts that accommodate them.

**String length expansion — design for the longest translation:**

| Language group | Typical expansion vs English |
|---|---|
| German | +30–35% |
| French, Spanish, Italian, Portuguese | +20–30% |
| Russian, Polish | +20–30% |
| Finnish, Hungarian | +25–40% |
| Japanese, Chinese (CJK) | −10–20% (shorter, but taller line heights often needed) |
| Korean | −5–10% |
| Arabic, Hebrew | Variable; RTL layout required regardless of length |

*Design rule:* UI text containers — buttons, labels, nav items, badges, tooltips — must flex to accommodate strings up to **40% longer** than the English source unless a specific shorter-expanding language set is confirmed. Fixed-width text containers are a localisation risk; flag any that appear in the Elements block.

*Pseudo-localisation:* When no translations are available yet, the prompt should instruct the AI to use pseudo-localised strings (e.g., `[Çréàté àccöûnt]`) to simulate expansion and catch overflow early.

**Text directionality:**

| Direction | Languages |
|---|---|
| LTR (left-to-right) | English, most European languages, CJK |
| RTL (right-to-left) | Arabic (ar), Hebrew (he), Persian/Farsi (fa), Urdu (ur) |
| Mixed (bidi) | Content that mixes LTR and RTL — requires Unicode bidi algorithm support |

*Design rule:* If any RTL language is in scope, the layout must be mirrored — not just text-align: right, but full spatial reversal: navigation icons flip, back-chevrons flip, reading flow reverses, padding/margin logic swaps. The prompt must specify this explicitly.

**Number, date, currency, and unit formats — use format tokens, not hardcoded strings:**
- Numbers: `1,234.56` (en-US) vs `1.234,56` (de-DE) vs `1 234,56` (fr-FR)
- Dates: `MM/DD/YYYY` (en-US) vs `DD.MM.YYYY` (de-DE) vs `YYYY年MM月DD日` (ja-JP)
- Currency: symbol position, spacing, and decimal convention vary by locale
- Units: metric vs imperial; temperature (°C / °F); time (12h / 24h)

*Design rule:* All numbers, dates, currencies, and units displayed in the UI must be rendered via localisation format tokens (e.g., `Intl.NumberFormat`, `Intl.DateTimeFormat`, or equivalent i18n library calls), never as hardcoded formatted strings.

**Typography and font stacks for non-Latin scripts:**
Non-Latin scripts require explicit font fallbacks in the type stack. Prompts must specify
font fallback behaviour when non-Latin locales are in scope:
- **Arabic / Hebrew / Persian:** Noto Sans Arabic, Noto Naskh Arabic, or system Arabic font
- **CJK (Chinese, Japanese, Korean):** Noto Sans CJK, Source Han Sans, or system CJK font
- **Devanagari (Hindi, Marathi):** Noto Sans Devanagari or system Devanagari font
- **Thai:** Noto Sans Thai or system Thai font

*Design rule:* The font token (`--font-family-base` or `typography.body.fontFamily`) must include a fallback stack that covers all script systems in scope.

**Pluralisation:**
English has two plural forms (singular / plural). Other languages have more:
- Arabic: 6 plural forms
- Russian/Polish: 3 plural forms
- CJK languages: typically 1 form (no grammatical plural)

*Design rule:* Any UI string that varies by count ("1 item", "2 items") must be flagged as requiring pluralisation token support. The prompt should note this so the AI doesn't hardcode singular/plural as a simple branch.

**How to apply:**
When localisation is required, include a `## Localisation & I18n` section in the generated
prompt specifying: target languages/locales, text directionality, string expansion headroom,
format token requirements, font fallback stack, and any pluralisation needs. Include the
L10n / I18n status in the prompt header metadata.

### Question Sequence

Ask these in order. The question text below is a guide — adapt the wording naturally to
the conversation; don't read it verbatim.

1. **Platform** — Which tool will receive this prompt? *(Claude Code, Figma Make, Google
   Stitch, Lovable, Cursor, v0, or another tool?)*
2. **UI Type** — What kind of interface are you building? *(A screen, component, flow,
   modal, widget — or something else?)*
3. **Product & User** — What kind of app or product is this for, and who is the user?
4. **User Moment** — What just happened before the user arrives at this screen, and what
   do they do next?
5. **Required Elements** — What specific UI components, content, or features must be
   present? *(List everything you know is required. Then ask: "Which of these is the
   primary action — the single most important thing a user should do on this screen?"
   If they list more than one primary action, note that only one can be primary and ask
   them to choose.)*
6. **Behaviors** — How should the UI respond to interaction? *(States, transitions,
   conditional logic, animations?)*
7. **Constraints** — Any rules to lock in? *(Platform — iOS/Android/Web, grid, spacing,
   accessibility needs, brand rules?)*
8. **Design System / Tokens / Guidelines File** — Do you have a component library, UI kit,
   design tokens, or a guidelines file to reference? *(Options — name whichever applies:)*
   - A **named design system** (shadcn/ui, Material 3, Tailwind, etc.)
   - A **DESIGN.md file** in your project *(Google Stitch's open-source guidelines format — contains YAML token front matter and human-readable design rationale. If present, token values for primitive, semantic, and component tiers can be referenced directly from it rather than entered manually.)*
   - A **platform-specific guidelines file** (e.g., Cursor's `.cursorrules`, Claude Code's `CLAUDE.md`, or any other agent instructions file that includes design rules)
   - **None** — tokens will be specified manually or left to AI discretion
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
14. **Accessibility Level** — The prompt will target **WCAG 2.2 AA** by default. Do you
    need **AAA** compliance instead? *(AA covers contrast ratios of 4.5:1 for normal text
    and 3:1 for large text and UI components, 24×24px minimum touch targets, visible focus
    indicators, and reflow at 320px. AAA adds 7:1 enhanced contrast, 44×44px targets, and
    stricter text presentation rules. Most production products target AA; AAA is typically
    required for government, healthcare, or high-compliance contexts.)*
15. **Localisation (L10n / I18n)** — Does this UI need to support multiple languages or
    locales? *(If yes: which languages or locales are in scope? This determines string
    expansion headroom — German can run 35% longer than English — text directionality for
    RTL languages like Arabic and Hebrew, date/number/currency format tokens, and font
    fallback stacks for non-Latin scripts like CJK or Arabic. If you're not sure yet, say
    so and I'll flag the layout constraints to watch for.)*

After the final question, confirm the full picture back to the user in a brief summary
before moving to Phase 2.

**Prompt-drift prevention note:** When Platform is Figma Make or another metered tool,
mention once — naturally, not as a formal warning — that refining the prompt here saves
credits later.

---

## Phase 2: Clarify and Analyze

After gathering inputs, review them before generating. Look for:

### Ambiguity Flags
- Vague adjectives: "modern", "clean", "professional" → ask for specifics (token-referenced
  values like `--radius-md` and `--color-surface-muted` beat "clean")
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
- **If a DESIGN.md is confirmed:** verify that the generated prompt instructs the tool to
  read the DESIGN.md before generating. Token references in the prompt should use DESIGN.md
  dot-path syntax (`colors.primary`, `spacing.lg`, `rounded.md`) rather than CSS variable
  convention. Check that primitive, semantic, and component tiers are all accounted for —
  a prompt that only references semantic tokens may miss component-level overrides.
- **If another guidelines file is confirmed:** instruct the prompt to reference it by name
  and location. Note any design rules it contains that should be explicitly restated in
  Constraints for tools that don't automatically read such files.

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
- **Always include at minimum these AA accessibility AC items**, regardless of whether the
  user specified them:
  - `- [ ] All text/background colour combinations meet the applicable contrast ratio (4.5:1 normal, 3:1 large text)`
  - `- [ ] All interactive elements have a visible focus indicator`
  - `- [ ] All interactive targets are ≥ 24×24px (AA) / ≥ 44×44px (AAA)`
  - `- [ ] Content reflows at 320px viewport width without horizontal scroll`
  - `- [ ] All meaningful images and icon controls have text alternatives`
- **Always include these CTA hierarchy AC items**, regardless of whether the user specified them:
  - `- [ ] Exactly one primary CTA is present and visually dominant`
  - `- [ ] No two CTAs have equal visual weight`
  - `- [ ] All CTA labels are outcome-oriented (not generic verbs like "Submit" or "Continue")`
  - `- [ ] No helper text or walkthroughs are used to explain what a CTA does`
- **If L10n / I18n is required, always include these AC items:**
  - `- [ ] All text containers flex to accommodate strings up to [X]% longer than English source`
  - `- [ ] No fixed-width text containers exist for UI labels, button copy, nav items, or badges`
  - `- [ ] All dates, numbers, currencies, and units are rendered via format tokens, not hardcoded strings`
  - `- [ ] RTL layout is fully mirrored for Arabic/Hebrew/Persian locales (if in scope)`
  - `- [ ] Font fallback stack covers all script systems in scope`
  - `- [ ] Count-dependent strings use pluralisation tokens`
- **Functional prototype AC** should include interaction checks: does the logic fire
  correctly, do states transition as specified, does conditional behavior work?
- **Design mockup AC** should focus on visual inspection: are all elements present, do
  spacing and tokens match the spec, are states visually distinguishable?
- Every AC item must be traceable back to a specific Element, Behavior, or Constraint.
  If it can't be traced, it's either a missing requirement or out of scope — clarify which.

### CTA Flag
Audit all gathered Elements and Behavior inputs for CTA hierarchy problems before generating:
- **Multiple primary CTAs:** If the user described more than one primary or equal-weight action, flag this and ask them to designate one as primary and demote the others to secondary or tertiary.
- **Missing primary CTA:** If no clear primary action was identified, ask what the user should do next after arriving at this screen. Use the answer to designate the primary CTA.
- **Vague CTA labels:** If CTA labels are generic ("Continue", "Submit", "OK", "Next"), flag them and suggest outcome-oriented alternatives based on the screen context.
- **Compensatory affordances:** If the user mentioned helper text, tooltips, walkthroughs, or product tours to explain what a CTA does, flag this as a design smell. Ask whether the label, surrounding context, or layout can make the action self-evident instead. Note that helper text is appropriate for form field guidance but not for explaining button purpose.
- **Buried or deferred primary action:** If the primary CTA was placed below a large amount of content, behind a scroll, or in a non-prominent position, flag this and recommend it appear at the natural endpoint of the reading flow.
- **Destructive CTA as primary:** If a destructive action (delete, remove, cancel subscription) was designated as the primary CTA without strong justification, flag it and ask whether this is intentional.

When generating the Elements block, label every CTA with its tier: `[Primary]`, `[Secondary]`, `[Tertiary]`, or `[Destructive]`. Include a CTA hierarchy summary in the Constraints block.

### Grid Flag
Audit all spacing and radius values across every gathered input field — including Elements,
Behavior, and Constraints — for values not conformant with the 8px base grid (or 4px
microgrid). Apply the same rounding and tokenisation logic from Phase 1. Include any
corrections in the Phase 2 summary message alongside Raw Value Translation changes.
If no grid was specified by the user and none was recommended during Q7, recommend the
8px grid now and apply it to all spacing values before generating.

### Raw Value Translation Flag
Review all gathered inputs for any raw values that were not caught and translated during
Phase 1. Check every field — including Elements, Behavior, and Constraints — for stray
hex codes, pixel measurements, unitless numbers that represent sizes, or hard-coded
weights. Translate any found using the same closest-match logic from Phase 1, notify the
user of the changes in the Phase 2 summary message, and confirm before generating.
Additionally, if a named design system is now confirmed, verify that all translated token
names follow that system's conventions — rename any that don't match.

### Accessibility Flag
Every prompt defaults to WCAG 2.2 AA. Review gathered inputs for any conflicts before
generating:
- **Color conflicts:** If the user specified brand colors, flag any foreground/background
  pairings that are likely to fail the applicable contrast threshold (4.5:1 for normal
  text, 3:1 for large text and UI components). Don't calculate exact ratios — flag obvious
  risks (light grey text on white, light yellow on white, low-saturation combinations) and
  note that contrast must be verified with a tool such as the WebAIM Contrast Checker.
- **Target size conflicts:** If any interactive elements were described with dimensions
  below 24×24px (AA) or 44×44px (AAA if selected), flag them and note the minimum.
- **Focus state omission:** If interactive elements were listed without mention of focus
  states, add a reminder that visible focus indicators are required at AA and must be
  included in the Behavior block.
- **Missing text alternatives:** If images, icons, or illustrations are listed in Elements
  without alt text or aria-label guidance, flag the gap.
- **Reflow risk:** If the layout was described with fixed widths or rigid side-by-side
  columns, flag that content must reflow at 320px viewport width.

Include the applicable WCAG 2.2 level (AA or AAA) in the Constraints block of the
generated prompt with the specific numeric requirements, not just the level name.

### L10n Flag
If localisation is required (confirmed at Q15), audit gathered inputs before generating:
- **Fixed-width text containers:** Any button, label, badge, nav item, or tooltip described with a fixed width is a localisation risk. Flag it and recommend a flex/min-width approach with a max-width cap if needed.
- **Hardcoded formatted strings:** Any date, number, currency, or unit value in the Elements or Behavior blocks must be replaced with a format token reference. Flag any hardcoded examples like "Jan 12, 2026" or "$1,234.56".
- **RTL layout omission:** If Arabic, Hebrew, Persian, or Urdu is in scope and the layout hasn't addressed mirroring, flag this explicitly. RTL is a full spatial reversal — not just text-align: right.
- **Non-Latin font stack gaps:** If CJK, Arabic, Devanagari, or Thai is in scope and the font token has no fallback for those script systems, flag the gap.
- **Pluralisation strings:** Any count-dependent string ("1 result", "3 items") must be flagged as requiring pluralisation token support.
- **Missing pseudo-localisation guidance:** If translations are not yet available, recommend the prompt instruct the AI to use pseudo-localised placeholder strings to surface overflow early.
- **String expansion headroom:** Confirm that text container widths and heights allow for the expansion rate of the widest-expanding language in scope (typically German at ~35%). If the layout is too tight for English, it will break under expansion.

Include the L10n status and target locales in the prompt header and the Localisation & I18n section of the Constraints block.

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
**For every CTA, label its tier explicitly:** `[Primary]`, `[Secondary]`, `[Tertiary]`, or `[Destructive]`. There must be exactly one `[Primary]` CTA per screen. Secondary CTAs must be visually subordinate; tertiary CTAs use text-link or icon-button weight only.

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
**Accessibility:** WCAG 2.2 [AA / AAA]
**L10n / I18n:** [Not required / Required — languages: list]

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
- **Grid:** 8px base grid (4px microgrid for fine details) — token names: `--space-sm` (8px), `--space-lg` (16px), `--space-xl` (24px), etc.
- **Design system:** [e.g., shadcn/ui, Material 3, custom — or "none specified"]
- **Tokens:** [Reference token names, not raw values — e.g., `--color-primary`, `--color-surface`, `--font-size-body`, `--space-md` — or "AI discretion"]
- **Accessibility — WCAG 2.2 [AA / AAA]:**
  - Contrast (normal text): ≥ 4.5:1 [AA] or ≥ 7:1 [AAA]
  - Contrast (large text ≥ 24px regular / ≥ 18.67px bold): ≥ 3:1 [AA] or ≥ 4.5:1 [AAA]
  - Contrast (UI components, focus indicators): ≥ 3:1
  - Touch/pointer targets: ≥ 24×24px minimum [AA]; ≥ 44×44px recommended and required [AAA]
  - Focus: visible focus indicator required on all interactive elements; focused elements must not be entirely obscured by sticky content
  - Reflow: content must reflow at 320px viewport width without horizontal scrolling
  - Text spacing: support line height ≥ 1.5×, letter spacing ≥ 0.12em without loss of content
  - Labels: visible label text must match or be contained in the accessible name of its control
  - Non-text content: all meaningful images and icon controls must have text alternatives
- **CTA hierarchy:**
  - Exactly one [Primary] CTA per screen — filled, highest visual weight, positioned at the natural endpoint of the reading flow
  - [Secondary] CTAs — outlined or ghost style, clearly subordinate in size and weight to primary
  - [Tertiary] CTAs — text-link or icon-button weight only, used for escape hatches and low-commitment options
  - [Destructive] CTAs — styled with `--color-error`; secondary or tertiary weight unless the screen's sole purpose is confirming a destructive action
  - No two CTAs of equal visual weight on the same screen
  - CTA labels must be outcome-oriented, not generic ("Create account" not "Submit")
  - Do not add helper text, tooltips, or walkthroughs to explain CTA purpose — if the action requires explanation, improve the label or layout instead
- [Any additional constraints or explicit prohibitions]

<!-- Include this section only when L10n / I18n is required -->
## Localisation & I18n
**Target languages / locales:** [e.g., en-US (source), de-DE, fr-FR, ar-SA, ja-JP]
**Text directionality:** [LTR only / LTR + RTL — full layout mirroring required for RTL locales]
**String expansion headroom:** All text containers must flex to accommodate strings up to [X]% longer than the English source. Widest-expanding language in scope: [e.g., German at ~35%]. Do not use fixed-width text containers for any UI labels, button copy, nav items, or badges.
**Format tokens:** All dates, numbers, currencies, and units must be rendered via localisation format tokens (e.g., `Intl.NumberFormat`, `Intl.DateTimeFormat`), never as hardcoded formatted strings.
**Font fallback stack:** The base font token must include fallbacks for all script systems in scope: [e.g., Latin → Arabic (Noto Sans Arabic) → CJK (Noto Sans CJK) → system-ui]
**Pluralisation:** The following strings vary by count and require pluralisation token support: [list count-dependent strings, e.g., "N items selected", "N results found"]
**Pseudo-localisation:** [If translations not yet available: Use pseudo-localised placeholder strings (e.g., `[Çréàté àccöûnt]`) in the prototype to simulate expansion and surface overflow early.]

<!-- Include this section when the user has a DESIGN.md or other guidelines file -->
## Design Guidelines
<!-- Replace the instruction below with the appropriate file reference for the target tool -->
Before generating any UI, read [DESIGN.md / .cursorrules / CLAUDE.md / other guidelines file]
at the project root. Use it as the authoritative source for all token values — primitive,
semantic, and component tiers. Reference tokens using the file's own naming convention:
- For DESIGN.md: use dot-path syntax — `{colors.primary}`, `{spacing.lg}`, `{rounded.md}`, `{typography.h1}`, `{components.button.background}`
- Do not override token values defined in the guidelines file with values from this prompt.
- If a required token is absent from the file, note the gap and apply the closest defined token rather than introducing a raw value.

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

- **Localisation is a layout constraint, not a content task.** When L10n / I18n is required, the prompt must specify target languages, string expansion headroom (up to 40% for German), text directionality (full RTL mirroring for Arabic/Hebrew), format tokens for dates/numbers/currencies, font fallback stacks for non-Latin scripts, and pluralisation support. Fixed-width text containers are a localisation risk and must be flagged.
- **One primary CTA per screen, strict hierarchy below it.** Every screen must have exactly one primary action. Secondary and tertiary CTAs must be visually subordinate. No two CTAs may have equal visual weight. Helper text and walkthroughs used to explain CTA purpose are design smells — the label, context, or layout should be fixed instead. CTA labels must name the outcome, not the action type.
- **WCAG 2.2 AA is the unconditional baseline.** Every generated prompt must include the full set of AA accessibility requirements in its Constraints block — specific contrast ratios, target sizes, focus visibility, reflow, and text spacing — not just a reference to "WCAG AA". AAA is opt-in via Q14 and adds enhanced contrast, 44×44px targets, and stricter text presentation rules.
- **Guidelines files are the token source of truth.** If a DESIGN.md, `.cursorrules`, `CLAUDE.md`, or equivalent guidelines file exists, the prompt must instruct the tool to read it before generating. Token values come from the file; the prompt references token names, not raw values. For DESIGN.md, use dot-path syntax: `{colors.primary}`, `{spacing.lg}`, `{rounded.md}`.
- **8px grid is the default.** All spacing and radius values must land on the 8px base grid, or the 4px microgrid for fine-grained contexts. Off-grid values are rounded to the nearest 4px multiple, corrected before tokenisation, and the user is informed of the change.
- **Token names beat raw values.** Reference design tokens and CSS variables by name (`--font-size-body`, `--color-primary`) rather than hard-coded values. Raw values like `#0057FF` or `16px` belong in the token file, not the prompt.
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

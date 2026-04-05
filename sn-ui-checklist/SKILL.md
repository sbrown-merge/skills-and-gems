---
name: sn-ui-checklist
description: Review interface design quality across strategy, typography, layout, color, style, imagery, elements, and product tactics. Use when the user asks for a design review, UI audit, checklist pass, pre-ship review, screenshot critique, or feedback on a component, screen, or flow.
---

# UI Design Checklist

Use this skill to run a structured interface review before shipping.

## Quick Start

1. Identify the review artifact: screenshot, Figma frame, live UI, or code.
2. Review the categories below and skip anything that is clearly not applicable.
3. Prioritize the highest-leverage issues first.
4. Give specific recommendations, not vague taste-based feedback.

## Evidence Rules

- Base findings on visible evidence. Do not invent issues you cannot verify.
- If reviewing code only, call out likely visual risks as assumptions.
- If reviewing a screenshot only, mention when states, interactions, or responsive behavior cannot be confirmed.
- Prefer concrete language like "The card uses 4 corner radii" over "The design feels inconsistent."

## Review Priorities

Prioritize in this order:

1. Clarity of the problem and interface purpose
2. Hierarchy, layout, and interaction clarity
3. Color and state usage
4. Stylistic consistency and polish

## Common Mistakes To Catch

| Mistake | What to flag |
|---------|--------------|
| Too many font sizes | More than 4 distinct sizes on one screen or section |
| Arbitrary spacing | Gaps that do not follow a consistent spacing rhythm |
| Weak hierarchy | Everything feels equally important |
| Color role confusion | Accent or CTA colors used decoratively instead of functionally |
| Missing states | Hover, focus, disabled, error, empty, or loading states are absent |
| Weak affordance | Interactive elements do not look interactive |
| Gray proliferation | Too many nearly identical neutrals |
| Decorative noise | Borders, shadows, blur, or gradients without a hierarchy purpose |

## Review: Getting Started

- Is the human problem being solved clear from the interface?
- Does the design complexity match the product complexity?
- Do the references feel inspired rather than derivative?
- Do the decisions reflect known business or technical constraints?

## Review: Typography

- Keep font sizes deliberate. Aim for 2 to 4 per screen or section.
- Merge stray sizes where possible.
- Use weight, case, or color before adding another size.
- Check that hierarchy matches content priority.
- Ensure typeface choice supports the intended personality.
- Keep primary content at 16px or larger unless there is a strong accessibility-aware reason not to.
- Watch line length and readability for longer copy.

## Review: Layout

- Every element should have intentional spacing.
- Use a clear alignment structure or grid.
- Negative space should define relationships, not appear random.
- Increase breathing room where sections feel cramped.
- Ensure scan paths are clear and reduce eye darting.
- Correct optical misalignments when mathematical alignment looks wrong.
- Match density to the type and volume of content.
- Make interaction affordances obvious.
- Remove or layer content when everything does not need to be visible at once.

## Review: Color

- Use a systematic palette, not ad hoc color picking.
- Check contrast across text, icons, controls, and states.
- Keep structural colors distinct from interactive colors.
- Establish a clear CTA hierarchy.
- Simplify gray usage and keep neutrals disciplined.
- Use color to support depth and layering.
- In dark interfaces, avoid pure black and pure white unless used intentionally.
- Treat gradients carefully and only when they help the design.

## Review: Style

- The design direction should be describable in a few specific adjectives.
- Corner radius choices should be intentional and consistent.
- Borders and dividers should support hierarchy, not dominate it.
- Use negative space as a separator before adding more lines.
- Shadows and depth should reinforce the visual model.
- Buttons and key actions should have considered interaction states.
- Avoid piling on blur, opacity, and effects without a clear reason.

## Review: Imagery

- Every image should improve the design.
- Stress-test dynamic imagery against awkward edge cases.
- Empty states should still feel designed.
- Icons should share a clear system for size, stroke, fill, and role.
- Prefer SVG or CSS when raster assets are unnecessary.
- Look for opportunities to use illustration, pattern, or branding details intentionally.

## Review: Elements

- Navigation should stay focused and easy to scan.
- Inputs need clear default, hover, focus, disabled, and error states.
- Forms should ask only for necessary information.
- Required versus optional fields should be obvious.
- Profile, settings, and user-generated-content states should be considered end to end.
- Components should feel complete, not only designed for the happy path.

## Review: Tactics

- The solution should look explored, not first-draft.
- Mobile should force prioritization where relevant.
- Platform conventions should be followed or intentionally broken for a good reason.
- The work should tell a coherent product story across flows.
- Important interactions should be prototyped when motion or state changes matter.

## Response Format

Use this structure:

```markdown
## UI Checklist Review

### Top 3 Priorities
1. [Highest-leverage fix with a concrete recommendation]
2. [Second priority]
3. [Third priority]

### Findings by Category

**Getting Started** - [PASS | X issues | N/A]
- [Specific finding and recommendation]

**Typography** - [PASS | X issues | N/A]
- [Specific finding and recommendation]

**Layout** - [PASS | X issues | N/A]
- [Specific finding and recommendation]

**Color** - [PASS | X issues | N/A]
- [Specific finding and recommendation]

**Style** - [PASS | X issues | N/A]
- [Specific finding and recommendation]

**Imagery** - [PASS | X issues | N/A]
- [Specific finding and recommendation]

**Elements** - [PASS | X issues | N/A]
- [Specific finding and recommendation]

**Tactics** - [PASS | X issues | N/A]
- [Specific finding and recommendation]

### Summary
- [Overall quality assessment]
- [Strongest area]
- [Biggest opportunity]
```

## Tone

- Be direct and useful.
- Prefer specific fixes over abstract design theory.
- Do not pad the review with praise if the work needs correction.
- If the work is strong, say why with the same level of specificity.

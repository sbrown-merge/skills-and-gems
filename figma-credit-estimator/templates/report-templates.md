# Figma credit estimator: report templates

These are the two report layouts the Figma credit estimator writes, with every fixed sentence, for the gem and MERGE One agent to follow word for word. Fill in only the parts in angle brackets. Version {{VERSION}} of the estimator, rates calibrated {{CALIBRATED}}. This file is built from the estimator's calculator; don't edit it by hand.

## Contents

<!-- toc -->
- Write the design-time report
- Write the spike work report
- The re-check caveat
- End the reply
<!-- /toc -->

## Write the design-time report

Write it in this layout, as normal formatted text. Fill in the parts in angle brackets and leave every other sentence exactly as written.

```
# Figma AI credit estimate: <program name, or leave off ": <program name>" if none was given>

**Recommended {{LINE_ITEM}}: $<recommended>.** Prepared <today's date as YYYY-MM-DD> with version {{VERSION}} of MERGE's Figma credit estimator, rates calibrated {{CALIBRATED}}.

## What we entered

<one line for each figure, in the order given; "1 designer" and "1 week" in the singular; add a last line "That's <total> design hours in all." when there's more than one:>
- <hours> design hours, as entered.
- <hours> design hours, converted from <n> designers × <weeks> weeks × {{DAYS_PER_WEEK}} days × {{WORKDAY_HOURS}} hours × <effort as a percent>, and confirmed as matching the staffing sheet.
- <hours> design hours, converted from <n> designers × <weeks> weeks × {{DAYS_PER_WEEK}} days × {{WORKDAY_HOURS}} hours × <effort as a percent>, with no staffing sheet yet to check it against.

## How we got there

- **Design time:** <hours> design hours × {{CREDITS_PER_HOUR}} credits an hour = <credits> credits, which at ${{PRICE}} a credit is $<cost>.
- **Padding:** {{PADDING}} of $<cost> is $<padding>.
- **Recommended:** $<cost> + $<padding> = $<recommended>.

## Assumptions

{{DESIGN_ASSUMPTIONS}}

## Caveats

{{DESIGN_CAVEATS}}
```

## Write the spike work report

Write it in this layout, as normal formatted text, in the same way.

```
# Figma AI spike work estimate: <program name, or leave off ": <program name>" if none was given>

**Recommended {{LINE_ITEM}} for spike work: $<recommended>**, on top of the program's design-time estimate. Prepared <today's date as YYYY-MM-DD> with version {{VERSION}} of MERGE's Figma credit estimator, rates calibrated {{CALIBRATED}}.

## What we entered

<one line for each figure, in the order given; "1 designer" and "1 week" in the singular; add a last line "That's <total> spike hours in all." when there's more than one:>
- <hours> spike hours, as entered.
- <hours> spike hours, converted from <n> designers × <weeks> weeks × {{DAYS_PER_WEEK}} days × {{SPIKE_DAY_HOURS}} hours, and confirmed as right.

## How we got there

- **Spike work:** <hours> spike hours × {{SPIKE_CREDITS_PER_HOUR}} credits an hour = <credits> credits, which at ${{PRICE}} a credit is $<cost>.
- **Padding:** {{PADDING}} of $<cost> is $<padding>.
- **Recommended:** $<cost> + $<padding> = $<recommended>.

## Assumptions

{{SPIKE_ASSUMPTIONS}}

## Caveats

{{SPIKE_CAVEATS}}
```

## The re-check caveat

If today's date is after {{RECALIBRATE_AFTER}}, add this as the last caveat of either report:

{{RECALIBRATE_CAVEAT}}

## End the reply

After the report, or after the last report when there are two, end the reply with this, word for word:

"{{CLOSING}}"

If the person says yes, save the report, without the closing words, as a document or file named for the program and the date, such as "Acme website Figma credit estimate 2026-10-09"; when the reply held a design-time report and a spike work report, save both in that one file. If you can't create files here, tell them to copy the report or use the export option for this chat. Don't add any other commentary, and don't name any MERGE employee.

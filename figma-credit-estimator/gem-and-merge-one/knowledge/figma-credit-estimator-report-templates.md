# Figma credit estimator: report templates

These are the two report layouts the Figma credit estimator writes, with every fixed sentence, for the gem and MERGE One agent to follow word for word. Fill in only the parts in angle brackets. Version 0.2.0 of the estimator, rates calibrated 2026-10-09. This file is built from the estimator's calculator; don't edit it by hand.

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

**Recommended Experience out-of-pocket: $<recommended>.** Prepared <today's date as YYYY-MM-DD> with version 0.2.0 of MERGE's Figma credit estimator, rates calibrated 2026-10-09.

## What we entered

<one line for each figure, in the order given; "1 designer" and "1 week" in the singular; add a last line "That's <total> design hours in all." when there's more than one:>
- <hours> design hours, as entered.
- <hours> design hours, converted from <n> designers × <weeks> weeks × 5 days × 8 hours × <effort as a percent>, and confirmed as matching the staffing sheet.
- <hours> design hours, converted from <n> designers × <weeks> weeks × 5 days × 8 hours × <effort as a percent>, with no staffing sheet yet to check it against.

## How we got there

- **Design time:** <hours> design hours × 334 credits an hour = <credits> credits, which at $0.0188 a credit is $<cost>.
- **Padding:** 30% of $<cost> is $<padding>.
- **Recommended:** $<cost> + $<padding> = $<recommended>.

## Assumptions

- **334 credits a design hour.** MERGE's heaviest Figma AI users averaged 1,745 credits a working day in their busiest months. Rounded up to 2,000 a day and spread over a 6-hour design day, that's 333.3 an hour, rounded up.
<only when the hours were converted from a duration:>
- **A converted duration counts 8 hours a day at full effort and 5 days a week,** with nothing taken out for holidays or vacation.
- **$0.0188 a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat aren't deducted.
- **Only design roles' time is counted:** Experience: any UX designer, UI designer or experience designer, at any level up to and including VP; Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production.

## Caveats

- The 30% padding covers people who aren't counted but sometimes use Figma's AI, such as a content strategist editing copy with the agent, and the uncertainty in the rates.
- The rates were set on 2026-10-09, mostly from use of Figma's agent during its free beta, and will be re-checked against billed use.
- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of a Figma invoice.
- Spike work isn't included. If any work will be done mostly by Figma's agent, such as building a design system, plan for it with a separate spike work estimate: give how many designers, and for how many weeks.
```

## Write the spike work report

Write it in this layout, as normal formatted text, in the same way.

```
# Figma AI spike work estimate: <program name, or leave off ": <program name>" if none was given>

**Recommended Experience out-of-pocket for spike work: $<recommended>**, on top of the program's design-time estimate. Prepared <today's date as YYYY-MM-DD> with version 0.2.0 of MERGE's Figma credit estimator, rates calibrated 2026-10-09.

## What we entered

<one line for each figure, in the order given; "1 designer" and "1 week" in the singular; add a last line "That's <total> spike hours in all." when there's more than one:>
- <hours> spike hours, as entered.
- <hours> spike hours, converted from <n> designers × <weeks> weeks × 5 days × 6 hours, and confirmed as right.

## How we got there

- **Spike work:** <hours> spike hours × 1,267 credits an hour = <credits> credits, which at $0.0188 a credit is $<cost>.
- **Padding:** 30% of $<cost> is $<padding>.
- **Recommended:** $<cost> + $<padding> = $<recommended>.

## Assumptions

- **1,267 credits a spike hour,** for work done mostly by Figma's agent. The heaviest agent-led design-system work on record averaged 7,600 credits a working day; spread over a 6-hour day, that's 1,266.7 an hour, rounded up.
<only when the hours were converted from a duration:>
- **A spike day counts 6 spike hours and a week 5 days,** because the rate was measured per working day.
- **Spike work is added on top of design time,** because it covers agent work beyond a normal design day: overtime, weekends and holidays.
- **$0.0188 a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat aren't deducted.

## Caveats

- The 30% padding covers the uncertainty in the rate.
- A single day of spike work can run far above its average: the busiest on record used 40,592 credits, about $763.
- The rates were set on 2026-10-09, mostly from use of Figma's agent during its free beta, and will be re-checked against billed use.
- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of a Figma invoice.
```

## The re-check caveat

If today's date is after 2026-11-07, add this as the last caveat of either report:

- These rates were due to be re-checked after 2026-11-07; confirm they're current before using this figure.

## End the reply

After the report, or after the last report when there are two, end the reply with this, word for word:

"Put the recommended figure in the staffing sheet's Experience out-of-pocket field, and attach this report to show how it was reached. Would you like me to save the report as a file you can attach?"

If the person says yes, save the report, without the closing words, as a document or file named for the program and the date, such as "Acme website Figma credit estimate 2026-10-09"; when the reply held a design-time report and a spike work report, save both in that one file. If you can't create files here, tell them to copy the report or use the export option for this chat. Don't add any other commentary, and don't name any MERGE employee.

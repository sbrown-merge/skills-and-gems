# Figma credit estimator: worked examples

These are finished conversations made with MERGE's Figma credit calculator, for the Figma credit estimator gem and MERGE One agent to match. The reports' date is fixed at 2026-10-09; a real report carries the date it's prepared. This file is built from the calculator; don't edit it by hand.

## Contents

<!-- toc -->
- Asking for the figures
- Design hours
- A duration, confirmed with no staffing sheet yet
- A duration that doesn't match the staffing sheet
- A spike work estimate
- Closing the reply
<!-- /toc -->

## Asking for the figures

When the person's message has no hours or duration, ask once, in one message, like this:

> To estimate the Figma credits, I need the total design hours from your staffing sheet. If you don't have a staffing sheet yet, give me how many designers, for how many weeks, and at what effort, such as 2 designers for 6 weeks at 80%.
>
> Only these roles' time counts: Experience: any UX designer, UI designer or experience designer, at any level up to and including VP; Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production.

## Design hours

The person types: "How much should we budget for Figma credits on the Acme website redesign? The staffing sheet has 520 design hours."

You reply:

````markdown
# Figma AI credit estimate: Acme website redesign

**Recommended Experience out-of-pocket: $4,245.** Prepared 2026-10-09 with version 0.2.0 of MERGE's Figma credit estimator, rates calibrated 2026-10-09.

## What we entered

- 520 design hours, as entered.

## How we got there

- **Design time:** 520 design hours × 334 credits an hour = 173,680 credits, which at $0.0188 a credit is $3,265.
- **Padding:** 30% of $3,265 is $980.
- **Recommended:** $3,265 + $980 = $4,245.

## Assumptions

- **334 credits a design hour.** MERGE's heaviest Figma AI users averaged 1,745 credits a working day in their busiest months. Rounded up to 2,000 a day and spread over a 6-hour design day, that's 333.3 an hour, rounded up.
- **$0.0188 a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat aren't deducted.
- **Only design roles' time is counted:** Experience: any UX designer, UI designer or experience designer, at any level up to and including VP; Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production.

## Caveats

- The 30% padding covers people who aren't counted but sometimes use Figma's AI, such as a content strategist editing copy with the agent, and the uncertainty in the rates.
- The rates were set on 2026-10-09, mostly from use of Figma's agent during its free beta, and will be re-checked against billed use.
- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of a Figma invoice.
- Spike work isn't included. If any work will be done mostly by Figma's agent, such as building a design system, plan for it with a separate spike work estimate: give how many designers, and for how many weeks.
````

## A duration, confirmed with no staffing sheet yet

The person types: "Pitch for a pharma mobile app, no staffing sheet yet: two UI designers for 6 weeks at 80%, and a VP of Experience Design for 6 weeks at 20%."

You reply:

````markdown
Your entry converts to 432 design hours:

- 2 designers × 6 weeks × 5 days × 8 hours × 80% = 384 design hours.
- 1 designer × 6 weeks × 5 days × 8 hours × 20% = 48 design hours.
- That's 432 design hours in all.

Does 432 design hours match the design hours on your staffing sheet? Reply yes, no, or that there's no staffing sheet yet.
````

The person types: "There's no staffing sheet yet."

You reply:

````markdown
# Figma AI credit estimate: Pharma mobile app pitch

**Recommended Experience out-of-pocket: $3,527.** Prepared 2026-10-09 with version 0.2.0 of MERGE's Figma credit estimator, rates calibrated 2026-10-09.

## What we entered

- 384 design hours, converted from 2 designers × 6 weeks × 5 days × 8 hours × 80%, with no staffing sheet yet to check it against.
- 48 design hours, converted from 1 designer × 6 weeks × 5 days × 8 hours × 20%, with no staffing sheet yet to check it against.
- That's 432 design hours in all.

## How we got there

- **Design time:** 432 design hours × 334 credits an hour = 144,288 credits, which at $0.0188 a credit is $2,713.
- **Padding:** 30% of $2,713 is $814.
- **Recommended:** $2,713 + $814 = $3,527.

## Assumptions

- **334 credits a design hour.** MERGE's heaviest Figma AI users averaged 1,745 credits a working day in their busiest months. Rounded up to 2,000 a day and spread over a 6-hour design day, that's 333.3 an hour, rounded up.
- **A converted duration counts 8 hours a day at full effort and 5 days a week,** with nothing taken out for holidays or vacation.
- **$0.0188 a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat aren't deducted.
- **Only design roles' time is counted:** Experience: any UX designer, UI designer or experience designer, at any level up to and including VP; Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production.

## Caveats

- The 30% padding covers people who aren't counted but sometimes use Figma's AI, such as a content strategist editing copy with the agent, and the uncertainty in the rates.
- The rates were set on 2026-10-09, mostly from use of Figma's agent during its free beta, and will be re-checked against billed use.
- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of a Figma invoice.
- Spike work isn't included. If any work will be done mostly by Figma's agent, such as building a design system, plan for it with a separate spike work estimate: give how many designers, and for how many weeks.
````

## A duration that doesn't match the staffing sheet

The person types: "Three designers for 4 weeks on the Fabrikam portal."

You reply:

````markdown
Your entry converts to 480 design hours:

- 3 designers × 4 weeks × 5 days × 8 hours × 100% = 480 design hours.

Does 480 design hours match the design hours on your staffing sheet? Reply yes, no, or that there's no staffing sheet yet.
````

The person types: "No, that's too high."

You reply:

> Then please give me the total design hours from the staffing sheet, for the design roles only, and I'll use that instead.

The person types: "The staffing sheet says 400."

You reply:

````markdown
# Figma AI credit estimate: Fabrikam portal

**Recommended Experience out-of-pocket: $3,266.** Prepared 2026-10-09 with version 0.2.0 of MERGE's Figma credit estimator, rates calibrated 2026-10-09.

## What we entered

- 400 design hours, as entered.

## How we got there

- **Design time:** 400 design hours × 334 credits an hour = 133,600 credits, which at $0.0188 a credit is $2,512.
- **Padding:** 30% of $2,512 is $754.
- **Recommended:** $2,512 + $754 = $3,266.

## Assumptions

- **334 credits a design hour.** MERGE's heaviest Figma AI users averaged 1,745 credits a working day in their busiest months. Rounded up to 2,000 a day and spread over a 6-hour design day, that's 333.3 an hour, rounded up.
- **$0.0188 a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat aren't deducted.
- **Only design roles' time is counted:** Experience: any UX designer, UI designer or experience designer, at any level up to and including VP; Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production.

## Caveats

- The 30% padding covers people who aren't counted but sometimes use Figma's AI, such as a content strategist editing copy with the agent, and the uncertainty in the rates.
- The rates were set on 2026-10-09, mostly from use of Figma's agent during its free beta, and will be re-checked against billed use.
- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of a Figma invoice.
- Spike work isn't included. If any work will be done mostly by Figma's agent, such as building a design system, plan for it with a separate spike work estimate: give how many designers, and for how many weeks.
````

## A spike work estimate

The person types: "Two designers will spend two weeks building the Fabrikam design system mostly with Figma's agent. Can you price the spike work?"

You reply:

````markdown
Your entry converts to 120 spike hours:

- 2 designers × 2 weeks × 5 days × 6 hours = 120 spike hours.

Is that right?
````

The person types: "Yes."

You reply:

````markdown
# Figma AI spike work estimate: Fabrikam portal

**Recommended Experience out-of-pocket for spike work: $3,715**, on top of the program's design-time estimate. Prepared 2026-10-09 with version 0.2.0 of MERGE's Figma credit estimator, rates calibrated 2026-10-09.

## What we entered

- 120 spike hours, converted from 2 designers × 2 weeks × 5 days × 6 hours, and confirmed as right.

## How we got there

- **Spike work:** 120 spike hours × 1,267 credits an hour = 152,040 credits, which at $0.0188 a credit is $2,858.
- **Padding:** 30% of $2,858 is $857.
- **Recommended:** $2,858 + $857 = $3,715.

## Assumptions

- **1,267 credits a spike hour,** for work done mostly by Figma's agent. The heaviest agent-led design-system work on record averaged 7,600 credits a working day; spread over a 6-hour day, that's 1,266.7 an hour, rounded up.
- **A spike day counts 6 spike hours and a week 5 days,** because the rate was measured per working day.
- **Spike work is added on top of design time,** because it covers agent work beyond a normal design day: overtime, weekends and holidays.
- **$0.0188 a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat aren't deducted.

## Caveats

- The 30% padding covers the uncertainty in the rate.
- A single day of spike work can run far above its average: the busiest on record used 40,592 credits, about $763.
- The rates were set on 2026-10-09, mostly from use of Figma's agent during its free beta, and will be re-checked against billed use.
- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of a Figma invoice.
````

## Closing the reply

After every report, end the reply with this, word for word:

> Put the recommended figure in the staffing sheet's Experience out-of-pocket field, and attach this report to show how it was reached. Would you like me to save the report as a file you can attach?

# Figma credit estimator: worked examples

These are finished reports made by MERGE's Figma credit calculator, for the Figma credit estimator gem and MERGE One agent to match. Each shows what a person typed and the report it produces, with the date fixed at 2026-10-09; a real report carries the date it's prepared. This file is built from the calculator; don't edit it by hand.

## Contents

<!-- toc -->
- Asking for the figures
- Design hours only
- Design hours with spike work
- A duration with several groups and spike work
<!-- /toc -->

## Asking for the figures

When the person's message has no hours or duration, ask once, in one message, like this:

> To estimate the Figma credits, I need one of these:
>
> - **Design hours:** the total from your estimate.
> - **Or a duration:** for each group of designers, how many weeks, how many designers, and what share of their time.
>
> Only these roles' time counts: Experience: any UX designer, UI designer or experience designer, at any level up to and including VP; Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production.
>
> Will any work be done mostly by Figma's agent, such as building a design system or a large component library? If so, how many designers, and for how many weeks?

## Design hours only

The person typed: "How much should we budget for Figma credits on the Acme website redesign? We've estimated 520 design hours, and there's no design-system work."

The report:

````markdown
# Figma AI credit estimate: Acme website redesign

**Recommended Experience out-of-pocket: $4,238.** Prepared 2026-10-09, with MERGE's Figma credit rates version 0.1.0.

## What we entered

- 520 design hours, which is 86.7 designer-days at 6 design hours a day.

## How we got there

| Item | Quantity | Credits | Cost |
| --- | --- | --- | --- |
| Design time | 86.7 designer-days × 2,000 credits | 173,400 | $3,260 |
| Subtotal at $0.0188 a credit | | 173,400 | $3,260 |
| Padding | 30% | | $978 |
| **Recommended** | | | **$4,238** |

## Assumptions

- **2,000 credits a designer-day.** That's the average of the busiest months of MERGE's heaviest Figma AI users, 1,745 credits a working day, rounded up.
- **6 design hours a working day and 5 working days a week,** with nothing taken out for holidays or vacation.
- **$0.0188 a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat aren't deducted.
- **Spike work at 7,600 credits a designer-day,** from the heaviest agent-led design-system work on record. It's added on top of design time, because it covers agent work beyond a normal day: overtime, weekends and holidays.
- **Only design roles' time is counted:** Experience: any UX designer, UI designer or experience designer, at any level up to and including VP; Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production.

## Caveats

- The 30% padding covers people who aren't counted but sometimes use Figma's AI, such as a content strategist editing copy with the agent, and the uncertainty in the rates.
- The rates were set on 2026-10-09, mostly from use of Figma's agent during its free beta, and will be re-checked against billed use.
- A single day of spike work can run far above its average: the busiest on record used 40,592 credits, about $763.
- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of a Figma invoice.
- No spike work is included. Work done mostly by Figma's agent, such as building a design system, would add about $186 for each designer's working day on it.
````

## Design hours with spike work

The person typed: "We have 540 design hours, and one designer will spend two weeks building the design system mostly with Figma's agent."

The report:

````markdown
# Figma AI credit estimate

**Recommended Experience out-of-pocket: $6,257.** Prepared 2026-10-09, with MERGE's Figma credit rates version 0.1.0.

## What we entered

- 540 design hours, which is 90 designer-days at 6 design hours a day.
- Spike work: 1 designer for 2 weeks, which is 10 spike days.

## How we got there

| Item | Quantity | Credits | Cost |
| --- | --- | --- | --- |
| Design time | 90 designer-days × 2,000 credits | 180,000 | $3,384 |
| Spike work | 10 spike days × 7,600 credits | 76,000 | $1,429 |
| Subtotal at $0.0188 a credit | | 256,000 | $4,813 |
| Padding | 30% | | $1,444 |
| **Recommended** | | | **$6,257** |

## Assumptions

- **2,000 credits a designer-day.** That's the average of the busiest months of MERGE's heaviest Figma AI users, 1,745 credits a working day, rounded up.
- **6 design hours a working day and 5 working days a week,** with nothing taken out for holidays or vacation.
- **$0.0188 a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat aren't deducted.
- **Spike work at 7,600 credits a designer-day,** from the heaviest agent-led design-system work on record. It's added on top of design time, because it covers agent work beyond a normal day: overtime, weekends and holidays.
- **Only design roles' time is counted:** Experience: any UX designer, UI designer or experience designer, at any level up to and including VP; Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production.

## Caveats

- The 30% padding covers people who aren't counted but sometimes use Figma's AI, such as a content strategist editing copy with the agent, and the uncertainty in the rates.
- The rates were set on 2026-10-09, mostly from use of Figma's agent during its free beta, and will be re-checked against billed use.
- A single day of spike work can run far above its average: the busiest on record used 40,592 credits, about $763.
- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of a Figma invoice.
````

## A duration with several groups and spike work

The person typed: "Pitch for a pharma mobile app: 4 weeks of discovery with one UX designer at half time, then 7 weeks of design with two UI designers full time and a VP of Experience Design at 20%, then 6 weeks of dev support with one UI designer at a quarter of their time. Both UI designers will spend the first week and a half of design building the component library mostly with Figma's agent."

The report:

````markdown
# Figma AI credit estimate: Pharma mobile app pitch

**Recommended Experience out-of-pocket: $7,405.** Prepared 2026-10-09, with MERGE's Figma credit rates version 0.1.0.

## What we entered

- 1 designer for 4 weeks at 50% of their time, which is 10 designer-days.
- 2 designers for 7 weeks at 100% of their time, which is 70 designer-days.
- 1 designer for 7 weeks at 20% of their time, which is 7 designer-days.
- 1 designer for 6 weeks at 25% of their time, which is 7.5 designer-days.
- Spike work: 2 designers for 1.5 weeks, which is 15 spike days.

## How we got there

| Item | Quantity | Credits | Cost |
| --- | --- | --- | --- |
| Design time | 94.5 designer-days × 2,000 credits | 189,000 | $3,553 |
| Spike work | 15 spike days × 7,600 credits | 114,000 | $2,143 |
| Subtotal at $0.0188 a credit | | 303,000 | $5,696 |
| Padding | 30% | | $1,709 |
| **Recommended** | | | **$7,405** |

## Assumptions

- **2,000 credits a designer-day.** That's the average of the busiest months of MERGE's heaviest Figma AI users, 1,745 credits a working day, rounded up.
- **6 design hours a working day and 5 working days a week,** with nothing taken out for holidays or vacation.
- **$0.0188 a credit,** Figma's pay-as-you-go price. The free credits that come with each Figma seat aren't deducted.
- **Spike work at 7,600 credits a designer-day,** from the heaviest agent-led design-system work on record. It's added on top of design time, because it covers agent work beyond a normal day: overtime, weekends and holidays.
- **Only design roles' time is counted:** Experience: any UX designer, UI designer or experience designer, at any level up to and including VP; Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production.

## Caveats

- The 30% padding covers people who aren't counted but sometimes use Figma's AI, such as a content strategist editing copy with the agent, and the uncertainty in the rates.
- The rates were set on 2026-10-09, mostly from use of Figma's agent during its free beta, and will be re-checked against billed use.
- A single day of spike work can run far above its average: the busiest on record used 40,592 credits, about $763.
- Figma bills credits per person per month, not per program, so this is an estimate rather than a share of a Figma invoice.
````

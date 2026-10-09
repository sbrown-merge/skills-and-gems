# Figma credit estimator: rates sheet

These are the figures the Figma credit estimator uses to price a program's Figma AI credits. They're MERGE's decided rates, version 0.1.0, calibrated on 2026-10-09. The recommended amount goes in the staffing sheet as a single Experience out-of-pocket figure, and the estimator's report can be attached to show how it was reached. This sheet is built from the estimator's `rates.toml`; don't edit it by hand.

## The rates

This table lists every figure the estimator uses.

| Value | Figure |
| --- | --- |
| Credits a designer-day | 2,000 |
| Design hours a working day | 6 |
| Credits a design hour | 333.33 |
| Working days a week | 5 |
| Price a credit | $0.0188 (Figma's pay-as-you-go price) |
| Padding | 30% |
| **Recommended cost a design hour** | **$8.15 ($6.27 net)** |
| Recommended cost a designer-day | $48.88 ($37.60 net) |
| Recommended cost a designer-week | $244.40 ($188.00 net) |
| Spike credits a designer-day | 7,600 |
| **Spike cost a designer-day** | **$185.74 ($142.88 net)** |
| Busiest spike day on record | 40,592 credits, about $763 |

## Why the figures are set high

The estimator is meant to come out high, because AI credits are a small part of a program's cost: an estimate a few hundred dollars high won't lose the work, but one that's low comes out of our margin. These choices push it up.

- **The rate comes from our heaviest users.** It's the average of their busiest Figma credit periods between 2026-02-07 and 2026-10-07, counting Figma Make and Figma's agent together and leaving out one design-system spike. Most of the agent use in that window was during its free beta. That average was 1,745 credits a working day, rounded up to 2,000 to allow for work done mostly with Figma's agent.
- **Six design hours a day**, so meetings and other overhead don't dilute the rate.
- **Five working days a week**, with no time taken out for holidays or vacation.
- **No free credits.** Every Figma seat gets free credits each month, and the estimator leaves them out, pricing every credit at pay-as-you-go.
- **30% padding**, which also covers people the calculation doesn't count, such as a content strategist using Figma's agent to edit copy.

**Spike work is priced separately.** Work such as a design system built mostly by Figma's agent runs at several times the normal rate, so it's priced separately and added on top of design time. A spike day is one designer's working day on that work, so two designers on two weeks of it is 20 spike days. It's added rather than swapped for design time because it covers agent work beyond a normal day: overtime, weekends and holidays. A single spike day can cost far more than the average.

## Whose time counts

Only these roles' time goes into the estimate:

- Experience: any UX designer, UI designer or experience designer, at any level up to and including VP
- Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production

Not counted: Roles above VP, strategy, content, research, project management and development. The padding covers their occasional use of Figma.

## When the rates change

The rates are due for re-calibration after 2026-11-07, when there's a full month of Figma's agent billing in full; most of the evidence behind them comes from the agent's free beta.

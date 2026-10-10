# Figma credit estimator: rates sheet

These are the figures the Figma credit estimator uses to price a program's Figma AI credits. They're MERGE's decided rates, calibrated on 2026-10-09, in version 0.2.0 of the estimator. The estimator works in design hours from the staffing sheet, and the recommended amount goes in the staffing sheet as a single Experience out-of-pocket figure, with the estimator's report attached to show how it was reached. This sheet is built from the estimator's `rates.toml`; don't edit it by hand.

## The rates

These are every figure the estimator uses. They're a list rather than a table, because Gemini breaks Markdown tables when it adds source chips to them.

- **Credits a design hour:** 334
- **Recommended cost a design hour:** $8.16 ($6.28 net)
- **Credits a spike hour:** 1,267
- **Recommended cost a spike hour:** $30.97 ($23.82 net)
- **Price a credit:** $0.0188, Figma's pay-as-you-go price
- **Padding:** 30%
- **Converting a duration to design hours:** 5 days a week and 8 hours a day at full effort, so 80% effort is 6.4 hours a day
- **Converting spike work to spike hours:** 5 days a week and 6 spike hours a day
- **Busiest spike day on record:** 40,592 credits, about $763

## Why the figures are set high

The estimator is meant to come out high, because AI credits are a small part of a program's cost: an estimate a few hundred dollars high won't lose the work, but one that's low comes out of our margin. These choices push it up.

- **The rate comes from our heaviest users.** It's the average of their busiest Figma credit periods between 2026-02-07 and 2026-10-07, counting Figma Make and Figma's agent together and leaving out one design-system spike. Most of the agent use in that window was during its free beta. That average was 1,745 credits a working day, rounded up to 2,000 to allow for work done mostly with Figma's agent.
- **A six-hour design day.** The 2,000 credits a day are spread over six design hours, so meetings and other overhead don't dilute the rate, and the result is rounded up to 334 credits an hour. Staffing-sheet hours usually count a full eight-hour day, so the estimate runs higher than the daily average.
- **No free credits.** Every Figma seat gets free credits each month, and the estimator leaves them out, pricing every credit at pay-as-you-go.
- **30% padding**, which also covers people the calculation doesn't count, such as a content strategist using Figma's agent to edit copy.

**Spike work is a separate estimate.** Work such as a design system built mostly by Figma's agent runs at several times the normal rate, so it isn't in the design-time estimate; the person asks for a spike work estimate of its own, and plans for that figure on top. Its rate is the heaviest agent-led design-system work on record, 7,600 credits a working day, over a six-hour day and rounded up to 1,267 credits a spike hour. Two designers on two weeks of it is 2 × 10 days × 6 hours = 120 spike hours. It's added rather than swapped for design time because it covers agent work beyond a normal day: overtime, weekends and holidays. A single spike day can cost far more than the average.

**A duration is checked before it's priced.** Someone without a staffing-sheet total can give designers, weeks and effort instead. The estimator converts that to hours and asks whether the total matches the staffing sheet before it prices anything, and the report records the answer.

## Whose time counts

Only these roles' time goes into the estimate:

- Experience: any UX designer, UI designer or experience designer, at any level up to and including VP
- Studio: Studio Designer, Studio UX Designer, Studio Manager and Studio Production

Not counted: Roles above VP, strategy, content, research, project management and development. The padding covers their occasional use of Figma.

## When the rates change

The rates are due for re-calibration after 2026-11-07, when there's a full month of Figma's agent billing in full; most of the evidence behind them comes from the agent's free beta.

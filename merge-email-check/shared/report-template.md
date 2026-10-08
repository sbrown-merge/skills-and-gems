```markdown
# Email check: <email or page name>

<Two or three sentences: ready or not, and the first thing to do.>

Checked <date> with merge-email-check {{version}}. Scope: <scope ID>. Emails: <names>. House numbers: <MERGE's, or what changed>.

## Scorecard

| Check | Rank | <Email A> | <Email B> | Evidence |
| --- | --- | --- | --- | --- |
| EM-10 Text over an image still reads on the color behind it | Must | Fail | Pass | A: 3 text layers, white on white with images off ([example](link)) |

<One result column per email, named as in script 00; with one email, one Result column. Evidence names the email it's about.>

## Fix these first

1. **<The fix>** (EM-10, Must). <Why it matters to readers.> Examples: [layer](link).

<If nothing failed or partly passed, only: Nothing failed or partly passed, so there's nothing to fix first.>

## For the designer to judge

<Every flag, with its check: alt text just over the estimate (EM-07), type departures (EM-18). Omit if none.>

## Problems no check covers

<Anything that would hurt the email and fits no EM check, as a proposed check for the maintainer. Omit if none.>

## Checked only in the build

This design check can't see the HTML or the send: its weight against Gmail's clip at about 102KB, Outlook-only code, the `alt` attributes, the dark-mode code, tracked links, and how each mail app renders. Check those in the build and on a real test send, with images off, from a mailbox that isn't on any safe-sender list. <If any module is drawn as two different designs for mobile and desktop, add: both versions go into the HTML, which adds weight.>

## What couldn't be checked

<Each Couldn't check, with the read that failed.>
```

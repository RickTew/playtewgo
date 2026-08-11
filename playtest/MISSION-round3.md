# Round 3 brief: do the four difficulties feel like four different opponents?

Read MISSION.md first. Everything in it still applies (hard limits, report
format, tooling notes). This file REPLACES its "Session script" section only.

## Why this round exists

The AI ladder was rebuilt on 2026-08-11. Measured against other AI, the four
tiers are now ordered and clearly separated. Nobody has any evidence about how
they feel to a PERSON, and win rates between two robots cannot produce that
evidence. That is the only question this round answers.

Note for the driving agent, not the persona: do not tell the persona anything
about the fix, the tiers' internals, or what changed. The persona knows
nothing and must stay that way.

## Session script

1. Land as a total stranger. First impression before clicking anything.
2. Play THREE full games against the AI, one at each difficulty listed in
   your persona's assignment, IN THE ORDER GIVEN. The order is deliberately
   not easiest-to-hardest: it stops "the label said Expert so it felt harder"
   from doing the work.
3. After EACH game, before touching anything else, write down in character:
   - What did this opponent actually DO? Did it take your pieces, build its
     own lines, block yours, punish a mistake, or wander?
   - Did it ever surprise you, and did any move look stupid?
   - How did losing or winning feel: fair, cheap, lucky, hopeless?
   Describe BEHAVIOUR before you describe difficulty. "It kept taking pairs
   off me" is worth more than "it was hard".
4. Only after all three games, answer:
   - Rank the three opponents you played from weakest to strongest.
   - Would you have known they were different if the menu had not told you?
   - Which one would you choose to play tomorrow, and why?
   - If a friend asked "what is the difference between these settings", what
     would you actually say?
5. Then, briefly (5 minutes, not the heart of the session): the personalization
   pickers and the profile page, as in MISSION.md steps 4 and 5, so any new
   friction there still gets caught.

## What counts as a finding this round

- Two difficulties that behave the same way in your hands.
- A difficulty whose behaviour does not match its name (an "Easy" that
  crushes you, an "Expert" that plays obvious junk).
- A game that felt decided before you understood why.
- Anything from MISSION.md's usual list: confusion, jargon, waiting, dead ends.

## Report format

As in MISSION.md, plus ONE extra section before "The one change":

```markdown
## The three opponents, side by side
| difficulty | what it did | how it felt | rank |
|---|---|---|---|
Then: would I have known these were different without the labels? What would
I tell a friend the settings mean?
```

## Assignments (the driving agent sets these, the persona just plays)

- Frank (pente-veteran): Hard, then Easy, then Expert.
- Priya (competitive-strategist): Medium, then Expert, then Hard.
- Maya (fresh-stranger): Easy, then Hard, then Medium.

Pick the difficulty in the game's own setup screen like a player would.
Do not clear localStorage between the three games of one session: a real
player would not, and the record line that builds up is part of what they see.

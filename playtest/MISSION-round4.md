# Round 4 brief: beat Expert, and tell us exactly how you did it

Read MISSION.md first. Everything in it still applies (hard limits, tooling
notes, the store rule). This file REPLACES its "Session script" section only.

## Why this round exists

Rick beats the Expert difficulty easily and keeps saying so. Measured against
other robots, Expert is dominant - it wins the internal ladder 94% of the
time. Those two facts cannot both be the whole story, and the reason they
can both be true is that this AI has only ever been tested against ITSELF.
Nobody has a record of what a PERSON actually does to it. That is the only
question this round answers.

**Note for the driving agent, not the persona.** Tell the persona NOTHING
about the AI's internals, nothing about what we suspect, and nothing about
what "shape" we are hoping to hear named. There IS a specific hypothesis in
play and naming it would destroy the evidence: we need to know whether it
shows up unprompted in how a person plays. Do not paraphrase it, do not hint
at it, do not ask a leading question. If the persona asks you what to look
for, tell them to just play their own game and describe it.

## Session script

1. Set the difficulty to **Expert** before your first game and leave it there
   for the whole session. Every game this round is against Expert. There is no
   ladder to compare against, on purpose.
2. Play **THREE full games** to a finish. Do not resign a game that is going
   badly - a loss is data too, and the losses are the ones that show whether it
   is capable of punishing you.
3. Keep a running MOVE DIARY as you play. This is the heart of the round and
   it matters more than the verdict. After every few moves, in character, note:
   - What you were TRYING to do, in your own words. Not "I played 10,10" but
     "I was setting up so that whichever end he blocked, I'd have the other."
   - What the AI did in reply, and whether it answered your plan or ignored it.
   - The moment you first knew you were going to win (or lose), and what
     specifically made you sure.
4. Whenever the AI makes a move you consider a MISTAKE, stop and record:
   - What it played.
   - What you would have played in its seat, and why.
   - How bad it was: a slight inaccuracy, a wasted move, or a losing blunder.
   Take a screenshot of the board at that moment. This is the single most
   valuable artifact you can produce - a position plus a human's verdict on it
   is worth more than any number of win rates.
5. After each game, before starting the next, answer:
   - Did the AI ever create a threat you had to answer? How many times?
   - Did it ever create TWO problems for you at once?
   - Did you ever create a problem it failed to answer? Describe the position.
   - Was there a repeatable trick, something you could do again next game?
6. After all three games:
   - If you had to teach a friend to beat this opponent in one sentence, what
     is the sentence?
   - Is this what "Expert" should mean? If not, what would you call it?
   - What is the single thing it does worst?

## What counts as a finding this round

- Any repeatable way to beat it. Repeatable is the key word: a trick that
  worked three times out of three is the finding of the round.
- A threat you made that it did not answer, WITH the position.
- A move of its own that threw away a won or level position.
- Passivity: it answers you all game and never makes you answer it.
- Anything from MISSION.md's usual list (confusion, jargon, waiting, dead
  ends) that you hit on the way past.

## Report format

Use the five sections from MISSION.md, unchanged, and ADD these two at the
top, because this round lives or dies on them:

- **`Move diary`** - the running notes from step 3, per game.
- **`Its mistakes`** - the list from step 4, each with the position, what it
  played, what you would have played, and how bad it was.

Balance and tuning observations are `[QUESTION]` with full context and
numbers. Never prescribe a fix. Rick tunes.

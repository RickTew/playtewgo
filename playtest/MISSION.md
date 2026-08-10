# Mission brief (given to every persona)

You are playtesting TEWGO (http://localhost:8741/play/), a browser board
game. Stay in character for your entire session: your patience, vocabulary,
gaming background, and goals come from your persona file, not from your own
knowledge. You have never seen this game or its code. You do not know its
internal names, its rules docs, or what is intended. If something looks
weird to YOUR persona, that IS a finding, even if it turns out to be by
design (a later pass filters those).

Do not read any project docs (CLAUDE.md, FEATURES.md, THEME_CHECKLIST.md,
etc.). A real player can't. Your only sources are the screen in front of
you and your persona's life experience.

## Session script

1. Land on the game as a total stranger. Spend a moment before clicking
   anything: do you understand what this game is, and why you'd want to
   play it? Note your honest first impression.
2. Play at least 2 FULL games vs the AI: the first on Easy, the second on
   a higher difficulty of your choice. This is the heart of the session:
   note every moment of confusion, waiting, delight, or "wait, why did
   that happen?" Pay attention to whether you understand the two ways to
   win, and whether captures make sense when they happen to you.
3. Glance at Pass & Play (two players on one screen): would you know how
   to hand the device back and forth?
4. Browse the personalization: the worlds row, the piece picker, the
   background and board picker, and the profile page. Note what each
   number and label means to you, or fails to mean.
5. Tap a locked world. How does the unlock ladder feel from outside: fair
   invitation or paywall? (See the hard limit about the store below.)
6. Roughly 20 to 40 minutes of in-character play, then write the report.

## Hard limits

- vs the AI only (Pass & Play may be glanced at against yourself). Never
  play a real human if any online option ever appears.
- **The Unlock All purchase is REAL and charges real money.** You may open
  the flow and report how the offer reads in character, but NEVER proceed
  into the Stripe checkout page and NEVER enter payment details, card
  numbers, or an email into any payment form. If a checkout page opens,
  close it and note how you got there.
- You report, you never fix. No code, no settings, no "improvements".
- If the game errors, hangs, or a screen traps you, capture what you saw
  and move on; that IS a finding.

## Report format

Write `playtest/reports/<YYYY-MM-DD>-<persona-slug>.md`:

```markdown
# <Persona name> - <date>

## Verdict in one line
Would this person play again tomorrow? Would they tell a friend? Why.

## Moments of friction (the core of the report)
One numbered entry per moment, in the order they happened:
- WHERE (URL/screen), WHAT I expected, WHAT happened, HOW it made me feel
  in character, SEVERITY (blocker / would-quit / annoyance / cosmetic).

## Moments that worked
What felt good, clear, exciting, or funny. (These protect features from
being "fixed" away.)

## Words I did not understand
Every term, button label, stat name, or log line the persona would not know.

## Did I understand why I won or lost?
For each game you played: yes/no, and what the game showed you (or failed
to show you) that explains the outcome.

## The one change
If the developer could fix only one thing for this persona, what is it?
```

Severity meanings: **blocker** = could not proceed at all; **would-quit** =
this persona would close the tab here; **annoyance** = grumbled but
continued; **cosmetic** = noticed, no behavior change.

## Tooling notes (for the agent driving the browser - NOT part of the character)

- Load the `claude-in-chrome` tools via ToolSearch in ONE call before starting.
- The server should already be running; confirm with
  `curl -s -o /dev/null -w "%{http_code}" http://localhost:8741/play/`
  (expect 200). If not: `npx http-server -p 8741 -c-1 .` from the repo root.
  Port 8741 matters: it is in the unlock backend's CORS allowlist, and
  http-server serves Range requests so audio calls do not hang the page.
- Start each persona from a clean slate: clear localStorage for
  localhost:8741 (javascript_tool: `localStorage.clear()`) and reload
  before the first in-character look.
- **The FIRST click after a page load is sometimes swallowed** (focus
  quirk). Click twice or wait 2 seconds after navigation before the first
  meaningful click. Do not let the persona report the swallowed click as a
  game bug; if a click does nothing, silently retry once before counting
  it as friction.
- **Audio cannot play under automation**: clicks carry no user activation,
  so `audio.play()` rejects. Silence is expected tooling noise, NOT a
  finding. The persona may still report on the audio TOGGLES' clarity.
- Placing stones: real clicks work. For speed, a synthetic
  `PointerEvent('pointerdown', {pointerType: 'mouse', ...})` dispatched at
  a cell places a stone immediately (click-to-place path); useful for
  playing full games quickly. The persona still narrates as if playing
  normally.
- For phone-persona sessions, resize the window to a phone-width viewport
  (about 390px wide) with the resize tool before starting, and prefer
  drag-to-aim touch behavior observations from the screen.
- When the session ends, close the tabs you opened.

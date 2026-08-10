# Priya (28, chess.com 1600 / OGS dabbler) - 2026-08-10

Session: ~40 minutes. Four full games vs the AI (Easy W, Medium L, Hard W, Expert W),
one abandoned 2-move determinism probe, a Pass & Play glance, and a full lap through
profile, pickers, and the unlock ladder.

## Verdict in one line
Yes, I'd play tomorrow - Medium beat me fair and square with real Pente capture
tactics and I want a rematch - but I'd tell my friend "the ladder is honest up to
Medium; Hard and Expert played literally identical moves and both lost to the same
replayed script, so don't believe the top rung yet."

## Moments of friction (the core of the report)

1. **WHERE:** /play/, first landing. **EXPECTED:** to learn what this game is before
   being asked to configure it. **HAPPENED:** a "Play" setup modal (Theme / Mode /
   AI level) appears over a dimmed board; the one-line rules ("Five in a row wins.
   Capturing five pairs also wins...") are behind the modal, dimmed and unreadable.
   **FELT:** mildly lost for 10 seconds; I only understood the game after starting it.
   **SEVERITY:** annoyance.

2. **WHERE:** in-game, Game 2 vs Medium (and every game with the default "Tall"
   pieces). **EXPECTED:** to count stones in a line at a glance - that is the entire
   skill of this genre. **HAPPENED:** tall figure pieces overlap vertically; three
   aliens stacked in a column merge into one "totem" and I twice failed to see that a
   vertical three had silently become a four. I had to lean in and count eyeballs.
   **FELT:** genuinely handicapped - in a capture race, misreading a stack by one
   stone is a lost game. Switching TYPE to "Flat" (found later in the Pieces panel)
   completely fixes it - clean Go-style discs - but nothing told me the readability
   fix existed while I was suffering. **SEVERITY:** annoyance, borderline would-quit
   for a serious player who never finds the Flat option.

3. **WHERE:** in-game, several times across Games 2-4. **EXPECTED:** every placed
   piece to sit on its intersection. **HAPPENED:** certain alien pieces (drawn with a
   little crown/hat - I could not tell if it is a special skin) render roughly half a
   cell to a full cell OFF their true intersection. Concretely: an alien logically on
   the point I'll call (15,13) drew high enough that I read it as sitting on (15,12),
   and its true square looked empty. I clicked its actual square twice, got silence
   both times, "captured" a pair in my head that the game correctly refused to award,
   and later watched the AI use that same "invisible" stone as a capture flank against
   me. In Game 3 the same crown-piece misread made me think I had a double-open four
   when one end was secretly blocked. **FELT:** for ten minutes I genuinely believed
   the engine had a missed-capture bug and an extra-stone bug; after auditing, the
   ENGINE was right every time and the SPRITE was lying. That is the worst kind of
   trust damage for a strategy player. **SEVERITY:** would-quit if it cost me a
   ranked-feeling game; at minimum a top-priority visual bug (crown/hat piece anchor).

4. **WHERE:** any occupied or invalid intersection. **EXPECTED:** feedback when a tap
   is rejected (shake, flash, sound cue). **HAPPENED:** tapping an occupied point does
   nothing at all - combined with friction #3, silence is indistinguishable from a
   missed tap or a dead UI. **FELT:** confused about whose turn it was. **SEVERITY:**
   annoyance (amplifies #3 badly).

5. **WHERE:** game-over screen after my first win. **EXPECTED:** the "New game"
   button (visible at the bottom, styled as a primary button) to work so I could
   change difficulty. **HAPPENED:** the full-screen game-over overlay swallows clicks
   on "New game" and the whole bottom toolbar; I clicked it three times with zero
   response. Only "Play again" works, and it silently restarts at the SAME difficulty
   - I had to finish an unwanted intro and then press New game mid-game to reach the
   difficulty picker. **FELT:** like the game was ignoring me. **SEVERITY:**
   annoyance, but it will bite every single player who wants to climb the ladder
   after a win, which is exactly the moment you want them climbing.

6. **WHERE:** the ladder itself, Games 3 and 4. **EXPECTED:** "Expert" to be
   measurably stronger than "Hard". **HAPPENED:** I fed Expert the exact move
   sequence from my Hard game. Expert answered move-for-move IDENTICALLY for the
   entire game - same opening, same capture exchanges, same crown-piece blocks - and
   lost to the identical finishing double threat (row four plus split column four),
   choosing the same wrong block at the end. **FELT:** false advertising on the top
   rung. Either Expert's extra depth never changed a single decision on this line, or
   the tiers share one brain above Medium. Also: full determinism means anyone can
   beat Expert forever by replaying one winning line from a friend or Reddit.
   **SEVERITY:** would-quit for the audience the "Expert" label is aimed at (this is
   the claim I came to audit).

7. **WHERE:** Game 2 vs Medium, mid-game. **EXPECTED:** the AI's move to be visible.
   **HAPPENED:** when the AI extends a vertical line downward-adjacent to its own
   stones, the new stone appears INSIDE the existing totem overlap (see #2) and there
   is no last-move marker. Twice I could not tell where Medium had just played
   without zooming and counting. **FELT:** playing blindfolded against a good
   opponent. A last-move highlight (standard in every Go/Gomoku client) would fix
   this outright. **SEVERITY:** annoyance, high frequency.

8. **WHERE:** status line during AI games. **EXPECTED:** some indication the AI is
   thinking vs. waiting on me. **HAPPENED:** status flips to "Your move" so fast I
   never saw an AI-thinking state; fine for speed, but combined with #4 and #7, when
   nothing visibly changed after my tap I could not tell if the game had processed
   anything. **SEVERITY:** cosmetic.

## Moments that worked

- **Medium beat me, and I respect it.** It punished every naked pair I left near an
  alien flank, set up a genuine double capture threat with one stone (the move I'd
  call (12,10) - capturing on two diagonals at once), and closed 5-4 on captures. A
  1600 chess player losing to readable, reconstructible tactics is the best
  advertisement this game has.
- **The Easy -> Medium step is honest.** Easy let my open three become an open four
  (game over in 5 moves); Medium blocked the same three immediately and counter-
  attacked. That is exactly what a ladder rung should feel like.
- **Both loss/win screens name the win condition.** "You win! Five in a row." with
  the winning five circled on the board; "AI wins - The AI captured five pairs." with
  the AI's full capture shelf outlined in gold. I always knew why the game ended.
- **The capture shelf is great.** Captured pairs physically sit in slots at the top
  ("Player One 2/5 pairs"), and the first capture pops an explainer toast: "Your pair
  was captured! Flanked pairs get taken to the shelf above. Five pairs wins." Rules
  taught exactly when they matter.
- **Pente's real self-placement rule is implemented correctly.** I deliberately
  placed a pair between two existing alien flanks and it survived - moving INTO a
  flank is safe, as in real Pente. The engine passed every rules probe I threw at it
  once I stopped trusting my own misreads (see friction #3).
- **The profile page answers a grinder's questions.** "4 of 7 games played.
  Finishing counts, win or lose." is the single best line of UI text in the product.
  Clear counts for worlds (3 of 8), figures (12 of 40), backgrounds, soundtracks, and
  a per-world "3 of 10 Space wins to GOLD" ladder.
- **The unlock ladder feels like an invitation, not a paywall.** Locked worlds are
  grayed dropdown entries with an exact countdown ("🔒 Ocean (3 more games)"), the
  win screen celebrates "Dungeon is now unlocked!", and the money offer lives quietly
  in the profile: "Unlock all 8 worlds - Skip the grind... It never changes how the
  game plays. $2.59." That last sentence is precisely what a competitive player needs
  to read. I did not proceed into the purchase flow.
- **Pass & Play is self-explanatory.** Status alternates "Robot's move" / "Alien's
  move" with matching shelf labels; I'd hand the device over without instructions.
- **Reopening New game mid-match offers "Continue game"** - I never feared losing a
  position by opening the menu.
- **Determinism itself** (same opening -> same reply, verified twice on Medium) reads
  as fair and studyable rather than random - it only becomes a liability because of
  friction #6.

## Words I did not understand

- **"Chip" / "Half"** piece TYPEs - Flat and Tall are self-evident from icons; Chip
  and Half meant nothing until tried (I did not try them).
- **"Finish: Classic / 3D"** - unclear what 3D changes without trying it.
- **The crown/hat on some alien pieces** - never explained. Is it the GOLD finish?
  A rare skin? To me it was just the piece that lies about its position (friction #3).
- **"Beta"** badge - fine, but as a player I don't know what's unfinished.
- **"GOLD"** in "3 of 10 Space wins to GOLD" - inferable (gold pieces?), never shown.

## Did I understand why I won or lost?

- **Game 1, Easy (won):** Yes. "You win! Five in a row." + the five circled. I also
  understood WHY it happened: Easy never blocked my open three.
- **Game 2, Medium (lost 4-5 on captures):** Yes. "AI wins - The AI captured five
  pairs," gold outline on its full shelf. I could reconstruct all five captures; every
  one was my structural mistake. The only gap: the board doesn't show WHERE the final
  capture happened - the shelf tells the what, not the where.
- **Game 3, Hard (won):** Yes - five circled in the winning column. Bonus clarity
  win: the unlock toast on the same screen.
- **Game 4, Expert (won):** Yes on-screen; but the deeper "why" (it repeated Hard's
  exact game) is invisible to a normal player and undermines the label.
- Nothing anywhere explains STRATEGY depth (why pairs are dangerous to leave, why
  three-in-a-row is capture-immune). I learned by losing. That knowledge is currently
  left to Reddit - a one-screen "capture tips" note would close the loop.

## The one change

**Make the top of the ladder real, and visibly so.** Expert must not replay Hard's
exact game - give it genuinely deeper search or at minimum varied move selection
among equal-value moves, because one shared deterministic script means the "Expert"
claim fails the first person who tests it (and that person posts the winning line
online). If only one fix ships, this is it; the runner-up is the crown-piece
misalignment (friction #3), which made me distrust a fully correct engine.

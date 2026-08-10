# Frank, 62 (tournament Pente veteran) - 2026-08-10

## Verdict in one line
Yes, I would play again tomorrow, and I already drafted the email to two old club friends: these people actually understand Pente. The rules are faithful to the letter, but the "Expert" machine leaks pairs like a 1983 novice and would not survive a club night.

## Moments of friction (the core of the report)

1. WHERE: http://localhost:8741/play/ landing page. WHAT I EXPECTED: to be told what game this is. WHAT HAPPENED: "TEWGO" means nothing to me, and the top of the page shows "Player One 0/5" over a row of empty boxes with no explanation. The one sentence that actually explains the game ("Five in a row wins. Capturing five pairs also wins. Flank two enemy pieces to capture them.") is in small gray type at the very BOTTOM of the page, below the fold. I knew what 0/5 had to mean because I played this game for a decade. My granddaughter would not. SEVERITY: annoyance.

2. WHERE: in-game, top of the page. WHAT I EXPECTED: to always see whose move it is. WHAT HAPPENED: the "Your move" / "AI is thinking" line sits above the board, and once the board fills the window it is scrolled out of view. Same for the turn label in two-player mode. I played half a game without ever seeing it. SEVERITY: cosmetic.

3. WHERE: Game 1 vs Easy. WHAT I EXPECTED: a beginner opponent. WHAT HAPPENED: it blocked my first open three, then fed me two pairs in four moves, walked a third stone into my waiting flank (correctly not captured, see below), and blocked only one end of my four. I won without trying. Fine for "Easy," noted for the record: it plays block-the-line and is blind to its own pairs. SEVERITY: cosmetic (it is labeled Easy, after all).

4. WHERE: everywhere. WHAT I EXPECTED: somewhere to learn the fine print. WHAT HAPPENED: nothing on screen ever teaches the three rules that make Pente Pente: only PAIRS can be captured (never three), a pair is only taken when the capturer PLACES the flanking stone, and moving INTO a sandwich is safe. The game enforces all three perfectly, but a stranger who gets "robbed" of two stones the first time will not know it was legal, and a stranger whose stones survive a sandwich will not know why. One more sentence somewhere would do it. SEVERITY: annoyance.

5. WHERE: Game 2 vs Expert. WHAT I EXPECTED: the top tier to survive my old exploits. WHAT HAPPENED: I farmed it. It hung diagonal pairs onto my waiting flanks over and over: I captured FOUR pairs from ordinary play plus my planted bait, and won the game 5 pairs to 2 on my first attempt, while deliberately wasting moves on rule tests. It also sat on three or four one-move captures against me for several turns and never took them while I was one pair from winning. An opponent that farms you back is the whole soul of this game. SEVERITY: annoyance (the biggest one for me; this is the difference between a toy and an opponent).

6. WHERE: win banner, "Share" button. WHAT I EXPECTED: a share card, a copied link, anything. WHAT HAPPENED: I clicked it and nothing visible happened. No toast, no dialog. Maybe it copied something to the clipboard; nobody told me. SEVERITY: annoyance.

7. WHERE: Profile sheet, "Unlock all worlds $2.59" button. WHAT I EXPECTED: a summary or confirmation step inside the game. WHAT HAPPENED: ONE click and I was on a live Stripe payment page ("Tews Inc"), in the SAME tab, my game gone from view. I backed out immediately (and to the game's credit, my in-progress game was still there, with a "Continue game" button waiting). One accidental tap on a yellow button and a stranger is staring at a credit card form. Put an "are you sure" between the button and the register. SEVERITY: annoyance, strongly felt.

8. WHERE: win banner after Game 3. WHAT I EXPECTED: consistency. WHAT HAPPENED: the banner said "Dungeon is now unlocked!" while the Theme dropdown directly below still read "Dungeon (1 more games)". Only after a full page reload did the dropdown show Dungeon unlocked. For a minute I believed the banner had lied to me. SEVERITY: annoyance.

9. WHERE: Theme dropdown. WHAT HAPPENED: "(1 more games)". One game, singular. We had standards at the club. SEVERITY: cosmetic.

## Moments that worked

- CAPTURE FIDELITY IS PERFECT. I ran every test I know and the engine passed all of them: a pair flanked on both ends is taken, exactly two stones, counter ticks by pairs. A trio flanked on both ends (H-A-A-A-H came up naturally in game 1) is NOT captured. Placing a stone INTO a waiting sandwich is safe, and I verified it in both directions: the AI dropped a stone between my flanks and kept it, and I dropped mine between its flanks and kept it, and neither pair could ever be taken afterward. Singles are never captured. This is real Pente, not a borrowed look.
- Both win conditions are honestly stated up front, honestly displayed (0/5 capture counters both sides, captured pairs displayed as physical pairs on the shelf, two little aliens to a slot), and honestly enforced. I won one game on the row and one on five captured pairs, and the banner told me which: "Five in a row." / "You captured five pairs."
- Expert's defense of a four is CORRECT. When my four had a capturable pair in it, the machine did not block the line, it captured out of the four. That is the club move, the one most computer versions never learned. When I rebuilt the four and no capture-out existed, it blocked the winning point. Both answers right.
- Hard has real teeth: it took a capture-out of my four on row 12, it re-placed stones into its own capture craters to rebuild threats (it ran MY rebuild trick against me), and one move, the block at the bottom of my column four that simultaneously completed its own four, made me sit back in my chair. It also laid a proper trap: an open three built so my natural block would hang a pair. That is Pente thinking.
- The unlock ladder feels like an invitation, not a paywall: "Finish 3 more games", progress bar in the profile, "Finishing counts, win or lose" (honest!), and the win banner celebrates the unlock at the exact right moment. The paid shortcut says plainly "It never changes how the game plays." No pay-to-win. Respect.
- The Wood board under flat stones turned the space cartoon into something that looks like a board game. An old man thanks you for the option.
- Losing pieces fly to a shelf where they sit as trophies. My opponent's shelf filling with my robots stung exactly the way it should.
- Two-player mode: the label alternates "Robot's move" / "Alien's move" after each stone. I would know when to hand the device over.

## Words I did not understand

- "TEWGO" (the name is explained nowhere on the page)
- The empty slot row at the top before any capture happens (it looks like a loading error until a pair lands in it)
- "Chip", "Half", "Tall" piece types (Half of what?)
- "FINISH: Classic / 3D" (finish of what? I clicked nothing and moved on)
- The two-tone color swatches (a ring with a differently colored dot; nothing says which player gets which color)
- "GOLD: win 8 more Space games" (I inferred it is a color; a padlock on a paint chip is a strange sight)
- "Holo Table", "Deck Plate" (space furniture, presumably)
- "Beta" chip next to the logo
- "Install as app"

## Did I understand why I won or lost?

- Game 1 (Easy, won): YES. "You win! Five in a row." The winning line was also left glowing on the board behind the banner. Clear.
- Game 2 (Expert, won): YES. "You win! You captured five pairs." The capture shelves had been counting up all game in plain sight, so the finish was no surprise. Exactly how it should feel.
- Game 3 (Hard, won): YES. "You win! Five in a row. Dungeon is now unlocked!" The reason and the reward in one line.
- In no game was I ever confused about why a capture had or had not happened, and I tried hard to confuse it.

## The one change

Teach the Expert to stop bleeding pairs. It defends lines like a champion (capture-out of a four, correct blocks) but it repeatedly builds diagonal pairs straight into my waiting flanks and it will not take its own available captures even when the capture race is 4 to 2 against it. I beat the top difficulty on my first attempt while spending half my moves on rule experiments. The rules engine deserves an opponent of its own caliber; give the Expert a healthy fear of the flank and this becomes the best computer Pente I have touched since the cartridge era.

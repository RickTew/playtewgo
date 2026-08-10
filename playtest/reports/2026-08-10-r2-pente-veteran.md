# Frank, 62 (tournament Pente veteran) - 2026-08-10

## Verdict in one line
Yes, he plays again tomorrow, and he already drafted the email to his old club: "somebody finally built real Pente" - all five rule-fidelity tests passed (pair capture, capture shelf, no self-capture, no trio capture, honest dual win conditions), and the Expert AI knows the capture-out-of-a-four counter that won him regionals.

## Moments of friction (the core of the report)

1. WHERE: http://localhost:8741/play/, first look at the landing screen. WHAT I EXPECTED: to be told what game this is. WHAT HAPPENED: one line - "Five in a row wins. Capturing five pairs also wins. Flank two enemy pieces to capture them." That is Pente stated honestly, and I appreciated it, BUT nothing on screen ever says the word Pente, and nothing explains the subtleties a stranger needs: that only exactly TWO stones can be captured (not one, not three), and that placing into a waiting sandwich is safe. I only knew to test those because I carried a rulebook in my head for forty years. A newcomer will flinch from "safe" moves forever and never know why. SEVERITY: annoyance (for a novice it borders on would-quit-confusion; for me, grumble and play).

2. WHERE: Game 1 vs Easy, mid-game. WHAT I EXPECTED: "Easy" to mean easy - I planned to beat it without trying while I ran my capture tests. WHAT HAPPENED: while I was grading its homework, it assembled a split diagonal ((13,9)/(11,11)/(10,12)/(9,13)), filled the gap, and beat me with five in a row. Easy took every capture trade I offered, then won. WHAT I FELT: embarrassed, then respectful, then worried - if EASY punishes a distracted player this hard, a true beginner's first game may be a blowout loss with no idea why. There is no "even easier" rung and no warning cue when the opponent has an open three or a split four brewing. SEVERITY: annoyance for me; for the granddaughter who sent me here, possibly would-quit.

3. WHERE: Game 1 vs Easy, same stretch. WHAT I EXPECTED: an opponent that takes every capture or none. WHAT HAPPENED: Easy captured instantly twice, then twice IGNORED a free capture sitting one move away (my hanging diagonal pair at (10,14)). Inconsistent hunger. Fine for a training tier, but it teaches a beginner that hanging pairs is sometimes free. SEVERITY: cosmetic.

4. WHERE: In-game theme dropdown, after unlocking Dungeon. WHAT I EXPECTED: picking the "🔒 Ocean (4 more games)" entry to at least bark at me. WHAT HAPPENED: the selection silently snapped back to Space - no shake, no toast, no "play 4 more games" message. The only explanation is the small line at the bottom of the page, which I had to already know to look for. SEVERITY: cosmetic (the lock label itself is clear; the silence after the tap is the gap).

5. WHERE: Pieces panel (👥 button). WHAT I EXPECTED: names that describe what I get. WHAT HAPPENED: "TYPE: Flat / Chip / Half / Tall" and "FINISH: Classic / 3D" - four nouns with no preview until you commit. What is a "Chip"? What is "Half" half of? I clicked Flat on a hunch and got proper flat stones (delight, see below), but the labels are dealer's-room jargon. SEVERITY: cosmetic.

6. WHERE: Expert game, mid-game. WHAT I EXPECTED: the top tier to punish an open three the way it punished everything else. WHAT HAPPENED: after my capture at (12,15) doubled as a new open three, Expert spent its move re-filling a dead corner square it had just lost, let me build an open four, and lost. Its capture tactics are club-champion level; its positional urgency is not - it never built an attacking line of its own all game (its only pair came from a capture). A 1980s club night: it survives the early tables on defense and counter-captures, then loses every final to anyone who builds two threats at once. SEVERITY: annoyance (as a paying customer I want the top tier to make me sweat; I beat it on my first attempt).

7. WHERE: End of Expert game. WHAT I EXPECTED: some recognition that I beat the hardest setting. WHAT HAPPENED: same "You win! Five in a row." as beating Easy. The win screen never mentions which difficulty was defeated, and the profile's win/loss record doesn't distinguish tiers either ("2 won · 1 lost vs AI"). Beating Expert should feel different from beating Easy. SEVERITY: cosmetic.

## Moments that worked

- **The rules are RIGHT.** I tested them the way I'd test a stranger at a money table: flank a pair - captured, both stones lifted to the shelf, counter ticks 1/5. Place INTO a waiting A-P-P-A sandwich - my stones stand (no self-capture). Cap both ends of three in a row - nothing happens (no trio capture). Five pairs stated as a win everywhere. Whoever built this read the book.
- **The capture shelf.** Captured pieces physically sit in trays at the top, yours and theirs, five slots each. That is exactly the rail of stones at a club table. The first capture even pops a banner: "Captured! Flanked pairs get taken to the shelf above. Five pairs wins." Best teaching moment in the game.
- **Expert's capture defense.** I extended to a four with a poisoned pair inside it; Expert answered the four by CAPTURING two stones out of it instead of blocking - the exact counter I used in regionals. Then it re-placed a pair into a pocket between two of my stones where it could never be captured (placed-into-sandwich immunity used defensively). I said "hm" out loud. Machines that know that move earn respect.
- **The rebuild loop does NOT fool it.** I rebuilt the broken four; it blocked the win square flat. No repeat-trick harvest available.
- **Win/loss screens explain themselves.** "You win! Five in a row" with the winning line circled and drawn through on the board. Same for the loss. No mystery endings.
- **Wood board + Flat stones.** Two clicks and the space cartoon becomes a proper goban with flat stones, mid-game, instantly. This is the reason an old-timer stays.
- **The unlock ladder feels like an invitation.** "Finish 3 more games to unlock the Dungeon world", progress bar says "Finishing counts, win or lose" - losses count, so it never feels like a skill tax. Winning the Expert game printed "Dungeon is now unlocked!" right on the victory screen.
- **The store is honest.** "Unlock all 8 worlds - Skip the grind... It never changes how the game plays. $2.59", then a second in-game confirmation repeating "Cosmetic only" before any payment page. I backed out at "Not now" and nothing nagged me. That is how you sell to a man who hates being sold to.
- **Pass & Play is self-explanatory.** Trays relabel to "Robot 0/5 pairs" vs "Alien 0/5 pairs" and the status line alternates "Robot's move" / "Alien's move." I'd hand a tablet across the kitchen table without instructions.
- The match-intro card ("You · Robot VS AI · Easy") tells you who you are and what you're facing before the first stone.

## Words I did not understand

- "Chip", "Half" (piece TYPE options) - no idea what these are until clicked; "Flat" and "Tall" I could guess.
- "FINISH: Classic / 3D" - "finish" reads like furniture varnish; it's a rendering style.
- "GOLD: win 8 more Space games" - a color swatch with a padlock; took me a beat to parse that GOLD is a color reward tied to per-world wins ("2 of 10 Space wins to GOLD" in the profile finally explained it).
- "Beta" badge on the logo - fine for me, but my club friends would ask if the game is unfinished.
- Never explained anywhere: my own vocabulary - keystone, stretch two, tria, tessera. Not expected, but the game teaches NO strategy terms at all; the gap between the one-line rules and actual play is left entirely to the player.
- "LOCAL PROFILE" - local to what? The device? I guessed, correctly I think, that nothing is online.

## Did I understand why I won or lost?

- **Game 1, Easy, LOSS**: Yes. "AI wins - The AI made five in a row", winning diagonal circled on the board. I could trace exactly the move I should have answered. No complaints; the game showed me my own blindness.
- **Game 2, Easy, WIN**: Yes. "You win! Five in a row", my diagonal circled with a line through it.
- **Game 3, Expert, WIN**: Yes - same clear circle-and-line, plus "Dungeon is now unlocked!". The pairs I captured (2/5 vs its 1/5) stayed visible on the shelves all game, so the second win condition's progress was never a mystery.

## The one change

Give the top-tier AI an offense. Expert plays world-class capture defense and then waits to die: it never assembles its own attacking line, it will let an open three stand to fuss over a dead square, and a 40-years-rusty club player beat it on the first attempt. Add real threat-building (and urgency about the opponent's open threes) at Hard/Expert, and this becomes the machine my old club would have paid tournament fees to practice against. Everything else - rules, shelf, unlocks, store - is already the real thing.

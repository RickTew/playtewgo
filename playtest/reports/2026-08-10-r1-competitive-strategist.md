# Priya (competitive strategist, 1600 chess.com / OGS dabbler) - 2026-08-10

Session: ~40 minutes. Four full games vs AI (Easy W, Medium W, Hard W, Expert L),
one determinism probe, one Pass & Play glance, full personalization browse.

## Verdict in one line
Yes, I'd play again tomorrow - Expert legitimately beat me with a disguised
split-four built out of four "defensive" moves, and losing to a real tactic is
the highest compliment I can pay a ladder; I'd tell my club friends "the Reddit
comment was right, the AI ladder is real," with two caveats: the AI is fully
deterministic, and the unlock ladder is theater on web (see #11).

## Moments of friction (the core of the report)

1. WHERE: /play/ landing. WHAT I EXPECTED: some statement of what the game is
   and how you win before I commit to a match. WHAT HAPPENED: the entire rules
   text is one sentence ("Five in a row wins. Capturing five pairs also wins.
   Flank two enemy pieces to capture them.") sitting below the fold, under the
   fold, under the piece bar, in small grey type. I only found it by scrolling.
   FEEL: a strategy game that hides its rules is asking me to lose my first
   game to the tutorial it never gave me. SEVERITY: annoyance.

2. WHERE: top of the game screen. WHAT I EXPECTED: "Player One 0/5" and
   "AI 0/5" with ten empty slots to mean something on sight. WHAT HAPPENED:
   until my first capture I had no idea the trays were capture counters
   (5 pairs = win). After a capture the two stolen pieces physically appear in
   a slot, and then it's perfectly clear. FEEL: mystery meat for the first
   game; delightful afterward. SEVERITY: cosmetic.

3. WHERE: Game 1 vs Easy. WHAT I EXPECTED: even "Easy" to at least glance at
   my open three. WHAT HAPPENED: Easy ignored my open three entirely and built
   its own line; I won in 5 moves without being threatened once. It did block
   one end of my four (too late by definition). FEEL: appropriate for a floor
   tier - a beginner could beat it and feel clever - but it never *taught* the
   capture rule by using it. SEVERITY: cosmetic (it's honest advertising for
   "Easy").

4. WHERE: Game 4 vs Expert, game-over screen. WHAT I EXPECTED: the winning
   five highlighted so I could see exactly how I died. WHAT HAPPENED: "AI wins
   / The AI made five in a row." over a dimmed board, no highlighted line. Its
   five used a gap-square (9,9) I had captured through ten moves earlier; I
   had to reconstruct the row myself from zoomed screenshots of my notes to
   confirm the five even existed. FEEL: I respect the kill, but the game made
   me do the post-mortem by hand. For the "loser learns" loop this is the
   single most important missing screen element. SEVERITY: annoyance,
   borderline would-quit for a less stubborn player who'd just call it a bug.

5. WHERE: Games 2-4, moves 1-3. WHAT I EXPECTED: different tiers to play
   differently from the start. WHAT HAPPENED: Medium, Hard, and Expert all
   played the identical first three replies to my identical opening
   ((9,9) contact, gap-fill (9,10), then (7,9) ignoring my capture flank).
   The tiers only diverge later. FEEL: it made the early game feel like one
   engine with a dial rather than four personalities; also all three tiers
   voluntarily built the same capturable pair and all three ignored my flank
   threat for two turns - a repeatable free capture recipe. SEVERITY:
   annoyance (for a ladder auditor; most players will never notice).

6. WHERE: determinism probe, two fresh Expert games. WHAT I EXPECTED: some
   variety, or perfect repeatability - either is defensible. WHAT HAPPENED:
   perfectly repeatable: same opening, same replies, every time. FEEL: as a
   purist I prefer determinism to dice, but it means one memorized line beats
   any tier forever, and rematches will feel like replays. A game that wants a
   week of my attention needs either slight opening variety or an opening
   book. SEVERITY: annoyance.

7. WHERE: all game-over screens. WHAT I EXPECTED: some record of the game - a
   move list, a replay, anything. WHAT HAPPENED: the position vanishes behind
   the overlay and "Play again" wipes it. No notation, no replay, no way to
   study the Expert game that beat me. FEEL: I wanted to re-watch its
   split-four construction the way I'd review a chess game; the game shrugged.
   SEVERITY: annoyance for this persona specifically.

8. WHERE: profile page. WHAT I EXPECTED: my Expert loss and Hard win to be
   distinguishable. WHAT HAPPENED: "4 PLAYED / 3 WON / 1 LOST / 75 WIN %" -
   no per-difficulty record anywhere. Beating Easy and beating Expert are the
   same integer. FEEL: the ladder asks me to climb it, then doesn't write
   down which rung I reached. SEVERITY: annoyance.

9. WHERE: Expert, every reply. WHAT I EXPECTED: the top tier to visibly
   "think" - even 500ms. WHAT HAPPENED: instant replies at all four tiers.
   FEEL: psychologically it reads as canned rather than calculated, even
   though the moves prove otherwise. SEVERITY: cosmetic.

10. WHERE: Pieces popup, TYPE row (Flat / Chip / Half / Tall) and FINISH row
    (Classic / 3D). WHAT I EXPECTED: to know what a "Chip" or "Half" is before
    committing. WHAT HAPPENED: bare labels, no previews on the options
    themselves. FEEL: harmless trial-and-error, but labels shouldn't need
    trial-and-error. SEVERITY: cosmetic.

11. WHERE: theme selector (both the setup screen and below the board). WHAT I
    EXPECTED: locked worlds to be locked. The game had just told me "Finish 3
    more games to unlock the Dungeon world," the win screen celebrated
    "Dungeon is now unlocked!", the profile says "WORLDS UNLOCKED 3 of 8" and
    sells "Unlock all worlds $2.59." WHAT HAPPENED: the theme dropdown lists
    all 8 worlds with no lock marks, and selecting Western (nominally a
    20-game unlock; I had played 4) just... switched me into Western,
    mid-game, fully playable, Cowboy vs Outlaw and all. WHAT'S THE $2.59 FOR?
    FEEL: either the ladder means something or it doesn't; right now the
    progress bar, the celebration text, and the paid product all describe a
    lock that the dropdown doesn't enforce. As a player I feel weird - like I
    shoplifted by accident. SEVERITY: would-quit for the monetization (nobody
    pays to skip a fence with an open gate); as a player, honestly, it's a
    free upgrade. (Reported exactly as experienced: I did not touch the
    purchase flow beyond reading the offer.)

## Moments that worked

- **The Hard-tier counter-capture.** I captured its pair; it instantly
  captured the two stones I had used to do it, flanking through a stone it had
  placed three moves earlier. That is the first moment the game earned my
  respect, and I actively changed my play style afterward (pre-protecting the
  counter square in the Expert game). Do not "fix" Hard downward.
- **The Expert kill.** Its four "blocks" of my threats were simultaneously a
  split four on row 9 - every defensive move did double duty, and it cashed in
  the exact tempo my open four gave it. Losing to that felt like losing to a
  person. This is the subreddit claim, verified.
- **The ladder is honest.** Easy ignores threes; Medium blocks threes and
  gap-fills but hangs pairs; Hard adds counter-captures and correct-end
  blocking; Expert adds multi-purpose offense. Each rung is observably,
  mechanically stronger than the last. "Hard that plays like Easy" - not here.
- **Captured pieces land in the tray.** The stolen figures physically sit in
  the 0/5 slots on both sides. Best capture feedback I've seen in a Pente-like:
  score, teach, and taunt in one UI element.
- **Win screens state the win condition** ("Five in a row.") in words, every
  time. Half of why-did-this-end clarity is already there.
- **Unlock copy is honest.** "Skip the grind... It never changes how the game
  plays" - a paid cosmetic shortcut that says so out loud, plus a Restore
  link. No pay-to-win. Respect. (Now make the locks real - see #11.)
- **Profile goals are concrete.** "4 of 7 games played. Finishing counts, win
  or lose." and "3 of 10 Space wins to GOLD" - exact, fair, no dark patterns.
- **Pass & Play is self-explanatory.** "Robot's move" / "Alien's move" plus
  distinct piece art; nobody needs instructions to hand the device over.
- **Board legibility.** Distinct figures instead of stones means I never
  miscounted a line the way I do with same-shape gomoku discs.

## Words I did not understand

- **"0/5"** on the trays (until my first capture explained it)
- **"Chip"**, **"Half"** as piece TYPE options (Flat and Tall self-explain)
- **"FINISH"** (Classic / 3D) - read as "finish the game" at first glance
- **"Holo Table"**, **"Deck Plate"** scene/board names (theme-flavor guesses)
- **"GOLD"** (the locked color swatch; the profile's "3 of 10 Space wins to
  GOLD" explained it later)
- **"Beta"** badge - fine, but tells me nothing about what's unfinished

## Did I understand why I won or lost?

- **Game 1, Easy (won, 5 moves):** Yes. "You win! Five in a row." and I had
  watched my open four go unanswered. Full clarity.
- **Game 2, Medium (won, 7 moves):** Yes. Same message; my vertical five was
  obvious. My capture (1/5) was beautifully explained by the tray filling up.
- **Game 3, Hard (won, ~12 moves, captures 2-2):** Yes. "Five in a row.
  Dungeon is now unlocked!" - and I knew exactly which double-four did it
  because I built it on purpose. The AI's counter-capture mid-game was also
  instantly legible because the stolen pieces appeared in its tray.
- **Game 4, Expert (LOST):** Half. "The AI made five in a row." is true but
  the board is dimmed and the five is not highlighted; its winning row used a
  gap square from a ten-move-old capture, and I had to reconstruct the line
  myself to believe it. I got there, but the game should have shown me.

## The one change

Highlight the winning line (or the fifth captured pair) on the game-over
screen, bright, over an undimmed board - and leave it on screen until I
dismiss it. Every other why-did-I-lose tool (move list, per-difficulty stats)
can wait; but when the AI outplays someone with a hidden split four, the game
must point at it, because that moment - seeing exactly how you were beaten -
is the moment a strategy player decides this AI is worth a week of evenings.

(Runner-up, for the business rather than for me: make the world locks real on
web or stop selling the key - #11.)

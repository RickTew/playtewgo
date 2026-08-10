# Maya, 34 (phone-casual, clicked a friend's link) - 2026-08-10

Session: ~35 minutes, 3 full games vs AI (Easy win, Medium loss by five-in-a-row, Medium loss by captures), plus Pass & Play glance, pickers, profile, locked worlds, and the Unlock All offer. Desktop-width window (the agent could not force a phone-width viewport; window manager kept a ~1280px minimum - all layout notes below are desktop-layout notes).

## Verdict in one line
Yes, she plays again tomorrow, and she texts the friend back "the aliens ABDUCTED my robots" - but only because she survived the first capture with zero explanation; a less patient version of her closes the tab right there.

## Moments of friction (in order)

1. **WHERE:** Landing page, first look. **EXPECTED:** One line telling me what this game is and why my friend's nephew cried. **HAPPENED:** A "Play" panel (Theme / Mode / AI level), two rows of empty grey boxes labeled "Player One 0/5" and "AI 0/5", and "Your move" - before any game exists. Nothing anywhere above the fold says what the goal is. **FELT:** Not lost exactly, but flying blind. I started a game knowing literally nothing. **SEVERITY:** annoyance.

2. **WHERE:** Top of screen, whole session. **EXPECTED:** The ten empty boxes to mean something, or explain themselves. **HAPPENED:** "0/5" next to ten blank rectangles meant nothing for two full games. They only made sense in game 3 when captured pieces started appearing in them. **FELT:** For two games I assumed they were broken or "coming soon". **SEVERITY:** annoyance.

3. **WHERE:** Game 1, Easy. **EXPECTED:** Some resistance, or a hint about a second rule. **HAPPENED:** I placed five in a straight line in five moves and won. The AI blocked one end only when I already had four. No captures ever happened, so I finished game 1 believing this is plain five-in-a-row. **FELT:** Fun to win, but "that's it?" - and it quietly taught me the WRONG model of the game. **SEVERITY:** annoyance (it sets up moment 6).

4. **WHERE:** "You win!" screen, Share button. **EXPECTED:** A share sheet, a copied link, an image, anything. **HAPPENED:** Clicked Share twice; nothing visibly happened either time. (Automation caveat: system share sheets may not appear under browser automation - but there was also no in-page fallback or "copied!" toast.) **FELT:** Wanted to brag at my friend, gave up. **SEVERITY:** annoyance.

5. **WHERE:** Game 2 loss, "AI wins - The AI made five in a row." **EXPECTED:** To see WHERE the five was. It won on a diagonal I never spotted. **HAPPENED:** The game-over overlay dims the whole board; the winning line is not highlighted or is invisible behind the dim. I took the loss on faith. **FELT:** Slightly cheated - I wanted to learn from it and couldn't. **SEVERITY:** annoyance.

6. **WHERE:** Game 3, my first capture (the big one). **EXPECTED:** My two robots to still be there. **HAPPENED:** An alien landed at the end of my two-in-a-row and both robots VANISHED. No message, no callout, no "Captured!" - the only clues were the counter flipping to "AI 1/5" and two tiny robots appearing in the AI's tray. I had to sit there and detective it out. **FELT:** First reaction was genuinely "is this a bug? did it just cheat?" Then I decoded the tray and it became the coolest thing in the game - alien abduction! But the game did NOTHING to help me across that gap. If I feel stupid twice in a row I leave; this was strike one, and it was only not strike two because the tray happened to catch my eye. **SEVERITY:** would-quit (for the median new player; for me it converted into the hook).

7. **WHERE:** Game 3, mid-game. **EXPECTED:** Tapping an occupied dot to do something - error blip, shake, anything. **HAPPENED:** Tapped a spot an alien was on; total silence, no feedback. For a second I thought the game had frozen. **SEVERITY:** cosmetic.

8. **WHERE:** Bottom of the page, discovered AFTER all three games. **HAPPENED:** The one sentence that explains the entire game - "Five in a row wins. Capturing five pairs also wins. Flank two enemy pieces to capture them." - exists, but it lives below the fold under the board, under my name, next to the App Store link. I never scrolled there while it mattered. **FELT:** Mild outrage. The tutorial exists and it's hiding in the footer. **SEVERITY:** annoyance (but it's the root cause of moments 3 and 6).

9. **WHERE:** Pieces picker, COLOR row, padlocked swatch. **EXPECTED:** Tapping the lock tells me what it is. **HAPPENED:** It does - "GOLD: win 9 more Space games" - but the hint is small yellow text that appears far below the swatch row; on my first tap I missed it entirely and thought the button was dead. **SEVERITY:** cosmetic.

10. **WHERE:** Profile, "1 of 10 Space wins to GOLD" progress bar. **EXPECTED:** To know what GOLD is. **HAPPENED:** No explanation there; I only learned GOLD is a piece color via the picker hint later. Gold... trophy? League? Skin? **SEVERITY:** cosmetic.

11. **WHERE:** Board & Background picker. **HAPPENED:** Three columns: BOARD / SCENES / NEUTRAL. I had to poke to learn Board = the slab under the dots and Scenes = wallpaper. "NEUTRAL" is designer-speak; to me those are just plain backgrounds. Tapping Aurora recolored the whole page instantly, which taught me faster than any label. **SEVERITY:** cosmetic.

12. **WHERE:** Whole session. **HAPPENED:** No undo anywhere. On a 22x22 grid of small dots, one fat-finger = a permanent stone, and in this game a misplaced stone can literally hand the opponent a capture. Wordscapes lets me shuffle; here a slip is fatal and silent. (I never actually misclicked on desktop - but on a phone I would have, repeatedly.) **SEVERITY:** annoyance.

13. **WHERE:** Tooling note for the developer, not a persona finding: the Theme dropdown's locked options are properly `disabled` (a real click can't choose them), but the page script itself doesn't re-check - setting the select value programmatically and firing `change` started a full OCEAN game with Pirate vs Kraken while Ocean still said "4 more games". Defense-in-depth gap only; invisible to real players.

## Moments that worked

- **The capture loop, once understood, is the game.** Being robbed, then pulling the same trick back one move later ("I abducted them back!") was a genuine out-loud moment. The mirrored trays filling with each other's little figures is a great scoreboard - protect this.
- **Game 3's arc was dramatic**: 1-0, 2-2, 3-3, then losing 3-5 by theft. Losing by captures felt like a real story, and "The AI captured five pairs" told me exactly what happened.
- **"Dungeon is now unlocked!" attached to a LOSS.** Softened the defeat perfectly. "Finishing counts, win or lose" in the profile is the same kind - generous and clearly worded.
- **The match intro card** ("You · Robot VS AI · Easy" in big letters) reads like a fight poster. Instantly communicated who I am on the board.
- **Zero-friction guest funnel.** No account, no name prompt, no email. I'm "Player One (LOCAL PROFILE)" with a little pencil if I ever care. Exactly right for a link from a friend.
- **The setup screen remembers my record** ("Your record vs AI: 1 win · 0 losses") - tiny, but it made the second game feel like a rivalry.
- **The unlock ladder feels fair, not paywall-y.** Locked themes are greyed in the dropdown with the literal price in games ("Ocean (7 more games)"), the count visibly ticked down to 4 as I played, and the profile shows a progress bar with the theme's roster (Pirate, Mermaid, Kraken...) as a tease.
- **The Unlock All offer reads honest.** "Skip the grind. Every world, every figure, instantly. It never changes how the game plays. - Unlock all worlds $2.59." Cheap, plainly worded, explicitly not pay-to-win, with a Restore link. After game 3 I'd genuinely consider it. (Per the brief I did not open the checkout.)
- **Pickers give instant feedback.** Choosing UFO updated the vs-strip immediately; choosing Aurora repainted the page. Poking teaches, which suits me.
- **Pass & Play is self-explanatory**: "UFO's move" / "Alien's move" flips every turn - I'd know when to hand the phone over.
- **Sound/music toggles** show clear on/off states (crossed-out speaker). No menus to dig through.

## Words I did not understand

- **"0/5"** on the trays (until game 3 made it mean captured-pairs-toward-five)
- **"TYPE: Flat / Chip / Half / Tall"** - piece shapes, but the words are furniture-speak until you tap them
- **"FINISH: Classic / 3D"** - "finish" like nail polish?
- **"NEUTRAL"** (background column) - just say Plain
- **"GOLD"** in "1 of 10 Space wins to GOLD" - unexplained where it appears
- **"Sepia" / "Slate"** - fine, but only because the thumbnails carry them
- **"LOCAL PROFILE"** - local as opposed to what? (There's no account to compare against)
- **"Already bought it? Restore"** - I'd get it, but "Restore" is app-store-speak
- **"Beta"** badge - understood, but it slightly lowered my trust before I'd even played
- Never appeared and never missed: "Pente", "Gomoku", "tria", "open four" - the game wisely avoids all jargon. The name TEWGO itself explains nothing, but neither does "Wordscapes".

## Did I understand why I won or lost?

- **Game 1 (Easy, WON):** Yes. "You win! Five in a row." I built the line myself, and the AI's one-end block even taught me blocking.
- **Game 2 (Medium, LOST):** Half. The banner said "The AI made five in a row" but the dimmed game-over board never showed me the diagonal that killed me. I believed it; I couldn't learn from it.
- **Game 3 (Medium, LOST):** Yes by the end - "The AI captured five pairs" plus the tray filling up made the loss fully legible, and honestly it was the most satisfying loss of the three. But the FIRST capture inside that game was explained by nothing at all (see friction 6).

## The one change

**Put the two win conditions in front of the first game, and celebrate the first capture when it happens.** The sentence already exists in the footer - "Five in a row wins. Capturing five pairs also wins. Flank two enemy pieces to capture them." - move/copy it above the board for a player with 0 games played, and the first time stones are ever captured, flash a one-time callout ("Captured! Flanked pairs get taken - 5 pairs wins") with a little arrow to the tray. Everything else about the game already teaches itself by poking; this is the one rule that reads as a bug or a cheat until someone tells you it's the best part.

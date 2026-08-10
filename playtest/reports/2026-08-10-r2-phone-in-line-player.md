# Marcus, 41 (plays in 5-10 minute queue windows) - 2026-08-10

Session: phone-width browser window, ~40 minutes. Three finished games (Easy vs AI, Hard vs AI, one Pass & Play), two deliberate mid-game interruptions with resume, profile / pickers / locked-world / purchase-offer walkthrough.

Tooling note (not in character): Chrome would not shrink below 500px wide, so this ran at 500x844 instead of a true 390px phone. Nothing horizontally clipped at 500; a real 390 device should still be spot-checked. Audio and pinch-zoom could not be exercised under automation and are not judged here.

## Verdict in one line
Yes, I'd play again tomorrow and I'd tell the coworker he was right: an Easy game fits a school-pickup line (~3-4 min), the autosave is bulletproof (survived two tab kills without losing a stone), and nothing about it begs for money - but Hard is a 10-15 minute commitment, and a couple of sloppy taps around the resume/win screens made me briefly distrust the thing I care about most.

## Moments of friction (the core of the report)

1. WHERE: /play/ first load. WHAT I EXPECTED: to understand the game before my first tap. WHAT HAPPENED: the Play dialog covers the one-line rules ("Five in a row wins. Capturing five pairs also wins...") which sits behind it, dimmed. I started my first game knowing the win conditions only because the line reappears above the board afterward. FELT: fine, but I got lucky - the rules line could easily be missed under the dialog. SEVERITY: cosmetic.

2. WHERE: in-game board, first stones. WHAT I EXPECTED: fat-finger trouble - intersections are ~21px apart at phone width on a 22x22 grid. WHAT HAPPENED: plain taps demand real precision, BUT touch-dragging shows a ghost stone with full-length crosshair guide lines before you commit. That's the drag-to-aim feel I know from good mobile board games, maybe better. FELT: relieved - once I found it. Nothing tells you the drag exists; a one-time "drag to aim" hint would save first-timers some misplaced stones. SEVERITY: annoyance (discoverability only; the mechanic itself is great).

3. WHERE: resuming after my first tab-close (kid needed me; came back minutes later). WHAT I EXPECTED: tap "Continue game", see my board. WHAT HAPPENED: my board came back perfectly - but the Continue tap ALSO painted a phantom robot stone on the board at the exact spot under the button. It wasn't in the real game (it vanished at my next move, the AI never responded to it), but for a good thirty seconds I thought the resume had corrupted my game or eaten my turn. It happened again identically on my second resume, so it's reproducible: the tap on "Continue game" falls through to the board and draws a ghost stone. FELT: alarmed, then annoyed - this bug attacks trust in the exact feature that earns the home-screen spot. SEVERITY: annoyance, borderline would-quit for someone who doesn't stop to verify.

4. WHERE: "You win!" screen after game 1. WHAT I EXPECTED: the bottom-bar buttons (New game, profile) to work. WHAT HAPPENED: they're dead while the win banner is up - I tapped "New game" three times, nothing; only Play again and Share respond. There's no way to change difficulty or open the profile from a finished game without first hitting "Play again" (which instantly starts another game I didn't want) and abandoning it. FELT: dumb loop - win a game, forced to start a throwaway game to reach the menu. SEVERITY: annoyance.

5. WHERE: "You win!" screen, Share button. WHAT I EXPECTED: a share sheet or at least "copied!". WHAT HAPPENED: nothing visible at all. FELT: shrug, moved on. SEVERITY: cosmetic (note: automation can suppress share sheets, but there was zero feedback of any kind).

6. WHERE: New game dialog, Theme dropdown. WHAT I EXPECTED: picking "🔒 Dungeon (1 more game)" and hitting Start to either be blocked with a message or take me to the unlock pitch. WHAT HAPPENED: it silently started a Space game. No "still locked, 1 more game!" toast, no shake, nothing acknowledging what I asked for. FELT: confused for a second - did I misread which theme I picked? SEVERITY: annoyance.

7. WHERE: after finishing the Pass & Play game (UFO won). WHAT I EXPECTED: the unlock counter to advance - the profile explicitly says "Finishing counts, win or lose." WHAT HAPPENED: the bar still said "Finish 1 more game to unlock the Dungeon world" after that finished game. Either only vs-AI games count (then say so) or the counter didn't refresh. FELT: cheated out of a promised tick on the progress bar - I finished a game with my kid and it didn't count. SEVERITY: annoyance.

8. WHERE: win screen scrolled down. WHAT HAPPENED: the floating "Play again"/"Share" buttons sit on top of the personalization bar - Share half-covers the piece icons, Play again covers the VS badge. Looks broken even though everything still works. SEVERITY: cosmetic.

9. WHERE: "Features & Updates" link at the page bottom. WHAT HAPPENED: it navigates the same tab away from the game. Going back landed me on the Play dialog, and since my just-started game had no stones yet there was no Continue - a mid-game reader would want reassurance the game survives this detour (my earlier tests suggest it would, via the same Continue flow, but the link gives no warning). SEVERITY: cosmetic.

10. WHERE: game length, the actual queue-window question. WHAT HAPPENED (real numbers): link tap to first stone placed: about 10 seconds (one dialog, one tap - excellent). Easy game: ~20 moves per side, finishable in 3-4 minutes at thumb pace. Hard game: ~25 moves per side of genuine thinking with the AI counter-capturing twice - realistically 10-15 minutes. WHAT I EXPECTED: some tier that fits 5 minutes. Easy does; Hard emphatically does not (that's praise for the AI, but the difficulty labels give no time hint). SEVERITY: cosmetic (worth a word like "quick game" on Easy).

11. WHERE: "Install as app" button. WHAT HAPPENED: tapped it, nothing visible. (Automation likely suppresses the browser's install prompt, so I won't call it broken - but if a real phone tap ever no-ops like this, a button that does nothing is worse than no button.) SEVERITY: not judged this session.

## Moments that worked

- **Autosave/resume is the whole pitch, and it delivers.** Killed the tab mid-Easy-game at 4/5 captured pairs; reopened; every stone, both capture shelves, the turn, and the difficulty were exactly where I left them. Did it again mid-Hard-game; identical. "Continue game" pre-selected in yellow next to "Start new game" is exactly the right resume screen. This is the feature that earns the home-screen spot - which is why the ghost-stone bug (friction #3) matters so much.
- **The first-capture tooltip.** The moment I made my first capture: "Captured! Flanked pairs get taken to the shelf above. Five pairs wins." Perfect timing, taught me the second win condition exactly when I cared, and the empty tray slots at the top suddenly made sense.
- **The capture shelves.** Captured enemy pairs physically sit in trays at the top of the screen with a N/5 counter per side. My progress toward the capture-win is a picture, not a stat.
- **Drag-to-aim with crosshair guides** (see #2) - genuinely thumb-friendly stone placement once discovered.
- **The Hard AI plays like a person.** It parked a stone next to my diagonal pair, waited four moves, then captured exactly when that capture also destroyed my five-in-a-row threat. It blocked my fours, refused my bait, and punished every careless pair I left. And it's still beatable - it missed one square that both completed my five AND captured its pair. Winning felt earned, not gifted.
- **Both win conditions on screen at all times** in one plain sentence above the board.
- **The win banner explains the result** ("Five in a row.") and circles the winning line on the board.
- **The profile page speaks parent.** "2 of 3 games played. Finishing counts, win or lose." with a progress bar, plus a preview of what's next (DUNGEON - Dragon, Wizard, Knight, Goblin). That's an invitation, not a paywall.
- **The $2.59 Unlock All offer is honest.** "Skip the grind... It never changes how the game plays", a clear in-app confirmation step ("One-time payment of $2.59... Continue to the secure payment page?") with a "Not now" that works, and a Restore link. I stopped at the confirmation, and nothing nagged me afterward. Fair deal, fairly presented.
- **Pass & Play handoff is self-explanatory:** the status line alternates "UFO's move" / "Alien's move" using the piece names - you know whose phone-turn it is at a glance.
- **Personalization applies instantly mid-game.** Switched to a wood board and a UFO piece between moves; the wood board actually made the grid dots easier to read at phone size.

## Words I did not understand

- **"pairs"** in "0/5 pairs" - meaningless until the first-capture tooltip rescued it (a full game could pass without a capture).
- **"TYPE: Flat / Chip / Half / Tall"** - piece-shape jargon; I had to try each to learn what they meant.
- **"FINISH: Classic / 3D"** - "finish" as in furniture? Tried it, still vague at this board size.
- **"2 of 10 Space wins to GOLD"** - gold what? A trophy, a color for my pieces, a rank? Nothing on the page says.
- **"Restore"** ("Already bought it? Restore") - app-store vocabulary; on a website I don't know what it restores or where from.
- **"Beta"** badge - fine, but as a player I don't know what's unfinished.

## Did I understand why I won or lost?

- **Game 1, Easy (won):** Yes. Banner said "You win! Five in a row." and the winning five were circled on the board. My four captures were each explained by the shelf filling up, and the first one by the tooltip.
- **Game 2, Hard (won):** Mostly yes - same clear ending. One gap: the first time the AI captured MY pair, my two stones just vanished and a robot pair appeared in its tray. I reconstructed why, but the game never gave the AI's captures the tooltip treatment mine got. First AI capture deserves the same one-line explanation.
- **Game 3, Pass & Play (UFO won):** Yes - "UFO wins! Five in a row."

## The one change

Fix the "Continue game" tap falling through to the board (the phantom stone, friction #3). Resume-after-interruption is the single feature that makes this a queue game and earns it a home-screen spot; a ghost stone appearing at the exact moment of resume is precisely where this player's trust must never wobble. (Runner-up: make the bottom-bar buttons live during the win banner so finishing a game doesn't dead-end.)

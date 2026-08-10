# Leo, 10 (robots-and-aliens kid, reads nothing) - 2026-08-10

## Verdict in one line
Yes, he plays again tomorrow and tells a friend "I captured the aliens and unlocked a DRAGON" - the robot-vs-alien fantasy is real within 30 seconds, captures feel great, and the unlock ladder pulled him through three games without ever feeling like a paywall.

## Moments of friction (the core of the report)
1. WHERE: landing page (http://localhost:8741/play/). WHAT I EXPECTED: pictures of robots. WHAT HAPPENED: a sentence under the logo ("Five in a row wins. Capturing five pairs also wins. Flank two enemy pieces to capture them.") that I skipped completely because it is three lines of words and has "flank" in it. HOW IT FELT: didn't care, the big yellow "Start new game" button saved me. Skipping it did NOT get me stuck, which is the good news. SEVERITY: cosmetic.
2. WHERE: first move of game 1. WHAT I EXPECTED: the game to tell me where to click. WHAT HAPPENED: a giant empty field of tiny dots and "Your move" at the top; no "tap anywhere" hint. I guessed the middle and it worked. SEVERITY: annoyance (a shyer kid might stare at it for a while).
3. WHERE: game board, all games. WHAT I EXPECTED: my robot to look big and cool. WHAT HAPPENED: the figures are tiny specks on the huge board on a laptop, and tall pieces visually overlap the piece on the dot above them (my robots looked stacked on each other's heads). I never found a way to zoom with the mouse. HOW IT FELT: the robot art is cool in the pickers but on the board I mostly see dots. SEVERITY: annoyance.
4. WHERE: piece picker (people icon in bottom bar). WHAT HAPPENED: the panel opens with its top cut off above the screen and the page will not scroll up while it is open, so I never saw column headers - I had to guess that the left column (highlighted "Robot") was me and the right one was the computer. SEVERITY: annoyance.
5. WHERE: piece picker, "FINISH" section (Classic / 3D). WHAT I EXPECTED: "finish" like finishing a race. WHAT HAPPENED: it changes how the pieces are shaded; after clicking 3D I could not see any change in the picker thumbnails, only later on the board. SEVERITY: cosmetic (but "FINISH" is an adult word here).
6. WHERE: game 2 vs Medium, right after my second capture. WHAT I EXPECTED: the two aliens I captured to be gone. WHAT HAPPENED: they vanished, but the computer INSTANTLY put a new alien back on one of the freed spots, so for a second it looked like my capture didn't work / the alien came back to life. SEVERITY: annoyance (a beat of delay before the AI reuses a just-captured square would fix the illusion).
7. WHERE: game 2 vs Medium. WHAT I EXPECTED: aliens standing between two of my robots to be captured. WHAT HAPPENED: the computer moved two aliens INTO the gap between my robots and nothing happened to them ("HEY, that's cheating, you're surrounded!"). Nothing anywhere explains that walking into a trap is safe and only springing the trap captures. SEVERITY: annoyance (rule confusion a kid will hit every game).
8. WHERE: win screen, "Share" button. WHAT I EXPECTED: a cool picture to send. WHAT HAPPENED: nothing visible at all - no message, no picture, no "copied!" (may be an automation limitation, but there was zero fallback feedback either). SEVERITY: annoyance.
9. WHERE: the whole session. WHAT I EXPECTED: the computer to take MY pieces at some point so I could shout "HEY!". WHAT HAPPENED: neither Easy nor Medium ever captured anything (final: me 4 pairs across games, AI 0), even when I left pairs hanging. HOW IT FELT: great for winning, but I never learned that captures can happen TO me - first time it happens (harder AI or a friend) will feel like a cheat out of nowhere. SEVERITY: annoyance (teaching gap, not a bug).
10. WHERE: profile page, "Unlock all 8 worlds" box. WHAT HAPPENED: "$2.59" is real money I don't have, and the words are adult words ("Skip the grind", "Cosmetic only", "One-time payment", "Already bought it? Restore"). Clicking the yellow button gave an in-game confirmation ("Continue to the secure payment page?") with an easy "Not now" - I clicked Not now and did NOT continue to any payment page. HOW IT FELT: not tempting and not scary, because the free path right next to it said "Play 1 more game" which is way better than $2.59. SEVERITY: cosmetic (for a kid; the confirmation step is good protection).

Tooling note (not in character): capture-vanish verification - in both observed captures (game 1 and game 2), a screenshot taken immediately after the capturing move already showed the flanked stones gone from the board at the same moment the pair counter incremented and the pieces appeared in the shelf, and a second screenshot 4+ seconds later confirmed they stayed gone. No lingering ghost stones.

## Moments that worked
- The match intro card: "You · Robot" VS "AI · Easy" with big robot and alien art. That is exactly what a 10-year-old came for, and I was the robot by default without touching anything.
- Time-to-fun: from cold load to my first placed robot was under 30 seconds with zero reading.
- Captures are the best thing in the game: the flanked aliens pop off the board instantly, fly to a trophy shelf at the top, the counter ticks 1/5, and a short yellow toast appears the first time ("Captured! Flanked pairs get taken to the shelf above. Five pairs wins."). Collecting captured aliens in the shelf like trophies is EXACTLY right for kids.
- Easy is beatable by a kid who reads nothing: won game 1 by five in a row while grabbing 2 pairs, no tutorial. Medium blocked every line I made and felt like a real opponent, but was still beatable through captures plus a diagonal.
- The win screen: "You win!" + "Five in a row." + a streak highlighting the winning five, so I could SEE why I won.
- The unlock ladder is motivating, not annoying: "Finish 1 more game to unlock the Dungeon world" everywhere, progress bar in the profile, "Finishing counts, win or lose", and then a gold "Dungeon is now unlocked!" right on the win screen. I immediately played the extra game just to get it.
- The profile NEXT UNLOCK card listing "Dragon, Wizard, Knight, Goblin" made the locked world irresistible. Figures 8 of 40, backgrounds 25 of 97 = "there's SO much more to get".
- The Ringed Planet background: one tap and the whole board sits on a giant planet. Instant "WHOA", and it changed live behind the current game.
- The Dungeon payoff is real: torchlit brick walls, crossed swords, treasure chest, and I got to be an orange DRAGON with glowing eyes vs a silver Knight.
- Pass & Play is understandable: the header switches between "Robot's move" and "Alien's move", so handing the laptop back and forth needs no explanation.

## Words I did not understand
- "Flank" / "Flanked" (rules line and capture toast) - the only rules word that matters and it's the hardest one.
- "pairs" as a score ("0/5 pairs") - only made sense AFTER my first capture filled the shelf.
- "FINISH" (Classic / 3D section) - finish what?
- "Cosmetic only" (purchase confirmation).
- "One-time payment" and "Already bought it? Restore" - "restore" means nothing to a kid.
- "Skip the grind" - borderline; Roblox kids half-know "grind".
- "Beta" (badge next to the logo).
- "Feudal" (Feudal Japan) - just "the ninja world" to me.
- "Parchment" (board material).
- "Daimyo" and "Geisha" (figure names in the profile row).
- "Nebula", "Crimson", "Aurora" (scene names) - picked by thumbnail, ignored the words.

## Did I understand why I won or lost?
- Game 1 (Easy, won): YES. "You win! Five in a row." plus the highlighted line. The two capture toasts also taught me the second win rule (five pairs) without reading the header.
- Game 2 (Medium, won): YES, same clear win screen and streak. Captures made sense from the shelf and counter. The only "wait, why?" was the AI re-placing an alien onto a square I had just captured (felt like the capture undid itself for a second), and the aliens standing safely between my robots (moment 7).
- Game 3 (Easy, quick, won): YES, and the "Dungeon is now unlocked!" banner made it the best win of the day.
- I never lost and was never captured, so the losing half of the game is untested by this persona (see moment 9).

## The one change
Make my robot readable on the board: at laptop size the figures are tiny overlapping specks on a sea of dots, and there is no mouse zoom. Bigger default figures (or a default zoom-in around the action, or a zoom control) would let the piece art - the entire reason this kid showed up - actually show during play, not just in the pickers.

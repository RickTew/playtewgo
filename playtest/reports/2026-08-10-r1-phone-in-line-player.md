# Marcus (41, plays in 5-10 minute queue windows) - 2026-08-10

## Verdict in one line
Yes, I'd play again tomorrow and I'd tell the coworker he was right about Easy/Medium
("finishable in a line, and it never lost my game, twice"), but I'd warn him his thumbs
will hate the tiny grid, and I'd keep it as a bookmark, not a home-screen app, until it
installs and works offline.

## Moments of friction

1. WHERE: /play/ first load. WHAT I EXPECTED: a landing page explaining the game.
   WHAT HAPPENED: a "Play" dialog is already open (Theme / Mode / AI level / Start new
   game) with the rules relegated to one line of small text at the very bottom of the
   page, behind the dialog. I started my first game without ever being told how to win;
   I only found "Five in a row wins. Capturing five pairs also wins." by scrolling later.
   FEELING: fast, but I flew blind for the first minute. SEVERITY: annoyance.

2. WHERE: in-game board, first tap. WHAT I EXPECTED: my stone exactly under my finger,
   or a drag-to-aim like other mobile board games. WHAT HAPPENED: the stone snapped to
   an intersection noticeably up-left of where I tapped. The 22x22 grid at phone width
   makes each target about 16px; a thumb covers four or five intersections. Placement
   is instant on touch: no drag-to-adjust, no magnifier, no confirm, and NO UNDO button
   anywhere. A later deliberate tap between two dots landed one row off from where I
   was aiming. In a capture game where one bad stone can hand the AI a pair, a fat-thumb
   misplace is a lost game. FEELING: nervous every single tap; I pinch-zoomed my eyes,
   not the board (found no zoom). SEVERITY: would-quit for anyone with bigger thumbs
   than mine; annoyance for me. THE single biggest phone problem.

3. WHERE: Hard game (game 2). WHAT I EXPECTED: captures I could see coming. WHAT
   HAPPENED: the AI kept eating my pairs along diagonals I never saw, because the
   pieces are ~16px tall figures on a dark background: reading a diagonal 4 stones long
   across a phone screen is squinting work. The Medium game (game 3) ended when the AI
   completed a diagonal four I literally never noticed being built. FEELING: outplayed
   is fine, but partly I lost to legibility, not strategy. SEVERITY: annoyance.

4. WHERE: game length on Hard. WHAT I EXPECTED: "a board game you can finish in a
   line." WHAT HAPPENED: Easy was ~10 of my moves and about 2-3 minutes: perfect.
   Medium was ~12 moves, maybe 4-5 minutes: fits a school-pickup line. Hard was ~24
   moves of genuine thinking with a 4-4 capture standoff: 15+ minutes for me. That's
   not a line game, that's a lunch game. Nothing tells you this before you pick a
   difficulty. FEELING: Easy/Medium keep the coworker's promise, Hard breaks it
   silently. SEVERITY: cosmetic (just label expectations).

5. WHERE: Board & Background picker. WHAT I EXPECTED: swipe up to scroll the long
   list. WHAT HAPPENED: my scroll gesture SELECTED "Holo Panel" (the item under my
   finger) instead of scrolling: the options react on pointer-down, so starting a
   scroll on top of an option picks it. The list is also very long (11 boards + 17
   scenes + 4 neutrals) with the Done button all the way at the bottom. FEELING: I
   changed my board by accident and didn't notice until later. SEVERITY: annoyance.

6. WHERE: New game dialog, Theme dropdown. WHAT I EXPECTED: "Ocean (4 more games)"
   to be locked: the profile page shows a padlock and a progress bar for it. WHAT
   HAPPENED: I selected Ocean anyway, hit "Start new game", and it just... started a
   full Ocean game (Pirate vs Kraken, underwater board, completely playable; I placed
   stones). The lock ladder, the "Finish 4 more games to unlock the Ocean world"
   footer, and the $2.59 "skip the grind" offer are all sitting next to a dropdown
   that hands out the locked worlds for free. FEELING: as a player, free candy; as a
   guy deciding whether to pay $2.59, why would I ever? SEVERITY: cosmetic for my
   fun, but this looks like a real bug that guts the whole unlock/purchase system.

7. WHERE: Profile page, "Unlock all worlds $2.59" button. WHAT I EXPECTED: a
   confirmation step, a summary, something. WHAT HAPPENED: one tap and the entire
   game was instantly replaced by a white external checkout page (payment form
   loading skeleton). No "are you sure", no in-game summary; mid-Pass-&-Play-game,
   gone. I backed out immediately without entering anything (per my own rule about
   never typing card numbers into a game in a sandwich line) and, credit where due,
   my in-progress game was still there when I returned. FEELING: one accidental tap
   away from a payment page is too twitchy. SEVERITY: annoyance.

8. WHERE: rotating the phone (landscape). WHAT I EXPECTED: the board to fit, or at
   least a usable layout. WHAT HAPPENED: same tall vertical layout; the header and
   capture trays eat the top half and the board is cut off below the fold. Playing
   landscape means scrolling mid-move. SEVERITY: annoyance (I just rotated back).

9. WHERE: profile page, "WORLDS UNLOCKED 3 of 8" and "FIGURES UNLOCKED 12 of 40"
   rows. WHAT I EXPECTED: to see my newly unlocked Dungeon world. WHAT HAPPENED: only
   Space and Feudal Japan are visible; the rest live in a sideways-scrolling row with
   no scrollbar and (for the worlds row) no cut-off card hinting that it scrolls. I
   only found Dungeon by accident. SEVERITY: cosmetic.

10. WHERE: "install it like an app" hunt. WHAT I EXPECTED: some "Add to home screen"
    pitch, and offline play (waiting rooms have dead spots). WHAT HAPPENED: no install
    prompt or hint anywhere in the game. Nothing indicates it would work offline
    (and my check says it wouldn't: first thing it needs is the network). FEELING:
    it stays a bookmark; a board game this light SHOULD work in airplane mode.
    SEVERITY: annoyance for my use case; it's the difference between home-screen
    and forgotten.

## Moments that worked

- AUTOSAVE AND RESUME ARE PERFECT. Twice I closed the tab cold in the middle of a
  game (once with my pieces under capture threat), came back minutes later, and got a
  dialog with "Continue game" highlighted plus my record ("1 win · 0 losses"). Both
  times every stone, the capture score, the difficulty, and whose turn it was were
  EXACTLY as I left them. The AI never sneaked a move. Even bouncing to the checkout
  page and back preserved my game. This is the #1 thing my kind of player needs and
  it's flawless.
- Fast start: link to first stone placed in under 15 seconds, and the AI answers
  instantly. Zero waiting anywhere. Ideal for a queue.
- Loss and win screens actually explain the outcome in plain words: "You win! Five in
  a row." / "AI wins. The AI captured five pairs." / "The AI made five in a row."
  I always knew why the game ended.
- The capture trays teach the second win condition by themselves: when I captured two
  aliens, they physically appeared in my tray next to "1/5". By game two I was
  watching that tray like a scoreboard. Great silent tutorial.
- Captures create real drama: my capture ripped out the AI's blocking stone and it
  had to plug the same hole twice; later the AI re-captured through a spot it had
  just lost. The 4-4 capture race in the Hard game was genuinely tense: best
  10 minutes of the session.
- The Hard AI is legitimately scary: it punished every careless pair within one move.
  Losing to it felt earned (mostly, see friction #3).
- Losing still paid out: "Dungeon is now unlocked!" on my LOSS screen, because the
  ladder counts games played, not wins ("Finishing counts, win or lose" - great line).
- The Pieces sheet is clear and thumb-sized: two player columns, piece choices with
  previews, colors, and one locked GOLD swatch labeled "GOLD: win 9 more Space games";
  as an earnable flex, that's the right kind of tease.
- Pass & Play needs no manual: the header flips to "Robot's move" / "Alien's move";
  you hand the phone over when the name changes.
- The $2.59 offer copy is honest: "It never changes how the game plays" plus a
  Restore link. Cheap, fair, not pay-to-win. (Shame about friction #6.)

## Words I did not understand

- "0/5" in the trays: meant nothing until my first capture filled it. One word
  ("pairs") would fix it.
- "TYPE: Flat / Chip / Half / Tall": tapped them, could not tell what they changed
  from the sheet itself (the tiny preview didn't obviously update).
- "FINISH: Classic / 3D": finish of what? Sounds like paint.
- "LOCAL PROFILE": local to what? This is the label on the thing holding my whole
  record: I NEED to know if clearing my browser or switching phones erases it.
- "Beta" badge: fine, but says nothing about what's unfinished.
- "WIN %" showing "33": the math checks out but a stat this prominent, three games
  in, mostly says "you're bad".
- Theme names as dropdown options with "(17 more games)" suffixes read like flavors,
  not locked content: nothing says the number means locked (and indeed it doesn't
  actually lock: friction #6).

## Did I understand why I won or lost?

- Game 1, Easy (WIN, ~10 moves): yes. "You win! Five in a row." I saw my diagonal
  complete, and my one capture put two aliens in my tray with a clear counter.
- Game 2, Hard (LOSS, ~24 moves): yes. "AI wins. The AI captured five pairs." The
  tray had ticked 1/5 to 5/5 all game, so the loss made sense, although two of those
  captures came from diagonals I never saw being aimed at me (see friction #3), so
  the WHY of individual captures lagged a move behind.
- Game 3, Medium (LOSS, ~12 moves): yes and no. "The AI made five in a row." True,
  but I never saw the diagonal four forming; the end screen told me what happened,
  the board never warned me it was happening. A brief highlight of the winning five
  helped after the fact.

## The one change
Make thumb placement safe on the phone grid: either drag-to-aim with a lifted preview
(place on release, like every good mobile Go/Gomoku app), or tap-then-confirm, or an
undo for the last stone. The grid at 390px is 16px per target; right now every tap in
a capture game is a small gamble, and it's the one thing that would make me hesitate
to open TEWGO one-handed in a line, which is the only place I play.

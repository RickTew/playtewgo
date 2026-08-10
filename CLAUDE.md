# playtewgo.com - Claude Instructions

## Project
The TEWGO website AND the browser version of the game. Two things live here:
- The marketing/support site (`index.html`, `privacy.html`) for the iOS app.
- The playable web game at `/play/` (canvas board vs AI), built so family and
  friends on Android can play TEWGO.

## Relationship to the iOS app
The iOS app lives in `~/Dev/TEWGO` and is the SOURCE OF TRUTH for game
rules, AI behavior, and design decisions (see its GAME_DESIGN.md and
CLAUDE.md). NOTE (verified 2026-07-31): that repo has NO git remote on
this Mac - it is local-only, so FEATURES.md commits there cannot be
pushed. Ask Rick if it should get a GitHub remote. `play/engine/` is a direct JavaScript port of:
- `TEWGO/Game/GameBoard.swift` -> `play/engine/board.js`
- `TEWGO/Game/GameState.swift` -> `play/engine/state.js`
- `TEWGO/Game/GameAI.swift` -> `play/engine/ai.js`

Any rule or AI change must land in BOTH engines with matching tests. The iOS
repo is read-only reference from here; never edit it from this project.

## AI parity (2026-08-10): full port of GameAI.swift @ c6c8c11
`play/engine/ai.js` now mirrors the iOS AI completely, in one pass:
- The 2026-08-04 ladder: Easy = random of top-8 scored, Medium = pure
  greedy (the old Hard), Hard = 2-ply veto lookahead, Expert = threat
  search. Expert is a NEW web tier (both difficulty selects + saved-value
  whitelist in game.js updated); saved easy/medium/hard values still load
  but now mean the new ladder rungs.
- iOS 99f8139 capture-defense: defenseMove gathers blocks PLUS captures,
  keeps only defenses leaving no immediate opponent win, and Hard/Expert
  rank safe captures above safe blocks (allowsUndefusableOpenFour is the
  load-bearing safety check; end-captures that re-open the line lose).
- iOS c6c8c11 capture economy: captureValue [400,550,800,1200,20000] by
  taker's banked pairs, vulnerablePairPenalty [1000,1400,2000,3200,30000]
  by opponent's banked pairs, threat weights derived from those tables,
  capturedShapeLoss added to capture replies in all three search paths.
  Tables pinned by the 'capture economy tables' test on both sides; any
  retune must change GameAI.swift + ai.js + both pinning tests together.
tests/ai.test.js is the full 15-test port of GameAITests.swift (suite 44).

## PLAYTEST NOTES
Intended behavior a naive playtester would flag as bugs. Read before
filing anything from a /playtest run.
- Captures take EXACTLY a pair: two adjacent stones flanked on both
  ends. Placing your own stone INTO a sandwich is SAFE, no self-capture
  (official Pente rule; looks like a bug, is the rule).
- Lines of three or more cannot be captured, only pairs.
- Win is 5+ in a row (overline counts) OR 5 captured pairs.
- Easy wanders on purpose (random among its top 8 scored moves); weak
  Easy moves are design, not bugs.
- The ladder is deliberate: Medium is greedy-best, Hard reads one reply
  ahead, Expert runs the threat search and may defend a four by
  capturing out of the line instead of blocking.
- The board is 22x22 by design.
- The world unlock ladder by games COMPLETED (win or lose) is intended,
  locked cards included; Gold color scheme at 10 wins per theme, and
  Gold stays play-earned even with the paid unlock.
- Unlock All Worlds shows $2.59. Whether checkout charges depends on
  which Stripe key is set (test-mode rehearsal passed 2026-08-10); a
  528/503 "store not open" button is a known state, not a bug.
- Automation gotchas: the FIRST click after a page load is sometimes
  swallowed (click twice or wait 2s); audio.play() rejects without a
  real human click, so silent audio under automation is expected;
  python3 -m http.server hangs audio (no Range support), use the live
  site.

## Tech decisions (2026-07-31)
- **No build step, on purpose.** Plain ES modules served as-is by GitHub Pages
  (deploys from main branch root; CNAME = playtewgo.com). No bundler, no
  GitHub Actions, no node_modules. Do not introduce a build step without Rick
  asking for one.
- Plain JavaScript, not TypeScript, so the browser and Node run the same files.
- Tests use Node's built-in runner: `npm test` (ports of the iOS
  GameBoardTests/GameStateTests/GameAITests plus progression tests,
  44 total). Run them before every commit that touches `play/engine/`.
- Game auto-saves to localStorage via the same JSON state shape as the iOS
  multiplayer codec (`tewgo.web.game`, `tewgo.web.difficulty`).

## Layout
- `play/index.html` + `play/game.js` - game page and UI/rendering
- `play/engine/` - rules engine, state codec, AI (keep UI out of here)
- `tests/` - engine tests
- `updates.html` - player-facing Features and Updates page. It MIRRORS
  `~/Dev/TEWGO/FEATURES.md` (the canonical list in the iOS repo). When a
  release ships or a feature lands in either project, update FEATURES.md
  first, then this page in the same sitting. Statuses must stay honest
  (Live / Coming soon / In development).

## Deploy
Push to main = live on playtewgo.com within a minute or two (GitHub Pages).
There is no staging; verify locally first (`python3 -m http.server` from repo
root, then open /play/).

## Testing gotchas (learned 2026-07-31, do not rediscover)
- `python3 -m http.server` is single-threaded and has no Range support:
  audio `.play()` HANGS the page against it. Test audio on the live site
  (GitHub Pages answers Range with 206) or use a threaded server.
- Claude-in-Chrome automation clicks carry NO user activation, so
  `audio.play()` rejects with NotAllowedError under automation. Audio can
  only be heard by a real human click; verify the call path + network only.
- The automation's FIRST click after a page load is sometimes swallowed
  (focus quirk). Always click twice or wait 2s after navigate before the
  first meaningful click.
- Synthetic PointerEvents via javascript_tool DO fire the game's handlers
  (placement works) but are untrusted: no activation, no audio. A
  pointerdown with `pointerType: 'mouse'` places a stone immediately
  (click-to-place path), which makes end-to-end game tests easy: seed a
  near-won board through encodeState into tewgo.web.game, reload, then
  dispatch one such event at the winning cell (progression E2E was
  verified exactly this way).

## Built so far (2026-07-31)
- Engine + AI + 22 tests; canvas board with hover ghost, pop/capture
  animations; painted Space scene (play/space.js: nebula/starfield/planet);
  Space audio (SFX + music, toggles); match intro (VS face-off); victory
  share card (Web Share / PNG download, dev preview at /play/?sharecard);
  vs AI and 2-players modes; Space figure pieces (play/pieces.js: Robot/
  Astronaut/Alien/UFO ported from PieceRenderer.swift with exact palettes,
  👥 picker popup, per-side persistence, sides kept distinct via swap);
  🖼️ Background picker (play/space.js SCENES registry: 6 painted Space
  scenes + the 4 iOS neutrals; light neutrals flip body.light + dark
  grid/dots + darker counter tints, mirroring iOS isLightSurface).

## Theme completeness rule (Rick, 2026-07-31)
Finish ALL of one theme before starting another: scenes, board options,
piece roster, piece TYPES (Flat/Chip/Half/Tall), audio. A theme is "done"
when its 🖼️ and 👥 pickers match what iOS offers for that theme.

Shipped 2026-07-31 (second pass): theme system (themes.js, Theme select,
per-theme scene/piece persistence, per-theme audio folders), piece TYPE
variants (Flat/Chip/Half/Tall in the 👥 popup, drawStone in game.js),
board surfaces (boards.js: 7 universal + 4 themed per theme, Board column
in the 🖼️ popup, light boards flip the grid), Ocean theme (6 figures,
5 scenes, 4 themed boards, audio).

## Options audit vs iOS (2026-07-31, final pass - deltas CLOSED)
ALL EIGHT themes are at full iOS option parity (Space, Ocean, Feudal
Japan, Dungeon, Undead, Western, Desert, Classic): all scenes (Space
13, the rest 12 each, iOS names/order/light flags), full rosters +
palettes, 4 piece types, Finish (Classic/3D dimensional), Color
schemes (11 pairs; Gold omitted until web has progression), 7+4
boards each, 4 neutrals, audio. THEME_CHECKLIST.md documents how the
ports were done.

Feudal Japan shipped 2026-07-31 (play/feudaljapan.js): Ninja/Geisha/
Samurai/Daimyo roster, 12 scenes (Sakura Dawn..Veranda), Kaya Goban/
Garden Stone/Tatami Mat/Red Lacquer boards, audio, default scene
Blossom Storm.

Dungeon shipped 2026-07-31 (play/dungeon.js): Dragon/Wizard/Knight/
Goblin roster, 12 scenes (Torchlit..Rampart), Vault Slab/Rampart
Stone/War Map/Obsidian boards, audio, default scene Torchlit.

Undead shipped 2026-07-31 (play/undead.js): Zombie/Skeleton/Ghost/
Vampire roster, 12 scenes (Graveyard..Grave Plot; web scene key
cryptBoard because Dungeon owns 'crypt'), Tomb Slab/Grave Earth/
Ritual Stone/Coffin Lid boards, audio, default scene Graveyard.

Western shipped 2026-07-31 (play/western.js): Cowboy/Sheriff/Outlaw/
Bandit roster, 12 scenes (Sunset..Trail Camp), Crate Lid/Camp Blanket/
Tooled Leather/Wanted Poster boards, audio (flat files renamed from
the Suno subfolders - iOS Western has no flat copies), default scene
Sunset.

Desert shipped 2026-07-31 (play/desert.js): SIX-figure roster
(Pharaoh/Anubis/Snake vs Mummy/Scarab/Turtle), 12 scenes (Pyramids..
Oasis), Temple Granite/Reed Mat/Cartouche/Lapis Lazuli boards, audio,
default scene Pyramids.

Classic shipped 2026-07-31 (play/classic.js): EIGHT material variants
sharing five shapes (Onyx Pawn/Stone/Rook + Walnut Meeple vs Ivory
Pawn/Stone/Die + Brass Hourglass; FIGURES entries share point arrays,
optional `band` key maps to the dice/hourglass detail painter), 12
scenes (Wood..Park; scene key classicSlate because the neutral owns
'slate'), Maple Inlay/Picnic Wood/Walnut Inlay/Ivory boards, audio,
default scene Wood. THE THEME SET IS COMPLETE.

UI conventions (Rick 2026-07-31): selects are chevron-free and compact
(appearance:none); the 4 control buttons use inline stroke SVGs, not
emoji; the install button shows /icon-192.png; Board and Piece type are
also top-level dropdowns in the controls row, kept in sync with pickers.

## Progression shipped 2026-07-31 (third pass)
play/engine/progression.js ports ProgressionManager.swift: games/wins/
losses + winsByTheme in localStorage key tewgo.web.progress (injectable
storage, tests/progression.test.js, suite now 28). Rules mirrored from
iOS: only finished vs-AI games record (pass-and-play never counts, the
anti-grind rule), draws complete a game but record no win/loss, Gold
(12th color pair, #FCC224/#DBE3ED, `rare` flag in COLOR_SCHEMES)
unlocks per theme at 10 wins in THAT theme. UI: locked gold swatch has
a padlock overlay + "GOLD: win N more <Theme> game(s)" caption in the
👥 picker, vs-AI record line on the setup screen (#setupRecord, hidden
until games > 0), victory overlay announces the unlock the moment the
10th win lands. A persisted gold selection stays applied in themes
where it is still locked (iOS parity).

## Profile, dock and unlock gating shipped 2026-08-01 (fourth pass)
Rick's brief: the controls row was "messy as well as boring", the game
is "about OPTIONS so we want to really show them off", and the web
version "entirely missed" the sense of a personal PAGE and PROFILE.

Design options were explored on `/play/concepts.html` (noindex, still in
the repo, drawn with the real scene/figure art). Six concepts; Rick
picked A, C, E and F. **Concept B (face-off loadout: your figure vs
theirs AS the controls) was NOT built and is still on the table.**

- **Capture shelves** (A) replace the "You 2/5" pills. Five sockets a
  side; a filled socket holds the pair that side captured, drawn as two
  of the ENEMY's figures. Always the figure, never the Flat/Chip disc,
  because a shelf has to say WHO was taken. The right shelf fills toward
  its own edge so trophies sit under their own label.
- **Profile dock** (E, then reworked into B) replaces all six dropdowns.
  Those selects still exist as hidden state that the rest of game.js
  reads and writes; the player now sets them on the setup screen and in
  the two pickers. Player name lives in tewgo.web.playerName and is used
  by nameOf(), so the shelf shows their name in vs-AI games.
  The round world medallions that first sat here were REMOVED: Rick read
  them as a piece picker, and the theme is already chosen on the setup
  screen, so a second theme picker under the board was redundant.
- **Unlock gating** (C) ports ProgressionManager.isUnlocked into
  engine/progression.js: THEME_UNLOCK_AFTER (space/feudaljapan 0, then
  3/7/12/20/30/38) and THEME_ORDER (iOS registry order, deliberately NOT
  themes.js declaration order). Counts COMPLETED GAMES, not wins, so
  losing still progresses. Locked worlds are unpickable in the setup
  dropdown; crossing a threshold announces the world on the victory
  overlay and flashes its medallion.
- **Profile page** (F) ports UI/ProfileView.swift: stat tiles, the
  next-unlock card, Gold progress, and the collection counted live from
  the registries (8 worlds, 40 figures, 97 backgrounds, 8 soundtracks).

## Second pass on the lower section, later on 2026-08-01
Rick's feedback after playing it, all shipped:
- **Concept B is the dock now**: your figure, VS, their figure, each one
  tapping through to the piece picker. Two rows: figures left, tools
  centred, New game framing the right; name, record and progress
  underneath.
- **Worlds moved into the profile as the box cards** (Concept C from
  concepts.html): a painted scene with that world's two figures on it,
  its name, and a padlock over "Play N more games" when locked. Tapping
  an open one switches world. Round medallions read as pieces; boxes
  read as places.
- **The FIGURES gallery is clickable**: picking a figure equips it, and
  picking one from another world switches to that world first, since
  rosters belong to their world.
- **Stacked overlays were a real bug.** Opening the profile while the
  setup screen was up left BOTH showing, which read as a stuck window.
  Everything now opens through `presentOverlay()`, which shows exactly
  one, plus a sticky close X and Escape.
- **Copy must say what a number means.** "FIGURES 8 of 40" became
  "FIGURES UNLOCKED"; "1 GAME TO GO" became "2 MORE GAMES TO UNLOCK";
  "Next world: Ocean in 4 games" became "Finish 4 more games to unlock
  the Ocean world". Rick's standard: a player should never have to guess
  what a label refers to.

## Rick's working preferences, learned the hard way this session
- **No long dashes anywhere**, including chat replies. Hyphen, comma,
  parentheses, or two sentences. This is in his global CLAUDE.md and I
  still broke it repeatedly.
- **No `Co-Authored-By: Claude` trailer** on commits. He opted out in
  May 2026. Six commits on 2026-08-01 carry it by mistake; he has not
  asked for a history rewrite.
- **Keep replies short.** Answer the question asked. Long summaries lose
  him. This one matters: he said so explicitly.

## Full unlock: Stripe wired 2026-08-01, ONE step left
Rick wants BOTH rails eventually: Stripe first, Steam later as a
distribution channel. `grantPro(source)` stores the NAME of the granting
rail ('stripe' / 'steam'), not a bare true, so adding Steam needs no
migration.

**Price: $2.59 one time** (Rick's call 2026-08-10: the 2 and 5 are the
name, TEW = 2, GO = 5. It is $2.59 not $2.50 because sub-$10 US App
Store prices all end in 9; verified in the live ASC picker), matching
iOS. Do not invent a different one;
it is already published in ~/Dev/TEWGO/FEATURES.md and updates.html.

**Backend** (this repo is still a no-build static site; the backend is
separate infrastructure, not a build step):
- Supabase project **TewBit Games**, ref `guwquufbifuzmphcdsdt`, the same
  shared hub AstroHold uses. TEWGO owns the `tewgo` schema.
- `tewgo.unlocks`: RLS enabled with NO policies, so it is unreachable
  from the browser. Only the edge function's service role touches it.
- Edge function `tewgo-unlock` (source kept in
  `supabase/functions/tewgo-unlock/index.ts`), verify_jwt false, three
  actions: checkout, verify, restore. Talks to Stripe's REST API
  directly, so there is no SDK to keep current.

**TEST REHEARSAL PASSED 2026-08-10.** Function redeployed at 259 cents,
checkout page showed $2.59 (and adaptive THB), Rick paid with the 4242
card, verify minted TEWGO-JJPP-CPDN into tewgo.unlocks (amount_total
259), restore accepts it, wrong codes 404, re-verify returns the same
code, and /play/?unlock=cs_... applied PRO with 8/8 worlds. Two fixes
were needed and are DONE, remember them for the next schema:
- The `tewgo` schema was not in PostgREST's exposed list and
  service_role had no grants, so verify 500'd AFTER Stripe took the
  money. Fixed by grants + `alter role authenticator set
  pgrst.db_schemas = 'public, graphql_public, astro_hold, tewgo'` +
  `notify pgrst, 'reload config'` AND `notify pgrst, 'reload schema'`
  (config reload alone leaves a stale schema cache, PGRST205).
- The key is a RESTRICTED Stripe key named TEWGO (Checkout Sessions:
  Write only), matching Rick's per-project key pattern, currently the
  rk_test_ one made in the sandbox on 2026-08-10.

**GOING LIVE, the only remaining steps, Rick's alone:** create the same
TEWGO restricted key in LIVE mode (Checkout Sessions: Write), then in
his OWN Terminal (never in chat, never to Claude):
```
supabase secrets set STRIPE_SECRET_KEY=rk_live_... --project-ref guwquufbifuzmphcdsdt
```
Then update the "not on sale yet" wording on updates.html. Until then
the store sells test-mode only.

**Rules that must not be softened:**
- The browser is NEVER the authority on payment. `tewgo.web.pro` is a
  convenience cache, exactly like the iOS local hasPro. Only Stripe
  confirming `payment_status == 'paid'` grants an unlock.
- Restore is by the random `TEWGO-XXXX-XXXX` code minted at purchase,
  NOT by email: an email lookup would be enumerable. Rick can look up a
  code by email in Supabase for support.
- Per the iOS monetization rule, the unlock is cosmetic only. It must
  never touch board state, win rate or AI difficulty.

## START HERE next session (handoff 2026-08-01 evening)
Themes, progression, the profile, unlock gating and the Stripe plumbing
are all DONE and live. Three things are open, in this order:

1. **Phone pass, NOT VERIFIED.** The whole lower section was rebuilt
   twice today and only ever checked on desktop: the browser stopped
   honouring resize requests part way through (reported a 675x448 window
   while rendering at 1300 CSS px). Check /play/ on a real phone first.
   The suspects are `.dock-row1` wrapping, the world-card gallery, and
   the profile overlay at `max-width: 620px`.
2. **Turn the Stripe unlock on.** Two steps, both Rick's:
   run `/mcp` and authorize "claude.ai Stripe" so Claude can work with
   the account, then set the secret (command in the Full unlock section
   above). Rehearse with a `sk_test_` key and Stripe's 4242 card before
   the live key. Verify: buy, confirm the code appears, clear
   localStorage, restore with the code.
3. **Online multiplayer**, the last big roadmap item. Supabase is
   already in play (TewBit Games hub, `tewgo` schema exists), and the
   state codec already matches the iOS multiplayer payload shape.

`/play/concepts.html` (noindex) still holds the six design concepts.
A, B, C, E and F are all built now; keep it as the record of what was
tried and what Rick picked.
- Service worker for offline play (skipped deliberately: cache
  invalidation risk vs benefit; revisit after family playtests)
- Whatever family playtests surface (the site exists so family and
  friends on Android can play; their feedback outranks this list)

Phone pass shipped 2026-07-31: touch drag-to-aim (down = ghost + crosshair
guides, drag to adjust, release places, off-board cancels; mouse unchanged),
manifest start_url=/play/, install button on beforeinstallprompt.

Phone layout fix 2026-08-01 (Rick: "stuck on the options page, nothing to
push"). Two CSS traps, both worth remembering:
- `body` is a column flexbox. Giving it `height: 100%` made that height
  DEFINITE, so every child flex-shrank to fit the screen. On an iPhone
  .board-wrap (overflow:hidden) squashed from 365px to 269px, clipping the
  bottom of the board AND the setup screen's Start button, and the page
  could not scroll to reach it. Fix: html keeps height:100%, body keeps
  only min-height:100dvh, plus `body > * { flex-shrink: 0 }`.
- An ancestor with `backdrop-filter` is a containing block for
  `position: fixed`, so .board-wrap's blur kept the overlays trapped in the
  board box. It is turned off inside the phone media query.
Overlays (setup, victory, both pickers) now go full-viewport under
620px wide or 620px tall, so their buttons are always reachable. Light
scenes also flip the overlay background now (it was black-on-black).

## User context
Same user as the iOS project: not a web expert, explain clearly, no long
dashes in text, commit at every green milestone without being asked.

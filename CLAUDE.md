# playtewgo.com - Claude Instructions

## Project
The TEWGO website AND the browser version of the game. Two things live here:
- The marketing/support site (`index.html`, `privacy.html`) for the iOS app.
- The playable web game at `/play/` (canvas board vs AI), built so family and
  friends on Android can play TEWGO.

## Relationship to the iOS app
The iOS app lives in `~/Dev/TEWGO` (repo RickTew/TEWGO) and is the SOURCE OF
TRUTH for game rules, AI behavior, and design decisions (see its GAME_DESIGN.md
and CLAUDE.md). `play/engine/` is a direct JavaScript port of:
- `TEWGO/Game/GameBoard.swift` -> `play/engine/board.js`
- `TEWGO/Game/GameState.swift` -> `play/engine/state.js`
- `TEWGO/Game/GameAI.swift` -> `play/engine/ai.js`

Any rule or AI change must land in BOTH engines with matching tests. The iOS
repo is read-only reference from here; never edit it from this project.

## Tech decisions (2026-07-31)
- **No build step, on purpose.** Plain ES modules served as-is by GitHub Pages
  (deploys from main branch root; CNAME = playtewgo.com). No bundler, no
  GitHub Actions, no node_modules. Do not introduce a build step without Rick
  asking for one.
- Plain JavaScript, not TypeScript, so the browser and Node run the same files.
- Tests use Node's built-in runner: `npm test` (ports of the iOS
  GameBoardTests/GameStateTests/GameAITests, 22 tests). Run them before every
  commit that touches `play/engine/`.
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
  (placement works) but are untrusted: no activation, no audio.

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

## Not yet built (candidates, in rough order)
Themes are DONE (2026-07-31, all eight worlds at parity). What's left,
in the order updates.html promises it:
- Win-based progression (games played / wins counter in localStorage),
  which unblocks the Gold color scheme (12th pair, play-earned on iOS)
- Online multiplayer (would need a backend; Supabase is available)
- Service worker for offline play (skipped deliberately: cache
  invalidation risk vs benefit; revisit after family playtests)
- Whatever family playtests surface (the site exists so family and
  friends on Android can play; their feedback outranks this list)

Phone pass shipped 2026-07-31: touch drag-to-aim (down = ghost + crosshair
guides, drag to adjust, release places, off-board cancels; mouse unchanged),
manifest start_url=/play/, install button on beforeinstallprompt.

## User context
Same user as the iOS project: not a web expert, explain clearly, no long
dashes in text, commit at every green milestone without being asked.

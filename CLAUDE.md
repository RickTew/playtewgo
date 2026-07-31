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
  animations, Space nebula backdrop; Space audio (SFX + music, toggles);
  match intro (VS face-off); victory share card (Web Share / PNG download,
  dev preview at /play/?sharecard); vs AI and 2-players modes (Mode select,
  Gold vs Blue pass-and-play).

## Not yet built (candidates, in rough order)
- Phone pass: pinch/zoom or magnifier for small screens (22x22 targets are
  tight), then PWA install prompt
- More theme visuals beyond Space (figure pieces, more scenes)
- Online multiplayer (would need a backend; Supabase is available)

## User context
Same user as the iOS project: not a web expert, explain clearly, no long
dashes in text, commit at every green milestone without being asked.

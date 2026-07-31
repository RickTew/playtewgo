# Theme Port Checklist

The template for porting an iOS theme to the web. A theme is DONE only when
every box is checked. Source of truth: `~/Dev/TEWGO` (read-only reference).
Space and Ocean are the worked examples of every step.

## 1. Roster (pieces.js)
- [ ] Read the theme's block in `TEWGO/Themes/ThemeRegistry.swift`:
      playerOnePieceOptions + playerTwoPieceOptions = the full roster
      (combined; both sides may pick any of them).
- [ ] For each figure: port the `<kind>Path(radius:)` points from
      `TEWGO/Game/PieceRenderer.swift` verbatim into `FIGURES` (y up from
      feet; flipped at draw time).
- [ ] Port each figure's `makeEyeBand` case into `drawEyeBand`.
- [ ] Convert each PieceStyle's primary/stroke/glow/accent SKColors to hex
      (x255) exactly. glow becomes `glowRgb: 'r, g, b'`.
- [ ] Defaults = the theme's `playerOnePiece` / `playerTwoPiece` kinds.

## 2. Scenes (new play/<theme>.js)
- [ ] List every BackgroundOption in the theme's `backgroundOptions`
      (names, iOS order, `variant: .light` scenes get `light: true`).
- [ ] Paint each scene with the shared helpers from space.js
      (mulberry32/glow/sky/starfield): layered soft glows, never hard
      discs; seeded so it's stable between visits; Ocean is the quality
      bar. Board-environment scenes (isBoardScene on iOS) are painted as
      plain environments - no play surface, the Board picker handles that.
- [ ] Export `<THEME>_SCENES` in iOS order.

## 3. Boards (boards.js)
- [ ] Port the theme's 4 themed boards from `BoardPanelStyle.themedBoards`
      names + the `makeBoardPanel` case colors in
      `BackgroundRenderer+Boards.swift` (fill/border/tone + corner
      hardware only - interiors stay clean).
- [ ] Set `light: true` for any board in BoardStyle.swift's
      `isLightSurface` list.
- [ ] Add the entry to `THEME_BOARDS`.

## 4. Audio (play/audio/<theme>/)
- [ ] Copy place/capture/victory/ingame from
      `TEWGO/TEWGO/Audio/<Theme>/` (flat .m4a files, or rename the Suno
      originals out of their subfolders like Ocean).

## 5. Registry (themes.js + index.html)
- [ ] Add the THEMES entry: name, scenes, figures, defaults, defaultScene
      (= the iOS `background:` intensity).
- [ ] Add the `<option>` to the Theme select in play/index.html.

## 6. Verify (all in the browser before pushing)
- [ ] Theme select shows it; switching re-skins live and swaps music.
- [ ] 👥 picker: full roster in both columns, previews correct, Type row
      (Flat/Chip/Half/Tall), Finish row (Classic/3D), Color swatches all
      render with the new figures.
- [ ] 🖼️ picker: all scenes with thumbnails + 4 themed boards + 7
      universal + 4 neutrals; light scenes/boards flip the page/grid.
- [ ] Board, Grid (Dots/Lines/Boxes/None) + Piece type dropdowns list the
      right options.
- [ ] Intro shows theme name + figures; share card shows theme name +
      winner figures; capture counters tint to the roster colors.
- [ ] Place a stone, hear place sfx + theme music (human click needed -
      automation can't hear audio).
- [ ] `npm test` still green; commit; push; verify live with a
      cache-busted URL.

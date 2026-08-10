# TEWGO persona playtest harness

Simulated players with different ages, patience levels, and gaming backgrounds
play the REAL game and report friction, confusion, and bugs before real players
hit them. Ported 2026-08-10 from the DungeonHole harness
(`~/Dev/DungeonHole/playtest/`), itself ported from WinJitsu, the
"Claude Code + browser MCP persona harness" model. Runs on the Claude
subscription, no per-token API bill.

## How a pass works

1. Serve the game locally: `npx http-server -p 8741 -c-1 .` from the repo
   root (port 8741 is the port the unlock backend's CORS allowlist expects
   for localhost; http-server answers Range requests, which
   `python3 -m http.server` does not, so audio does not hang). Personas test
   **localhost only** (http://localhost:8741/play/), never production.
   No account exists in this game at all; progress is localStorage.
2. For each persona file in `personas/`, run ONE agent session whose prompt is:
   the persona file + `MISSION.md`. Browser layer: `claude-in-chrome` (drives
   Rick's Chrome, one persona at a time) or Playwright MCP for parallel
   headless sweeps.
3. Each persona writes findings to `playtest/reports/<date>-<persona>.md`
   using the format in `MISSION.md`.
4. A final dedupe pass merges findings into `playtest/reports/<date>-SUMMARY.md`,
   ranked by how many personas hit the same wall. **The dedupe pass (never the
   personas) cross-checks every flag against the PLAYTEST NOTES section of
   CLAUDE.md and marks intended behavior `[INTENDED]`; balance observations
   become `[QUESTION]` with full context, never prescriptions** (personas are
   fresh players and know none of the internals; them flagging intended
   things is expected and filtered here).
5. Personas start from a clean profile: clear localStorage for the site
   before the session so every persona is a true stranger.

## Rules

- Personas REPORT, they never fix. Findings become backlog items or session work.
- vs AI only (plus a glance at Pass & Play on one screen). The web game has
  no online play yet; if that ever changes, never play a real human.
- **The store is LIVE with real money.** Personas may open the Unlock All
  flow and report how it reads, but must NEVER proceed into Stripe checkout
  and never enter payment details of any kind.
- One session = one persona. Never blend personas; the value is the
  difference between them.

## The roster (personas/)

| File | Who | What they stress |
|------|-----|------------------|
| pente-veteran.md | Frank, 62, tournament Pente in the 1980s | rules fidelity (captures, no self-capture), AI credibility per tier, rebuild and pair-farm exploits |
| fresh-stranger.md | Maya, 34, phone-casual, clicked a friend's link | "what is this game", learning the two win conditions from the screen alone, jargon, first-match feel |
| kid-theme-fan.md | Leo, 10, here for robots and aliens, reads nothing | time-to-fun, theme and piece payoff, capture excitement, beating Easy, reading level |
| competitive-strategist.md | Priya, 28, chess.com and Go player | fairness, honest difficulty ladder, why-did-I-lose clarity, RNG vs skill perception |
| phone-in-line-player.md | Marcus, 41, plays in 5-10 minute queue windows | real game length per tier, autosave and resume, phone-width touch controls, install-as-app |

Add personas as one file each; keep them in this table.

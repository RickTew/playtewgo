// AI opponent. Direct port of TEWGO/Game/GameAI.swift (iOS repo) at
// commit c6c8c11: the 2026-08-04 ladder (Easy = random top-8, Medium =
// greedy, Hard = 2-ply veto lookahead, Expert = threat search), the
// capture-out-of-line defense (99f8139), and the 2026-08-10 capture
// economy (scaled pair values, capturedShapeLoss on capture replies).
// Keep scoring weights in sync; the tables are pinned by tests on both
// sides.

import { GameBoard, SIZE, EMPTY, opponentOf } from './board.js';

const LINE_DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1]];
const CAPTURE_DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
const CENTER = [Math.floor(SIZE / 2), Math.floor(SIZE / 2)];
// How many opponent replies Expert carries into its third ply.
const REPLY_BREADTH = 8;

function inB(r, c) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

// Swift integer division truncates toward zero; JS / does not.
function idiv(a, b) {
  return Math.trunc(a / b);
}

export class GameAI {
  /**
   * @param {'easy'|'medium'|'hard'|'expert'} difficulty
   * @param {boolean} openingVariety Persona round 2: Priya beat every
   *   tier with one memorized line because the AI answered a given
   *   opening identically forever ("rematches will feel like replays").
   *   With this on, the first few replies are drawn at random from the
   *   moves that score within a whisker of the best - variety where
   *   nothing is at stake, and the midgame stays fully deterministic.
   *   Tests that need reproducible games pass false.
   */
  constructor(difficulty, openingVariety = true) {
    this.difficulty = difficulty;
    this.openingVariety = openingVariety;
  }

  /** Returns [row, col], or null when no legal move exists (board effectively full). */
  bestMove(board, aiPlayer) {
    const candidates = this.#candidateMoves(board);
    if (candidates.length === 0) return null;

    const opponent = opponentOf(aiPlayer);

    // Win immediately
    for (const [r, c] of candidates) {
      const b = board.clone();
      b.place(aiPlayer, r, c);
      if (b.checkWin(aiPlayer, r, c)) return [r, c];
    }

    // Defend an opponent win next move.
    const oppWinSquares = this.#winningSquares(opponent, board, candidates);
    if (oppWinSquares.length > 0) {
      return this.#defenseMove(oppWinSquares, candidates, board, aiPlayer, opponent);
    }

    // Nothing is at stake yet: vary the opening so a rematch is not a
    // replay. Deliberately AFTER the win/defend scans so it can never
    // override a tactic.
    const opening = this.#openingMove(candidates, board, aiPlayer);
    if (opening) return opening;

    // The 2026-08-04 ladder shift (experienced players cleared the whole
    // old ladder): every tier moved up one notch of the old ladder, and
    // Expert gained the threat search.
    switch (this.difficulty) {
      case 'easy': {
        // Take a capture that is sitting right there, but never hunt for
        // one. Persona round 1: Maya, Leo and Priya all finished their
        // first game without a single capture happening, so Easy taught
        // them the game was plain five-in-a-row. Easy is the tier that
        // introduces the rules, so it has to demonstrate the signature
        // one; it still wanders everywhere else.
        // Persona round 3 (Rick, 2026-08-11): ONE demo capture, not a
        // mugging. Maya lost her first game to Easy 3 pairs down and
        // called it "the bitey one", harder in her hands than Medium.
        // So the shortcut runs only until Easy banks its first pair;
        // after that, captures happen only when its normal top-8 move
        // lands on one. Same rule in GameAI.swift; retune together.
        if (board.captureCount[aiPlayer] === 0) {
          const captures = this.#captureMoves(aiPlayer, board, candidates);
          const capture = this.#scored(captures, board, aiPlayer)[0]?.[0];
          if (capture) return capture;
        }
        // Random among the top eight scored moves: wanders enough to be
        // beatable, but no longer plays outright nonsense.
        const top = this.#scored(candidates, board, aiPlayer).slice(0, 8).map((e) => e[0]);
        return top[Math.floor(Math.random() * top.length)] ?? CENTER;
      }

      case 'medium':
        // The old Hard: the best greedy move every time, no lookahead.
        return this.#scored(candidates, board, aiPlayer)[0]?.[0] ?? CENTER;

      case 'hard':
        return this.#lookaheadMove(candidates, board, aiPlayer, opponent);

      case 'expert':
      default:
        return this.#threatSearchMove(candidates, board, aiPlayer, opponent);
    }
  }

  // The opponent completes a win next move unless we act. Occupying the
  // winning square is one defense; capturing a pair out of the threatened
  // line is the other classic Pente answer, and banks a pair on top.
  // Easy/Medium keep the simple block. Hard/Expert weigh every defense
  // that actually defuses the threat: a capture off the END of the line
  // is refused when it re-opens the line into an unstoppable open four
  // (2026-08-04), and since the 2026-08-10 field report a capture is
  // preferred over a block ONLY when it is durable or wins the pair
  // race. Rick's rebuild proof: capture two stones out of a four and
  // the opponent just replaces one, four again, the "defense" bought
  // one move and solved nothing. A block occupies the winning square
  // forever. So a DELAYING capture (opponent can re-threaten an
  // immediate win with a single reply) outranks a block only when it
  // brings the AI to 4+ banked pairs, where the forced capture
  // exchange IS the AI's own win condition.
  #defenseMove(oppWinSquares, candidates, board, aiPlayer, opponent) {
    const bestBlock = this.#scored(oppWinSquares, board, aiPlayer)[0]?.[0] ?? null;
    if (this.difficulty !== 'hard' && this.difficulty !== 'expert') return bestBlock;

    const defenses = oppWinSquares.slice();
    for (const m of this.#captureMoves(aiPlayer, board, candidates)) {
      if (!defenses.some(([r, c]) => r === m[0] && c === m[1])) defenses.push(m);
    }

    // Evaluate each defense once; durability is only computed when a
    // safe capture exists, because that is the only comparison it can
    // change (it is the expensive check).
    const evaluated = [];
    for (const [r, c] of defenses) {
      const b = board.clone();
      const caps = b.place(aiPlayer, r, c);
      if (this.#winningSquares(opponent, b, this.#candidateMoves(b)).length > 0) continue;
      // A defense is only "safe" if the opponent cannot answer it by
      // building an open four we have no reply to.
      const safe = !this.#allowsUndefusableOpenFour(b, aiPlayer, opponent);
      evaluated.push({
        move: [r, c],
        isCapture: caps.length > 0,
        postCapturePairs: b.captureCount[aiPlayer],
        safe,
        score: this.#score(board, r, c, aiPlayer),
        boardAfter: b,
      });
    }

    const needDurability = evaluated.some((d) => d.safe && d.isCapture);

    let best = null;
    let bestRank = -Infinity;
    let bestScore = -Infinity;
    for (const d of evaluated) {
      let rank = 0;
      if (d.safe) {
        const durable = needDurability
          ? !this.#opponentRethreatens(d.boardAfter, aiPlayer, opponent)
          : true;
        if (d.isCapture) {
          // A durable capture (or one that puts the AI at 4+ pairs,
          // where the exchange is its own win condition) is the best
          // defense there is. A delaying capture drops BELOW a durable
          // block (Rick's rebuild proof) but stays above a delaying
          // block: if every defense is temporary, the one that banks a
          // pair is better.
          rank = (durable || d.postCapturePairs >= 4) ? 4 : 2;
        } else {
          rank = durable ? 3 : 1;
        }
      }
      if (rank > bestRank || (rank === bestRank && d.score > bestScore)) {
        bestRank = rank; bestScore = d.score; best = d.move;
      }
    }
    // Nothing fully defuses it (e.g. an unbreakable open four): take the
    // best-scoring block and hope the opponent misses it.
    return best ?? bestBlock;
  }

  // After a defense (already placed on `b`), true if the opponent can
  // re-establish an immediate winning threat with a single reply - the
  // defense only delayed the threat. The classic case: two stones
  // captured out of a four are replaced by one stone and the four
  // re-forms with its winning square still open.
  #opponentRethreatens(b, aiPlayer, opponent) {
    for (const [r, c] of this.#candidateMoves(b)) {
      const b2 = b.clone();
      b2.place(opponent, r, c);
      if (this.#winningSquares(opponent, b2, this.#candidateMoves(b2)).length > 0) {
        return true;
      }
    }
    return false;
  }

  // True when some opponent reply on this board creates an open four the
  // AI cannot break with a win or a capture - i.e. a lost position.
  #allowsUndefusableOpenFour(b, aiPlayer, opponent) {
    for (const [r, c] of this.#candidateMoves(b)) {
      const b2 = b.clone();
      b2.place(opponent, r, c);
      const four = this.#openFourCells(b2, opponent, r, c);
      if (four && !this.#canDefuse(four, b2, aiPlayer)) return true;
    }
    return false;
  }

  // ----- Hard (2-ply veto lookahead, the original Expert) -----

  // Greedy plus one question: "and then what?". Takes the top moves by
  // the heuristic and, for each, finds the opponent's best reply on the
  // resulting board. A move that hands the opponent an immediate win (a
  // five, or a capture reaching 5 pairs) is vetoed outright.
  //
  // ⚠️ THIS FUNCTION WAS THE BROKEN RUNG, and the repair is the
  // `false` on the reply's #score call below. Keep it there.
  //
  // Measured with tools/sim.js, 100 games per pairing, alternating seats,
  // opening variety on. Before (2026-08-11): Hard lost to BOTH tiers
  // under it, 42% vs Medium and 39% vs Easy, conceding 4.04 pairs a game
  // to Easy. The tell was that across three pairings Hard won 122 games
  // and NOT ONE was a five in a row, while Medium beat Easy by line 89
  // times out of 89.
  //
  // WHY: the reply being subtracted was scored with the opponent's own
  // #score, and #score pays 3/4 of a line's worth for BLOCKING. So the
  // better the shape Hard built, the more the opponent's block was
  // worth, and 9/10 of that came back off Hard's own move. It penalised
  // itself for making threats. It bit hardest against WEAK opponents,
  // whose own offense is small, so the block term dominated - which is
  // why Hard was farmable by Easy of all things.
  //
  // Not counting blocking in the reply (and in Expert's #quietValue)
  // takes Hard to 88%/92% vs Easy and 79%/65% vs Medium on two seeds.
  // The baseline-delta candidate iOS discarded is genuinely no good:
  // 34% vs Easy, worse than shipping. Fixing Hard alone inverts the top
  // of the ladder (it beats the old Expert 81%), which is why Expert
  // gained its third ply in the same change.
  //
  // DO NOT TUNE THIS BY FEEL. Single deterministic games cannot referee
  // it (12 games swung a win rate 83% -> 41% with no relevant change),
  // and the one-game ladder guards in tests/ai.test.js passed all the
  // way through the bug. Any change needs >= 100 games per pairing via
  // tools/sim.js, and the same change must land on iOS. All of it is AI
  // vs AI: it says nothing about a human playing Hard.
  #lookaheadMove(candidates, board, aiPlayer, opponent) {
    const rootMoves = this.#scored(candidates, board, aiPlayer).slice(0, 12);
    const fallback = rootMoves[0]?.[0];
    if (!fallback) return CENTER;

    let bestMove = fallback;
    let bestValue = -Infinity;
    for (const [move, myScore] of rootMoves) {
      const b = board.clone();
      b.place(aiPlayer, move[0], move[1]);

      let oppWins = false;
      let bestReply = 0;
      for (const [r, c] of this.#candidateMoves(b)) {
        const b2 = b.clone();
        const caps = b2.place(opponent, r, c);
        if (b2.checkWin(opponent, r, c)) { oppWins = true; break; }
        const reply = this.#score(b, r, c, opponent, false)
          + this.#capturedShapeLoss(caps, b, aiPlayer);
        bestReply = Math.max(bestReply, reply);
      }

      // Reply discounted at 9/10 so the AI keeps the initiative on
      // otherwise-equal trades instead of playing pure defense.
      const value = oppWins ? -1000000 + myScore : myScore - idiv(bestReply * 9, 10);
      if (value > bestValue) { bestValue = value; bestMove = move; }
    }
    return bestMove;
  }

  // ----- Expert (threat-aware 2-ply search) -----

  // Hard's lookahead had three holes an experienced player farms:
  // 1. Top-12 pruning could drop the only square that blocks an opponent
  //    three, so the "block or lose" move never entered the search.
  // 2. An opponent reply creating an OPEN four only subtracted points,
  //    but an unbreakable open four IS a loss (two winning ends).
  // 3. After the AI made a four the opponent was modeled as free to play
  //    any quiet move, so forcing attacks looked weaker than they are.
  // Expert fixes all three: opponent-hot squares are forced into the root
  // set, an undefusable open four counts as lost, and forcing moves
  // restrict the opponent to actual defenses (block the win square or
  // capture out of the threat - real Pente tactics).
  #threatSearchMove(candidates, board, aiPlayer, opponent) {
    const ranked = this.#scored(candidates, board, aiPlayer);
    const fallback = ranked[0]?.[0];
    if (!fallback) return CENTER;

    const roots = ranked.slice(0, 12).map((e) => e[0]);
    for (const sq of this.#opponentFourSquares(board, opponent, candidates)) {
      if (!roots.some(([r, c]) => r === sq[0] && c === sq[1])) roots.push(sq);
    }

    let bestMove = fallback;
    let bestValue = -Infinity;
    for (const move of roots) {
      const myScore = this.#score(board, move[0], move[1], aiPlayer);
      const b = board.clone();
      b.place(aiPlayer, move[0], move[1]);
      const value = this.#valueAfterMove(myScore, b, aiPlayer, opponent);
      if (value > bestValue) { bestValue = value; bestMove = move; }
    }
    return bestMove;
  }

  // Board is AFTER the AI's candidate move; returns that move's value.
  #valueAfterMove(myScore, b, aiPlayer, opponent) {
    const replies = this.#candidateMoves(b);

    // Opponent wins on the spot: vetoed no matter what we threatened.
    if (this.#winningSquares(opponent, b, replies).length > 0) {
      return -1000000 + myScore;
    }

    const myWins = this.#winningSquares(aiPlayer, b, replies);
    if (myWins.length === 0) {
      return this.#quietValue(myScore, b, replies, aiPlayer, opponent);
    }

    // Forcing move: we threaten to win next turn, so the opponent's only
    // real options are occupying a winning square or capturing a pair to
    // change the position. If no such answer kills EVERY threat, the
    // game is won on the spot (e.g. an open four: two ends, one block).
    const neutralizers = myWins.slice();
    for (const m of this.#captureMoves(opponent, b, replies)) {
      if (!neutralizers.some(([r, c]) => r === m[0] && c === m[1])) neutralizers.push(m);
    }

    let bestSurvivingReply = null;
    for (const [r, c] of neutralizers) {
      const b2 = b.clone();
      const caps = b2.place(opponent, r, c);
      const stillWinning = this.#winningSquares(aiPlayer, b2, this.#candidateMoves(b2)).length > 0;
      if (!stillWinning) {
        // The `false` here is load-bearing and it fails QUIETLY: the iOS
        // port left blocking credit on in this loop alone and Expert
        // dropped from 95% to 69% against Easy, reading as a mildly
        // passive Expert rather than as a bug. Every reply scored inside
        // a lookahead needs it, not just the quiet branch.
        const replyScore = this.#score(b, r, c, opponent, false)
          + this.#capturedShapeLoss(caps, b, aiPlayer);
        bestSurvivingReply = Math.max(bestSurvivingReply ?? -Infinity, replyScore);
      }
    }
    if (bestSurvivingReply === null) {
      return 500000 + myScore; // every defense still loses
    }
    // Opponent escapes, but we spent their turn: small initiative bonus.
    return myScore + 2000 - idiv(bestSurvivingReply * 9, 10);
  }

  // Value of a non-forcing move: the opponent may answer anywhere. An
  // answer that builds an open four we cannot defuse is a loss, not a
  // score - that exact gap is how the old Expert "fell for" open threes.
  //
  // This is Expert's THIRD PLY, and it is the whole difference between
  // Expert and Hard (2026-08-11): a reply is judged not only by what it
  // is worth to the opponent but by what WE get to do after it, so a
  // reply that hands us the initiative is not one they would really
  // play. Without it the two tiers measure dead level once the blocking
  // leak is fixed - 50/50 here over 100 games, 47% and 48% from the two
  // seats on iOS, the same finding on two engines - because Expert's
  // threat search alone adds nothing. Without this ply the top of the
  // ladder is one tier with two names. With it: Expert 57% and 62% over
  // Hard on two seeds, 74% vs Medium, 95% vs Easy.
  //
  // Latency, 20 games per tier: Expert mean 17.4ms a move, p95 31.4ms,
  // worst 54.7ms (Hard 4.5 / 7.3 / 54.8; Medium and Easy 0.4). The web
  // runs this on the main thread inside the 350ms AI_DELAY_MS pause, so
  // the worst case is about three dropped frames while nothing is
  // animating. If it ever grows past this, move it to a Worker.
  #quietValue(myScore, b, replies, aiPlayer, opponent) {
    // The extra ply is the expensive one, so only plausible replies get
    // it; below the top handful the opponent is not choosing anyway.
    const ranked = replies
      .map(([r, c]) => [[r, c], this.#score(b, r, c, opponent, false)])
      .sort((x, y) => y[1] - x[1])
      .slice(0, REPLY_BREADTH);

    let bestReply = 0;
    for (const [[r, c], immediate] of ranked) {
      const b2 = b.clone();
      const caps = b2.place(opponent, r, c);
      let replyScore = immediate + this.#capturedShapeLoss(caps, b, aiPlayer);
      const four = this.#openFourCells(b2, opponent, r, c);
      if (four && !this.#canDefuse(four, b2, aiPlayer)) {
        replyScore = 300000;
      } else {
        // Our best answer to that reply, discounted at 4/5: it is two
        // moves away, so it is worth less than the reply itself.
        let ourFollowUp = 0;
        for (const [r3, c3] of this.#candidateMoves(b2)) {
          const v = this.#score(b2, r3, c3, aiPlayer, false);
          if (v > ourFollowUp) ourFollowUp = v;
        }
        replyScore -= idiv(ourFollowUp * 4, 5);
      }
      bestReply = Math.max(bestReply, replyScore);
      if (bestReply >= 300000) break;
    }
    return myScore - idiv(bestReply * 9, 10);
  }

  // Empty squares where `player` placing would win immediately
  // (five in a row, or a capture reaching 5 pairs).
  #winningSquares(player, board, candidates) {
    return candidates.filter(([r, c]) => {
      const b = board.clone();
      b.place(player, r, c);
      return b.checkWin(player, r, c);
    });
  }

  // Empty squares where `player` placing captures at least one pair.
  #captureMoves(player, board, candidates) {
    return candidates.filter(([r, c]) => {
      const b = board.clone();
      return b.place(player, r, c).length > 0;
    });
  }

  // Squares that are hot for the opponent: placing there would give them
  // a line of 4+ (open three ends, gap squares of split threes, four
  // extensions). These must survive root pruning as defensive options.
  #opponentFourSquares(board, opponent, candidates) {
    return candidates.filter(([r, c]) =>
      LINE_DIRECTIONS.some(([dr, dc]) =>
        this.#lineInfo(board, opponent, r, c, dr, dc)[0] >= 4));
  }

  // The four stones of an open four through (row, col) on the given
  // board, or null if that placement made no open four.
  #openFourCells(board, player, row, col) {
    for (const [dr, dc] of LINE_DIRECTIONS) {
      const cells = [[row, col]];
      let open = 0;
      for (const sign of [-1, 1]) {
        let r = row + sign * dr, c = col + sign * dc;
        while (inB(r, c) && board.grid[r][c] === player) {
          cells.push([r, c]); r += sign * dr; c += sign * dc;
        }
        if (inB(r, c) && board.grid[r][c] === EMPTY) open += 1;
      }
      if (cells.length === 4 && open === 2) return cells;
    }
    return null;
  }

  // An open four is only actually lost if we cannot answer it: with our
  // own immediate win, or a capture that removes one of its stones.
  #canDefuse(fourCells, board, aiPlayer) {
    const cands = this.#candidateMoves(board);
    if (this.#winningSquares(aiPlayer, board, cands).length > 0) return true;
    for (const [r, c] of cands) {
      const b = board.clone();
      const caps = b.place(aiPlayer, r, c);
      if (caps.length === 0) continue;
      for (const cap of caps) {
        if (fourCells.some(([fr, fc]) =>
          (fr === cap.row1 && fc === cap.col1) || (fr === cap.row2 && fc === cap.col2))) {
          return true;
        }
      }
    }
    return false;
  }

  // ----- Internals -----

  // Opening variety, or null when this move should be played normally.
  // Only fires while the board is nearly empty (at most 3 stones, so the
  // AI's first reply and its second), and only picks among moves within
  // a whisker of the best score, so the cost is never a worse move -
  // early on, symmetry makes many squares score identically anyway.
  #openingMove(candidates, board, aiPlayer) {
    if (!this.openingVariety || this.#stoneCount(board) > 3) return null;
    const ranked = this.#scored(candidates, board, aiPlayer);
    const best = ranked[0]?.[1];
    if (best === undefined) return null;
    const floor = best - Math.max(40, Math.trunc(Math.abs(best) / 10));
    const pool = ranked.slice(0, 6).filter((e) => e[1] >= floor);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)][0];
  }

  #stoneCount(board) {
    let n = 0;
    for (const row of board.grid) {
      for (const v of row) if (v !== EMPTY) n += 1;
    }
    return n;
  }

  #scored(candidates, board, aiPlayer) {
    return candidates
      .map(([r, c]) => [[r, c], this.#score(board, r, c, aiPlayer)])
      .sort((a, b) => b[1] - a[1]);
  }

  #candidateMoves(board) {
    const seen = Array.from({ length: SIZE }, () => new Array(SIZE).fill(false));
    const result = [];
    let hasAny = false;

    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < SIZE; c += 1) {
        if (board.grid[r][c] === EMPTY) continue;
        hasAny = true;
        for (let dr = -2; dr <= 2; dr += 1) {
          for (let dc = -2; dc <= 2; dc += 1) {
            const nr = r + dr;
            const nc = c + dc;
            if (!inB(nr, nc) || board.grid[nr][nc] !== EMPTY || seen[nr][nc]) continue;
            seen[nr][nc] = true;
            result.push([nr, nc]);
          }
        }
      }
    }
    return hasAny ? result : [CENTER];
  }

  /**
   * Worth of `aiPlayer` playing (row, col) on `board`.
   *
   * @param countBlocking Pass FALSE when scoring the OPPONENT'S reply
   *   inside a lookahead. A reply that blocks our line is credited here
   *   with 3/4 of that line's worth, and a search that subtracts the
   *   reply would then charge us for the block our own threat invited.
   *   Being blocked is not damage, it is the threat being answered, and
   *   counting it cost Hard every attack it ever had (see the warning on
   *   #lookaheadMove). Our OWN move always counts blocking: denying the
   *   opponent a line is real value when it is our turn to choose.
   */
  #score(board, row, col, aiPlayer, countBlocking = true) {
    const opponent = opponentOf(aiPlayer);
    let s = 0;

    // Captures this move yields - each pair is worth more the closer its
    // taker already is to the 5-pair win, plus a contest bonus when the
    // OPPONENT is the one closing in on it.
    const pairsHeldBefore = board.captureCount[aiPlayer];
    const oppPairsBefore = board.captureCount[opponent];
    const b = board.clone();
    const captures = b.place(aiPlayer, row, col);
    s += captures.length * (this.captureValue(pairsHeldBefore)
      + this.captureContestBonus(oppPairsBefore));

    // Capture count proximity to win
    if (b.captureCount[aiPlayer] >= 4) s += 2000; // one more pair wins

    // Line potential for AI (open ends matter: an open three becomes an
    // unstoppable open four, a closed three is just a shape)
    s += this.#bestLineScore(board, aiPlayer, row, col);

    // Block opponent lines - weighted at 3/4 so denying an open three
    // (2250) beats building our own closed three (500)
    if (countBlocking) s += idiv(this.#bestLineScore(board, opponent, row, col) * 3, 4);

    // Capture threats created - scaled like the capture itself (x3/8 of
    // its value, i.e. the historical 150 at zero pairs)
    s += this.#captureThreatCount(board, row, col, aiPlayer)
      * idiv(this.captureValue(pairsHeldBefore) * 3, 8);

    // Block opponent capture threats against our own pairs - a quarter
    // of what losing the pair would cost us (the flat 80 this replaced
    // meant a set-up capture was almost never answered)
    const oppCaptures = b.captureCount[opponent];
    s += this.#captureThreatCount(board, row, col, opponent)
      * idiv(this.vulnerablePairPenalty(oppCaptures), 4);

    // Don't hand the opponent free pairs: penalize every capturable pair
    // this move creates. With 5 pairs as a win condition this is the
    // difference between a challenge and a farm.
    s -= this.vulnerablePairCount(b, row, col, aiPlayer)
      * this.vulnerablePairPenalty(oppCaptures);

    return s;
  }

  // ----- Capture economy (keep in sync with TEWGO/Game/GameAI.swift) -----

  // Worth of taking one pair when the taker has already banked
  // `pairsHeld`. Five pairs win, so each pair matters more than the one
  // before; at 4 the capture IS the win (normally caught by checkWin
  // before scoring, so 20000 is a search-path backstop).
  captureValue(pairsHeld) {
    switch (pairsHeld) {
      case 0: return 400;
      case 1: return 550;
      case 2: return 800;
      case 3: return 1200;
      default: return 20000;
    }
  }

  // Cost of leaving a freshly placed pair capturable, scaled by how many
  // pairs the opponent has banked. The flat 350 this replaced was cheaper
  // than a closed three (500), so any shape-building move happily parked
  // a pair in front of an opponent stone ("here, take my pieces" - field
  // report 2026-08-10). Losing a pair costs the stones, banks the
  // opponent a pair toward 5, AND hands back tempo, so even at 0 pairs
  // it must outweigh small shapes; at 4 pairs it is the lost game
  // (30000 tops even an open four's 20000).
  // TUNING NOTE (2026-08-10 persona round 1): Frank the Pente-veteran
  // persona farmed Expert by hanging shapes on it - the fix looks like
  // raising this table, and it does NOT work: 2500-base, 2000-base, and
  // a Hard/Expert-only 2500 table were each tried on iOS, and every
  // variant collapsed the ladder head-to-heads (Hard/Expert losing to
  // Medium) - single deterministic games are too chaotic to tune this
  // weight against. Do not touch this table again without the sim
  // harness (thousands of games per pairing) as the referee.
  vulnerablePairPenalty(oppPairsHeld) {
    switch (oppPairsHeld) {
      case 0: return 1000;
      case 1: return 1400;
      case 2: return 2000;
      case 3: return 3200;
      default: return 30000;
    }
  }

  // Extra worth of taking a pair when the OPPONENT is close to the
  // 5-pair win: contesting the race removes their material and tempo.
  // Persona round 1 (Frank): Expert "sat on three or four one-move
  // captures for several turns" while he was one pair from a capture
  // win - captures priced only by the AI's own race ignored his.
  captureContestBonus(oppPairsHeld) {
    switch (oppPairsHeld) {
      case 0:
      case 1:
      case 2: return 0;
      case 3: return 1200;
      default: return 1600;
    }
  }

  // What the AI loses in shape when an opponent reply captures its
  // stones: the best line each captured pair was holding on the
  // pre-capture board. Without this the searches priced a capture reply
  // at its flat pair value, so "I make an open three, you capture it"
  // looked like a winning trade when it actually loses the shape, banks
  // the opponent a pair, and hands over tempo. max() per capture, not a
  // sum of both stones: both stones of a pair usually hold the same
  // line, summing would double-count.
  #capturedShapeLoss(captures, board, aiPlayer) {
    return captures.reduce((sum, cap) =>
      sum + Math.max(this.#bestLineScore(board, aiPlayer, cap.row1, cap.col1),
                     this.#bestLineScore(board, aiPlayer, cap.row2, cap.col2)), 0);
  }

  #lineScore(len, openEnds) {
    if (len >= 5) return 100000;
    if (len === 4 && openEnds === 2) return 20000; // open four: win next move, two ways
    if (len === 4 && openEnds === 1) return 5000; // simple four: forces a response
    if (len === 3 && openEnds === 2) return 3000; // open three: becomes an open four
    if (len === 3 && openEnds === 1) return 500;
    if (len === 2 && openEnds === 2) return 150;
    if (len === 2 && openEnds === 1) return 40;
    return openEnds > 0 ? 10 : 0;
  }

  #bestLineScore(board, player, row, col) {
    return Math.max(...LINE_DIRECTIONS.map(([dr, dc]) => {
      const [len, open] = this.#lineInfo(board, player, row, col, dr, dc);
      return this.#lineScore(len, open);
    }));
  }

  // Length of the line through (row, col) if `player` owned that cell,
  // plus how many of its two ends are open (in bounds and empty).
  #lineInfo(board, player, row, col, dr, dc) {
    let count = 1;
    let open = 0;
    for (const sign of [-1, 1]) {
      let r = row + sign * dr;
      let c = col + sign * dc;
      while (inB(r, c) && board.grid[r][c] === player) {
        count += 1;
        r += sign * dr;
        c += sign * dc;
      }
      if (inB(r, c) && board.grid[r][c] === EMPTY) open += 1;
    }
    return [count, open];
  }

  // Pairs containing the stone just placed at (row, col) that the opponent
  // can capture on their next move: [opp][AI][AI][empty] or the mirror.
  // Evaluated on the post-move board.
  vulnerablePairCount(board, row, col, aiPlayer) {
    const opp = opponentOf(aiPlayer);
    let count = 0;
    for (const [dr, dc] of CAPTURE_DIRECTIONS) {
      const pr = row + dr, pc = col + dc; // partner stone of the pair
      const br = row - dr, bc = col - dc; // end behind the placed stone
      const fr = row + 2 * dr, fc = col + 2 * dc; // end beyond the partner
      if (!inB(pr, pc) || board.grid[pr][pc] !== aiPlayer) continue;
      const behindOpp = inB(br, bc) && board.grid[br][bc] === opp;
      const behindEmpty = inB(br, bc) && board.grid[br][bc] === EMPTY;
      const beyondOpp = inB(fr, fc) && board.grid[fr][fc] === opp;
      const beyondEmpty = inB(fr, fc) && board.grid[fr][fc] === EMPTY;
      if ((behindOpp && beyondEmpty) || (behindEmpty && beyondOpp)) count += 1;
    }
    return count;
  }

  #captureThreatCount(board, row, col, aiPlayer) {
    const opp = opponentOf(aiPlayer);
    let count = 0;
    for (const [dr, dc] of CAPTURE_DIRECTIONS) {
      const r1 = row + dr, c1 = col + dc;
      const r2 = row + 2 * dr, c2 = col + 2 * dc;
      const r3 = row + 3 * dr, c3 = col + 3 * dc;
      if (!inB(r1, c1) || !inB(r2, c2) || !inB(r3, c3)) continue;
      if (board.grid[r1][c1] === opp && board.grid[r2][c2] === opp && board.grid[r3][c3] === aiPlayer) count += 1;
    }
    return count;
  }
}

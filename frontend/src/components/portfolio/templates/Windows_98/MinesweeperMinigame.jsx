import React, { useState, useEffect, useCallback, useRef } from 'react';
import data from '../../../../data/dummy_data.json';

/* ─── Windows 98 Design Tokens ─── */
const W = {
  desktop: '#008080',
  silver: '#C0C0C0',
  darkGray: '#808080',
  lightGray: '#DFDFDF',
  white: '#FFFFFF',
  navy: '#000080',
  titleActive: 'linear-gradient(90deg, #000080, #1084d0)',
};

const raised = {
  borderTop: '2px solid #FFFFFF',
  borderLeft: '2px solid #FFFFFF',
  borderBottom: '2px solid #000000',
  borderRight: '2px solid #000000',
};

const sunken = {
  borderTop: '2px solid #000000',
  borderLeft: '2px solid #000000',
  borderBottom: '2px solid #FFFFFF',
  borderRight: '2px solid #FFFFFF',
};

const outerRaised = {
  borderTop: '1px solid #FFFFFF',
  borderLeft: '1px solid #FFFFFF',
  borderBottom: '1px solid #808080',
  borderRight: '1px solid #808080',
  boxShadow: 'inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #808080',
};

/* ─── Number colours (classic Minesweeper) ─── */
const NUM_COLORS = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];

/* ─── Injected CSS ─── */
const STYLES = `
  @keyframes w98CounterBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .w98-cell {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
  }

  .w98-cell-unrevealed {
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
    background: #C0C0C0;
  }

  .w98-cell-unrevealed:active {
    border-top: 1px solid #808080;
    border-left: 1px solid #808080;
    border-bottom: 1px solid #808080;
    border-right: 1px solid #808080;
  }

  .w98-cell-revealed {
    border: 1px solid #808080;
    background: #C0C0C0;
    cursor: default;
  }

  .w98-cell-mine {
    border: 1px solid #808080;
    background: #ff0000;
    cursor: default;
  }

  .w98-led {
    font-family: 'Courier New', monospace;
    font-size: 22px;
    font-weight: bold;
    color: #ff0000;
    background: #000;
    padding: 2px 4px;
    min-width: 46px;
    text-align: right;
    letter-spacing: 2px;
    border-top: 1px solid #808080;
    border-left: 1px solid #808080;
    border-bottom: 1px solid #FFFFFF;
    border-right: 1px solid #FFFFFF;
  }

  .w98-smiley {
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
    background: #C0C0C0;
    width: 28px;
    height: 26px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .w98-smiley:active {
    border-top: 2px solid #000 !important;
    border-left: 2px solid #000 !important;
    border-bottom: 2px solid #fff !important;
    border-right: 2px solid #fff !important;
    padding-top: 2px;
    padding-left: 2px;
  }

  .w98-diff-btn {
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
    background: #C0C0C0;
    cursor: pointer;
    font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
    font-size: 10px;
    padding: 2px 8px;
    color: #000;
  }

  .w98-diff-btn.active {
    border-top: 2px solid #000;
    border-left: 2px solid #000;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
    background: #aaa;
  }

  .w98-diff-btn:active {
    border-top: 2px solid #000 !important;
    border-left: 2px solid #000 !important;
    border-bottom: 2px solid #fff !important;
    border-right: 2px solid #fff !important;
  }
`;

/* ─── Difficulty presets ─── */
const DIFFICULTIES = {
  Beginner: { rows: 9, cols: 9, mines: 10 },
  Intermediate: { rows: 13, cols: 15, mines: 25 },
  Expert: { rows: 16, cols: 20, mines: 60 },
};

/* ─── Board utilities ─── */
function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r, col: c,
      mine: false, revealed: false, flagged: false, count: 0,
    }))
  );
}

function placeMines(board, rows, cols, mines, safeR, safeC) {
  const candidates = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.abs(r - safeR) > 1 || Math.abs(c - safeC) > 1) {
        candidates.push([r, c]);
      }
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  candidates.slice(0, mines).forEach(([r, c]) => { newBoard[r][c].mine = true; });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].mine) count++;
        }
      }
      newBoard[r][c].count = count;
    }
  }
  return newBoard;
}

function floodReveal(board, rows, cols, r, c) {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const queue = [[r, c]];
  const visited = new Set([`${r},${c}`]);
  while (queue.length) {
    const [cr, cc] = queue.shift();
    newBoard[cr][cc].revealed = true;
    if (newBoard[cr][cc].count === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = cr + dr, nc = cc + dc;
          const key = `${nr},${nc}`;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(key) && !newBoard[nr][nc].mine && !newBoard[nr][nc].revealed) {
            visited.add(key);
            queue.push([nr, nc]);
          }
        }
      }
    }
  }
  return newBoard;
}

/* ─── LED display ─── */
function LEDDisplay({ value }) {
  const str = Math.max(-99, Math.min(999, value)).toString().padStart(3, '0');
  return <div className="w98-led">{str}</div>;
}

/* ─── Score panel connecting Minesweeper to portfolio ─── */
function SkillUnlockPanel({ skill }) {
  if (!skill) return null;
  return (
    <div style={{
      ...outerRaised,
      padding: '8px 12px',
      background: '#E8F4E8',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{ fontSize: '20px' }}>🏆</span>
      <div>
        <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold', color: W.navy }}>
          Skill Unlocked: {skill.name}
        </div>
        <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '10px', color: '#000' }}>
          Level {skill.level}% · {skill.category}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Minesweeper component ─── */
export default function MinesweeperMinigame() {
  const { skills } = data;
  const [difficulty, setDifficulty] = useState('Beginner');
  const { rows, cols, mines } = DIFFICULTIES[difficulty];

  const [board, setBoard] = useState(() => createEmptyBoard(rows, cols));
  const [gameState, setGameState] = useState('idle'); // idle | playing | won | lost
  const [started, setStarted] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);
  const [face, setFace] = useState('😊');
  const [wonSkill, setWonSkill] = useState(null);
  const timerRef = useRef(null);
  const skillIdxRef = useRef(0);

  const resetGame = useCallback((diff = difficulty) => {
    const { rows: r, cols: c } = DIFFICULTIES[diff];
    setBoard(createEmptyBoard(r, c));
    setGameState('idle');
    setStarted(false);
    setFlagCount(0);
    setTime(0);
    setFace('😊');
    setWonSkill(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [difficulty]);

  const handleDifficulty = (d) => {
    setDifficulty(d);
    resetGame(d);
  };

  /* Timer */
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setTime(t => Math.min(t + 1, 999)), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  /* Check win condition */
  const checkWin = useCallback((b, r, c, m) => {
    let revealedNonMine = 0;
    for (let row = 0; row < r; row++) {
      for (let col = 0; col < c; col++) {
        if (b[row][col].revealed && !b[row][col].mine) revealedNonMine++;
      }
    }
    return revealedNonMine === r * c - m;
  }, []);

  const handleCellClick = (r, c) => {
    if (gameState === 'lost' || gameState === 'won') return;
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;

    let currentBoard = board;

    if (!started) {
      currentBoard = placeMines(board, rows, cols, mines, r, c);
      setStarted(true);
      setGameState('playing');
    }

    if (currentBoard[r][c].mine) {
      const exploded = currentBoard.map(row => row.map(cell => ({
        ...cell,
        revealed: cell.mine ? true : cell.revealed,
      })));
      exploded[r][c] = { ...exploded[r][c], exploded: true };
      setBoard(exploded);
      setGameState('lost');
      setFace('😵');
      return;
    }

    const revealed = floodReveal(currentBoard, rows, cols, r, c);
    const won = checkWin(revealed, rows, cols, mines);
    setBoard(revealed);

    if (won) {
      setGameState('won');
      setFace('😎');
      const skill = skills[skillIdxRef.current % skills.length];
      setWonSkill(skill);
      skillIdxRef.current++;
    }
  };

  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameState === 'lost' || gameState === 'won') return;
    const cell = board[r][c];
    if (cell.revealed) return;
    const newBoard = board.map(row => row.map(cl => ({ ...cl })));
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setFlagCount(f => newBoard[r][c].flagged ? f + 1 : f - 1);
    setBoard(newBoard);
  };

  const handleMouseDown = () => {
    if (gameState !== 'lost' && gameState !== 'won') setFace('😮');
  };

  const handleMouseUp = () => {
    if (gameState === 'playing' || gameState === 'idle') setFace('😊');
  };

  const getCellContent = (cell) => {
    if (!cell.revealed) {
      if (cell.flagged) return { content: '🚩', color: '', bg: '' };
      return { content: '', color: '', bg: '' };
    }
    if (cell.mine) {
      return { content: cell.exploded ? '💥' : '💣', color: '', bg: cell.exploded ? '#ff0000' : '' };
    }
    if (cell.count === 0) return { content: '', color: '', bg: '' };
    return { content: cell.count.toString(), color: NUM_COLORS[cell.count] || '#000', bg: '' };
  };

  const minesLeft = mines - flagCount;

  return (
    <section
      id="minesweeper"
      style={{
        background: W.desktop,
        padding: '40px 16px 60px',
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <style>{STYLES}</style>

      {/* Desktop label */}
      <div style={{ position: 'absolute', top: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '24px' }}>💣</span>
        <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', textShadow: '1px 1px 2px #000' }}>
          Minesweeper
        </span>
      </div>

      {/* Minesweeper window */}
      <div style={{ background: W.silver, ...outerRaised, marginTop: '48px', display: 'inline-flex', flexDirection: 'column' }}>
        {/* Title bar */}
        <div style={{ background: W.titleActive, padding: '3px 4px', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}>
          <span style={{ fontSize: '14px' }}>💣</span>
          <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', flex: 1 }}>
            Minesweeper
          </span>
          {['_', '□', '✕'].map((ch, i) => (
            <div key={i} style={{ ...raised, width: '16px', height: '14px', background: W.silver, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', cursor: 'default', color: '#000' }}>
              {ch}
            </div>
          ))}
        </div>

        {/* Menu bar */}
        <div style={{ display: 'flex', padding: '2px 4px', borderBottom: `1px solid ${W.darkGray}` }}>
          {['Game', 'Help'].map(m => (
            <button key={m}
              style={{ background: 'none', border: 'none', padding: '2px 6px', cursor: 'pointer', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#000'; }}
            >
              {m}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          {/* Difficulty selector */}
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {Object.keys(DIFFICULTIES).map(d => (
              <button
                key={d}
                className={`w98-diff-btn${difficulty === d ? ' active' : ''}`}
                onClick={() => handleDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Game area */}
        <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Stats bar */}
          <div style={{ ...raised, padding: '4px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <LEDDisplay value={minesLeft} />
            <button
              className="w98-smiley"
              onClick={() => resetGame()}
              title="New game"
              aria-label="New game"
            >
              {face}
            </button>
            <LEDDisplay value={time} />
          </div>

          {/* Board */}
          <div
            style={{
              ...sunken,
              display: 'inline-block',
              lineHeight: 0,
              cursor: 'default',
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            {board.map((row, r) => (
              <div key={r} style={{ display: 'flex' }}>
                {row.map((cell, c) => {
                  const { content, color, bg } = getCellContent(cell);
                  const unrevealed = !cell.revealed;
                  return (
                    <div
                      key={c}
                      className={`w98-cell ${unrevealed ? 'w98-cell-unrevealed' : cell.mine ? 'w98-cell-mine' : 'w98-cell-revealed'}`}
                      style={{
                        color,
                        background: bg || undefined,
                      }}
                      onClick={() => handleCellClick(r, c)}
                      onContextMenu={(e) => handleRightClick(e, r, c)}
                      role="button"
                      aria-label={unrevealed ? (cell.flagged ? 'Flagged cell' : 'Hidden cell') : (cell.mine ? 'Mine' : `Cell ${content || 'empty'}`)}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Game over overlay messages */}
          {gameState === 'lost' && (
            <div style={{
              ...outerRaised,
              padding: '6px 12px',
              background: '#ffe0e0',
              textAlign: 'center',
              fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
              fontSize: '11px',
              color: '#800000',
              fontWeight: 'bold',
            }}>
              💥 Boom! You hit a mine. Click 😊 to play again.
            </div>
          )}
          {gameState === 'won' && (
            <div style={{
              ...outerRaised,
              padding: '6px 12px',
              background: '#e0ffe0',
              textAlign: 'center',
              fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
              fontSize: '11px',
              color: '#006600',
              fontWeight: 'bold',
            }}>
              🎉 You Win! Time: {time}s — Click 😎 for another round.
            </div>
          )}
          {gameState === 'idle' && (
            <div style={{
              textAlign: 'center',
              fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
              fontSize: '10px',
              color: W.darkGray,
              padding: '4px',
            }}>
              Left-click to reveal · Right-click to flag · First click is always safe
            </div>
          )}

          {/* Win skill reveal */}
          <SkillUnlockPanel skill={wonSkill} />
        </div>

        {/* Status bar */}
        <div style={{ borderTop: `1px solid ${W.darkGray}`, padding: '2px 6px', display: 'flex', gap: '4px', background: W.silver }}>
          {[
            gameState === 'idle' ? 'Click any cell to start' : gameState === 'playing' ? `⏱ ${time}s elapsed` : gameState === 'won' ? `🏆 Won in ${time}s!` : '💣 Game over',
            `${minesLeft} mines remaining`,
            `${difficulty}`,
          ].map((t, i) => (
            <div key={i} style={{ ...sunken, padding: '1px 6px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', flex: i === 0 ? 2 : 1, color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* How to play */}
      <div style={{
        ...outerRaised,
        background: W.silver,
        padding: '8px 12px',
        marginTop: '12px',
        width: 'min(400px, calc(100vw - 32px))',
      }}>
        <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold', color: W.navy, marginBottom: '6px' }}>
          📋 How to Play
        </div>
        {[
          '🖱️ Left-click to reveal a cell',
          '🚩 Right-click to place / remove a flag',
          '😊 Click the smiley face to start a new game',
          '🏆 Clear all non-mine cells to win and unlock a skill!',
          '💡 First click is always safe — no mine will be placed under it',
        ].map((item, i) => (
          <div key={i} style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000', padding: '2px 0' }}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

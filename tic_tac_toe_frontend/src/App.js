import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Color palette from requirements
 *  primary: #1976d2
 *  secondary: #424242
 *  accent: #fbc02d
 */

const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#fbc02d",
};

const BOARD_SIZE = 3;

// Utility function to determine winner
// Returns 'X', 'O', 'draw', or null
function calculateResult(board) {
  // Rows, columns, diagonals
  const lines = [];

  // Rows
  for (let i = 0; i < BOARD_SIZE; i++) {
    lines.push(board[i]);
  }
  // Columns
  for (let j = 0; j < BOARD_SIZE; j++) {
    lines.push([board[0][j], board[1][j], board[2][j]]);
  }
  // Diagonals
  lines.push([board[0][0], board[1][1], board[2][2]]);
  lines.push([board[0][2], board[1][1], board[2][0]]);

  for (let line of lines) {
    if (line.every(cell => cell === "X")) return "X";
    if (line.every(cell => cell === "O")) return "O";
  }

  // Check for draw
  if (board.flat().every(cell => cell)) {
    return "draw";
  }

  return null;
}

// PUBLIC_INTERFACE
function App() {
  // State: 2D array for board, 'X' or 'O' for current, winner
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill("")));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });

  // Side effect: update result after move
  useEffect(() => {
    const res = calculateResult(board);
    setResult(res);

    if (res === "X" || res === "O") {
      setScore(score => ({
        ...score,
        [res]: score[res] + 1,
      }));
    }
  // eslint-disable-next-line
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(i, j) {
    if (board[i][j] !== "" || result) return;
    const newBoard = board.map(row => [...row]);
    newBoard[i][j] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill("")));
    setResult(null);
    setCurrentPlayer("X");
  }

  // Styling helpers
  function getPlayerColor(player) {
    // X gets primary, O gets accent
    return player === "X" ? COLORS.primary : COLORS.accent;
  }

  // Responsive: Square sizing
  // Calculate based on screen width
  let boardSizePx = "min(90vw, 350px)";

  // PUBLIC_INTERFACE
  return (
    <div
      className="App"
      style={{
        background: "#fff",
        color: COLORS.secondary,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Segoe UI, Arial, sans-serif",
      }}
    >
      <main
        style={{
          background: "#fff",
          boxShadow: "0 4px 24px rgba(25,118,210,0.06)",
          borderRadius: 22,
          padding: "32px 24px",
          minWidth: 260,
          maxWidth: 410,
          width: "96vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Player Turn Indicator */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          {result === null ? (
            <>
              <span style={{ color: getPlayerColor(currentPlayer), letterSpacing: 1.5 }}>
                Player {currentPlayer}'s turn
              </span>
            </>
          ) : result === "draw" ? (
            <span style={{ color: COLORS.secondary, letterSpacing: 1.5 }}>It's a Draw!</span>
          ) : (
            <span style={{ color: getPlayerColor(result), letterSpacing: 1.5 }}>
              Player {result} Wins!
            </span>
          )}
        </div>
        {/* Game Board */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
            width: boardSizePx,
            height: boardSizePx,
            gap: "5px",
            marginBottom: 25,
            background: COLORS.primary + "20",
            borderRadius: 16,
            boxShadow: "0 1px 5px #aaa1",
            touchAction: "manipulation"
          }}
        >
          {board.map((row, i) =>
            row.map((cell, j) => (
              <button
                key={`${i},${j}`}
                className="ttt-square"
                onClick={() => handleSquareClick(i, j)}
                aria-label={`Cell ${i + 1},${j + 1}`}
                style={{
                  background: "#fff",
                  border: `2px solid ${cell ? getPlayerColor(cell) : COLORS.primary + "20"}`,
                  color: getPlayerColor(cell) || COLORS.secondary,
                  fontSize: "2.7rem",
                  fontWeight: 800,
                  transition: "background 0.12s, border-color 0.2s, color 0.12s",
                  borderRadius: 12,
                  height: "min(28vw,90px)",
                  width: "min(28vw,90px)",
                  outline: "none",
                  cursor: cell || result ? "default" : "pointer",
                  boxShadow: cell
                    ? "0 2px 8px 0 rgba(251,192,45,0.08)"
                    : "0 2px 8px 0 rgba(25,118,210,0.06)",
                  userSelect: "none"
                }}
                disabled={!!cell || result}
              >
                {cell}
              </button>
            ))
          )}
        </div>
        {/* Score Tracker */}
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "24px",
            marginBottom: 18,
            width: "100%",
            fontSize: 17.5,
            fontWeight: 600,
          }}
        >
          <span style={{ color: COLORS.primary }}>
            X&nbsp;
            <span style={{ fontWeight: 800 }}>{score.X}</span>
          </span>
          <span
            style={{
              color: "#888",
              fontWeight: 400,
              fontSize: 16,
              opacity: 0.67,
              letterSpacing: 1.2,
              userSelect: "none",
            }}
          >
            vs
          </span>
          <span style={{ color: COLORS.accent }}>
            O&nbsp;
            <span style={{ fontWeight: 800 }}>{score.O}</span>
          </span>
        </section>
        {/* Reset Button */}
        <button
          type="button"
          onClick={resetGame}
          aria-label="Restart game"
          style={{
            background: COLORS.primary,
            color: "#fff",
            padding: "10px 34px",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16.5,
            boxShadow: "0 1px 4px #1a769723",
            cursor: "pointer",
            letterSpacing: 1,
            marginTop: 2,
            transition: "background 0.12s, box-shadow 0.2s",
          }}
        >
          {result ? "Restart Game" : "Reset Board"}
        </button>
        {/* Attribution */}
        <footer
          style={{
            width: "100%",
            marginTop: 22,
            fontSize: 13,
            color: "#bbb",
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          <span>
            Minimalist Tic Tac Toe — <span style={{ color: COLORS.primary, fontWeight: 700 }}>React</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;

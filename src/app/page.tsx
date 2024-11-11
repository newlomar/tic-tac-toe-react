"use client";

import { useState } from "react";

type SquareType = {
  value: string | null;
  onSquareClick: () => void;
  winnerArray: number[];
  position: number;
};

type BoardType = {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
  winner: [string, number[]] | null;
};

function Square({ value, onSquareClick, winnerArray, position }: SquareType) {
  return winnerArray.includes(position) ? (
    <button className="square winnerSquare" onClick={onSquareClick}>
      {value}
    </button>
  ) : (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winner }: BoardType) {
  function handleClick(i: number) {
    if (squares[i] || winner !== null) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  let status: string;
  if (winner !== null) {
    status = "Winner: " + winner[0];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  const boardRows = [0, 1, 2];
  return (
    <>
      <div className="status">{status}</div>
      {boardRows.map((value, index) => {
        const positions = [3 * index, 3 * index + 1, 3 * index + 2];
        return (
          <div className="board-row" key={positions[index]}>
            {positions.map((value, i) => {
              return (
                <Square
                  value={squares[positions[i]]}
                  onSquareClick={() => handleClick(positions[i])}
                  key={i}
                  winnerArray={winner ? winner[1] : []}
                  position={positions[i]}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [moveHistoryOrderAsc, setMoveHistoryOrderAsc] = useState(true);
  const winner = calculateWinner(currentSquares);

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    const isCurrentMove = move === history.length - 1;
    const squaresPositionObject = {
      0: "1, 1",
      1: "1, 2",
      2: "1, 3",
      3: "2, 1",
      4: "2, 2",
      5: "2, 3",
      6: "3, 1",
      7: "3, 2",
      8: "3, 3",
      null: "",
    };

    const newMovePosition =
      move === 0
        ? null
        : history[move].findIndex(
            (item, index) => history[move][index] !== history[move - 1][index]
          );
    console.log(squaresPositionObject[0]);
    if (move === 0) {
      description = "Go to game start";
    } else if (isCurrentMove) {
      description = "You are at move #" + move;
      //+`(${squaresPositionObject[String(newMovePosition)]})`;
    } else {
      description = "Go to move #" + move;
      //+`(${squaresPositionObject[String(newMovePosition)]})`;
    }
    return (
      <li key={move}>
        {isCurrentMove ? (
          <button
            className="historyButton historyButtonCurrentMove"
            onClick={() => jumpTo(move)}
          >
            {description}
          </button>
        ) : (
          <button className="historyButton" onClick={() => jumpTo(move)}>
            {description}
          </button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winner={winner}
        />
      </div>
      <div className="game-info">
        <ol>{moveHistoryOrderAsc ? moves : moves.reverse()}</ol>
        <button
          className="reverseHistoryOrder"
          onClick={() =>
            setMoveHistoryOrderAsc((prevState) => {
              return !prevState;
            })
          }
        >
          Reverse History Order
        </button>
      </div>
    </div>
  );
}

function calculateWinner(
  squares: (string | null)[]
): [string, number[]] | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

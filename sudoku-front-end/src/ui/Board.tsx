import React from "react";
import Tile from "./Tile";

interface BoardProps {
  puzzle: number[][];
  grid: number[][];
  handleChange: (row: number, col: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Board: React.FC<BoardProps> = ({ puzzle, grid, handleChange }) => {
  return (
    <div className="board">
      <Tile puzzle={puzzle} grid={grid} handleChange={handleChange} />
    </div>
  );
}

export default Board;

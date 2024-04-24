import React, { FC } from "react";

interface TileProps {
  puzzle: number[][];
  grid: number[][];
  handleChange: (rowIndex: number, colIndex: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Tile: FC<TileProps> = ({ puzzle, grid, handleChange }) => {
  return grid.map((row, rowIndex) =>
    row.map((col, colIndex) => (
      <input
        className={
          puzzle[rowIndex][colIndex] !== 0
            ? "initial"
            : col !== 0
            ? "tile taken"
            : "tile"
        }
        value={col === 0 ? "" : col}
        key={`${rowIndex}-${colIndex}`}
        type="text"
        onChange={(e) => handleChange(rowIndex, colIndex, e)}
      />
    ))
  );
};

export default Tile;

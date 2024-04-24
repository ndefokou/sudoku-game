import "./App.css";
import React, { useState, useRef } from "react";
import Board from "./ui/Board";
import Interface from "./ui/Interface";
import { REST } from "./service/api";

function getGrid(): number[][] {
  const grid: number[][] = [];
  for (let i = 0; i < 9; i++) {
    grid[i] = Array(9).fill(0);
  }
  return grid;
}

function copy2DArray(from: number[][], to: number[][]): void {
  for (let i = 0; i < from.length; i++) {
    to[i] = [...from[i]];
  }
}

function Sudoku(): JSX.Element {
  const [grid, setGrid] = useState<number[][]>(getGrid);
  const [puzzleStatus, setPuzzleStatus] = useState<string>("** UNSOLVED **");
  const initialGrid = useRef<number[][]>(getGrid());

  function handleChange(row: number, col: number, e: React.ChangeEvent<HTMLInputElement>): void {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      if (Number(e.target.value) < 10 && initialGrid.current[row][col] === 0) {
        const newGrid = [...grid];
        newGrid[row][col] = Number(e.target.value);
        setGrid(newGrid);
      }
    }
  }

  async function handleInterface(action: string): Promise<void> {
    let newGrid: number[][];
    switch (action) {
      case "create":
        newGrid = await handleCreate();
        copy2DArray(newGrid, initialGrid.current);
        setPuzzleStatus("");
        setGrid(newGrid);
        break;
      case "solve":
        newGrid = await handleSolve();
        setGrid(newGrid);
        break;
      case "clear":
        newGrid = getGrid();
        copy2DArray(newGrid, initialGrid.current);
        setGrid(newGrid);
        setPuzzleStatus("");
        break;
      case "validate":
        const status = await handleValidate();
        const puzzStats = status ? "** SOLVED **" : "** UNSOLVED **";
        setPuzzleStatus(puzzStats);
        break;
      default:
        throw new Error("Invalid action");
    }
  }

  async function handleCreate(): Promise<number[][]> {
    try {
      const response = await REST.getBoard();
      const data = await response.json();
      return data.game;
    } catch (error) {
      console.log(error);
      return getGrid(); // Return a default grid if an error occurs
    }
  }

  async function handleValidate(): Promise<boolean> {
    try {
      const response = await REST.validateBoard(grid);
      const data = await response.json();
      return data.status;
    } catch (error) {
      console.log(error);
      return false; // Return false if an error occurs
    }
  }

  async function handleSolve(): Promise<number[][]> {
    try {
      const response = await REST.solveBoard(grid);
      const data = await response.json();
      if (data.status) {
        setPuzzleStatus("** SOLVED **");
        return data.solution;
      } else {
        setPuzzleStatus("** UNSOLVABLE **");
        return grid;
      }
    } catch (error) {
      console.log(error);
      return grid; // Return the original grid if an error occurs
    }
  }

 return (
    <div className="Sudoku">
      <h1>Sudoku Game</h1>
      <Board puzzle={initialGrid.current} grid={grid} handleChange={handleChange} />
      <Interface handleInterface={handleInterface} status={puzzleStatus} />
    </div>
  );
}

export default Sudoku;

import "./App.css";
import  { FC } from "react";
import Sudoku from "./Sudoku";

const App: FC = () => {
  return (
    <div className="App">
      <Sudoku />
    </div>
  );
};

export default App;

import React, { useState, useMemo } from "react";
import Checker from "./Checker";
import PlayableSquare from "./PlayableSquare";
import {
  nonPlayableSquareStyle,
  playableSquareStyle,
  checkerStyle,
  BoardGrid
} from "../styles/boardStyles";

const calcLocations = board => {
  let blackCounter = 0;
  let redCounter = 0;
  let locations = { red: {}, black: {} };
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let squareState = initialBoard[row][col];
      if (squareState > 0) {
        const checkerColor = squareState == 1 ? "red" : "black";
        locations[checkerColor][
          checkerColor == "red" ? redCounter++ : blackCounter++
        ] = [row, col];
      }
    }
  }
  return locations;
};

let initialBoard = [
  [-1, 1, -1, 1, -1, 1, -1, 1],
  [1, -1, 1, -1, 1, -1, 1, -1],
  [-1, 1, -1, 1, -1, 1, -1, 1],
  [0, -1, 0, -1, 0, -1, 0, -1],
  [-1, 0, -1, 0, -1, 0, -1, 0],
  [2, -1, 2, -1, 2, -1, 2, -1],
  [-1, 2, -1, 2, -1, 2, -1, 2],
  [2, -1, 2, -1, 2, -1, 2, -1]
];

let makeHighlighted = () => [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

let initialLocations = calcLocations(initialBoard);

class Board extends React.Component {
  locations = initialLocations;

  state = {
    highlighted: makeHighlighted(),
    selectedColor: null,
    selectedRow: null,
    selectedCol: null,
    board: initialBoard
  };

  setBoard = ({ val, row, col }) => {
    row = parseInt(row);
    col = parseInt(col);
    val = parseInt(val);
    console.log(row, col, val);
    var newArray = [];
    for (var i = 0; i < this.state.board.length; i++) {
      newArray[i] = this.state.board[i].slice();
    }
    newArray[row][col] = val;
    this.setState({
      board: newArray
    });
  };

  colorMap = {
    black: 2,
    red: 1
  };

  moveCurr = ({ row, col }) => {
    const { selectedColor } = this.state;

    this.setBoard({ col, row, val: this.colorMap[selectedColor] });
  };

  setLocation = ({ color, counter, row, col }) => {
    row = parseInt(row);
    col = parseInt(col);
    counter = parseInt(counter);
    this.setState({
      selectedCol: col,
      selectedRow: row,
      selectedColor: color
    });
  };

  resetSquare = ({ row, col }) => {
    console.log("reset", row, col);
    this.setBoard({ val: 0, row, col });
    this.setState({ highlighted: makeHighlighted() });
  };

  showSquares = ({ color, counter, col, row }) => {
    this.setLocation({ color, counter, row, col });
    var newArray = [];
    for (var i = 0; i < this.state.highlighted.length; i++)
      newArray[i] = this.state.highlighted[i].slice();

    const moves = this.validMove(color, row, col);
    console.log(moves);
    moves.forEach(move => {
      const [r, c] = move;
      console.log(r, c);
      newArray[r][c] = 1;
    });

    newArray[row][col] = 1;
    this.setState({ highlighted: newArray });
    console.log(new Date());
  };

  validMove = (color, row, col) => {
    col = parseInt(col);
    row = parseInt(row);

    var moves = [];
    var multiplier = 1;
    if (color == "black") {
      multiplier = -1;
    }

    const rows = [-1, 1];
    rows.forEach(item => {
      if (row >= 0 && col >= 0 && row < 8 && col < 8) {
        moves.push([row + multiplier, col + item]);
      }
    });
    console.log(moves);
    return moves;
  };

  makeBoard = () => {
    let blackCounter = 0;
    let redCounter = 0;
    let retVal = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareState = this.state.board[row][col];
        switch (squareState) {
          case -1:
            retVal.push(
              <div style={nonPlayableSquareStyle} key={["np", row, col]}></div>
            );
            break;
          default:
            const checkerColor = squareState == 1 ? "red" : "black";
            retVal.push(
              <PlayableSquare
                key={[row, col]}
                row={row}
                col={col}
                style={playableSquareStyle}
                setBoard={this.setBoard}
                board={this.board}
                locations={this.locations}
                setLocation={this.setLocation}
                moveCurr={this.moveCurr}
                highlighted={this.state.highlighted[row][col]}
              >
                {squareState > 0 ? (
                  <Checker
                    color={checkerColor}
                    counter={
                      checkerColor == "red" ? redCounter++ : blackCounter++
                    }
                    style={checkerStyle}
                    row={row}
                    col={col}
                    showSquares={this.showSquares}
                    resetSquare={this.resetSquare}
                  ></Checker>
                ) : null}
              </PlayableSquare>
            );
            break;
        }
      }
    }
    return retVal;
  };
  render() {
    return <BoardGrid>{this.makeBoard()}</BoardGrid>;
  }
}

export default Board;

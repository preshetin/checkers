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
      let squareState = board[row][col];
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
  board = initialBoard;
  state = {
    highlighted: makeHighlighted()
  };

  setBoard = (row, col, val) => {
    row = parseInt(row);
    col = parseInt(col);
    val = parseInt(val);
    this.board[row][col] = val;
  };

  locations = initialLocations;

  setLocation = ({ color, counter, row, col }) => {
    row = parseInt(row);
    col = parseInt(col);
    counter = parseInt(counter);
    this.locations[color][counter] = [row, col];
  };

  showSquares = ({ color, counter }) => {
    const [row, col] = this.locations[color][counter];
    var newArray = [];
    for (var i = 0; i < this.state.highlighted.length; i++)
      newArray[i] = this.state.highlighted[i].slice();
    newArray[row][col] = 1;
    this.setState({ highlighted: newArray });
    console.log(this.highlighted);
  };

  makeBoard = () => {
    let blackCounter = 0;
    let redCounter = 0;
    let retVal = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareState = initialBoard[row][col];
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

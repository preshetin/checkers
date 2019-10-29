import React from "react";
import Checker from "./Checker";
import PlayableSquare from "./PlayableSquare";
import {
  nonPlayableSquareStyle,
  playableSquareStyle,
  checkerStyle,
  BoardGrid
} from "../styles/boardStyles";

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

class Board extends React.Component {
  state = {
    highlighted: makeHighlighted(),
    selectedColor: null,
    selectedRow: null,
    selectedCol: null,
    currMove: "black",
    board: initialBoard,
    selectedIsKing: false
  };

  makeAutoMove = () => {
    const color = "red";
    const b = this.state.board;
    var maxMoveLength = 0;
    var maxMove = null;
    var maxStartRow = null;
    var maxStartCol = null;
    var maxKing = null;
    for (let row = 0; row < b.length; row++) {
      for (let col = 0; col < b[0].length; col++) {
        const boardVal = b[row][col];
        if (boardVal == 1 || boardVal == 3) {
          const king = boardVal == 3;
          const moves = this.getMoves(color, row, col, king);
          moves.push(...this.getJumps(color, row, col, king));
          // eslint-disable-next-line no-loop-func
          moves.forEach(move => {
            const [r, c] = move;
            const length = Math.abs(row - r) + Math.abs(col - c);
            if (length > maxMoveLength) {
              maxMove = move;
              maxMoveLength = length;
              maxStartRow = row;
              maxStartCol = col;
              maxKing = king;
            }
          });
        }
      }
    }
    this.setLocation({
      color,
      row: maxStartRow,
      col: maxStartCol,
      king: maxKing
    });
    if (maxMove) {
      const [row, col] = maxMove;
      this.moveCurr({ row, col });
      this.resetSquare({ row: maxStartRow, col: maxStartCol });
      this.switchTurns();
    }
  };

  switchTurns = () => {
    if (this.state.currMove == "black") {
      this.setState({
        currMove: "red"
      });
      setTimeout(this.makeAutoMove, 300);
    } else {
      this.setState({
        currMove: "black"
      });
    }
  };

  setBoard = ({ val, row, col }) => {
    row = parseInt(row);
    col = parseInt(col);
    val = parseInt(val);
    if (row == 0 && val == 2) {
      val = 4;
    } else if (row == 7 && val == 1) {
      val = 3;
    }
    var newArray = [];
    for (var i = 0; i < this.state.board.length; i++) {
      newArray[i] = this.state.board[i].slice();
    }
    newArray[row][col] = val;
    if (Math.abs(row - this.state.selectedRow) > 1) {
      const capturedPieces = this.getCaptured({
        startRow: this.state.selectedRow,
        startCol: this.state.selectedCol,
        endRow: row,
        endCol: col,
        color: this.state.selectedColor,
        king: this.state.selectedIsKing
      });
      capturedPieces.forEach(piece => {
        [row, col] = piece;
        newArray[row][col] = 0;
      });
    }
    this.setState({
      board: newArray
    });
  };

  colorMap = {
    black: 2,
    red: 1
  };

  moveCurr = ({ row, col }) => {
    const { selectedColor, selectedIsKing } = this.state;
    var val = this.colorMap[selectedColor];
    if (selectedIsKing) {
      val += 2;
    }
    console.log("king", selectedIsKing);
    this.setBoard({ col, row, val });
  };

  setLocation = ({ color, row, col, king }) => {
    row = parseInt(row);
    col = parseInt(col);
    this.setState({
      selectedCol: col,
      selectedRow: row,
      selectedColor: color,
      selectedIsKing: king
    });
  };

  resetSquare = () => {
    this.setBoard({
      val: 0,
      row: this.state.selectedRow,
      col: this.state.selectedCol
    });
  };

  resetHiglighted = () => {
    this.setState({ highlighted: makeHighlighted() });
  };

  showSquares = ({ color, col, row, king }) => {
    if (this.state.currMove != color) {
      return;
    }
    this.setLocation({ color, row, col, king });
    var newArray = [];
    for (var i = 0; i < this.state.highlighted.length; i++)
      newArray[i] = this.state.highlighted[i].slice();
    var moves = this.getJumps(color, row, col, king);
    if (moves.length == 0) {
      moves = this.getMoves(color, row, col, king);
    }
    moves.forEach(move => {
      const [r, c] = move;
      newArray[r][c] = 1;
    });
    this.setState({ highlighted: newArray });
  };

  isInBounds = (r, c) => r >= 0 && c >= 0 && r < 8 && c < 8;

  getMoves = (color, row, col, king) => {
    col = parseInt(col);
    row = parseInt(row);
    var moves = [];
    var rows = color == "black" ? [-1] : [1];
    if (king) {
      rows = [1, -1];
    }
    const cols = [-1, 1];
    cols.forEach(c => {
      rows.forEach(r => {
        if (this.isInBounds(row + r, col + c)) {
          if (this.state.board[row + r][col + c] == 0) {
            moves.push([row + r, col + c]);
          }
        }
      });
    });
    return moves;
  };

  getJumps = (color, row, col, king) => {
    col = parseInt(col);
    row = parseInt(row);
    var rows = color == "black" ? [-1] : [1];
    if (king) {
      rows = [1, -1];
    }
    const oponnents = color == "black" ? [1, 3] : [2, 4];
    const moves = [];
    const seen = new Set();
    const dfsUtil = (row, col, rows) => {
      seen.add(row * 8 + col);
      const jumps = [];
      rows.forEach(row => {
        jumps.push([row, 1]);
        jumps.push([row, -1]);
      });
      jumps.forEach(jumped => {
        const [r, c] = jumped;
        const [jRow, jCol] = [row + r, col + c];
        const [lRow, lCol] = [row + r * 2, col + c * 2];
        if (
          this.isInBounds(jRow, jCol) &&
          oponnents.includes(this.state.board[jRow][jCol])
        ) {
          if (
            !seen.has(lRow * 8 + lCol) &&
            this.isInBounds(lRow, lCol) &&
            this.state.board[lRow][lCol] == 0
          ) {
            moves.push([lRow, lCol]);
            dfsUtil(lRow, lCol, rows);
          }
        }
      });
    };
    dfsUtil(row, col, rows);
    return moves;
  };

  getCaptured = ({ startRow, startCol, endRow, endCol, color, king }) => {
    var rows = color == "black" ? [-1] : [1];
    if (king) {
      rows = [1, -1];
    }
    const oponnents = color == "black" ? [1, 3] : [2, 4];
    var ans = [];
    var found = false;
    const seen = new Set();
    const dfsUtil = (row, col, rows, captured) => {
      seen.add(row * 8 + col);
      const jumps = [];
      rows.forEach(row => {
        jumps.push([row, 1]);
        jumps.push([row, -1]);
      });
      jumps.forEach(jumped => {
        const [r, c] = jumped;
        const [jRow, jCol] = [row + r, col + c];
        const [lRow, lCol] = [row + r * 2, col + c * 2];
        if (
          this.isInBounds(jRow, jCol) &&
          oponnents.includes(this.state.board[jRow][jCol])
        ) {
          if (
            !seen.has(lRow * 8 + lCol) &&
            this.isInBounds(lRow, lCol) &&
            this.state.board[lRow][lCol] == 0
          ) {
            if (found == true) {
              return;
            }
            captured.push([jRow, jCol]);
            if (lRow == endRow && lCol == endCol) {
              ans = captured.slice();
              found = true;
              return;
            }
            dfsUtil(lRow, lCol, rows, captured.slice());
            if (found == true) {
              return;
            }
            captured.pop();
          }
        }
      });
    };
    dfsUtil(startRow, startCol, rows, []);
    return ans;
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
            const checkerColor =
              squareState == 1 || squareState == 3 ? "red" : "black";
            const king = squareState > 2;
            retVal.push(
              <PlayableSquare
                key={[row, col]}
                row={row}
                col={col}
                style={playableSquareStyle}
                moveCurr={this.moveCurr}
                highlighted={this.state.highlighted[row][col]}
                resetSquare={this.resetSquare}
                resetHighlighted={this.resetSquare}
                switchTurns={this.switchTurns}
              >
                {squareState > 0 ? (
                  <Checker
                    color={checkerColor}
                    king={king}
                    counter={
                      checkerColor == "red" ? redCounter++ : blackCounter++
                    }
                    style={checkerStyle}
                    row={row}
                    col={col}
                    showSquares={this.showSquares}
                    resetSquare={this.resetSquare}
                    resetHighlighted={this.resetHiglighted}
                    currMove={this.state.currMove}
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

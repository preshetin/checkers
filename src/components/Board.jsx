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
    board: initialBoard
  };

  switchTurns = ()=>{
    if (this.state.currMove=="black"){
      this.setState({
        currMove: "red"
      })
    } else {
      this.setState({
        currMove: "black"
      })
    }
  }

  setBoard = ({ val, row, col }) => {
    row = parseInt(row);
    col = parseInt(col);
    val = parseInt(val);
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

  resetSquare = () => {
    this.setBoard({ val: 0, row: this.state.selectedRow, col: this.state.selectedCol });
  };

  resetHiglighted = () =>{
    this.setState({ highlighted: makeHighlighted() });
  }

  showSquares = ({ color, counter, col, row }) => {
    if (this.state.currMove!=color){
      return
    }
    this.setLocation({ color, counter, row, col });
    var newArray = [];
    for (var i = 0; i < this.state.highlighted.length; i++)
      newArray[i] = this.state.highlighted[i].slice();
    const moves = this.getMoves(color, row, col);
    moves += this.getJumps(color,row,col)
    moves.forEach(move => {
      const [r, c] = move;
      newArray[r][c] = 1;
    });
    this.setState({ highlighted: newArray });
  };

  isInBounds = (r,c) => (
    r >= 0 && c >= 0 && r < 8 && c < 8
  ) 
  
  getMoves = (color, row, col) => {
    col = parseInt(col);
    row = parseInt(row);
    var moves = [];
    const direction = color == "black"? -1 :1
    const rows = [-1, 1];
    rows.forEach(item => {
      if (this.isInBounds(row + direction,col+item)) {
        if (this.state.board[row + direction][col + item]==0){
          moves.push([row + direction, col + item]);
        }
      }
    });
    return moves;
  };

  getJumps = (color, row, col) => {
    col = parseInt(col);
    row = parseInt(row);
    const direction = (color == "black") ? -1 : 1
    const oponnent = (color =="black") ? 1:  2
    const moves=[]
    const dfsUtil=(row,col,direction)=>{
      const jumps = [[direction,1],[direction,-1]]
      jumps.forEach(jumped => {
        const [r,c]=jumped
        const [jRow,jCol]=[row+r,col+c]
        const [lRow,lCol]=[row+r*2,col+c*2]
        if (this.isInBounds(jRow,jCol) && this.state.board[jRow][jCol]==oponnent) {
          if (this.isInBounds(lRow,lCol) && this.state.board[lRow][lCol]==0) {
            moves.push([lRow, lCol]);
            dfsUtil(lRow,lCol,direction)
          }
        }
      })
    }
    dfsUtil(row,col,direction)
    console.log(moves)
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
                moveCurr={this.moveCurr}
                highlighted={this.state.highlighted[row][col]}
                resetSquare={this.resetSquare}
                resetHighlighted={this.resetSquare}
                switchTurns={this.switchTurns}
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

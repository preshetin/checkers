import React, { useContext } from "react";
import { privateEncrypt } from "crypto";
import { useDrop } from "react-dnd";

const PlayableSquare = ({
  style,
  children,
  row,
  col,
  board,
  setBoard,
  setLocation,
  locations,
  highlighted
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "checker",
    canDrop: () => true, //canMoveChecker(x, y),
    drop: () => true, //moveChecker(x, y),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  });
  // const drop = e => {
  //   e.preventDefault();
  //   const data = e.dataTransfer.getData("transfer");
  //   e.target.appendChild(document.getElementById(data));
  //   const color = e.dataTransfer.getData("color");
  //   const counter = e.dataTransfer.getData("counter");
  //   const [prevRow, prevCol] = locations[color][parseInt(counter)];
  //   setBoard(prevRow, prevCol, 0);
  //   setBoard(row, col, color == "red" ? 1 : 2);
  //   setLocation({ color, counter, row, col });
  // };

  // const allowDrop = e => {
  //   e.preventDefault();
  // };

  return (
    <div
      ref={drop}
      // onDrop={drop}
      // onDragOver={allowDrop}
      style={{
        ...style,
        backgroundColor:
          (isOver && !canDrop && "red") ||
          (!isOver && canDrop && "yellow") ||
          (isOver && canDrop && "green") ||
          "black"
      }}
    >
      {children}
    </div>
  );
};

export default PlayableSquare;

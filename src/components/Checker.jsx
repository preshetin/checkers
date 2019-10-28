import React, { useContext, useState } from "react";
import { BoardContext } from "../context/BoardContext";
import { DragPreviewImage, useDrag } from "react-dnd";

const Checker = ({
  setPosition,
  color,
  style,
  counter,
  row,
  col,
  showSquares
}) => {
  // const { board, setBoard } = useContext(BoardContext);
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: "checker" },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  // const drag = e => {
  //   e.dataTransfer.setData("transfer", e.target.id);
  //   e.dataTransfer.setData("color", color);
  //   e.dataTransfer.setData("counter", counter);
  //   showSquares({ color, counter });
  // };

  // const noAllowDrop = e => {
  //   e.stopPropagation();
  // };

  return (
    <div
      // draggable="true"
      // onDragStart={drag}
      // onDragOver={noAllowDrop}
      ref={drag}
      style={{
        ...style,
        backgroundColor: color,
        opacity: isDragging ? 0.5 : 1
      }}
      id={[color, counter]}
    ></div>
  );
};

export default Checker;

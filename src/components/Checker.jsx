import React, { useContext, useState } from "react";
import { BoardContext } from "../context/BoardContext";
import { useDrag } from "react-dnd";

const Checker = ({
  resetSquare,
  color,
  style,
  counter,
  row,
  col,
  showSquares
}) => {
  var started = false;

  const [{ isDragging }, drag] = useDrag({
    item: { type: "checker", color, row, col },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    begin: monitor => showSquares({ color, counter, col, row }),
    end: monitor => resetSquare({ row, col })
  });

  return (
    <div
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

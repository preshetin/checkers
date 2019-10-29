import React from "react";
import { useDrag } from "react-dnd";

const Checker = ({
  resetHighlighted,
  color,
  style,
  counter,
  row,
  col,
  showSquares,
  currMove,
  king
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: "checker" },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    begin: monitor => showSquares({ color, col, row, king }),
    end: monitor => resetHighlighted()
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
    >
      <div
        style={{
          fontFamily: "Arial Black",
          fontSize: "1em",
          color: "white",
          textAlign: "center",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "turqoise",
          width: "100%"
        }}
      >
        {king ? "K" : ""}
      </div>
    </div>
  );
};
export default Checker;

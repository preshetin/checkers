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
  currMove
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: "checker"},
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    begin: monitor => showSquares({ color, col, row }),
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
    ></div>
  );
};
export default Checker;

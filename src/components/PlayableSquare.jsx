import React from "react";
import { useDrop } from "react-dnd";

const PlayableSquare = ({
  style,
  children,
  row,
  col,
  highlighted,
  moveCurr,
  resetSquare,
  resetHighlighted,
  switchTurns
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "checker",
    canDrop: () => highlighted == 1,
    drop: (item, monitor) => {
      moveCurr({ row, col })
      resetSquare({ row, col })
      resetHighlighted()
      switchTurns()
    },
    collect: (monitor, props) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  });
  return (
    <div
      ref={drop}
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

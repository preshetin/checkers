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
  highlighted,
  moveCurr
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "checker",
    canDrop: () => highlighted == 1,
    drop: (item, monitor) => moveCurr({ row, col }),
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

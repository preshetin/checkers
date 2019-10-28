import React from "react";
import Board from "./components/Board";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

export default class App extends React.Component {
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <Board></Board>
      </DndProvider>
    );
  }
}

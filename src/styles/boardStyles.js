import styled from "styled-components";

export const BoardGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(8, 12vmin);
  grid-template-rows: repeat(8, 12vmin);
  height: 100vh;
`;

export const nonPlayableSquareStyle = {
    backgroundColor: "red",
    border: "1px yellow solid"
};

export const playableSquareStyle = {
    backgroundColor: "black",
    border: "1px yellow solid"
};

export const checkerStyle = {
    borderRadius: "50%",
    position: "relative",
    height: "90%",
    width: "90%",
    top: "5%",
    left: "5%",
    cursor: "pointer",
    boxShadow: "inset 0 0 20px white",
    opacity: "99%",
    transform: 'translate(0, 0)'
};
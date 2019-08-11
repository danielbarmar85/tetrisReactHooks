import React from "react";
import { StyledDisplay } from "./styles/StyledDisplay";

// Create display score, level...
const Display = ({ gameOver, text }) => {
  return <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>;
};

export default Display;

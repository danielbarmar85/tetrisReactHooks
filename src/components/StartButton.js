import React from "react";
import { StyledStartButton } from "./styles/StyleStartButton";

// Component to draw start button.
const StartButton = ({ callback }) => (
  <StyledStartButton onClick={callback}>Start Game</StyledStartButton>
);

export default StartButton;

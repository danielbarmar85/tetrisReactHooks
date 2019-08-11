import React from "react";
import { StyledCell } from "./styles/StyledCell";
import { TETROMINOS } from "../tetrominos";

// Components to create cell.
const Cell = ({ type }) => (
  <StyledCell type={type} color={TETROMINOS[type].color} />
);

// Memorize the component and only update
// when there is a real change.
export default React.memo(Cell);

import { useState, useEffect } from "react";
import { createStage } from "../gameHelpers";

// Hooks to control the stage and movement of the player.
export const useStage = (player, resetPlayer) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    // Delete entire rows.
    const sweepRows = newStage =>
      newStage.reduce((ack, row) => {
        if (row.findIndex(cell => cell[0] === 0) === -1) {
          setRowsCleared(prev => prev + 1);
          ack.unshift(new Array(newStage[0].length).fill([0, "clear"]));
          return ack;
        }
        ack.push(row);
        return ack;
      }, []);

    const updateStage = prevStage => {
      // First flush stage. We check if the cell is to delete
      // or if we do not return the cell.
      // With this we will know if the cells
      // have collided with each other.
      const newStage = prevStage.map(row =>
        row.map(cell => (cell[1] === "clear" ? [0, "clear"] : cell))
      );

      // Then draw the tetromino.
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            // Tetromino coordinates on stage
            // And check if collided if clear to delete in the next execution.
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? "merged" : "clear"}`
            ];
          }
        });
      });

      // Then check if we collided.
      if (player.collided) {
        // Reset teromino.
        resetPlayer();
        // Check if there is a complete row:
        // if it is complete, remove it from the scenario
        // but return the same scenario.
        return sweepRows(newStage);
      }

      return newStage;
    };

    // To call the function to update the stage and pass it the previous
    // stage we call "setState" with a function that in turn calls the
    // update by passing the previous stage as an argument. Functional programing.
    setStage(prev => updateStage(prev));
  }, [player, resetPlayer]);

  return [stage, setStage, rowsCleared];
};

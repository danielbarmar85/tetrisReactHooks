import { useState, useCallback } from "react";
import { randomTetrominos, TETROMINOS } from "../tetrominos";
import { STAGE_WIDTH, checkCollision } from "../gameHelpers";

// Hook to control user movement tetromino.
export const usePlayer = () => {
  // TETROMINOS[0] It is for the first time since we do not want
  // to show a tetromino until the start button is pressed.
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false
  });

  // Rotate tetromino.
  const rotate = (matrix, dir) => {
    // Make the rows to become cols (transpose).
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map(col => col[index])
    );
    // Reverse each row to get a rotated matrix.
    if (dir > 0) return rotatedTetro.map(row => row.reverse());

    return rotatedTetro.reverse();
  };

  // It is the most complicated function of this project
  // to look at the issue of collisions.
  // I think I went totally crazy.
  // Player rotate tetromino.
  const playerRotate = (stage, dir) => {
    // Clone player.
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    // Mathematical method that does it in a very optimal
    // way to verify that when rotating
    // it does not collide with the walls of our stage.
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      // Round trip movement.
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        // We return it to the original position since the turn cannot be made
        // because it collides with something.
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }

    setPlayer(clonedPlayer);
  };

  // Function update position tetronimo with user
  // press keys left, right and down.
  const updatePlayerPos = ({ x, y, collided }) => {
    //Update position.
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided
    }));
  };

  // Funcion para reiniciar a la posion de origen.
  // To avoid an infinite loop we use "useCallback".
  const resetPlayer = useCallback(() => {
    // Update position initial x half and y 0,
    // Random tetromino and collided to a false.
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetrominos().shape,
      collided: false
    });
  }, []);

  return [player, updatePlayerPos, resetPlayer, playerRotate];
};

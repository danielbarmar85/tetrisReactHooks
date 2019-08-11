import React, { useState } from "react";
// Import components.
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";
// Import styles.
import { StyledTetrisWrapper, StyledTetris } from "./styles/StyledTetris";
// Import Custom Hooks.
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";
import { useInterval } from "../hooks/useInterval";
import { useGameStatus } from "../hooks/useGameStatus";
// Import libs.
import { createStage, checkCollision } from "../gameHelpers";

// Principal component to added APP.
const Tetris = () => {
  // Normal Hooks.
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Custom Hooks for player and stage.
  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );

  // Function for move left and right. move axis x
  // left = -1 and right 1.
  const movePlayer = dir => {
    // Call check collision.
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const startGame = () => {
    // Reset everything
    setStage(createStage());
    // Initialize the time with which
    // the tetromino will go down.
    setDropTime(1000);
    // Reset player.
    resetPlayer();
    // Set game over to false.
    setGameOver(false);
    // Set score 0.
    setScore(0);
    // Set rows 0.
    setRows(0);
    // Set Level 0.
    setLevel(0);
  };

  // Function for the fall of the tetromino
  // one position down.
  const drop = () => {
    // Increase level when player has cleared 10 rows.
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      // Also increase speed.
      setDropTime(1000 / (level + 1) + 200);
    }

    // Call check collision.
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // When controlling the collision when
      // the user moves the tetromino down,
      // when this collision should be added to the stage.

      // Game over check.
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  // Function to reset the interval to continue.
  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  // Function to lower the tetromino down.
  const dropPlayer = () => {
    //Stop the interval when the player is pressing down.
    setDropTime(null);
    drop();
  };

  // Function that captures the pressed keys
  // whenever the game is started
  // Destructuring e.keycode.
  const move = ({ keyCode }) => {
    // Check start game.
    if (!gameOver) {
      // Arrow Left key.
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        // Arrow Right key.
        movePlayer(1);
      } else if (keyCode === 40) {
        // Arrow Down key.
        dropPlayer();
      } else if (keyCode === 38) {
        // UP Arrow rotate tetromino.
        playerRotate(stage, 1);
      }
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;

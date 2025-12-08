/**
 * Game action hooks
 * Handles all game interactions: rotation, flipping, moving shapes, etc.
 */

import { useCallback, type RefObject } from "react";
import { Grid, type MoveShapeDirection } from "../objects/Grid";

export type UseGameActionsProps = {
  grid: RefObject<Grid>;
  redraw: (grid: RefObject<Grid>) => void;
  setHasWon: (hasWon: boolean) => void;
};

export type UseGameActionsReturn = {
  rotateActiveShape: (clockwise: boolean) => void;
  flipActiveShape: (horizontal: boolean) => void;
  moveActiveShape: (direction: MoveShapeDirection) => void;
  nextShape: () => void;
  undo: () => void;
  autoComplete: () => void;
  restartGame: () => void;
};

export function useGameActions({
  grid,
  redraw,
  setHasWon,
}: UseGameActionsProps): UseGameActionsReturn {
  const rotateActiveShape = useCallback(
    (clockwise: boolean) => {
      grid.current.rotateActiveShape(clockwise);
      redraw(grid);
    },
    [grid, redraw]
  );

  const flipActiveShape = useCallback(
    (horizontal: boolean) => {
      grid.current.flipActiveShape(horizontal);
      redraw(grid);
    },
    [grid, redraw]
  );

  const moveActiveShape = useCallback(
    (direction: MoveShapeDirection) => {
      grid.current.moveActiveShape(direction);
      redraw(grid);
    },
    [grid, redraw]
  );

  const nextShape = useCallback(() => {
    if (grid.current.hasWon()) {
      setHasWon(true);
      redraw(grid);
      return;
    }
    if (!grid.current.hasOverlappingShapes()) {
      grid.current.addShape();
    }
    // Always redraw to re-evaluate button states after attempting to add shape
    redraw(grid);
  }, [grid, redraw, setHasWon]);

  const undo = useCallback(() => {
    grid.current.undo();
    redraw(grid);
  }, [grid, redraw]);

  const autoComplete = useCallback(() => {
    grid.current.autoComplete();
    setHasWon(true);
    redraw(grid);
  }, [grid, redraw, setHasWon]);

  const restartGame = useCallback(() => {
    // Note: This function expects state setters to be called from the parent component
    // It only handles grid-related reset
    grid.current = new Grid();
    redraw(grid);
  }, [grid, redraw]);

  return {
    rotateActiveShape,
    flipActiveShape,
    moveActiveShape,
    nextShape,
    undo,
    autoComplete,
    restartGame,
  };
}

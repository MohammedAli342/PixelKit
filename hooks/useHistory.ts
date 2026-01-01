
import { useState, useCallback } from 'react';

export const useHistory = <T>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const setState = useCallback((newState: T | ((prevState: T) => T)) => {
    const resolvedState = newState instanceof Function ? newState(state) : newState;
    
    // If we are in the middle of history, new state should truncate the future
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(resolvedState);
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [currentIndex, history, state]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }, [canRedo]);

  const reset = useCallback((newState: T = initialState) => {
    setHistory([newState]);
    setCurrentIndex(0);
  }, [initialState]);


  return { state, setState, undo, redo, canUndo, canRedo, reset };
};

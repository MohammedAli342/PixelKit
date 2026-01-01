
export class History {
  constructor(initialState, onStateChange) {
    this.history = [initialState];
    this.currentIndex = 0;
    this.onStateChange = onStateChange;
  }

  get state() {
    return this.history[this.currentIndex];
  }

  get canUndo() {
    return this.currentIndex > 0;
  }

  get canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  setState(newStateFn) {
    const resolvedState = newStateFn(this.state);
    const newHistory = this.history.slice(0, this.currentIndex + 1);
    newHistory.push(resolvedState);
    
    this.history = newHistory;
    this.currentIndex = newHistory.length - 1;
    this.onStateChange();
  }

  undo() {
    if (this.canUndo) {
      this.currentIndex--;
      this.onStateChange();
    }
  }

  redo() {
    if (this.canRedo) {
      this.currentIndex++;
      this.onStateChange();
    }
  }

  reset(newState) {
    this.history = [newState];
    this.currentIndex = 0;
    this.onStateChange();
  }
}

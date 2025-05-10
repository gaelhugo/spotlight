// SequenceManager: animates each spotlight in sequence, one after another
// Usage: new SequenceManager(spotlightToolInstance, delayMs).play()
export class SequenceManager {
  /**
   * @param {import('./SpotlightTool.js').SpotlightTool} spotlightTool - The SpotlightTool instance to control
   * @param {number} delayMs - Delay in ms between spotlights (default: 1000)
   */
  constructor(spotlightTool, delayMs = 1000) {
    this.spotlightTool = spotlightTool;
    this.delayMs = delayMs;
    this._isPlaying = false;
    this._abortSequence = false;
    this._onUserMouseOver = this._onUserMouseOver.bind(this);
  }

  /**
   * Interrupt sequence if user moves mouse over a spotlight
   */
  _onUserMouseOver() {
    if (this._isPlaying) {
      this._abortSequence = true;
    }
  }

  async play() {
    if (this._isPlaying) return;
    this._isPlaying = true;
    this._abortSequence = false;
    // Listen for user mouseover during the sequence
    this.spotlightTool.canvas.addEventListener("mousemove", this._onUserMouseOver);
    const { spotlights, spotlightAnim, dimOverlay, dimAlpha } = this.spotlightTool;
    for (let i = 0; i < spotlights.length; i++) {
      if (this._abortSequence) break;
      const spot = spotlights[i];
      // Snap animation to this spotlight
      Object.assign(spotlightAnim, {
        spot,
        x: spot.x,
        y: spot.y,
        targetX: spot.x,
        targetY: spot.y,
        targetR: spot.r * 1.1,
        visible: true,
        mouseTarget: { x: spot.x, y: spot.y },
      });
      dimOverlay.setTarget(dimAlpha);
      // Wait for the delay while the spotlight is visible, but allow interruption
      const interrupted = await this._waitInterruptible(this.delayMs);
      if (interrupted) break;
      // Animate out before next
      spotlightAnim.targetR = 0;
      dimOverlay.setTarget(0);
      const interruptedOut = await this._waitInterruptible(350);
      if (interruptedOut) break;
    }
    this.spotlightTool.canvas.removeEventListener("mousemove", this._onUserMouseOver);
    this._isPlaying = false;
  }

  /**
   * Wait for ms milliseconds, but resolve early if sequence is aborted
   */
  _waitInterruptible(ms) {
    return new Promise((resolve) => {
      let done = false;
      const check = () => {
        if (this._abortSequence && !done) {
          done = true;
          resolve(true);
        }
      };
      const interval = setInterval(check, 30);
      setTimeout(() => {
        if (!done) {
          done = true;
          clearInterval(interval);
          resolve(false);
        }
      }, ms);
    });
  }
}

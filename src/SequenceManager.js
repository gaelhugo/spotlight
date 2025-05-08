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
  }

  async play() {
    if (this._isPlaying) return;
    this._isPlaying = true;
    const { spotlights, spotlightAnim, dimOverlay, dimAlpha } = this.spotlightTool;
    for (let i = 0; i < spotlights.length; i++) {
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
      // Wait for the delay while the spotlight is visible
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
      // Animate out before next
      spotlightAnim.targetR = 0;
      dimOverlay.setTarget(0);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
    this._isPlaying = false;
  }
}

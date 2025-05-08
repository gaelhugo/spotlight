import { SPOTLIGHT_CONFIG } from './config.js';

// Handles the animated dimming overlay for the spotlight effect
export class DimOverlay {
  /**
   * Create a new dim overlay
   * @param {number} ease - Easing factor for alpha animation
   */
  constructor(ease = SPOTLIGHT_CONFIG.easeDim) {
    this.alpha = 0; // Current overlay alpha
    this.targetAlpha = 0; // Target overlay alpha
    this.ease = ease; // Easing factor
  }
  /**
   * Set the target alpha (opacity) for the overlay
   * @param {number} alpha
   */
  setTarget(alpha) {
    this.targetAlpha = alpha;
  }
  /**
   * Update the alpha value towards the target (with easing)
   */
  update() {
    this.alpha += (this.targetAlpha - this.alpha) * this.ease;
  }
  /**
   * Draw the dim overlay on the canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} width
   * @param {number} height
   */
  draw(ctx, width, height) {
    ctx.fillStyle = `rgba(0,0,0,${this.alpha})`;
    ctx.fillRect(0, 0, width, height);
  }
}

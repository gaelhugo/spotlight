import { SPOTLIGHT_CONFIG } from "./config.js";

/**
 * The SpotlightAnimation class is responsible for handling the animation and drawing of the spotlight effect.
 * It manages the position, radius, and visibility of the spotlight, and provides methods for updating and drawing the effect.
 */
export class SpotlightAnimation {
  /**
   * Create a new SpotlightAnimation instance.
   * @param {number} ease - Easing for position (default: SPOTLIGHT_CONFIG.ease)
   * @param {number} easeRUp - Easing for radius increase (default: SPOTLIGHT_CONFIG.easeRUp)
   * @param {number} easeRDown - Easing for radius decrease (default: SPOTLIGHT_CONFIG.easeRDown)
   */
  constructor(
    ease = SPOTLIGHT_CONFIG.ease,
    easeRUp = SPOTLIGHT_CONFIG.easeRUp,
    easeRDown = SPOTLIGHT_CONFIG.easeRDown,
  ) {
    /**
     * The current x-coordinate of the spotlight.
     * @type {number}
     */
    this.x = 0;
    /**
     * The current y-coordinate of the spotlight.
     * @type {number}
     */
    this.y = 0;
    /**
     * The current radius of the spotlight.
     * @type {number}
     */
    this.r = 0;
    /**
     * The target x-coordinate of the spotlight.
     * @type {number}
     */
    this.targetX = 0;
    /**
     * The target y-coordinate of the spotlight.
     * @type {number}
     */
    this.targetY = 0;
    /**
     * The target radius of the spotlight.
     * @type {number}
     */
    this.targetR = 0;
    this.visible = false;
    this.spot = null;
    this.mouseTarget = null;
    
    this.ease = ease;
    this.easeRUp = easeRUp;
    this.easeRDown = easeRDown;
  }
  /**
   * Reset animation state to a given center
   * @param {number} centerX
   * @param {number} centerY
   */
  reset(centerX, centerY) {
    this.x = centerX;
    this.y = centerY;
    this.r = 0;
    this.targetX = centerX;
    this.targetY = centerY;
    this.targetR = 0;
    this.visible = false;
    this.spot = null;
    this.mouseTarget = null;
    
  }
  /**
   * Update spotlight animation (position, radius, visibility)
   */
  update() {
    // Animate radius
    if (this.targetR > this.r) {
      this.r += (this.targetR - this.r) * this.easeRUp;
    } else {
      this.r += (this.targetR - this.r) * this.easeRDown;
    }
    // Animate position
    if (
      this.visible &&
      this.r > (this.spot ? this.spot.r * 0.9 : 0) &&
      this.mouseTarget
    ) {
      this.targetX =
        this.mouseTarget.x + (this.spot.x - this.mouseTarget.x) * 0.8;
      this.targetY =
        this.mouseTarget.y + (this.spot.y - this.mouseTarget.y) * 0.8;
      this.x += (this.targetX - this.x) * this.ease;
      this.y += (this.targetY - this.y) * this.ease;
    } else if (this.spot) {
      this.x += (this.spot.x - this.x) * this.ease;
      this.y += (this.spot.y - this.y) * this.ease;
    }
    // Hide the spotlight only after it has fully scaled down
    if (this.targetR === 0 && this.r < 1) {
      this.visible = false;
      this.spot = null;
    }
  }
  /**
   * Draw the spotlight effect on the canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.r > 1) {
      ctx.globalCompositeOperation = "destination-out";
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        this.r * 0.5,
        this.x,
        this.y,
        this.r
      );
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(0.7, "rgba(0,0,0,0.5)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
  }
}

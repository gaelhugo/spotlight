import { Spotlight } from "./Spotlight.js";
import { DimOverlay } from "./DimOverlay.js";
import { SpotlightAnimation } from "./SpotlightAnimation.js";
import { SPOTLIGHT_CONFIG } from "./config.js";

// Main application class for the spotlight effect UI and animation
export class App {
  /**
   * Create a new App instance and initialize spotlight system
   * @param {string} imgId - ID of the image element
   * @param {string} canvasId - ID of the canvas overlay element
   */
  constructor(imgId = "spotlight-img", canvasId = "spotlight-canvas") {
    // Get DOM elements
    // Get image and canvas DOM elements
    this.img = document.getElementById(imgId);
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Create all spotlights from config points
    this.spotlights = SPOTLIGHT_CONFIG.points.map(
      (p) => new Spotlight(p.x, p.y, p.r)
    );
    // Create the dimming overlay
    this.dimOverlay = new DimOverlay(SPOTLIGHT_CONFIG.easeDim);
    // Create the spotlight animation manager
    this.spotlightAnim = new SpotlightAnimation(
      SPOTLIGHT_CONFIG.ease,
      SPOTLIGHT_CONFIG.easeRUp,
      SPOTLIGHT_CONFIG.easeRDown
    );
    // Maximum opacity for dim overlay
    this.dimAlpha = SPOTLIGHT_CONFIG.dimAlpha;
    // Track current mouse position (canvas coordinates)
    this.mouse = { x: 0, y: 0 };

    // Set up mouse/resize events and start animation when image is loaded
    this.setupEvents();
    if (this.img.complete) this.onImageLoad();
    else this.img.onload = () => this.onImageLoad();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  // Called when image is loaded
  /**
   * Called when the image is fully loaded. Resizes canvas and starts animation loop.
   */
  onImageLoad() {
    this.resizeCanvas();
    this.animate();
  }

  // Resize canvas to match image
  /**
   * Resize the canvas to match the image size and reset the spotlight animation.
   */
  resizeCanvas() {
    this.canvas.width = this.img.width;
    this.canvas.height = this.img.height;
    // Center the spotlight animation
    this.spotlightAnim.reset(this.canvas.width / 2, this.canvas.height / 2);
    this.draw();
  }

  // Draw the current frame
  /**
   * Redraw the entire spotlight effect frame (dimming + spotlight)
   */
  draw() {
    // Clear previous frame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    // Draw the dim overlay
    this.dimOverlay.draw(this.ctx, this.canvas.width, this.canvas.height);
    // Draw the animated spotlight
    this.spotlightAnim.draw(this.ctx);
    this.ctx.restore();
  }

  // Animation loop
  /**
   * Animation loop: update state and redraw, then schedule next frame
   */
  animate() {
    this.dimOverlay.update(); // Ease the dim overlay
    this.spotlightAnim.update(); // Animate spotlight position/size
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  // Convert mouse event to canvas coordinates
  /**
   * Convert mouse event coordinates to canvas coordinates
   * @param {MouseEvent} evt
   * @returns {{x: number, y: number}}
   */
  getCursorPos(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (evt.clientY - rect.top) * (this.canvas.height / rect.height),
    };
  }

  // Setup mouse event listeners
  /**
   * Setup mouse and leave events for interactive spotlight
   */
  setupEvents() {
    // On mouse move: update mouse position and activate/deactivate spotlights
    this.canvas.addEventListener("mousemove", (evt) => {
      const { x, y } = this.getCursorPos(evt);
      this.mouse = { x, y };
      // Find which spotlight (if any) is under the mouse
      const spot = this.spotlights.find((s) => s.contains(x, y));
      if (spot) {
        // If entering a new spotlight, snap animation to its center
        if (!this.spotlightAnim.visible || this.spotlightAnim.spot !== spot) {
          this.spotlightAnim.x = spot.x;
          this.spotlightAnim.y = spot.y;
        }
        // Set spotlight animation targets and enable dimming
        Object.assign(this.spotlightAnim, {
          spot,
          targetX: spot.x,
          targetY: spot.y,
          targetR: spot.r * 1.1,
          visible: true,
          mouseTarget: { x, y },
        });
        this.dimOverlay.setTarget(this.dimAlpha);
      } else {
        // No spotlight: animate out and remove dim
        this.spotlightAnim.targetR = 0;
        this.dimOverlay.setTarget(0);
      }
    });
    // On mouse leave: fade out spotlight and dim
    this.canvas.addEventListener("mouseleave", () => {
      this.spotlightAnim.targetR = 0;
      this.dimOverlay.setTarget(0);
    });
  }
}

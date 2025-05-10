import { Spotlight } from "./Spotlight.js";
import { DimOverlay } from "./DimOverlay.js";
import { SpotlightAnimation } from "./SpotlightAnimation.js";
import EventEmitter from "@onemorestudio/eventemitterjs";
// Handles all canvas drawing, resizing, and event logic for the spotlight application
export class SpotlightTool extends EventEmitter {
  /**
   * @param {HTMLImageElement} img - The image element
   * @param {object} config - The spotlight configuration object
   */
  constructor(img, config) {
    super();
    this.img = img;
    this.config = config;
    // Store relative config
    this.relativeSpotlights = config.points.map((p) => ({ ...p }));
    this.spotlights = this.relativeSpotlights.map(() => new Spotlight(0, 0, 0));
    this.dimOverlay = new DimOverlay(config.easeDim);
    this.spotlightAnim = new SpotlightAnimation(
      config.ease,
      config.easeRUp,
      config.easeRDown
    );
    this.dimAlpha = config.dimAlpha;
    this.mouse = { x: 0, y: 0 };
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    // Style canvas to overlay image
    this.canvas.style.position = "absolute";
    this.canvas.style.left = 0;
    this.canvas.style.top = 0;
    this.canvas.style.pointerEvents = "auto";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.cursor = "pointer";
    this.canvas.style.display = "block";
    this.canvas.className = "spotlight-canvas";
    // Automatically attach, set up events, and enable resize
    this.attachToDOM();
    this.setupEvents();
    this.enableAutoResize();
  }

  /**
   * Attach the canvas to the DOM, after the image element.
   */
  attachToDOM() {
    this.img.parentNode.insertBefore(this.canvas, this.img.nextSibling);
  }

  /**
   * Set references to spotlight logic and overlay.
   */

  /**
   * Setup mouse and leave events for interactive spotlight.
   */
  setupEvents() {
    this.canvas.addEventListener("mousemove", (evt) => {
      const { x, y } = this.getCursorPos(evt);
      this.mouse.x = x;
      this.mouse.y = y;
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
    this.canvas.addEventListener("mouseleave", () => {
      this.spotlightAnim.targetR = 0;
      this.dimOverlay.setTarget(0);
    });

    this.canvas.addEventListener("click", (evt) => {
      const { x, y } = this.getCursorPos(evt);
      const spot = this.spotlights.find((s) => s.contains(x, y));
      if (spot) {
        this.emit("click", [spot]);
      }
    });
  }

  /**
   * Enable automatic resizing of the canvas on window resize.
   */
  enableAutoResize() {
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  /**
   * Utility to get the created canvas element.
   */
  getCanvas() {
    return this.canvas;
  }

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

  /**
   * Resize the canvas to match the image size and reset the spotlight animation.
   */
  resizeCanvas() {
    this.canvas.width = this.img.width;
    this.canvas.height = this.img.height;
    // Update spotlights' absolute positions/radii based on current image size
    const w = this.img.width;
    const h = this.img.height;
    this.relativeSpotlights.forEach((rel, i) => {
      this.spotlights[i].x = rel.x * w;
      this.spotlights[i].y = rel.y * h;
      this.spotlights[i].r = rel.r * w; // Use width for radius scaling
    });
    // Center the spotlight animation
    if (this.spotlightAnim) {
      this.spotlightAnim.reset(this.canvas.width / 2, this.canvas.height / 2);
    }
    this.draw();
  }

  /**
   * Animation loop: update state and redraw, then schedule next frame
   */
  animate() {
    this.dimOverlay.update(); // Ease the dim overlay
    this.spotlightAnim.update(); // Animate spotlight position/size
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  /**
   * Redraw the entire spotlight effect frame (dimming + spotlight)
   */
  draw() {
    // Clear previous frame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    // Draw the dim overlay
    if (this.dimOverlay) {
      this.dimOverlay.draw(this.ctx, this.canvas.width, this.canvas.height);
    }
    // Draw the animated spotlight
    if (this.spotlightAnim) {
      this.spotlightAnim.draw(this.ctx);
    }
    this.ctx.restore();
  }

  start() {
    this.resizeCanvas();
    this.animate();
  }
}

import { Spotlight } from './Spotlight.js';
import { DimOverlay } from './DimOverlay.js';
import { SpotlightAnimation } from './SpotlightAnimation.js';
import { SPOTLIGHT_CONFIG } from './config.js';

// Main application class for the spotlight effect
// Main application class for the spotlight effect
export class App {
  constructor(imgId = 'spotlight-img', canvasId = 'spotlight-canvas') {
    // Get DOM elements
    this.img = document.getElementById(imgId);
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // Initialize spotlights and animation/dim objects from config
    this.spotlights = SPOTLIGHT_CONFIG.points.map(p => new Spotlight(p.x, p.y, p.r));
    this.dimOverlay = new DimOverlay(SPOTLIGHT_CONFIG.easeDim);
    this.spotlightAnim = new SpotlightAnimation({
      ease: SPOTLIGHT_CONFIG.ease,
      easeRUp: SPOTLIGHT_CONFIG.easeRUp,
      easeRDown: SPOTLIGHT_CONFIG.easeRDown
    });
    this.dimAlpha = SPOTLIGHT_CONFIG.dimAlpha;
    this.mouse = { x: 0, y: 0 };

    // Setup events and start
    this.setupEvents();
    if (this.img.complete) this.onImageLoad();
    else this.img.onload = () => this.onImageLoad();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  // Called when image is loaded
  onImageLoad() {
    this.resizeCanvas();
    this.animate();
  }

  // Resize canvas to match image
  resizeCanvas() {
    this.canvas.width = this.img.width;
    this.canvas.height = this.img.height;
    this.spotlightAnim.reset(this.canvas.width / 2, this.canvas.height / 2);
    this.draw();
  }

  // Draw the current frame
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.dimOverlay.draw(this.ctx, this.canvas.width, this.canvas.height);
    this.spotlightAnim.draw(this.ctx);
    this.ctx.restore();
  }

  // Animation loop
  animate() {
    this.dimOverlay.update();
    this.spotlightAnim.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  // Convert mouse event to canvas coordinates
  getCursorPos(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (evt.clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  // Setup mouse event listeners
  setupEvents() {
    this.canvas.addEventListener('mousemove', evt => {
      const { x, y } = this.getCursorPos(evt);
      this.mouse = { x, y };
      // Find spotlight under mouse
      const spot = this.spotlights.find(s => s.contains(x, y));
      if (spot) {
        // Activate spotlight
        if (!this.spotlightAnim.visible || this.spotlightAnim.spot !== spot) {
          this.spotlightAnim.x = spot.x;
          this.spotlightAnim.y = spot.y;
          this.spotlightAnim.followMouse = false;
        }
        Object.assign(this.spotlightAnim, {
          spot,
          targetX: spot.x,
          targetY: spot.y,
          targetR: spot.r * 1.1,
          visible: true,
          mouseTarget: { x, y }
        });
        this.dimOverlay.setTarget(this.dimAlpha);
      } else {
        // Deactivate
        this.spotlightAnim.targetR = 0;
        this.spotlightAnim.followMouse = false;
        this.dimOverlay.setTarget(0);
      }
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.spotlightAnim.targetR = 0;
      this.dimOverlay.setTarget(0);
    });
  }
}

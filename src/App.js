import { SPOTLIGHT_CONFIG } from "./config.js";
import { convertPointsToPercent } from "./utils.js";
import { SpotlightTool } from "./SpotlightTool.js";
import { SequenceManager } from "./SequenceManager.js";

// Main application class for the spotlight effect UI and animation
export class App {
  /**
   * Create a new App instance and initialize spotlight system
   * @param {string} imgId - ID of the image element
   * @param {string} canvasId - ID of the canvas overlay element
   */
  constructor(imgId = "spotlight-img") {
    // Get DOM elements
    // Get image DOM element
    this.img = document.getElementById(imgId);
    // Convert pixel points to percent (relative to image)
    const percentConfig = {
      ...SPOTLIGHT_CONFIG,
      points: convertPointsToPercent(
        SPOTLIGHT_CONFIG.points,
        this.img.naturalWidth || this.img.width,
        this.img.naturalHeight || this.img.height
      ),
    };
    this.spotlightTool = new SpotlightTool(this.img, percentConfig);
    this.sequenceManager = new SequenceManager(this.spotlightTool, 1200);

    // Start animation after image load
    if (this.img.complete) this.onImageLoad();
    else this.img.onload = () => this.onImageLoad();
  }

  // Called when image is loaded
  /**
   * Called when the image is fully loaded. Resizes canvas and starts animation loop.
   */
  onImageLoad() {
    this.spotlightTool.start();
    setTimeout(() => this.sequenceManager.play(), 2000);
  }
}

import { SPOTLIGHT_CONFIG } from "./config.js";

export class SpotlightAnimation {
  constructor({
    ease = SPOTLIGHT_CONFIG.ease,
    easeRUp = SPOTLIGHT_CONFIG.easeRUp,
    easeRDown = SPOTLIGHT_CONFIG.easeRDown,

  } = {}) {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.targetR = 0;
    this.visible = false;
    this.spot = null;
    this.mouseTarget = null;
    this.followMouse = false;
    this.ease = ease;
    this.easeRUp = easeRUp;
    this.easeRDown = easeRDown;

  }
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
    this.followMouse = false;
  }
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

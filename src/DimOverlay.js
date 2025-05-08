import { SPOTLIGHT_CONFIG } from './config.js';

export class DimOverlay {
  constructor(ease = SPOTLIGHT_CONFIG.easeDim) {
    this.alpha = 0;
    this.targetAlpha = 0;
    this.ease = ease;
  }
  setTarget(alpha) {
    this.targetAlpha = alpha;
  }
  update() {
    this.alpha += (this.targetAlpha - this.alpha) * this.ease;
  }
  draw(ctx, width, height) {
    ctx.fillStyle = `rgba(0,0,0,${this.alpha})`;
    ctx.fillRect(0, 0, width, height);
  }
}

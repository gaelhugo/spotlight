// Represents a circular spotlight region
export class Spotlight {
  constructor(x, y, r) {
    this.x = x; // center x
    this.y = y; // center y
    this.r = r; // radius
  }
  // Returns true if point (px, py) is inside the spotlight
  contains(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    return Math.hypot(dx, dy) <= this.r;
  }
}

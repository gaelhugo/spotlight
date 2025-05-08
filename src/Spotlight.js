// Represents a circular spotlight region for hit-testing
export class Spotlight {
  /**
   * Create a new spotlight
   * @param {number} x - Center x coordinate
   * @param {number} y - Center y coordinate
   * @param {number} r - Radius
   */
  constructor(x, y, r) {
    this.x = x; // center x
    this.y = y; // center y
    this.r = r; // radius
  }
  /**
   * Returns true if point (px, py) is inside the spotlight circle
   * @param {number} px
   * @param {number} py
   * @returns {boolean}
   */
  contains(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    return Math.hypot(dx, dy) <= this.r;
  }
}

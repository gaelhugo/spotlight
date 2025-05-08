// Utility to convert spotlight config points from pixel to percent (relative to image size)
export function convertPointsToPercent(points, imgWidth, imgHeight) {
  return points.map(({ x, y, r }) => ({
    x: x / imgWidth,
    y: y / imgHeight,
    r: r / imgWidth // radius relative to width for consistency
  }));
}

// Configuration for spotlight points and parameters
// Configuration for all spotlight points and animation parameters
export const SPOTLIGHT_CONFIG = {
  // Array of spotlight definitions (center x, y, radius)
  points: [
    { x: 200, y: 150, r: 90 }, // px values for easier editing
    { x: 500, y: 300, r: 70 },
    { x: 350, y: 400, r: 60 }
  ],
  dimAlpha: 0.7, // Maximum opacity for the dim overlay
  ease: 0.18,    // Easing for spotlight position
  easeRUp: 0.16, // Easing for spotlight radius increase
  easeRDown: 0.08, // Easing for spotlight radius decrease
  easeDim: 0.12   // Easing for dim overlay alpha
};

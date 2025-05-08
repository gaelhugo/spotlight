const img = document.getElementById('spotlight-img');
const canvas = document.getElementById('spotlight-canvas');
const ctx = canvas.getContext('2d');

// Define spotlight positions and radii
const spotlights = [
  { x: 200, y: 150, r: 90 },
  { x: 500, y: 300, r: 70 },
  { x: 350, y: 400, r: 60 }
];

let activeSpotlightIndex = null;
let mouse = { x: 0, y: 0 };
let spotlightAnim = {
  x: 0,
  y: 0,
  r: 0,
  targetX: 0,
  targetY: 0,
  targetR: 0,
  visible: false,
};

function resizeCanvas() {
  canvas.width = img.width;
  canvas.height = img.height;
  // Reset animation state
  spotlightAnim.x = canvas.width / 2;
  spotlightAnim.y = canvas.height / 2;
  spotlightAnim.r = 0;
  spotlightAnim.targetX = canvas.width / 2;
  spotlightAnim.targetY = canvas.height / 2;
  spotlightAnim.targetR = 0;
  drawSpotlights();
}

function drawSpotlights() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  // Dim the whole image
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (spotlightAnim.r > 1) {
    ctx.globalCompositeOperation = 'destination-out';
    // Create a radial gradient for smooth edges
    const gradient = ctx.createRadialGradient(
      spotlightAnim.x, spotlightAnim.y, spotlightAnim.r * 0.5,
      spotlightAnim.x, spotlightAnim.y, spotlightAnim.r
    );
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.7, 'rgba(0,0,0,0.5)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(spotlightAnim.x, spotlightAnim.y, spotlightAnim.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
}

function animate() {
  // Easing parameters
  const ease = 0.18; // for position
  const easeRUp = 0.16; // for radius scale up
  const easeRDown = 0.08; // for radius scale down (slower)

  // Animate radius with different easing for up/down
  if (spotlightAnim.targetR > spotlightAnim.r) {
    spotlightAnim.r += (spotlightAnim.targetR - spotlightAnim.r) * easeRUp;
  } else {
    spotlightAnim.r += (spotlightAnim.targetR - spotlightAnim.r) * easeRDown;
  }

  // Only start following the mouse when the radius is almost full
  if (
    spotlightAnim.visible &&
    spotlightAnim.r > (spotlightAnim.spot ? spotlightAnim.spot.r * 0.9 : 0) &&
    spotlightAnim.mouseTarget
  ) {
    // Start following the mouse with a delay
    spotlightAnim.targetX = spotlightAnim.mouseTarget.x + (spotlightAnim.spot.x - spotlightAnim.mouseTarget.x) * 0.2;
    spotlightAnim.targetY = spotlightAnim.mouseTarget.y + (spotlightAnim.spot.y - spotlightAnim.mouseTarget.y) * 0.2;
    spotlightAnim.x += (spotlightAnim.targetX - spotlightAnim.x) * ease;
    spotlightAnim.y += (spotlightAnim.targetY - spotlightAnim.y) * ease;
  } else if (spotlightAnim.spot) {
    // Stay at the center of the spotlight until scale-up is done
    spotlightAnim.x += (spotlightAnim.spot.x - spotlightAnim.x) * ease;
    spotlightAnim.y += (spotlightAnim.spot.y - spotlightAnim.y) * ease;
  }

  // Hide the spotlight only after it has fully scaled down
  if (spotlightAnim.targetR === 0 && spotlightAnim.r < 1) {
    spotlightAnim.visible = false;
    spotlightAnim.spot = null;
  }

  drawSpotlights();
  requestAnimationFrame(animate);
}


function getCursorPos(evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

canvas.addEventListener('mousemove', (evt) => {
  const { x, y } = getCursorPos(evt);
  mouse.x = x;
  mouse.y = y;
  let found = null;
  for (let i = 0; i < spotlights.length; i++) {
    const spot = spotlights[i];
    const dx = x - spot.x;
    const dy = y - spot.y;
    if (Math.sqrt(dx * dx + dy * dy) <= spot.r) {
      found = i;
      break;
    }
  }
  if (found !== null) {
    const spot = spotlights[found];
    // When entering a new spotlight or if not already animating
    if (!spotlightAnim.visible || spotlightAnim.spot !== spot) {
      spotlightAnim.x = spot.x;
      spotlightAnim.y = spot.y;
      spotlightAnim.followMouse = false;
    }
    spotlightAnim.spot = spot;
    spotlightAnim.targetX = spot.x;
    spotlightAnim.targetY = spot.y;
    spotlightAnim.targetR = spot.r * 1.1;
    spotlightAnim.visible = true;
    spotlightAnim.mouseTarget = { x, y };
  } else {
    spotlightAnim.targetR = 0;
    // Do not set visible to false here; let the animation handle it
    spotlightAnim.followMouse = false;
  }
});

canvas.addEventListener('mouseleave', () => {
  spotlightAnim.targetR = 0;
  spotlightAnim.visible = false;
});

img.onload = () => {
  resizeCanvas();
  animate();
};
window.addEventListener('resize', resizeCanvas);
if (img.complete) {
  resizeCanvas();
  animate();
}

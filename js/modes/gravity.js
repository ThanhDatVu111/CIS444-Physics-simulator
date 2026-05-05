// ============================================================
// Gravity Drop + Bounce – state, update, draw, stats
//
// Shared globals (declared in index.html):
//   state, WORLD, inputs, running
// Shared helpers (function declarations in index.html):
//   getGravityPx, pushTrail, resetTrail,
//   drawTrail, drawBall, setStats
// ============================================================

function createGravityState() {
  const mass = Number(inputs.mass.value);
  const dropHeightMeters = Number(inputs.dropHeight.value);
  state = {
    ball: {
      x: WORLD.width / 2,
      y: WORLD.floorY - dropHeightMeters * WORLD.scale,
      vx: 0,
      vy: 0,
      mass,
      r: Math.max(12, Math.min(24, mass / 1.5)),
      color: '#a78bfa'
    },
    lastPeak: dropHeightMeters
  };
  resetTrail(220);
}

function updateGravity(dt) {
  const g = getGravityPx();
  const loss = Number(inputs.bounce.value);
  const ball = state.ball;
  ball.vy += g * dt;
  ball.y += ball.vy * dt;
  pushTrail(ball.x, ball.y);

  if (ball.y >= WORLD.floorY) {
    ball.y = WORLD.floorY;
    ball.vy = -ball.vy * loss;
    state.lastPeak = Math.max(0, (WORLD.floorY - ball.y) / WORLD.scale);
    if (Math.abs(ball.vy) < 18) {
      ball.vy = 0;
      running = false;
    }
  }
}

function drawGravity() {
  drawTrail('rgba(167,139,250,0.65)');
  drawBall(state.ball);
}

function updateGravityStats() {
  const b = state.ball;
  const height = (WORLD.floorY - b.y) / WORLD.scale;
  const speed = Math.abs(b.vy) / WORLD.scale;
  const pe = (Number(inputs.mass.value) * Number(inputs.gravity.value) * Math.max(height, 0)).toFixed(1);
  const direction = Math.abs(b.vy) < 0.1 ? 'At Rest' : b.vy < 0 ? 'Upward' : 'Downward';
  setStats({
    height,
    speed,
    direction,
    energy: `PE ${pe} J`,
    extra: `Bounce ${(Number(inputs.bounce.value) * 100).toFixed(0)}%`
  });
}

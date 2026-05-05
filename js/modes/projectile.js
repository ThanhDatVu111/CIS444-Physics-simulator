// ============================================================
// Projectile Motion – state, update, draw, stats
//
// Shared globals (declared in index.html):
//   state, WORLD, inputs, running
// Shared helpers (function declarations in index.html):
//   toRadians, getGravityPx, pushTrail, resetTrail,
//   drawTrail, drawBall, setStats
// ============================================================

function createProjectileState() {
  const v = Number(inputs.velocity.value);
  const angle = toRadians(Number(inputs.angle.value));
  state = {
    ball: {
      x: 70,
      y: WORLD.floorY,
      vx: v * Math.cos(angle),
      vy: -v * Math.sin(angle),
      r: 14,
      color: '#6ee7ff'
    }
  };
  resetTrail(260);
}

function updateProjectile(dt) {
  const g = getGravityPx();
  const ball = state.ball;
  ball.vy += g * dt;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  pushTrail(ball.x, ball.y);

  if (ball.y >= WORLD.floorY) {
    ball.y = WORLD.floorY;
    running = false;
  }
  if (ball.x > WORLD.width + 40) running = false;
}

function drawProjectile() {
  drawTrail('rgba(110,231,255,0.7)');
  drawBall(state.ball);
}

function updateProjectileStats() {
  const b = state.ball;
  const height = (WORLD.floorY - b.y) / WORLD.scale;
  const speed = Math.hypot(b.vx, b.vy) / WORLD.scale;
  const pe = Math.max(0, Number(inputs.gravity.value) * height).toFixed(1);
  setStats({
    height,
    speed,
    direction: b.vy < 0 ? 'Upward' : 'Downward',
    energy: `PE ${pe}`,
    extra: `x speed ${(b.vx / WORLD.scale).toFixed(1)} m/s`
  });
}

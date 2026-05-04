// ============================================================
// Black Hole Orbit – state, update, draw, stats
//
// Shared globals (declared in index.html):
//   state, WORLD, inputs, running, ctx
// Shared helpers (function declarations in index.html):
//   pushTrail, resetTrail, drawTrail, drawBall, setStats
// ============================================================

function createBlackHoleState() {
  state = {
    center: { x: WORLD.width / 2, y: WORLD.height / 2 },
    ball: {
      x: WORLD.width / 2 + 180,
      y: WORLD.height / 2 - 30,
      vx: 0,
      vy: -Number(inputs.orbitSpeed.value),
      r: 11,
      color: '#fb923c'
    }
  };
  resetTrail(320);
}

function updateBlackHole(dt) {
  const pull = Number(inputs.pull.value);
  const { center, ball } = state;
  const dx = center.x - ball.x;
  const dy = center.y - ball.y;
  const distSq = Math.max(dx * dx + dy * dy, 1600);
  const dist = Math.sqrt(distSq);
  const ax = (pull * dx) / distSq;
  const ay = (pull * dy) / distSq;
  ball.vx += ax * dt;
  ball.vy += ay * dt;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  pushTrail(ball.x, ball.y);
  if (dist < 26) running = false;
}

function drawBlackHole() {
  const { center } = state;

  ctx.beginPath();
  ctx.arc(center.x, center.y, 28, 0, Math.PI * 2);
  ctx.fillStyle = '#020617';
  ctx.shadowBlur = 28;
  ctx.shadowColor = '#f97316';
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(251,191,36,0.7)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(center.x, center.y, 52, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(251,191,36,0.25)';
  ctx.lineWidth = 6;
  ctx.stroke();

  drawTrail('rgba(249,115,22,0.65)');
  drawBall(state.ball);
}

function updateBlackHoleStats() {
  const { center, ball } = state;
  const dx = center.x - ball.x;
  const dy = center.y - ball.y;
  const dist = Math.sqrt(dx * dx + dy * dy) / WORLD.scale;
  const speed = Math.hypot(ball.vx, ball.vy) / WORLD.scale;
  setStats({
    height: dist,
    speed,
    direction: 'Orbiting',
    energy: `r ${dist.toFixed(2)} m`,
    extra: `Pull ${Number(inputs.pull.value)}`
  });
}

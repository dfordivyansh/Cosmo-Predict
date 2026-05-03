export const calculatePhysics = (state, spaceData, delta) => {
  const { position, velocity } = state;

  const kp = Number(spaceData?.current_kp || 0);
  const solarWind = Number(spaceData?.avg_speed || 300);

  /* =========================
     🌍 BASE FORCES
  ========================= */

  const gravity = -0.02;

  // thrust reacts to KP (storm me unstable)
  const thrust = 0.06 + kp * 0.004;

  // solar wind direction (dynamic)
  const windDir = Math.sin(Date.now() * 0.001);

  // turbulence (random but controlled)
  const turbulence =
    (Math.sin(Date.now() * 0.002 + position.y) +
      Math.cos(position.x)) *
    0.01 *
    (kp / 5);

  // disturbance (main KP + solar wind force)
  const disturbance =
    Math.min(0.08, kp * 0.02 + solarWind * 0.000015);

  // damping (important for smoothness)
  const drag = 0.97;

  /* =========================
     ⚡ ACCELERATION
  ========================= */

  const ax = disturbance * windDir + turbulence;
  const ay = thrust + gravity;
  const az = disturbance * 0.5 + turbulence;

  /* =========================
     🚀 VELOCITY
  ========================= */

  const newVelocity = {
    x: (velocity.x + ax * delta) * drag,
    y: (velocity.y + ay * delta) * drag,
    z: (velocity.z + az * delta) * drag,
  };

  /* =========================
     📍 POSITION
  ========================= */

  const newPosition = {
    x: position.x + newVelocity.x * delta,
    y: Math.max(0, position.y + newVelocity.y * delta),
    z: position.z + newVelocity.z * delta,
  };

  return {
    velocity: newVelocity,
    position: newPosition,
  };
};
export const calculatePhysics = (state, spaceData, delta) => {
  const { position, velocity } = state;

  const kp = Number(spaceData?.current_kp || 0);
  const solarWind = Number(spaceData?.avg_speed || 300);

  /* ============================
     🚀 FORCES
  ============================ */

  // Thrust (controlled upward force)
  const thrust = 0.05 + kp * 0.003;

  // Gravity (constant downward)
  const gravity = -0.02;

  // 🌪 Space disturbance (LIMITED for stability)
  const disturbance = Math.min(0.05, kp * 0.015 + solarWind * 0.00001);

  // 🧱 Drag (VERY IMPORTANT for stability)
  const drag = 0.98;

  /* ============================
     ⚡ ACCELERATION
  ============================ */

  const ax = disturbance;
  const ay = thrust + gravity;
  const az = disturbance * 0.4;

  /* ============================
     🚀 VELOCITY UPDATE
  ============================ */

  const newVelocity = {
    x: (velocity.x + ax * delta) * drag,
    y: (velocity.y + ay * delta) * drag,
    z: (velocity.z + az * delta) * drag,
  };

  /* ============================
     📍 POSITION UPDATE
  ============================ */

  const newPosition = {
    x: position.x + newVelocity.x * delta,
    y: Math.max(0, position.y + newVelocity.y * delta), // 🚫 ground limit
    z: position.z + newVelocity.z * delta,
  };

  return {
    velocity: newVelocity,
    position: newPosition,
  };
};
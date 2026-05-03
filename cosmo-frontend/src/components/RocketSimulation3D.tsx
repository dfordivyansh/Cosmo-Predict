import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

import { Rocket, RefreshCw, Orbit } from "lucide-react";

import { calculatePhysics } from "@/utils/physicsEngine";

const BASE = "http://127.0.0.1:8000/api";

/* ================= 🌍 EARTH ================= */
const Earth = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001;
  });

  return (
    <Sphere ref={ref} args={[2, 128, 128]}>
      <meshStandardMaterial
        color="#1f4e79"
        emissive="#0a192f"
        emissiveIntensity={0.4}
      />
    </Sphere>
  );
};

/* ================= 🚀 ROCKET ================= */
const RocketMesh = ({ spaceData }) => {
  const ref = useRef<THREE.Group>(null);
  const trail = useRef<THREE.Vector3[]>([]);

  const state = useRef({
    position: { x: 0, y: 2, z: 0 },
    velocity: { x: 0.01, y: 0.02, z: 0.01 },
  });

  useFrame((_, delta) => {
    if (!spaceData) return;

    const next = calculatePhysics(state.current, spaceData, delta);
    state.current = next;

    if (ref.current) {
      const pos = new THREE.Vector3(
        next.position.x,
        next.position.y,
        next.position.z
      );

      ref.current.position.lerp(pos, 0.12);

      const angle = Math.atan2(next.velocity.y, next.velocity.x);
      ref.current.rotation.z = angle;
    }

    trail.current.push(
      new THREE.Vector3(
        next.position.x,
        next.position.y,
        next.position.z
      )
    );

    if (trail.current.length > 80) trail.current.shift();
  });

  return (
    <>
      <group ref={ref}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1}
          />
        </mesh>

        <mesh position={[0, -0.3, 0]}>
          <coneGeometry args={[0.1, 0.3]} />
          <meshStandardMaterial
            color="#ff6600"
            emissive="#ff2200"
            emissiveIntensity={2}
          />
        </mesh>
      </group>

      {trail.current.length > 2 && (
        <Line points={trail.current} color="#00ffff" lineWidth={2} />
      )}
    </>
  );
};

/* ================= TRAJECTORY ================= */
const generateTrajectory = (spaceData, mode = "safe") => {
  let temp = {
    position: { x: 0, y: 2, z: 0 },
    velocity: { x: 0.01, y: 0.02, z: 0.01 },
  };

  const pts = [];

  const kp = Number(spaceData?.current_kp || 0);
  const wind = Number(spaceData?.avg_speed || 300);

  for (let i = 0; i < 200; i++) {
    temp = calculatePhysics(temp, spaceData, 0.1);

    if (mode === "risk") {
      const disturbance = kp * 0.01 + wind * 0.00001;

      temp.velocity.x += disturbance * 0.15;
      temp.velocity.y -= disturbance * 0.05;
      temp.velocity.z += disturbance * 0.1;
    }

    pts.push(
      new THREE.Vector3(
        temp.position.x,
        temp.position.y,
        temp.position.z
      )
    );
  }

  return pts;
};

/* ================= SMOOTH ================= */
const smoothPath = (points) => {
  if (!points.length) return [];
  const curve = new THREE.CatmullRomCurve3(points);
  return curve.getPoints(300);
};

/* ================= 🧠 STATUS LOGIC ================= */
const getTrajectoryStatus = (kp, predicted_kp) => {
  if (kp < 3 && predicted_kp < 3)
    return { text: "Trajectory stable", color: "text-green-400" };

  if (kp < 5)
    return { text: "Minor deviation possible", color: "text-yellow-400" };

  return { text: "High deviation risk", color: "text-red-400" };
};

const getSpaceCondition = (kp, speed) => {
  if (kp < 3 && speed < 400) return "Calm space environment";
  if (kp < 5) return "Moderate solar disturbance";
  return "Geomagnetic storm conditions";
};

/* ================= MAIN ================= */
const RocketSimulation3D = () => {
  const [spaceData, setSpaceData] = useState<any>(null);
  const [safePath, setSafePath] = useState([]);
  const [riskPath, setRiskPath] = useState([]);
  const [showPath, setShowPath] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [pred, analytics] = await Promise.all([
        axios.get(`${BASE}/prediction/`),
        axios.get(`${BASE}/analytics/`),
      ]);

      const combined = {
        ...pred.data,
        ...analytics.data,
      };

      setSpaceData(combined);

      setSafePath(generateTrajectory(combined, "safe"));
      setRiskPath(generateTrajectory(combined, "risk"));
    } catch {
      setSpaceData({
        current_kp: 2,
        predicted_kp: 2,
        avg_speed: 350,
        prediction: "Quiet",
        confidence: 80,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="p-6 space-y-6 bg-black/40 border border-white/10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Rocket className="text-cyan-400" />
          Advanced Space Simulator
        </h2>

        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button
            onClick={() => setShowPath(!showPath)}
            className="bg-purple-500"
          >
            <Orbit className="w-4 h-4 mr-2" />
            {showPath ? "Hide Path" : "Show Path"}
          </Button>
        </div>
      </div>

      {/* 🔥 NEW SMART UI */}
      {spaceData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* TRAJECTORY */}
          <Card className="p-4 text-center bg-white/5">
            <p className="text-sm text-gray-400">Trajectory</p>

            {(() => {
              const s = getTrajectoryStatus(
                spaceData.current_kp,
                spaceData.predicted_kp
              );

              return (
                <h2 className={`text-lg font-bold ${s.color}`}>
                  {s.text}
                </h2>
              );
            })()}
          </Card>

          {/* SPACE CONDITION */}
          <Card className="p-4 text-center bg-white/5">
            <p className="text-sm text-gray-400">Environment</p>

            <h2 className="text-lg font-bold text-cyan-300">
              {getSpaceCondition(
                spaceData.current_kp,
                spaceData.avg_speed
              )}
            </h2>
          </Card>

          {/* FORECAST */}
          <Card className="p-4 text-center bg-white/5">
            <p className="text-sm text-gray-400">Forecast</p>

            <h2 className="text-lg font-bold text-purple-300">
              {spaceData.prediction}
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Confidence: {spaceData.confidence}%
            </p>
          </Card>

        </div>
      )}

      {/* CANVAS */}
      <div className="h-[500px] bg-black rounded-xl relative">
        <Canvas camera={{ position: [8, 6, 8] }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />

          <Stars />

          <Earth />
          {spaceData && <RocketMesh spaceData={spaceData} />}

          {showPath && (
            <>
              <Line
                points={smoothPath(safePath)}
                color="#00ff88"
                lineWidth={4}
              />
              <Line
                points={smoothPath(riskPath)}
                color="#ff4444"
                lineWidth={2}
              />
            </>
          )}

          <OrbitControls />
        </Canvas>

        {/* LOADER */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <p className="text-cyan-400 animate-pulse">
              Simulating...
            </p>
          </div>
        )}

        {/* LEGEND */}
        <div className="absolute bottom-2 left-2 text-xs text-white/70">
          🟢 Optimal trajectory <br />
          🔴 Disturbance scenario
        </div>
      </div>

    </Card>
  );
};

export default RocketSimulation3D;
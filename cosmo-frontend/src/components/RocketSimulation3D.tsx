import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Rocket,
  RefreshCw,
  Orbit,
  Activity,
  Wind,
} from "lucide-react";

import { calculatePhysics } from "@/utils/physicsEngine";

/* 🌍 EARTH */
const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0008;
    if (cloudRef.current) cloudRef.current.rotation.y += 0.0012;
  });

  return (
    <group>
      <Sphere ref={earthRef} args={[2, 128, 128]}>
        <meshStandardMaterial
          color="#2a6f97"
          emissive="#0b2545"
          emissiveIntensity={0.2}
          roughness={0.8}
        />
      </Sphere>

      <Sphere args={[2.01, 128, 128]}>
        <meshStandardMaterial color="#3fa34d" transparent opacity={0.15} />
      </Sphere>

      <Sphere ref={cloudRef} args={[2.05, 64, 64]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.12} />
      </Sphere>

      <Sphere args={[2.2, 64, 64]}>
        <meshBasicMaterial
          color="#4fa3ff"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

/* 🚀 ROCKET */
const RocketMesh = ({ spaceData }) => {
  const ref = useRef<THREE.Group>(null);

  const state = useRef({
    position: { x: 0, y: 2, z: 0 },
    velocity: { x: 0.01, y: 0.02, z: 0.01 },
  });

  useFrame((_, delta) => {
    const next = calculatePhysics(state.current, spaceData, delta);
    state.current = next;

    if (ref.current) {
      ref.current.position.set(
        next.position.x,
        next.position.y,
        next.position.z
      );
      ref.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <cylinderGeometry args={[0.08, 0.08, 0.4]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.6}
        />
      </mesh>

      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.08, 0.15]} />
        <meshStandardMaterial color="#00ffff" />
      </mesh>
    </group>
  );
};

/* 🔮 TRAJECTORY */
const predictTrajectory = (spaceData) => {
  let tempState = {
    position: { x: 0, y: 2, z: 0 },
    velocity: { x: 0.01, y: 0.02, z: 0.01 },
  };

  const points = [];

  for (let i = 0; i < 200; i++) {
    tempState = calculatePhysics(tempState, spaceData, 0.1);

    points.push(
      new THREE.Vector3(
        tempState.position.x,
        tempState.position.y,
        tempState.position.z
      )
    );
  }

  return points;
};

/* 🎯 MAIN */
const RocketSimulation3D = () => {
  const [spaceData, setSpaceData] = useState<any>(null);
  const [trajectory, setTrajectory] = useState<any[]>([]);
  const [showPrediction, setShowPrediction] = useState(false);
  const [loading, setLoading] = useState(false);

  const BASE = "http://127.0.0.1:8000/api";

  const fetchData = async () => {
    try {
      setLoading(true);

      const [predRes, analyticsRes] = await Promise.all([
        axios.get(`${BASE}/prediction/`),
        axios.get(`${BASE}/analytics/`),
      ]);

      const combined = {
        ...predRes.data,
        ...analyticsRes.data,
      };

      setSpaceData(combined);
      setTrajectory(predictTrajectory(combined));
    } catch {
      console.log("API error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    if (!spaceData) return "#44ff44";
    if (spaceData.current_kp > 5) return "#ff4444";
    if (spaceData.current_kp > 3) return "#ffaa00";
    return "#44ff44";
  };

  return (
    <Card className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          <Rocket className="text-cyan-400" />
          <h2 className="text-2xl font-bold">
            Space Physics Simulator
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button
            onClick={() => setShowPrediction(!showPrediction)}
            className="bg-purple-500"
          >
            <Orbit className="w-4 h-4 mr-2" />
            {showPrediction ? "Hide Path" : "Simulate Deviation"}
          </Button>
        </div>
      </div>

      {/* INFO */}
      {spaceData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <Card className="p-4 text-center bg-white/5">
            <Activity className="mx-auto mb-2 text-cyan-400" />
            <p className="text-sm text-gray-400">KP Index</p>
            <h2 className="text-xl font-bold">{spaceData.current_kp}</h2>
          </Card>

          <Card className="p-4 text-center bg-white/5">
            <Wind className="mx-auto mb-2 text-yellow-400" />
            <p className="text-sm text-gray-400">Solar Speed</p>
            <h2 className="text-xl font-bold">{spaceData.avg_speed}</h2>
          </Card>

          <Card className="p-4 text-center bg-white/5">
            <p className="text-sm text-gray-400 mb-2">Prediction</p>
            <Badge className="text-lg px-3 py-1">
              {spaceData.prediction}
            </Badge>
          </Card>

        </div>
      )}

      {/* CANVAS */}
      <div className="h-[400px] md:h-[600px] bg-black rounded-xl overflow-hidden">

        <Canvas camera={{ position: [8, 6, 8] }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />
          <Stars />

          <Earth />
          {spaceData && <RocketMesh spaceData={spaceData} />}

          {showPrediction && trajectory.length > 0 && (
            <Line
              points={trajectory}
              color={getColor()}
              lineWidth={3}
            />
          )}

          <OrbitControls />
        </Canvas>
      </div>

      {loading && (
        <p className="text-center text-cyan-400 animate-pulse">
          Updating simulation...
        </p>
      )}
    </Card>
  );
};

export default RocketSimulation3D;
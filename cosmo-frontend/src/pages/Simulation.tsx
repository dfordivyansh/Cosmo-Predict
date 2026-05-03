import { useEffect, useState } from "react";
import axios from "axios";

import RocketSimulation3D from "@/components/RocketSimulation3D";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Info,
  Activity,
  Zap,
  RefreshCw,
  Rocket,
  Gauge,
  TrendingUp,
} from "lucide-react";

import cosmoPredictLogo from "@/assets/cosmopredict-logo.png";

const ACCESS_KEY = "SPACE-2026";
const BASE = "http://127.0.0.1:8000/api";

const Simulation = () => {
  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // 🔥 route loader

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // ================= AUTH =================
  useEffect(() => {
    const saved = localStorage.getItem("simulation-auth");
    if (saved === "true") setIsAuthorized(true);

    // 🔥 dashboard jaisa loader delay
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAccess = () => {
    setVerifying(true);

    setTimeout(() => {
      if (inputKey === ACCESS_KEY) {
        localStorage.setItem("simulation-auth", "true");
        setIsAuthorized(true);
        setError("");
      } else {
        setError("❌ Invalid Access Key");
      }
      setVerifying(false);
    }, 700);
  };

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);

      await new Promise((r) => setTimeout(r, 50)); // smooth loader

      const [pred, analytics] = await Promise.all([
        axios.get(`${BASE}/prediction/`),
        axios.get(`${BASE}/analytics/`),
      ]);

      setData({
        ...pred.data,
        ...analytics.data,
      });
    } catch {
      console.log("API error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    fetchData();
  }, [isAuthorized]);

  const getColor = () => {
    if (!data) return "text-gray-400";
    if (data.current_kp > 5) return "text-red-400";
    if (data.current_kp > 3) return "text-yellow-400";
    return "text-green-400";
  };

  // ================= ACCESS =================
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black text-white">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl w-full max-w-md text-center">

          <h1 className="text-2xl font-bold text-cyan-400 mb-4 flex justify-center gap-2">
            <Rocket className="animate-pulse" />
            Secure Simulation Access
          </h1>

          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Enter Access Key"
            className="w-full p-3 mb-4 rounded-xl bg-black border border-white/20"
          />

          <Button onClick={handleAccess} className="w-full bg-cyan-500">
            {verifying ? "Verifying..." : "Unlock Simulation"}
          </Button>

          {error && <p className="text-red-400 mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  // ================= INITIAL LOADER =================
  if (initialLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-slate-900 to-black text-white">
        <div className="flex flex-col items-center gap-6">

          <div className="relative">
            <div className="absolute w-28 h-28 bg-cyan-400/30 blur-2xl rounded-full animate-pulse"></div>

            <img
              src={cosmoPredictLogo}
              className="w-24 h-24 animate-[zoomPulse_2.5s_ease-in-out_infinite]"
            />
          </div>

          <p className="text-cyan-400 animate-pulse tracking-widest">
            Initializing Simulation Engine...
          </p>
        </div>
      </div>
    );
  }

  // ================= MAIN =================
  return (
    <div className="min-h-screen pt-28 md:pt-24 bg-gradient-to-br from-black via-slate-900 to-black text-white px-4 py-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Rocket className="text-cyan-400" />
          <h1 className="text-3xl font-bold">3D Rocket Simulation</h1>
        </div>

        <Button onClick={fetchData} className="bg-cyan-500">
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>

      {/* STATUS CARDS */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <Activity className="mx-auto mb-2 text-cyan-400" />
              <p className="text-sm text-gray-400">Current KP</p>
              <h2 className={`text-3xl font-bold ${getColor()}`}>
                {data.current_kp}
              </h2>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <TrendingUp className="mx-auto mb-2 text-green-400" />
              <p className="text-sm text-gray-400">Prediction</p>
              <h2 className="text-lg font-semibold">
                {data.prediction}
              </h2>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <Gauge className="mx-auto mb-2 text-purple-400" />
              <p className="text-sm text-gray-400">Confidence</p>
              <h2 className="text-xl font-bold">
                {data.confidence}%
              </h2>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <Zap className="mx-auto mb-2 text-yellow-400" />
              <p className="text-sm text-gray-400">Avg Solar Speed</p>
              <h2 className="text-xl font-bold">
                {data.avg_speed}
              </h2>
            </CardContent>
          </Card>

        </div>
      )}

      {/* 🚀 3D SIMULATION */}
      <div className="mb-10">
        <RocketSimulation3D />
      </div>

      {/* INFO PANEL */}
      <Card className="bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="text-cyan-400" />
            Simulation Guide
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-gray-400 space-y-3">
          <p>• Drag to rotate</p>
          <p>• Scroll to zoom</p>
          <p>• Right click to pan</p>
          <p>• KP affects trajectory disturbance</p>
        </CardContent>
      </Card>

      {/* 🔥 ACTION LOADER */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur">
          <div className="flex flex-col items-center gap-6">
            <img
              src={cosmoPredictLogo}
              className="w-24 h-24 animate-[zoomPulse_2.5s_ease-in-out_infinite]"
            />
            <p className="text-cyan-400 animate-pulse">
              Updating Simulation...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;
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

const Simulation = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const BASE = "http://127.0.0.1:8000/api";

  const fetchData = async () => {
    try {
      setLoading(true);

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
    fetchData();
  }, []);

  const getColor = () => {
    if (!data) return "text-gray-400";
    if (data.current_kp > 5) return "text-red-400";
    if (data.current_kp > 3) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div className="flex items-center gap-3">
          <Rocket className="text-cyan-400" size={28} />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              3D Rocket Simulation
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Real-time physics engine powered by space weather data
            </p>
          </div>
        </div>

        <Button
          onClick={fetchData}
          className="flex items-center gap-2"
          variant="outline"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      {/* LIVE STATUS */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

          {/* KP */}
          <Card className="bg-white/5 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Activity className="mx-auto mb-2 text-cyan-400" />
              <p className="text-sm text-gray-400">Current KP</p>
              <h2 className={`text-2xl font-bold ${getColor()}`}>
                {data.current_kp}
              </h2>
            </CardContent>
          </Card>

          {/* SPEED */}
          <Card className="bg-white/5 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Zap className="mx-auto mb-2 text-yellow-400" />
              <p className="text-sm text-gray-400">Solar Speed</p>
              <h2 className="text-xl font-bold">{data.avg_speed}</h2>
            </CardContent>
          </Card>

          {/* PREDICTION */}
          <Card className="bg-white/5 backdrop-blur">
            <CardContent className="p-4 text-center">
              <TrendingUp className="mx-auto mb-2 text-green-400" />
              <p className="text-sm text-gray-400">Prediction</p>
              <h2 className="text-lg font-semibold">
                {data.prediction}
              </h2>
            </CardContent>
          </Card>

          {/* CONFIDENCE */}
          <Card className="bg-white/5 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Gauge className="mx-auto mb-2 text-purple-400" />
              <p className="text-sm text-gray-400">Confidence</p>
              <h2 className="text-xl font-bold">
                {data.confidence}%
              </h2>
            </CardContent>
          </Card>

        </div>
      )}

      {/* 🚀 SIMULATION */}
      <RocketSimulation3D />

      {/* INFO PANEL */}
      <Card className="bg-white/5 backdrop-blur border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-cyan-400" />
            Simulation Guide
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* CONTROLS */}
          <div>
            <h3 className="font-semibold mb-2">Controls</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li><strong>Rotate:</strong> Drag mouse</li>
              <li><strong>Zoom:</strong> Scroll</li>
              <li><strong>Pan:</strong> Right click drag</li>
              <li><strong>Auto Update:</strong> Every 5 seconds</li>
            </ul>
          </div>

          {/* LOGIC */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="font-semibold mb-2">Physics Logic</h3>

            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li className="flex gap-2 items-center">
                <Rocket size={14} /> Thrust drives motion
              </li>
              <li className="flex gap-2 items-center">
                <Activity size={14} /> Gravity pulls down
              </li>
              <li className="flex gap-2 items-center">
                <Zap size={14} /> KP disturbs trajectory
              </li>
              <li className="flex gap-2 items-center">
                <TrendingUp size={14} /> Solar wind adds force
              </li>
            </ul>
          </div>

        </CardContent>
      </Card>

      {loading && (
        <p className="text-center text-cyan-400 animate-pulse">
          Updating live data...
        </p>
      )}
    </div>
  );
};

export default Simulation;
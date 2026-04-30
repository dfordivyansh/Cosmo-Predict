import { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Database,
  Globe,
  Rocket,
  Orbit,
  Brain,
} from "lucide-react";

// Charts (recharts)
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const BASE = "http://127.0.0.1:8000/api";

const Insights = () => {
  const [aiData, setAiData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [apod, setApod] = useState<any>(null);
  const [asteroids, setAsteroids] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // ✅ AI DATA
        const [pred, alertStats] = await Promise.all([
          axios.get(`${BASE}/prediction/`),
          axios.get(`${BASE}/alert-stats/`),
        ]);

        setAiData({ ...pred.data, ...alertStats.data });

        // ✅ ANALYTICS
        const analyticsRes = await axios.get(`${BASE}/analytics/`);
        setAnalytics(analyticsRes.data);

        // ✅ NASA (FROM BACKEND)
        const nasa = await axios.get(`${BASE}/nasa/`);

        setApod(nasa.data.apod);
        setAsteroids(nasa.data.asteroids || []);
        setAlerts(nasa.data.alerts || []);

      } catch (err) {
        console.log("Insights error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ================= LOGIC =================

  const getRisk = () => {
    if (!aiData) return "LOW";
    if (aiData.current_kp > 5) return "HIGH";
    if (aiData.current_kp > 3) return "MEDIUM";
    return "LOW";
  };

  const getAlertScore = () => {
    if (!aiData) return 0;
    return Math.min(100, aiData.current_kp * 15 + aiData.avg_kp * 10).toFixed(0);
  };

  const compareAIvsNASA = () => {
    if (!aiData || alerts.length === 0) return "No Solar Events";

    if (aiData.current_kp < 3 && alerts.length > 0) {
      return "AI Underestimated Risk";
    }

    if (aiData.current_kp > 5 && alerts.length === 0) {
      return "AI Overestimated";
    }

    return "AI Matches NASA";
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold gradient-text">
          Space Intelligence Insights
        </h1>
        <p className="text-muted-foreground">
          AI + NASA powered analytics dashboard
        </p>
      </div>

      {/* AI SUMMARY */}
      {aiData && (
        <div className="grid md:grid-cols-4 gap-6">

          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <Activity className="mx-auto mb-2 text-cyan-400" />
              <p className="text-sm">KP Index</p>
              <h2 className="text-2xl font-bold">{aiData.current_kp}</h2>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <TrendingUp className="mx-auto mb-2 text-green-400" />
              <p className="text-sm">Prediction</p>
              <h2>{aiData.prediction}</h2>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <AlertTriangle className="mx-auto mb-2 text-yellow-400" />
              <p className="text-sm">Storm Risk</p>
              <h2>{getRisk()}</h2>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <Database className="mx-auto mb-2 text-purple-400" />
              <p className="text-sm">Confidence</p>
              <h2>{aiData.confidence}%</h2>
            </CardContent>
          </Card>

        </div>
      )}

      {/* NASA */}
      <div className="grid lg:grid-cols-2 gap-6">

        {apod && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <Globe size={18} /> NASA Image of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img src={apod.url} className="rounded-lg mb-3" />
              <p className="font-semibold">{apod.title}</p>
            </CardContent>
          </Card>
        )}

<Card className="glass-card">
  <CardHeader>
    <CardTitle className="flex gap-2 items-center">
      <Orbit size={18} /> Near Earth Objects
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">

    {/* 📊 PIE CHART */}
    <div className="h-[180px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={[
              {
                name: "Safe",
                value: asteroids.filter(a => !a.is_potentially_hazardous_asteroid).length,
              },
              {
                name: "Hazardous",
                value: asteroids.filter(a => a.is_potentially_hazardous_asteroid).length,
              },
            ]}
            dataKey="value"
            outerRadius={70}
          >
            <Cell fill="#22c55e" />
            <Cell fill="#ef4444" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* 📋 LIST WITH DETAILS */}
    <div className="space-y-3">
      {asteroids.slice(0, 3).map((a: any, i: number) => {
        const approach = a.close_approach_data?.[0];

        return (
          <div
            key={i}
            className="p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <p className="font-semibold text-sm">{a.name}</p>

            <p className="text-xs text-muted-foreground">
              Speed:{" "}
              {approach
                ? parseFloat(
                    approach.relative_velocity.kilometers_per_hour
                  ).toFixed(0)
                : "N/A"}{" "}
              km/h
            </p>

            <Badge
              className="mt-1"
              variant={
                a.is_potentially_hazardous_asteroid
                  ? "destructive"
                  : "secondary"
              }
            >
              {a.is_potentially_hazardous_asteroid ? "Hazardous" : "Safe"}
            </Badge>
          </div>
        );
      })}
    </div>

    {/* 📊 SPEED BAR CHART */}
    <div className="h-[150px]">
      <ResponsiveContainer>
        <BarChart
          data={asteroids.slice(0, 3).map((a: any) => ({
            name: a.name.slice(0, 8),
            speed: parseFloat(
              a.close_approach_data?.[0]?.relative_velocity
                ?.kilometers_per_hour || 0
            ),
          }))}
        >
          <XAxis dataKey="name" hide />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="speed" fill="#38bdf8" />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </CardContent>
</Card>

      </div>

      {/* ANALYTICS */}
      {analytics && (
        <div className="grid lg:grid-cols-3 gap-6">

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>KP Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer>
                <BarChart data={[
                  { name: "Avg", value: analytics.avg_kp },
                  { name: "Max", value: analytics.max_kp },
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Solar Wind</CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer>
                <BarChart data={[
                  { name: "Avg", value: analytics.avg_speed },
                  { name: "Max", value: analytics.max_speed },
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardContent className="p-6 flex flex-col justify-center items-center h-full">
              <AlertTriangle size={40} />
              <p className="mt-3 text-sm">Storm Risk</p>
              <h2 className="text-xl font-bold uppercase">
                {analytics.storm_risk}
              </h2>
            </CardContent>
          </Card>

        </div>
      )}



      {loading && (
        <p className="text-center text-cyan-400">Loading insights...</p>
      )}

    </div>
  );
};

export default Insights;
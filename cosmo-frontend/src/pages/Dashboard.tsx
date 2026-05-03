import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Activity,
  Wind,
  Zap,
  Magnet,
  Volume2,
  AlertTriangle,
  Radio,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import cosmoPredictLogo from "@/assets/cosmopredict-logo.png"; // 🔥 added

const ACCESS_KEY = "SPACE-2026";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [ticker, setTicker] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");
  const [loadingAccess, setLoadingAccess] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("space-auth");
    if (saved === "true") setIsAuthorized(true);
  }, []);

  const handleAccess = () => {
    setLoadingAccess(true);

    setTimeout(() => {
      if (inputKey === ACCESS_KEY) {
        localStorage.setItem("space-auth", "true");
        setIsAuthorized(true);
        setError("");
      } else {
        setError("❌ Invalid Access Key");
      }
      setLoadingAccess(false);
    }, 800);
  };

  const speakNow = () => {
    if (!data) return;

    const message = data.noaaAlert || data.alert;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";

    if (data.severity === "high") {
      speech.pitch = 1.4;
      speech.volume = 1;
    } else if (data.severity === "moderate") {
      speech.volume = 0.7;
    } else {
      speech.volume = 0.5;
    }

    window.speechSynthesis.speak(speech);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/dashboard/");
      const d = res.data;

      setData(d);

      const message = d.noaaAlert || d.alert;

      setAlerts((prev) => [
        {
          severity: d.severity,
          message,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 6),
      ]);
    } catch {}
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/history/");
      setHistory(res.data);
    } catch {}
  };

  const fetchTicker = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/all-alerts/");
      setTicker(res.data.map((a: any) => a.message).slice(0, 10));
    } catch {}
  };

  useEffect(() => {
    if (!isAuthorized) return;

    fetchData();
    fetchTicker();
    fetchHistory();

    const interval = setInterval(() => {
      fetchData();
      fetchTicker();
      fetchHistory();
    }, 120000);

    return () => clearInterval(interval);
  }, [isAuthorized]);

  // ================= 🔐 ACCESS =================
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-slate-900 to-black text-white">
        <div className="flex-1 flex justify-center items-center px-4 sm:px-6 py-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-xl w-full max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4 text-cyan-400 flex justify-center items-center gap-2">
              <Radio className="animate-pulse" />
              Secure Space System
            </h1>

            <p className="text-gray-400 mb-6 text-sm">
              Authorized personnel only. Enter access key.
            </p>

            <input
              type="password"
              placeholder="Enter Access Key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full p-3 rounded-xl bg-black border border-white/20 mb-4 outline-none"
            />

            <button
              onClick={handleAccess}
              disabled={loadingAccess}
              className="w-full bg-cyan-500 py-2 rounded-xl hover:scale-105 transition">
              {loadingAccess ? "Verifying..." : "Unlock System"}
            </button>

            {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  // ================= 🔥 NEW LOADER =================
  if (!data)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-slate-900 to-black text-white">
        <div className="flex flex-col items-center gap-6">

          <div className="relative">
            <div className="absolute w-28 h-28 rounded-full bg-cyan-400/30 blur-2xl animate-pulse"></div>

            <img
              src={cosmoPredictLogo}
              className="w-24 h-24 animate-[zoomPulse_2.5s_ease-in-out_infinite]"
            />
          </div>

          <p className="text-cyan-400 text-lg tracking-widest animate-pulse">
            Initializing Space System...
          </p>
        </div>
      </div>
    );

  const kpColor =
    data.kpIndex > 5
      ? "text-red-400"
      : data.kpIndex > 3
      ? "text-yellow-400"
      : "text-green-400";

  // ================= MAIN =================
  return (
    <div className="min-h-screen pt-28 md:pt-24 bg-gradient-to-br from-black via-slate-900 to-black text-white px-4 sm:px-6 py-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Radio className="text-cyan-400 animate-pulse" />
          Space Weather AI
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <span className="text-gray-400 text-sm">
            {new Date(data.timestamp).toLocaleString()}
          </span>

          <button
            onClick={speakNow}
            className="bg-cyan-500 px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition">
            <Volume2 size={16} />
            Voice Alert
          </button>
        </div>
      </div>

      {/* TICKER */}
      <div className="overflow-hidden border border-red-500/20 bg-red-500/10 p-3 rounded-xl mb-8">
        <div className="animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {ticker.map((msg, i) => (
            <span
              key={i}
              className="mx-8 text-red-300 inline-flex items-center gap-2">
              <AlertTriangle size={14} />
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={Wind} title="Solar Wind" value={data.solarWind} />
        <Card icon={Activity} title="Density" value={data.protonDensity} />
        <Card icon={Magnet} title="Magnetic Field" value={data.magneticField} />
        <Card
          icon={Zap}
          title="Kp Index"
          value={data.kpIndex}
          color={kpColor}
        />
      </div>

      {/* GRAPH */}
      <div className="mt-10 bg-white/5 border border-white/10 p-6 rounded-2xl">
        <h2 className="text-cyan-400 mb-4">Kp Index Trend</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" hide />
            <YAxis domain={[0, 9]} />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="kp"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#60a5fa"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ALERTS */}
      <div className="mt-10">
        <h2 className="text-xl mb-4 text-red-400">Live Alerts</h2>

        <div className="space-y-3">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                a.severity === "high"
                  ? "bg-red-500/20 border-red-500"
                  : a.severity === "moderate"
                    ? "bg-yellow-500/20 border-yellow-500"
                    : "bg-green-500/20 border-green-500"
              }`}>
              <div className="flex items-center gap-2 font-bold uppercase">
                <AlertTriangle size={14} />
                {a.severity}
              </div>
              <div className="mt-1">{a.message}</div>
              <div className="text-xs text-gray-400 mt-1">{a.time}</div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
};

const Card = ({ icon: Icon, title, value, color = "" }: any) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:scale-105 transition">
    <div className="flex justify-between mb-2">
      <span className="text-gray-400">{title}</span>
      <Icon />
    </div>
    <div className={`text-2xl font-bold ${color}`}>
      {Number(value).toFixed(1)}
    </div>
  </div>
);

export default Dashboard;

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

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [ticker, setTicker] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ============================
  // 🔊 VOICE (ONLY ON CLICK)
  // ============================
  const speakNow = () => {
    if (!data) return;

    const message = data.noaaAlert || data.alert;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";
    speech.rate = 1;

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

  // ============================
  // 🔥 FETCH DATA
  // ============================
  const fetchData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/dashboard/");
      const d = res.data;

      setData(d);

      const message = d.noaaAlert || d.alert;

      // 🔥 NEW ALERT EVERY TIME
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

  // ============================
  // 🔥 GRAPH DATA
  // ============================
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/history/");
      setHistory(res.data);
    } catch {}
  };

  // ============================
  // 🔥 TICKER
  // ============================
  const fetchTicker = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/all-alerts/");
      setTicker(res.data.map((a: any) => a.message).slice(0, 10));
    } catch {}
  };

  // ============================
  // 🔥 INIT (2 MIN)
  // ============================
  useEffect(() => {
    fetchData();
    fetchTicker();
    fetchHistory();

    const interval = setInterval(() => {
      fetchData();
      fetchTicker();
      fetchHistory();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-white text-center mt-10">Loading...</div>;

  const kpColor =
    data.kpIndex > 5
      ? "text-red-400"
      : data.kpIndex > 3
      ? "text-yellow-400"
      : "text-green-400";

// 🔥 ONLY UI RESPONSIVE IMPROVED (NO LOGIC CHANGE)

return (
  <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white px-4 sm:px-6 py-6">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
        <Radio className="text-cyan-400 animate-pulse" />
        Space Weather AI
      </h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">

        <span className="text-gray-400 text-xs sm:text-sm">
          {new Date(data.timestamp).toLocaleString()}
        </span>

        {/* 🔊 VOICE BUTTON */}
        <button
          onClick={speakNow}
          className="bg-cyan-500 w-full sm:w-auto px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition shadow-lg"
        >
          <Volume2 size={16} />
          Voice Alert
        </button>
      </div>
    </div>

    {/* 🔥 TICKER */}
    <div className="overflow-hidden border border-red-500/20 bg-red-500/10 p-2 sm:p-3 rounded-xl mb-6 sm:mb-8 backdrop-blur-xl">
      <div className="animate-[scroll_20s_linear_infinite] whitespace-nowrap text-sm sm:text-base">
        {ticker.map((msg, i) => (
          <span key={i} className="mx-4 sm:mx-8 text-red-300 inline-flex items-center gap-2">
            <AlertTriangle size={14} />
            {msg}
          </span>
        ))}
      </div>
    </div>

    {/* METRICS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card icon={Wind} title="Solar Wind" value={data.solarWind} />
      <Card icon={Activity} title="Density" value={data.protonDensity} />
      <Card icon={Magnet} title="Magnetic Field" value={data.magneticField} />
      <Card icon={Zap} title="Kp Index" value={data.kpIndex} color={kpColor} />
    </div>

    {/* 📊 GRAPH */}
    <div className="mt-8 sm:mt-10 bg-white/5 border border-white/10 p-4 sm:p-6 rounded-2xl backdrop-blur-xl shadow-2xl">
      <h2 className="text-cyan-400 mb-4 text-sm sm:text-base">
        Kp Index Trend
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" hide />
          <YAxis domain={[0, 9]} />
          <Tooltip />

          <Line type="monotone" dataKey="kp" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="speed" stroke="#60a5fa" strokeWidth={1} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* 🌌 FLARE */}
    <div className="mt-8 sm:mt-10 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl shadow-xl text-center sm:text-left">
      <h2 className="text-purple-300 mb-2 text-sm sm:text-base">
        Solar Flare
      </h2>
      <div className="text-3xl sm:text-5xl font-bold text-purple-400 animate-pulse">
        {data.flareClass}
      </div>
    </div>

    {/* 🔥 ALERTS */}
    <div className="mt-8 sm:mt-10">
      <h2 className="text-lg sm:text-xl mb-4 text-red-400">
        Live Alerts
      </h2>

      <div className="space-y-3">
        {alerts.map((a, i) => (
          <div
            key={i}
            className={`p-3 sm:p-4 rounded-xl border backdrop-blur-xl text-sm sm:text-base ${
              a.severity === "high"
                ? "bg-red-500/20 border-red-500"
                : a.severity === "moderate"
                ? "bg-yellow-500/20 border-yellow-500"
                : "bg-green-500/20 border-green-500"
            }`}
          >
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

    {/* CSS */}
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

// CARD
const Card = ({ icon: Icon, title, value, color = "" }: any) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl hover:scale-105 transition">
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
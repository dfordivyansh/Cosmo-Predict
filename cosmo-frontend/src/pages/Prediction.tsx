import { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  FaSatellite,
  FaHistory,
  FaSync,
  FaMicrophone,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { toast } from "sonner";
import cosmoPredictLogo from "@/assets/cosmopredict-logo.png";

const ACCESS_KEY = "SPACE-2026";
const BASE = "http://127.0.0.1:8000/api";

const Prediction = () => {
  // ================= STATE =================
  const [minKp, setMinKp] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [alertsFeed, setAlertsFeed] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // 🔥 NEW

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  // ================= AUTH CHECK =================
  useEffect(() => {
    const saved = localStorage.getItem("prediction-auth");
    if (saved === "true") setIsAuthorized(true);

    // 🔥 dashboard jaisa loader delay
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ================= ACCESS =================
  const handleAccess = () => {
    setVerifying(true);

    setTimeout(() => {
      if (inputKey === ACCESS_KEY) {
        localStorage.setItem("prediction-auth", "true");
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
  if (!startDate || !endDate) {
    toast.error("Select date range");
    return;
  }

  try {
    setLoading(true);

    await new Promise((r) => setTimeout(r, 50));

    setResult(null);
    setData([]);

    const start = new Date(startDate);
    start.setHours(0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    // ✅ 3 APIs together
    const [rangeRes, alertRes, predictionRes] = await Promise.all([
      axios.get(
        `${BASE}/range/?start=${start.toISOString()}&end=${end.toISOString()}`
      ),
      axios.get(`${BASE}/all-alerts/`),
      axios.get(`${BASE}/prediction/`), // 🔥 NEW
    ]);

    const rangeData = rangeRes.data;

    if (!rangeData.length) {
      toast.error("No data found");
      return;
    }

    const filtered = rangeData.filter(
      (d: any) => Number(d.kp) >= minKp
    );

    if (!filtered.length) {
      toast.error("No data after filter");
      return;
    }

    setData(filtered);
    setAlertsFeed(alertRes.data);

    const p = predictionRes.data;

    // ✅ DIRECT BACKEND RESULT
    const final = {
      current_kp: p.current_kp,        // REAL
      predicted_kp: p.predicted_kp,    // ML
      avg_kp: p.avg_kp,
      prediction: p.prediction,
      confidence: p.confidence,
      trend: p.trend,
      time: new Date().toLocaleTimeString(),
    };

    setResult(final);

    setHistory((prev) => [
      final,
      ...prev.filter((h) => h.time !== final.time).slice(0, 5),
    ]);

    toast.success("Prediction Ready 🚀");

  } catch {
    toast.error("API Error");
  } finally {
    setLoading(false);
  }
};

  const speakAnalysis = () => {
    if (!result) return;

    const speech = new SpeechSynthesisUtterance(`
      Current KP is ${result.current_kp}.
      Condition is ${result.prediction}.
      Trend is ${result.trend}.
      Confidence ${result.confidence} percent.
    `);

    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const getColor = (kp: number) => {
    if (kp > 5) return "text-red-400";
    if (kp > 3) return "text-yellow-400";
    return "text-green-400";
  };

  // ================= ACCESS SCREEN =================
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black text-white">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center w-full max-w-md">
          <h1 className="text-2xl font-bold text-cyan-400 mb-4 flex gap-2 justify-center">
            <FaSatellite className="animate-pulse" />
            Secure Prediction Engine
          </h1>

          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl bg-black border border-white/20"
          />

          <Button onClick={handleAccess} className="w-full bg-cyan-500">
            {verifying ? "Verifying..." : "Unlock"}
          </Button>

          {error && <p className="text-red-400 mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  // ================= 🔥 INITIAL LOADER =================
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
            Initializing Prediction Engine...
          </p>
        </div>
      </div>
    );
  }

  // ================= MAIN =================
  return (
    <div className="min-h-screen pt-28 md:pt-24 bg-gradient-to-br from-black via-slate-900 to-black text-white p-6">

      {/* HEADER */}
      <div className="text-center mb-6">
        <FaSatellite className="text-cyan-400 text-4xl mx-auto mb-2" />
        <h1 className="text-3xl font-bold">CosmoPredict</h1>
      </div>

      {/* CONTROLS */}
      <Card className="p-4 mb-6 grid md:grid-cols-5 gap-4 bg-white/5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Start"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "End"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
          </PopoverContent>
        </Popover>

        <Input type="number" placeholder="Min KP" onChange={(e) => setMinKp(Number(e.target.value))} />

        <Button onClick={fetchData} className="bg-cyan-500">
          <FaSync /> Analyze
        </Button>

        <Button onClick={speakAnalysis} className="bg-purple-500">
          <FaMicrophone /> Voice
        </Button>
      </Card>

      {/* RESULT */}
      {result && (
  <Card className="p-6 mb-6 text-center bg-white/5">

    <h2 className="text-sm text-gray-400">REAL KP</h2>
    <h2 className="text-5xl font-bold">
      {result.current_kp}
    </h2>

    {result.predicted_kp !== null && (
      <>
        <p className="mt-4 text-sm text-gray-400">PREDICTED KP</p>
        <p className="text-3xl text-cyan-400 font-bold">
          {result.predicted_kp}
        </p>
      </>
    )}

    <p className={`mt-4 ${getColor(Number(result.current_kp))}`}>
      {result.prediction}
    </p>

    <p>Trend: {result.trend}</p>
    <p>Confidence: {result.confidence}%</p>
  </Card>
)}

      {/* CHART */}
      {data.length > 0 && (
        <Card className="p-4 mb-6 bg-white/5">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line dataKey="kp" stroke="#22d3ee" />
              <Line dataKey="speed" stroke="#facc15" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* ALERTS */}
      {alertsFeed.length > 0 && (
        <Card className="p-4 mb-6 bg-white/5">
          {alertsFeed.slice(0, 3).map((a, i) => (
            <p key={i}>• {a.message}</p>
          ))}
        </Card>
      )}

      {/* HISTORY */}
      {history.length > 0 && (
        <Card className="p-4 bg-white/5">
          <FaHistory /> History
          {history.map((h, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span>{h.time}</span>
              <span>Kp: {h.current_kp}</span>
              <span>{h.prediction}</span>
            </div>
          ))}
        </Card>
      )}

      {/* 🔥 ACTION LOADER */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur">
          <div className="flex flex-col items-center gap-6">
            <img
              src={cosmoPredictLogo}
              className="w-24 h-24 animate-[zoomPulse_2.5s_ease-in-out_infinite]"
            />
            <p className="text-cyan-400 animate-pulse">
              Analyzing Space Data...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;
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

const ACCESS_KEY = "SPACE-2026"; // 🔑 KEY

const Prediction = () => {
  const [minKp, setMinKp] = useState(0);

  const [data, setData] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [alertsFeed, setAlertsFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // 🔐 ACCESS STATES
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const BASE = "http://127.0.0.1:8000/api";

  // ============================
  // 🔐 CHECK LOCAL AUTH
  // ============================
  useEffect(() => {
    const saved = localStorage.getItem("prediction-auth");
    if (saved === "true") setIsAuthorized(true);
  }, []);

  // ============================
  // 🔐 ACCESS HANDLER
  // ============================
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

  // ============================
  // 🔥 ANALYSIS
  // ============================
  const fetchData = async () => {
    if (!startDate || !endDate) {
      toast.error("Select date range");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setData([]);

      const start = new Date(startDate);
      start.setHours(0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59);

      const startISO = start.toISOString();
      const endISO = end.toISOString();

      const [rangeRes, alertRes] = await Promise.all([
        axios.get(`${BASE}/range/?start=${startISO}&end=${endISO}`),
        axios.get(`${BASE}/all-alerts/`),
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

      const kpValues = filtered.map((d: any) => Number(d.kp));
      const avgKp =
        kpValues.reduce((a, b) => a + b, 0) / kpValues.length;

      const currentKp = kpValues[kpValues.length - 1];

      let trend = "stable";
      if (currentKp > kpValues[0]) trend = "increasing";
      else if (currentKp < kpValues[0]) trend = "decreasing";

      let prediction = "Quiet";
      if (avgKp > 6) prediction = "Severe Storm";
      else if (avgKp > 4) prediction = "Strong Storm";
      else if (avgKp > 2) prediction = "Moderate Activity";

      const variance =
        kpValues.reduce((a, v) => a + Math.abs(v - avgKp), 0) /
        kpValues.length;

      const confidence = Math.max(
        30,
        Math.min(95, 100 - variance * 20)
      ).toFixed(2);

      const final = {
        current_kp: currentKp.toFixed(2),
        avg_kp: avgKp.toFixed(2),
        prediction,
        confidence,
        trend,
        time: new Date().toLocaleTimeString(),
      };

      setResult(final);
      setAlertsFeed(alertRes.data);

      setHistory((prev) => [
        final,
        ...prev.filter((p) => p.time !== final.time).slice(0, 5),
      ]);

      toast.success("Analysis Complete 🚀");

    } catch {
      toast.error("API Error");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 🎤 VOICE
  // ============================
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

  // ============================
  // 🔐 ACCESS SCREEN
  // ============================
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center w-full max-w-md">

          <h1 className="text-2xl font-bold text-cyan-400 mb-4">
            🔐 Secure Prediction Engine
          </h1>

          <input
            type="password"
            placeholder="Enter Access Key"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-full p-3 rounded-xl bg-black border border-white/20 mb-4"
          />

          <Button onClick={handleAccess} className="w-full bg-cyan-500">
            {verifying ? "Verifying..." : "Unlock"}
          </Button>

          {error && <p className="text-red-400 mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  // ============================
  // 🚀 MAIN UI
  // ============================
  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="text-center mb-6">
        <FaSatellite className="text-cyan-400 text-4xl mx-auto mb-2" />
        <h1 className="text-3xl font-bold">CosmoPredict</h1>
      </div>

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

        <Input
          type="number"
          placeholder="Min KP"
          onChange={(e) => setMinKp(Number(e.target.value))}
        />

        <Button onClick={fetchData} className="bg-cyan-500">
          <FaSync /> Analyze
        </Button>

        <Button onClick={speakAnalysis} className="bg-purple-500">
          <FaMicrophone /> Voice
        </Button>
      </Card>

      {result && (
        <Card className="p-6 mb-6 text-center bg-white/5">
          <h2 className="text-5xl font-bold">{result.current_kp}</h2>
          <p className={getColor(Number(result.current_kp))}>
            {result.prediction}
          </p>
          <p>Trend: {result.trend}</p>
          <p>Confidence: {result.confidence}%</p>
        </Card>
      )}

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

      {alertsFeed.length > 0 && (
        <Card className="p-4 mb-6 bg-white/5">
          {alertsFeed.slice(0, 3).map((a, i) => (
            <p key={i}>• {a.message}</p>
          ))}
        </Card>
      )}

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

      {loading && <p className="text-center mt-4">Processing...</p>}
    </div>
  );
};

export default Prediction;
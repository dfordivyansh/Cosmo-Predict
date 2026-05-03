import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Rocket, Activity, Satellite } from "lucide-react";
import cosmoPredictLogo from "@/assets/cosmopredict-logo.png";

const BASE = "http://127.0.0.1:8000/api";

const Home = () => {
  const [apod, setApod] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isImage = apod?.media_type === "image";

  const imageUrl =
    isImage && (apod?.hdurl || apod?.url)
      ? apod.hdurl || apod.url
      : "https://images.unsplash.com/photo-1462331940025-496dfbfc7564";

  const videoUrl =
    apod?.media_type === "video" && apod?.url.includes("youtube.com")
      ? apod.url.replace("watch?v=", "embed/") + "?autoplay=1&mute=1"
      : apod?.url;

  useEffect(() => {
    const fetchNASA = async () => {
      try {
        const res = await axios.get(`${BASE}/nasa/`);
        const apodData = res.data.apod;

        if (apodData) {
          setApod(apodData);
        }
      } catch (err) {
        console.log("Backend NASA API error", err);

        setApod({
          media_type: "image",
          url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
          title: "Space View",
          explanation: "Fallback image",
        });
      } finally {
        setTimeout(() => setLoading(false), 1200);
      }
    };

    fetchNASA();
  }, []);

  // ================= 🔥 LOADER =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6">

          {/* 🔥 GLOW + ZOOM */}
          <div className="relative flex items-center justify-center">

            {/* glow layer */}
            <div className="absolute w-28 h-28 rounded-full bg-cyan-400/30 blur-2xl animate-pulse"></div>

            {/* smooth zoom logo */}
            <img
              src={cosmoPredictLogo}
              className="w-24 h-24 animate-[zoomPulse_2.5s_ease-in-out_infinite]"
            />
          </div>

          <h2 className="text-xl text-cyan-400 tracking-widest animate-pulse">
            Loading CosmoPredict...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-19 md:pt-8 animate-fade-in">
      {/* ================= HERO ================= */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">

        {isImage && (
          <div
            className="absolute inset-0 scale-110 animate-[zoom_20s_linear_infinite]"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {apod?.media_type === "video" && (
          <div className="absolute inset-0">
            {apod.url.endsWith(".mp4") ? (
              <video
                src={apod.url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={videoUrl}
                title="NASA Video"
                className="w-full h-full object-cover"
                allow="autoplay; fullscreen"
              />
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />

        <div className="relative z-10 container mx-auto px-4 text-center">

          {apod && (
            <div className="mb-6">
              <h2 className="text-lg text-cyan-400 font-semibold">
                Today's NASA Gallery
              </h2>
              <p className="text-sm text-gray-400 mt-1">{apod.title}</p>
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CosmoPredict
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            3D Space Weather & Rocket Simulation
          </p>

          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Visualize rocket trajectories in real-time 3D, predict space
            weather impacts, and explore deviation protocols.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/simulation">
              <Button size="lg" className="shadow-glow-primary">
                <Rocket className="mr-2 h-5 w-5" />
                Launch Simulation
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button size="lg" variant="outline">
                <Activity className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {apod && (
          <div className="absolute bottom-4 text-center px-4 w-full">
            <p className="text-xs md:text-sm text-gray-300 max-w-3xl mx-auto line-clamp-2">
              {apod.explanation}
            </p>
          </div>
        )}
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">

          <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
            Mission Capabilities
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:scale-105 transition">
              <Rocket className="h-8 w-8 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">
                3D Trajectory Simulation
              </h3>
              <p className="text-gray-400">
                Interactive Three.js visualization.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:scale-105 transition">
              <Activity className="h-8 w-8 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">
                Real-Time Monitoring
              </h3>
              <p className="text-gray-400">
                Live solar wind & KP index tracking.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:scale-105 transition">
              <Satellite className="h-8 w-8 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">
                Predictive Analytics
              </h3>
              <p className="text-gray-400">
                Forecast geomagnetic storms.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-4 text-cyan-400">
          Ready to Explore?
        </h2>

        <p className="text-gray-400 mb-6">
          Experience the future of space simulation.
        </p>

        <Link to="/dashboard">
          <Button size="lg">Get Started</Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
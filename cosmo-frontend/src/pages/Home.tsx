import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Rocket, Activity, Satellite } from "lucide-react";

const BASE = "http://127.0.0.1:8000/api";

const Home = () => {
  const [apod, setApod] = useState<any>(null);

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

        // fallback
        setApod({
          media_type: "image",
          url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
          title: "Space View",
          explanation: "Fallback image",
        });
      }
    };

    fetchNASA();
  }, []);

  return (
    <div className="min-h-screen">
      {/* ================= HERO ================= */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* IMAGE BACKGROUND */}
        {isImage && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* VIDEO BACKGROUND */}
        {apod?.media_type === "video" && (
          <div className="absolute inset-0">
            {/* If MP4 → use video tag */}
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
              /* Otherwise iframe (YouTube/Vimeo) */
              <iframe
                src={videoUrl}
                title="NASA Video"
                className="w-full h-full object-cover"
                allow="autoplay; fullscreen"
              />
            )}
          </div>
        )}

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />

        {/* CONTENT */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* NASA TITLE */}
          {apod && (
            <div className="mb-6">
              <h2 className="text-lg text-cyan-400 font-semibold">
                NASA Image of the Day
              </h2>
              <p className="text-sm text-gray-400 mt-1">{apod.title}</p>
            </div>
          )}

          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">CosmoPredict</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              3D Space Weather & Rocket Simulation
            </p>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Visualize rocket trajectories in real-time 3D, predict space
              weather impacts, and explore deviation protocols with advanced
              simulation technology.
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
        </div>

        {/* explanation (optional premium touch) */}
        {apod && (
          <div className="absolute bottom-4 left-0 right-0 text-center px-4">
            <p className="text-xs md:text-sm text-gray-300 max-w-3xl mx-auto line-clamp-2">
              {apod.explanation}
            </p>
          </div>
        )}
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 bg-gradient-nebula">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
            Mission Capabilities
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl hover:shadow-glow-primary transition-all">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                3D Trajectory Simulation
              </h3>
              <p className="text-muted-foreground">
                Interactive Three.js visualization showing real-time rocket
                paths.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl hover:shadow-glow-accent transition-all">
              <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Real-Time Monitoring</h3>
              <p className="text-muted-foreground">
                Live dashboard tracking solar wind and KP index.
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl hover:shadow-glow-accent transition-all">
              <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Satellite className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Predictive Analytics</h3>
              <p className="text-muted-foreground">
                Forecast solar flares and geomagnetic storms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="glass-card p-12 rounded-2xl max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Ready to Explore?
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              Experience the future of space simulation.
            </p>

            <Link to="/dashboard">
              <Button size="lg" className="shadow-glow-primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

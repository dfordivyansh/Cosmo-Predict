import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Shield, Cpu, Satellite, GraduationCap } from "lucide-react";

import cosmoPredictLogo from "@/assets/cosmopredict-logo.png"; // ✅ ADD THIS

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Rocket,
      title: "Trajectory Simulation Engine",
      description:
        "Simulates rocket motion under space weather disturbances using physics-based modeling.",
    },
    {
      icon: Shield,
      title: "Space Weather Safety System",
      description:
        "Detects geomagnetic storms and calculates safe deviation paths.",
    },
    {
      icon: Cpu,
      title: "AI Prediction Model",
      description:
        "Machine learning model trained on historical KP index data for storm prediction.",
    },
    {
      icon: Satellite,
      title: "NASA Data Integration",
      description:
        "Live data from NASA APIs including APOD and asteroid monitoring.",
    },
  ];

  const techStack = [
    { name: "React", purpose: "Frontend UI" },
    { name: "Django REST", purpose: "Backend API" },
    { name: "Three.js", purpose: "3D Simulation" },
    { name: "Machine Learning", purpose: "Prediction Model" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white relative overflow-hidden pt-20">
      {/* 🌌 BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 blur-3xl top-0 left-0 animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-500/10 blur-3xl bottom-0 right-0 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16 relative z-10">
        {/* 🎓 HERO */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-cyan-500/20 p-4 rounded-full shadow-lg shadow-cyan-500/20 animate-pulse">
              <GraduationCap className="text-cyan-400" size={32} />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold gradient-text">
            Final Year Major Project
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            CosmoPredict – Space Weather & Rocket Simulation System
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            This project integrates Artificial Intelligence, Space Data
            Analytics, and 3D Visualization to simulate rocket trajectories
            under real-time space weather conditions.
          </p>
        </div>

        {/* 📌 PROJECT OVERVIEW */}
        <Card className="glass-card backdrop-blur-xl border border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
            <p>
              CosmoPredict analyzes solar activity and predicts geomagnetic
              storms that can impact rocket trajectories and satellite systems.
            </p>
            <p>
              It combines real-time NASA data, machine learning models, and
              physics-based simulations to visualize and predict safe flight
              paths.
            </p>
          </CardContent>
        </Card>

        {/* 🚀 FEATURES */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center gradient-text">
            Core Modules
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="glass-card backdrop-blur-xl border border-white/10 hover:shadow-cyan-500/20 hover:scale-[1.02] transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 p-3 rounded-lg shadow-inner">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 🧠 TECH STACK */}
        <Card className="glass-card backdrop-blur-xl border border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Technology Stack</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center">
                  <div className="font-bold text-lg gradient-text mb-1">
                    {tech.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tech.purpose}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 📊 STATS */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { value: "94%", label: "Model Accuracy" },
            { value: "Real-Time", label: "Data Processing" },
            { value: "3D", label: "Simulation Engine" },
            { value: "AI", label: "Prediction Model" },
          ].map((stat, i) => (
            <Card
              key={i}
              className="glass-card text-center backdrop-blur-xl border border-white/10 hover:scale-105 transition-all">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-cyan-400">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🎯 OBJECTIVE */}
        <Card className="glass-card backdrop-blur-xl border border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Project Objective</CardTitle>
          </CardHeader>

          <CardContent className="text-muted-foreground space-y-3 leading-relaxed">
            <p>• Predict space weather using ML models</p>
            <p>• Simulate rocket trajectory under disturbances</p>
            <p>• Integrate NASA APIs for real-time data</p>
            <p>• Provide interactive visual insights</p>
          </CardContent>
        </Card>
      </div>

      {/* 🔥 UPDATED LOADER */}
      {loading && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              {/* glow */}
              <div className="absolute w-28 h-28 rounded-full bg-cyan-400/30 blur-2xl animate-pulse"></div>

              {/* logo animation */}
              <img
                src={cosmoPredictLogo}
                className="w-24 h-24 animate-[zoomPulse_2.5s_ease-in-out_infinite]"
              />
            </div>

            <p className="text-cyan-400 text-lg tracking-widest animate-pulse">
              Initializing Project Overview...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;

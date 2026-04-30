import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Shield, Cpu, Satellite, GraduationCap } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Rocket,
      title: 'Trajectory Simulation Engine',
      description: 'Simulates rocket motion under space weather disturbances using physics-based modeling.',
    },
    {
      icon: Shield,
      title: 'Space Weather Safety System',
      description: 'Detects geomagnetic storms and calculates safe deviation paths.',
    },
    {
      icon: Cpu,
      title: 'AI Prediction Model',
      description: 'Machine learning model trained on historical KP index data for storm prediction.',
    },
    {
      icon: Satellite,
      title: 'NASA Data Integration',
      description: 'Live data from NASA APIs including APOD and asteroid monitoring.',
    },
  ];

  const techStack = [
    { name: 'React', purpose: 'Frontend UI' },
    { name: 'Django REST', purpose: 'Backend API' },
    { name: 'Three.js', purpose: '3D Simulation' },
    { name: 'Machine Learning', purpose: 'Prediction Model' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">

      {/* 🎓 HERO */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-cyan-500/20 p-3 rounded-full">
            <GraduationCap className="text-cyan-400" size={28} />
          </div>
        </div>

        <h1 className="text-5xl font-bold gradient-text">
          Final Year Major Project
        </h1>

        <h2 className="text-2xl font-semibold text-white">
          CosmoPredict – Space Weather & Rocket Simulation System
        </h2>

        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          This project is developed as a Final Year B.Tech Major Project, focusing on 
          integrating Artificial Intelligence, Space Data Analytics, and 3D Visualization 
          to simulate rocket trajectories under real-time space weather conditions.
        </p>
      </div>

      {/* 📌 PROJECT OVERVIEW */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-4">
          <p>
            CosmoPredict is designed to analyze solar activity and predict geomagnetic storms 
            that can impact rocket trajectories and satellite systems.
          </p>
          <p>
            The system combines real-time NASA data, machine learning models, and physics-based 
            simulation to visualize and predict safe flight paths in space missions.
          </p>
        </CardContent>
      </Card>

      {/* 🚀 FEATURES */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center gradient-text">
          Core Modules
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="glass-card hover:shadow-glow-primary transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 🧠 TECHNOLOGY STACK */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Technology Stack</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition text-center"
              >
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

      {/* 📊 PROJECT STATS */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="glass-card text-center">
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-primary">94%</div>
            <div className="text-sm text-muted-foreground">Model Accuracy</div>
          </CardContent>
        </Card>

        <Card className="glass-card text-center">
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-accent">Real-Time</div>
            <div className="text-sm text-muted-foreground">Data Processing</div>
          </CardContent>
        </Card>

        <Card className="glass-card text-center">
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-secondary">3D</div>
            <div className="text-sm text-muted-foreground">Simulation Engine</div>
          </CardContent>
        </Card>

        <Card className="glass-card text-center">
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-success">AI</div>
            <div className="text-sm text-muted-foreground">Prediction Model</div>
          </CardContent>
        </Card>
      </div>

      {/* 🎯 OBJECTIVE */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Project Objective</CardTitle>
        </CardHeader>

        <CardContent className="text-muted-foreground space-y-3">
          <p>
            • Predict space weather conditions using machine learning models
          </p>
          <p>
            • Simulate rocket trajectory under disturbance conditions
          </p>
          <p>
            • Integrate NASA APIs for real-time global space data
          </p>
          <p>
            • Provide visual insights through interactive dashboards
          </p>
        </CardContent>
      </Card>

    </div>
  );
};

export default About;
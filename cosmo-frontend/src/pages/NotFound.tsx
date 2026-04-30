import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Rocket, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">

      {/* 🌌 Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.2),transparent_60%)]" />

      {/* ✨ Floating Glow */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full" />

      {/* 🚀 CONTENT */}
      <div className="relative z-10 text-center px-6">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/5 rounded-full">
            <AlertTriangle className="text-yellow-400" size={40} />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-7xl font-bold gradient-text mb-4">
          404
        </h1>

        {/* MESSAGE */}
        <p className="text-2xl text-white mb-2">
          Lost in Space
        </p>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are trying to access does not exist or has been moved.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4">

          <Link to="/">
            <Button size="lg" className="shadow-glow-primary">
              <Rocket className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>

          <Link to="/dashboard">
            <Button size="lg" variant="outline">
              Go to Dashboard
            </Button>
          </Link>

        </div>

        {/* ROUTE DEBUG */}
        <p className="text-xs text-gray-500 mt-6">
          Path: {location.pathname}
        </p>

      </div>
    </div>
  );
};

export default NotFound;
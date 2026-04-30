import { Rocket, Github, Mail, Globe, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-gradient-to-b from-black/80 to-black">

      {/* subtle glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,cyan,transparent_70%)]" />

      <div className="relative container mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-10">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-cyan-500/20">
                <Rocket className="text-cyan-400" />
              </div>

              <h2 className="text-2xl font-bold text-cyan-400 tracking-wide">
                CosmoPredict
              </h2>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered space weather prediction platform with real-time analytics,
              NASA data integration, and 3D simulation capabilities.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="font-semibold mb-4 text-white tracking-wide">
              Navigation
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">

              <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
              <Link to="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link>
              <Link to="/simulation" className="hover:text-cyan-400 transition">Simulation</Link>
              <Link to="/insights" className="hover:text-cyan-400 transition">Insights</Link>
              <Link to="/prediction" className="hover:text-cyan-400 transition">Prediction</Link>
              <Link to="/about" className="hover:text-cyan-400 transition">About</Link>

            </div>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="font-semibold mb-4 text-white tracking-wide">
              Connect
            </h3>

            <div className="flex gap-4 mb-4">

              <a
                href="https://github.com/dfordivyansh"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 hover:bg-cyan-500/20 transition hover:scale-110"
              >
                <Github size={18} />
              </a>

              <a
                href="https://linkedin.com/in/divyanshsrivastava1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 hover:bg-cyan-500/20 transition hover:scale-110"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="mailto:dfordivyansh3@gmail.com"
                className="p-3 rounded-full bg-white/5 hover:bg-cyan-500/20 transition hover:scale-110"
              >
                <Mail size={18} />
              </a>

              <a
                href="/"
                className="p-3 rounded-full bg-white/5 hover:bg-cyan-500/20 transition hover:scale-110"
              >
                <Globe size={18} />
              </a>

            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Built using React, Django, and NASA APIs.
            </p>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} CosmoPredict. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs text-gray-500">
            <span className="hover:text-cyan-400 cursor-pointer">Privacy</span>
            <span className="hover:text-cyan-400 cursor-pointer">Terms</span>
            <span className="hover:text-cyan-400 cursor-pointer">Contact</span>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
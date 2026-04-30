import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Rocket,
  BrainCircuit,
  Mail,
  Info,
} from "lucide-react";
import { useState, useEffect } from "react";
import cosmoPredictLogo from "@/assets/cosmopredict-logo.png";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // 🔒 SCROLL LOCK
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const navLinks = [
    { name: "Home", path: "/", icon: Rocket },
    { name: "Dashboard", path: "/dashboard", icon: Rocket },
    { name: "Prediction", path: "/prediction", icon: BrainCircuit },
    { name: "Simulation", path: "/simulation", icon: Rocket },
    { name: "Insights", path: "/insights", icon: Rocket },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 🔥 NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/10">

        <div className="container mx-auto px-6">

          <div className="flex items-center justify-between h-20">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={cosmoPredictLogo}
                className="h-11 w-11 transition duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CosmoPredict
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-2">

              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-300 group ${
                      active
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_15px_#22d3ee] scale-105"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <Icon size={16} />

                    {/* TEXT */}
                    <span className="relative">
                      {link.name}

                      {/* UNDERLINE ANIMATION */}
                      {!active && (
                        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-400 transition-all group-hover:w-full"></span>
                      )}
                    </span>
                  </Link>
                );
              })}

            </div>

            {/* MOBILE BUTTON */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen(!open)}
                className="relative w-10 h-10 flex items-center justify-center"
              >
                <span
                  className={`absolute w-6 h-[2px] bg-white transition-all ${
                    open ? "rotate-45" : "-translate-y-2"
                  }`}
                />
                <span
                  className={`absolute w-6 h-[2px] bg-white transition-all ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute w-6 h-[2px] bg-white transition-all ${
                    open ? "-rotate-45" : "translate-y-2"
                  }`}
                />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* 🔥 MOBILE FULLSCREEN MENU */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col transition-all duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >

        <div className="flex flex-col justify-center items-center flex-1 gap-6">

          {navLinks.map((link, i) => {
            const Icon = link.icon;
            const active = isActive(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-4 text-2xl px-6 py-3 rounded-2xl transition-all duration-300 ${
                  active
                    ? "bg-cyan-400 text-black scale-110 shadow-[0_0_25px_#22d3ee]"
                    : "text-gray-300 hover:text-white hover:scale-110"
                }`}
                style={{
                  transitionDelay: `${i * 0.05}s`,
                }}
              >
                <Icon size={24} />
                {link.name}
              </Link>
            );
          })}

        </div>

        {/* FOOTER */}
        <div className="text-center pb-6 text-gray-500 text-sm">
          © 2026 CosmoPredict
        </div>
      </div>
    </>
  );
};

export default Navbar;
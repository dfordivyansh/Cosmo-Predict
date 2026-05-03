import { Link, useLocation } from "react-router-dom";
import {
  Rocket,
  BrainCircuit,
  Mail,
  Info,
  Activity,
  Orbit,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import cosmoPredictLogo from "@/assets/cosmopredict-logo.png";

const Navbar = () => {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  const rotationRef = useRef(0);
  const targetRotation = useRef(0);
  const velocity = useRef(0);

  const [boostSpin, setBoostSpin] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  // 🔥 animation loop
  useEffect(() => {
    let raf;

    const animate = () => {
      const diff = targetRotation.current - rotationRef.current;
      const smooth = diff * 0.08;

      velocity.current *= 0.95;
      rotationRef.current += smooth + velocity.current;

      forceUpdate((prev) => prev + 1);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: Rocket },
    { name: "Dashboard", path: "/dashboard", icon: Activity },
    { name: "Prediction", path: "/prediction", icon: BrainCircuit },
    { name: "Simulation", path: "/simulation", icon: Orbit },
    { name: "Insights", path: "/insights", icon: TrendingUp },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setOpen((prev) => !prev);

  const boostRotation = () => {
    velocity.current += 3;
    setBoostSpin(true);
    setTimeout(() => setBoostSpin(false), 600);
  };

  const rotateLeft = () => {
    targetRotation.current -= 50;
  };

  const rotateRight = () => {
    targetRotation.current += 50;
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl bg-black/60 border-b border-cyan-400/20 shadow-[0_0_35px_rgba(34,211,238,0.25)]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-28 md:h-24">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-4 group">
              <img
                src={cosmoPredictLogo}
                className="h-14 w-14 transition duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
              <span className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CosmoPredict
              </span>
            </Link>

            {/* DESKTOP */}
            <div className="hidden md:flex items-center gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-300 ${
                      active
                        ? "bg-cyan-400 text-black shadow-[0_0_20px_#22d3ee]"
                        : "text-gray-300 hover:bg-white/10 hover:scale-105"
                    }`}
                  >
                    <Icon size={18} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* MOBILE BTN */}
            <div
              onClick={toggleMenu}
              className="md:hidden relative w-16 h-16 flex items-center justify-center cursor-pointer"
            >
              <div className="absolute w-20 h-20 bg-cyan-400/20 blur-2xl rounded-full animate-pulse"></div>
              <div className="absolute w-16 h-16 border border-cyan-400/30 rounded-full animate-spin-slow"></div>

              <div className={`z-10 ${open ? "rotate-180 text-orange-400" : "text-cyan-400"}`}>
                {open ? <Rocket size={28} /> : <Orbit size={26} />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 flex items-center justify-center transition-all duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* 🌌 ORBIT RINGS */}
        <div className="absolute w-56 h-56 border border-cyan-400/20 rounded-full animate-spin-slow"></div>
        <div className="absolute w-72 h-72 border border-purple-400/20 rounded-full animate-spin-reverse"></div>
        <div className="absolute w-96 h-96 border border-blue-400/10 rounded-full animate-spin-slow"></div>

        {/* 🌍 EARTH */}
        <div
          onClick={boostRotation}
          className="relative w-44 h-44 rounded-full overflow-hidden border border-cyan-400 shadow-[0_0_45px_#22d3ee]"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
            className={`w-full h-full object-cover animate-spin-slow ${
              boostSpin ? "scale-110" : ""
            }`}
          />
        </div>

        {/* 🔼 TOP CONTROLS */}
        <div className="absolute top-60 flex gap-6">
          <button
            onClick={rotateLeft}
            className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_15px_#ec4899] hover:scale-110 transition"
          >
            <ChevronLeft size={18} className="text-white" />
          </button>

          <button
            onClick={rotateRight}
            className="p-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_#22d3ee] hover:scale-110 transition"
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        </div>

        {/* ITEMS */}
        {open &&
          navLinks.map((link, i) => {
            const baseAngle = (i / navLinks.length) * 360;
            const dynamicAngle = baseAngle + rotationRef.current;

            const rad = (dynamicAngle * Math.PI) / 180;
            const radius = 190;

            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const depth = Math.sin(rad);

            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className="absolute flex flex-col items-center text-white"
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${1 + depth * 0.6})`,
                  opacity: 0.3 + depth * 0.7,
                }}
              >
                <div className="p-3 rounded-full bg-white/10 border border-white/20 backdrop-blur">
                  <Icon size={22} />
                </div>
                <span className="text-xs mt-1">{link.name}</span>
              </Link>
            );
          })}
      </div>
    </>
  );
};

export default Navbar;
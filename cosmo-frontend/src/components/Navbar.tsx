import { Link, useLocation } from "react-router-dom";
import {
  Rocket,
  BrainCircuit,
  Mail,
  Info,
  Activity,
  Orbit,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import cosmoPredictLogo from "@/assets/cosmopredict-logo.png";

const Navbar = () => {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [, forceUpdate] = useState(0); // 🔥 safe re-render trigger

  // 🔥 animation refs (NO state loop)
  const rotationRef = useRef(0);
  const targetRotation = useRef(0);
  const velocity = useRef(0);

  const lastX = useRef(0);
  const isDragging = useRef(false);

  const [boostSpin, setBoostSpin] = useState(false);

  // 🔒 scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  // 🔥 animation loop (RUN ONLY ONCE)
  useEffect(() => {
    let raf;

    const animate = () => {
      const diff = targetRotation.current - rotationRef.current;
      const smooth = diff * 0.08;

      velocity.current *= 0.95;

      rotationRef.current += smooth + velocity.current;

      // trigger UI update safely
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

  // 🧠 DRAG HANDLERS
  const handleStart = (e) => {
    isDragging.current = true;
    lastX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e) => {
    if (!isDragging.current) return;

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const delta = x - lastX.current;

    velocity.current = delta * 0.02;
    targetRotation.current += delta * 0.4;

    lastX.current = x;
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const toggleMenu = () => setOpen((prev) => !prev);

  // 🌍 TAP BOOST
  const boostRotation = () => {
    velocity.current += 3;
    setBoostSpin(true);

    setTimeout(() => setBoostSpin(false), 600);
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
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

            {/* DESKTOP NAV */}
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

            {/* 🚀 MOBILE BUTTON */}
            <div
              onClick={toggleMenu}
              className="md:hidden relative w-16 h-16 flex items-center justify-center cursor-pointer"
            >
              <div className="absolute w-20 h-20 bg-cyan-400/20 blur-2xl rounded-full animate-pulse"></div>

              <div className="absolute w-16 h-16 border border-cyan-400/30 rounded-full animate-spin-slow"></div>
              <div className="absolute w-20 h-20 border border-cyan-400/10 rounded-full animate-spin-reverse"></div>

              <div
                className={`z-10 transition-all duration-500 ${
                  open
                    ? "rotate-180 scale-110 text-orange-400"
                    : "text-cyan-400"
                }`}
              >
                {open ? <Rocket size={28} /> : <Orbit size={26} />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 🔥 MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 flex items-center justify-center transition-all duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* rings */}
        <div className="absolute w-80 h-80 border border-cyan-400/10 rounded-full animate-spin-slow"></div>
        <div className="absolute w-96 h-96 border border-cyan-400/5 rounded-full animate-spin-reverse"></div>

        {/* 🌍 EARTH */}
        <div
          onClick={boostRotation}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="relative w-44 h-44 rounded-full overflow-hidden border border-cyan-400 shadow-[0_0_45px_#22d3ee] cursor-grab"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
            className={`w-full h-full object-cover animate-spin-slow ${
              boostSpin ? "scale-110" : ""
            }`}
          />
        </div>

        {/* 🛰️ ITEMS */}
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
                className="absolute flex flex-col items-center text-white transition-all duration-300"
                style={{
                  transform: `
                    translate(${x}px, ${y}px)
                    scale(${1 + depth * 0.6})
                    rotateX(${depth * 35}deg)
                  `,
                  opacity: 0.25 + depth * 0.75,
                  zIndex: Math.round((depth + 1) * 100),
                }}
              >
                <div className="p-3 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:scale-125 hover:shadow-[0_0_25px_#22d3ee] transition">
                  <Icon size={22} />
                </div>
                <span className="text-xs mt-1">{link.name}</span>
              </Link>
            );
          })}

        {/* footer */}
        <div className="absolute bottom-6 text-gray-500 text-sm">
          © 2026 CosmoPredict
        </div>
      </div>
    </>
  );
};

export default Navbar;
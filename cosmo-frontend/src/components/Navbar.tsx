import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, BrainCircuit, Mail, Info } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import cosmoPredictLogo from '@/assets/cosmopredict-logo.png';

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Rocket },
    { name: 'Dashboard', path: '/dashboard', icon: Rocket },
    { name: 'Prediction', path: '/prediction', icon: BrainCircuit },
    { name: 'Simulation', path: '/simulation', icon: Rocket },
    { name: 'Insights', path: '/insights', icon: Rocket },
    { name: 'About', path: '/about', icon: Info }, // ✅ ADDED
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10 shadow-lg">

      <div className="container mx-auto px-6">

        {/* 🔥 TOP BAR */}
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={cosmoPredictLogo}
              className="h-12 w-12 transition-transform group-hover:scale-110"
            />
            <span className="text-2xl font-bold text-cyan-400 tracking-wide">
              CosmoPredict
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-3">

            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-cyan-500 text-black shadow-lg scale-105'
                      : 'text-gray-300 hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  <Icon size={16} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* 🔥 MOBILE MENU ICON */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setOpen(!open)}>
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* 🔥 MOBILE MENU */}
        {open && (
          <div className="md:hidden pb-6 animate-fadeIn">

            <div className="flex flex-col gap-3 mt-4 bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl">

              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      isActive(link.path)
                        ? 'bg-cyan-500 text-black'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={18} />
                    {link.name}
                  </Link>
                );
              })}

            </div>

          </div>
        )}

      </div>

      {/* 🔥 ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
        `}
      </style>

    </nav>
  );
};

export default Navbar;
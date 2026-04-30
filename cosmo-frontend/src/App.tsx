import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Insights from "./pages/Insights";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Prediction from "./pages/Prediction";
import Footer from "@/components/Footer";
import Contact from './pages/Contact';
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/about" element={<About />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
              <Footer /> 
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

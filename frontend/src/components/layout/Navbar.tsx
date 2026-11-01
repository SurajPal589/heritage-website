import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  UploadCloud, 
  Layers, 
  Activity, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { fetchHealth } from '../../lib/api';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [backendHealth, setBackendHealth] = useState<{ status: string; gemini_enabled: boolean } | null>(null);

  useEffect(() => {
    fetchHealth()
      .then(setBackendHealth)
      .catch(() => setBackendHealth({ status: 'offline', gemini_enabled: false }));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-heritage-dark border-b border-heritage-border/60 text-heritage-ivory shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-heritage-sandstone hover:text-white hover:bg-heritage-navy transition"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-heritage-gold to-heritage-terracotta flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-heritage-dark" />
              </div>
              <div className="flex flex-col">
                <span className="font-heritage text-lg font-bold tracking-wide text-heritage-ivory group-hover:text-heritage-goldLight transition-colors">
                  HeritageVerse <span className="text-heritage-gold">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-heritage-sandstone/70">
                  IIT Gandhinagar · HC26-CULT01
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search stepwells, temples, manuscripts, or crafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-heritage-navy/90 text-sm text-heritage-ivory placeholder-heritage-sandstone/50 rounded-full pl-10 pr-4 py-2 border border-heritage-border focus:outline-none focus:border-heritage-gold transition-colors"
              />
              <Search className="w-4 h-4 text-heritage-sandstone/60 absolute left-3.5 top-2.5" />
            </form>
          </div>

          {/* Right: Quick Actions & Status */}
          <div className="flex items-center space-x-3">
            {/* Health & AI Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-heritage-navy border border-heritage-border text-heritage-sandstone">
              <span className={`w-2 h-2 rounded-full ${backendHealth?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              <span>{backendHealth?.gemini_enabled ? 'Gemini AI' : 'Deterministic OCR'}</span>
            </div>

            {/* Quick Upload Button */}
            <Link
              to="/upload"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-heritage-terracotta hover:bg-heritage-terracottaLight text-white shadow-sm hover:shadow transition-all duration-200"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Digitise Archive</span>
            </Link>

            {/* Explore Link */}
            <Link
              to="/explore"
              className="hidden lg:inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium text-heritage-sandstone hover:text-white hover:bg-heritage-navy border border-heritage-border transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};


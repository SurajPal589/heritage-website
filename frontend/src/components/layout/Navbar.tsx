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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-heritage-dark border-b border-heritage-border/60 text-heritage-ivory shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-heritage-sandstone hover:text-white hover:bg-heritage-navy active:bg-heritage-surface transition min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Toggle Navigation Drawer"
            >
              {isSidebarOpen ? <X className="w-5 h-5 text-heritage-gold" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-heritage-gold to-heritage-terracotta flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-heritage-dark" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-heritage text-sm sm:text-base md:text-lg font-bold tracking-wide text-heritage-ivory group-hover:text-heritage-goldLight transition-colors truncate">
                  HeritageVerse <span className="text-heritage-gold">AI</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-heritage-sandstone/70 truncate hidden xs:block">
                  IIT Gandhinagar · HC26-CULT01
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Search Bar */}
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
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Mobile Search Toggle Icon */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 rounded-xl text-heritage-sandstone hover:text-white hover:bg-heritage-navy transition min-w-[38px] min-h-[38px] flex items-center justify-center"
              aria-label="Toggle Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Health & AI Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-heritage-navy border border-heritage-border text-heritage-sandstone">
              <span className={`w-2 h-2 rounded-full ${backendHealth?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              <span>{backendHealth?.gemini_enabled ? 'Gemini AI' : 'Deterministic OCR'}</span>
            </div>

            {/* Quick Upload Button */}
            <Link
              to="/upload"
              className="inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold bg-heritage-terracotta hover:bg-heritage-terracottaLight text-white shadow-sm hover:shadow transition-all duration-200"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Digitise Archive</span>
              <span className="xs:hidden">Upload</span>
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

        {/* Expandable Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search stepwells, temples, manuscripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-heritage-navy text-xs text-heritage-ivory placeholder-heritage-sandstone/50 rounded-xl pl-9 pr-9 py-2 border border-heritage-gold/50 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-heritage-gold absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="absolute right-2.5 top-2 text-heritage-sandstone/70 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

      </div>
    </header>
  );
};


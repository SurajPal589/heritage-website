import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Compass, 
  Archive as ArchiveIcon, 
  UploadCloud, 
  MapPin, 
  Box 
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-heritage-dark/95 backdrop-blur-xl border-t border-heritage-border/80 shadow-2xl safe-bottom select-none"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2 relative">
        
        {/* 1. Home / Overview */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => `
            flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 group
            ${isActive ? 'text-heritage-gold font-bold scale-105' : 'text-heritage-sandstone/70 hover:text-white'}
          `}
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Compass className="w-5 h-5 transition-transform group-active:scale-90" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-heritage-gold rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">Home</span>
            </>
          )}
        </NavLink>

        {/* 2. Digital Archives */}
        <NavLink
          to="/archives"
          className={({ isActive }) => `
            flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 group
            ${isActive ? 'text-heritage-gold font-bold scale-105' : 'text-heritage-sandstone/70 hover:text-white'}
          `}
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <ArchiveIcon className="w-5 h-5 transition-transform group-active:scale-90" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-heritage-gold rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">Archives</span>
            </>
          )}
        </NavLink>

        {/* 3. Center Highlight: Upload / Digitise Archive */}
        <div className="flex-1 flex justify-center -mt-5">
          <NavLink
            to="/upload"
            aria-label="Digitise New Archive"
            className={({ isActive }) => `
              w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform group active:scale-95
              ${isActive 
                ? 'bg-gradient-to-tr from-heritage-terracotta to-amber-500 ring-4 ring-heritage-gold/40 shadow-heritage-lg' 
                : 'bg-gradient-to-tr from-heritage-terracotta to-heritage-terracottaLight ring-3 ring-heritage-dark shadow-md hover:scale-105'
              }
            `}
          >
            <UploadCloud className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </NavLink>
        </div>

        {/* 4. Geospatial Map */}
        <NavLink
          to="/map"
          className={({ isActive }) => `
            flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 group
            ${isActive ? 'text-heritage-gold font-bold scale-105' : 'text-heritage-sandstone/70 hover:text-white'}
          `}
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <MapPin className="w-5 h-5 transition-transform group-active:scale-90" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-heritage-gold rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">Map</span>
            </>
          )}
        </NavLink>

        {/* 5. 3D Explorer */}
        <NavLink
          to="/3d-explorer"
          className={({ isActive }) => `
            flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 group
            ${isActive ? 'text-heritage-gold font-bold scale-105' : 'text-heritage-sandstone/70 hover:text-white'}
          `}
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Box className="w-5 h-5 transition-transform group-active:scale-90" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-heritage-gold rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">3D Tour</span>
            </>
          )}
        </NavLink>

      </div>
    </nav>
  );
};


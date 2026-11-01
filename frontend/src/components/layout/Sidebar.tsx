import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Archive as ArchiveIcon, 
  UploadCloud, 
  Cpu, 
  Search, 
  MapPin, 
  Box, 
  BookOpen, 
  Info,
  Compass,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const navItems = [
  { path: '/', label: 'Overview', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/archives', label: 'Digital Archives', icon: ArchiveIcon },
  { path: '/upload', label: 'Upload Centre', icon: UploadCloud },
  { path: '/processing', label: 'AI Processing Centre', icon: Cpu },
  { path: '/explore', label: 'Intelligent Search', icon: Search },
  { path: '/map', label: 'Geospatial Map', icon: MapPin },
  { path: '/3d-explorer', label: '3D Heritage Explorer', icon: Box },
  { path: '/stories', label: 'Cultural Stories', icon: BookOpen },
  { path: '/about', label: 'About & Methodology', icon: Info },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={`
        fixed top-16 bottom-0 left-0 z-40 w-64 bg-heritage-dark border-r border-heritage-border/70 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-heritage-sandstone/60">
            Heritage Platform
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === '/'}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-heritage-navy text-heritage-gold font-semibold shadow-inner border-l-4 border-heritage-gold' 
                    : 'text-heritage-sandstone/90 hover:text-white hover:bg-heritage-navy/50'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Hackathon Citation Box */}
        <div className="p-3 m-3 rounded-xl bg-heritage-navy/80 border border-heritage-border/80 text-xs">
          <div className="flex items-center space-x-1.5 text-heritage-gold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px]">Blithchron '27 Hackathon</span>
          </div>
          <p className="text-[11px] text-heritage-sandstone/70 leading-relaxed">
            IIT Gandhinagar Problem Statement: <span className="text-heritage-sandstone font-medium">HC26-CULT01</span>
          </p>
          <div className="mt-2 text-[10px] text-heritage-sandstone/50 border-t border-heritage-border/40 pt-1.5 flex justify-between">
            <span>Revitalising Indian Archives</span>
            <span className="text-emerald-400">MVP v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};


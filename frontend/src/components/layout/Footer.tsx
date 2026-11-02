import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-heritage-dark border-t border-heritage-border text-heritage-sandstone/80 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 text-heritage-ivory">
              <Compass className="w-5 h-5 text-heritage-gold" />
              <span className="font-heritage text-base font-bold">HeritageLens AI</span>
            </div>
            <p className="text-xs text-heritage-sandstone/70 leading-relaxed">
              From Historical Archives to Interactive Heritage Maps. Converting historical PDFs, scanned documents, photographs and research reports into structured, searchable heritage records and interactive geographical visualizations.
            </p>
            <div className="flex items-center space-x-1.5 text-[11px] text-heritage-gold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Preserving Living Indian Heritage</span>
            </div>
          </div>

          {/* Column 2: Innovation Pathways */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-ivory font-heritage">
              Innovation Pathways
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/3d-explorer" className="hover:text-heritage-gold transition">
                  A. Computer Vision & 3D WebGL
                </Link>
              </li>
              <li>
                <Link to="/processing" className="hover:text-heritage-gold transition">
                  B. Archival NLP & OCR Pipeline
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-heritage-gold transition">
                  C. Geospatial & Immersive Web
                </Link>
              </li>
              <li>
                <Link to="/stories" className="hover:text-heritage-gold transition">
                  D. Cultural Narrative Archives
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-ivory font-heritage">
              Archive Systems
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-heritage-gold transition">Main Analytics Dashboard</Link>
              </li>
              <li>
                <Link to="/archives" className="hover:text-heritage-gold transition">Digital Archives Catalogue</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-heritage-gold transition">Intelligent Heritage Search</Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-heritage-gold transition">Document Upload & OCR Centre</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-heritage-gold transition">Methodology & Problem Statement</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Attribution */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-ivory font-heritage">
              Organization & Attribution
            </h4>
            <p className="text-xs leading-relaxed text-heritage-sandstone/70">
              Developed for <span className="text-heritage-ivory font-semibold">Blithchron '27</span> at <span className="text-heritage-ivory font-semibold">IIT Gandhinagar</span>.
            </p>
            <p className="text-xs text-heritage-sandstone/70">
              Problem Statement: <span className="font-mono text-heritage-gold text-[11px]">HC26-CULT01</span>
            </p>
            <div className="pt-2 text-[11px] text-heritage-sandstone/50">
              Archival sources: Archaeological Survey of India (ASI), Gujarat State Archives, UNESCO Memory of the World, and National Crafts Museum.
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-heritage-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-heritage-sandstone/60">
          <div>
            &copy; {new Date().getFullYear()} HeritageLens AI. Built for the preservation of Indian cultural heritage.
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/about" className="hover:text-heritage-sandstone">Documentation</Link>
            <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-heritage-sandstone">
              <span>FastAPI Swagger Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};


import React from 'react';
import { 
  Compass, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  MapPin, 
  Box, 
  FileText, 
  Sparkles, 
  CheckCircle,
  Database,
  ExternalLink
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="border-b border-heritage-sandstone/30 pb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-terracotta">
          System Architecture & Academic Provenance
        </span>
        <h1 className="text-3xl sm:text-4xl font-heritage font-bold text-heritage-dark mt-1">
          About HeritageVerse AI
        </h1>
        <p className="text-sm text-heritage-navy/70 mt-1 leading-relaxed">
          Developed for Hackathon Problem Statement <strong>HC26-CULT01</strong> at <strong>Blithchron '27, IIT Gandhinagar</strong>.
        </p>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sandstone/40 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-heritage-terracotta">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="font-heritage font-bold text-lg text-heritage-dark">
            Problem Statement: HC26-CULT01
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-heritage-navy/80 leading-relaxed text-justify">
          Cultural documentation collected by students, researchers, and explorers is scattered across disconnected PDF reports, historical photographs, handwritten documents, regional language manuscripts, travel journals, and unindexed cloud folders. 
          <br /><br />
          HeritageVerse AI solves this by engineering a functional end-to-end pipeline that transforms raw unstructured files into structured, searchable, interactive, and visually immersive digital knowledge.
        </p>
      </div>

      {/* 3 Innovation Pathways */}
      <div className="space-y-6">
        <h2 className="font-heritage font-bold text-2xl text-heritage-dark">
          The Three Innovation Pathways
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-heritage-navy text-heritage-gold flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="font-heritage font-bold text-base text-heritage-dark">
              A. Computer Vision & 3D WebGL
            </h3>
            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              Real-time WebGL rendering of architectural elements with orbital controls, material simulations, and future compatibility with multi-view stereo photogrammetry pipelines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-heritage-terracotta text-white flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-heritage font-bold text-base text-heritage-dark">
              B. Archival NLP & OCR
            </h3>
            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              Multi-tiered text extraction capable of processing native PDF streams, image scans, bilingual Devanagari script detection, and structured metadata cataloging via Gemini AI.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-heritage-sage text-white flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-heritage font-bold text-base text-heritage-dark">
              C. Geospatial & Immersive Web
            </h3>
            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              Interactive Leaflet geospatial mapping with verified coordinates, clustered discovery, and principled handling for unlocated field notes awaiting verification.
            </p>
          </div>

        </div>
      </div>

      {/* Technology Stack & Pipeline Architecture */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sandstone/40 shadow-sm space-y-6">
        <h2 className="font-heritage font-bold text-xl text-heritage-dark flex items-center space-x-2">
          <Layers className="w-5 h-5 text-heritage-navy" />
          <span>Technical Architecture & Open Standards</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-heritage-navy/80">
          <div className="space-y-2 p-4 rounded-2xl bg-heritage-cream/30 border border-heritage-sandstone/40">
            <h4 className="font-bold text-heritage-dark text-sm">Backend Engine</h4>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><strong>Framework:</strong> FastAPI (Python 3.14) REST API</li>
              <li><strong>Database:</strong> SQLite with SQLAlchemy ORM & 10 relational entities</li>
              <li><strong>OCR Pipeline:</strong> PyPDF native stream extractor + Tesseract OCR</li>
              <li><strong>AI Engine:</strong> Google GenAI (Gemini 2.5 Flash) with deterministic fallback</li>
              <li><strong>Validation:</strong> Pydantic v2 data models with automatic OpenAPI schema</li>
            </ul>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-heritage-cream/30 border border-heritage-sandstone/40">
            <h4 className="font-bold text-heritage-dark text-sm">Frontend Architecture</h4>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><strong>UI Framework:</strong> React 19 + TypeScript + Vite</li>
              <li><strong>Design System:</strong> Tailwind CSS Editorial Museum Palette</li>
              <li><strong>Geospatial:</strong> Leaflet & OpenStreetMap with custom SVG markers</li>
              <li><strong>3D Engine:</strong> Three.js WebGL with custom orbital controls & lighting</li>
              <li><strong>Typography:</strong> Google Cinzel (Serif) & Plus Jakarta Sans</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ethical Heritage Principles */}
      <div className="p-6 rounded-3xl bg-heritage-parchment border border-heritage-sandstone/40 space-y-4">
        <h3 className="font-heritage font-bold text-lg text-heritage-dark flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-heritage-gold" />
          <span>Archival Ethics & Preservation Philosophy</span>
        </h3>
        <p className="text-xs text-heritage-navy/80 leading-relaxed text-justify">
          In preserving cultural heritage, historical accuracy is non-negotiable. HeritageVerse AI enforces three core ethical rules:
        </p>
        <ul className="text-xs text-heritage-navy/80 space-y-2 list-disc list-inside">
          <li><strong>No Hallucinated Geography:</strong> Unlocated records are stored in a dedicated georeferencing queue rather than plotted at random coordinates.</li>
          <li><strong>Transparent Provenance:</strong> Every record displays whether its metadata was synthesized by Gemini AI or inferred through rule-based heuristics.</li>
          <li><strong>Open Cultural Access:</strong> Designed in harmony with UNESCO Open Science and Archaeological Survey of India public documentation principles.</li>
        </ul>
      </div>

      {/* External Links */}
      <div className="pt-4 border-t border-heritage-sandstone/30 flex flex-wrap gap-4 text-xs font-semibold text-heritage-terracotta">
        <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 hover:underline">
          <span>FastAPI Swagger Documentation</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a href="https://asi.nic.in" target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 hover:underline">
          <span>Archaeological Survey of India</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a href="https://whc.unesco.org/en/statesparties/in" target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 hover:underline">
          <span>UNESCO World Heritage Sites in India</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};


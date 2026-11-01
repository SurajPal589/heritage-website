import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  UploadCloud, 
  MapPin, 
  Box, 
  BookOpen, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  ArrowRight,
  Database,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { fetchAnalytics, fetchArchives, fetchStories, getSafeArchiveImage } from '../lib/api';
import { AnalyticsResponse, Archive, CulturalStory } from '../types';

export const LandingPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [featuredArchives, setFeaturedArchives] = useState<Archive[]>([]);
  const [featuredStories, setFeaturedStories] = useState<CulturalStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAnalytics().catch(() => null),
      fetchArchives({ limit: 4, sort_by: 'date_desc' }).catch(() => null),
      fetchStories().catch(() => null)
    ]).then(([analyticsData, archivesData, storiesData]) => {
      if (analyticsData) setAnalytics(analyticsData);
      if (archivesData) setFeaturedArchives(archivesData.items.slice(0, 4));
      if (storiesData) setFeaturedStories(storiesData.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-heritage-ivory text-heritage-dark overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-heritage-dark text-heritage-ivory px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=2000&q=80"
            alt="Rani ki Vav Stepwell Subterranean Architecture"
            className="w-full h-full object-cover object-center opacity-30 scale-105 filter brightness-75 contrast-125 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark via-heritage-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-heritage-dark/90 via-transparent to-heritage-dark/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          {/* Hackathon Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-heritage-navy/90 border border-heritage-gold/40 text-heritage-gold text-xs font-semibold uppercase tracking-wider backdrop-blur-md animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IIT Gandhinagar · Blithchron '27 · HC26-CULT01</span>
          </div>

          {/* Master Heading */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-heritage font-extrabold tracking-tight leading-tight text-white">
              Preserving Yesterday. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-sandstone via-heritage-gold to-heritage-terracottaLight">
                Discovering Tomorrow.
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-sm sm:text-lg lg:text-xl text-heritage-sandstone/90 leading-relaxed font-light px-2">
              An intelligent digital heritage platform transforming scattered cultural archives into searchable, interactive and immersive knowledge.
            </p>
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 sm:pt-4">
            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-heritage-gold hover:bg-heritage-goldLight text-heritage-dark font-bold text-sm shadow-heritage hover:shadow-heritage-lg transition-all duration-200 transform active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Heritage</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-heritage-navy/90 hover:bg-heritage-navy text-heritage-ivory border border-heritage-border/80 font-semibold text-sm backdrop-blur-md transition-all duration-200 active:scale-95"
            >
              <UploadCloud className="w-4 h-4 text-heritage-terracottaLight" />
              <span>Digitise an Archive</span>
            </Link>
          </div>

          {/* Live Dynamic Stats Banner */}
          <div className="pt-8 sm:pt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-heritage-surface/85 border border-heritage-border/70 backdrop-blur-md">
              <div className="text-center p-2.5 sm:p-2">
                <div className="text-2xl sm:text-3xl font-heritage font-bold text-heritage-gold">
                  {analytics?.total_archives ?? 14}
                </div>
                <div className="text-[10px] sm:text-xs text-heritage-sandstone/70 uppercase tracking-wider font-medium mt-1">
                  Archived Records
                </div>
              </div>

              <div className="text-center p-2.5 sm:p-2 border-l border-heritage-border/50">
                <div className="text-2xl sm:text-3xl font-heritage font-bold text-heritage-terracottaLight">
                  {analytics?.total_digitised_documents ?? 8}
                </div>
                <div className="text-[10px] sm:text-xs text-heritage-sandstone/70 uppercase tracking-wider font-medium mt-1">
                  Digitised Manuscripts
                </div>
              </div>

              <div className="text-center p-2.5 sm:p-2 border-t md:border-t-0 md:border-l border-heritage-border/50">
                <div className="text-2xl sm:text-3xl font-heritage font-bold text-emerald-400">
                  {analytics?.total_heritage_locations ?? 12}
                </div>
                <div className="text-[10px] sm:text-xs text-heritage-sandstone/70 uppercase tracking-wider font-medium mt-1">
                  Verified Geospatial Sites
                </div>
              </div>

              <div className="text-center p-2.5 sm:p-2 border-t md:border-t-0 border-l border-heritage-border/50">
                <div className="text-2xl sm:text-3xl font-heritage font-bold text-sky-400">
                  100%
                </div>
                <div className="text-[10px] sm:text-xs text-heritage-sandstone/70 uppercase tracking-wider font-medium mt-1">
                  OCR & Epigraphy Indexed
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE PROBLEM STATEMENT */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
            The Archival Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl font-heritage font-bold text-heritage-dark">
            Why Cultural Knowledge Remains Lost
          </h2>
          <p className="text-heritage-navy/70 text-sm sm:text-base leading-relaxed">
            Currently, invaluable cultural documentation collected by students, researchers, and explorers remains fragmented across incompatible formats, inaccessible to scholars and public memory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-heritage-cream/60 border border-heritage-sandstone/40 rounded-2xl p-7 space-y-4 hover:shadow-card-warm transition-all">
            <div className="w-12 h-12 rounded-xl bg-heritage-navy text-heritage-gold flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-heritage text-lg font-bold text-heritage-dark">
              Scattered Unstructured Formats
            </h3>
            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              Historical photographs, handwritten notebooks, PDF survey reports, and regional language manuscripts rot in disconnected hard drives without indexing or cross-referencing.
            </p>
          </div>

          <div className="bg-heritage-cream/60 border border-heritage-sandstone/40 rounded-2xl p-7 space-y-4 hover:shadow-card-warm transition-all">
            <div className="w-12 h-12 rounded-xl bg-heritage-terracotta text-white flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-heritage text-lg font-bold text-heritage-dark">
              Language & Script Barriers
            </h3>
            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              Inscriptions in Devanagari, Grantha, Old Kannada, and regional dialects lack accessible OCR. Searching across centuries of epigraphy is virtually impossible with standard tools.
            </p>
          </div>

          <div className="bg-heritage-cream/60 border border-heritage-sandstone/40 rounded-2xl p-7 space-y-4 hover:shadow-card-warm transition-all">
            <div className="w-12 h-12 rounded-xl bg-heritage-sage text-white flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-heritage text-lg font-bold text-heritage-dark">
              Disconnected Geospatial Context
            </h3>
            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              Architectural observations lack GPS and geospatial anchoring, preventing researchers from correlating regional construction styles, stepwell water tables, or temple dynasties.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THE 3 INNOVATION PATHWAYS */}
      <section className="py-20 bg-heritage-parchment border-y border-heritage-sandstone/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-gold">
              Core Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-heritage font-bold text-heritage-dark">
              The Three Innovation Pathways
            </h2>
            <p className="text-heritage-navy/70 text-sm sm:text-base leading-relaxed">
              HeritageVerse AI bridges historical preservation and computational engineering across three tightly integrated approaches:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pathway A */}
            <div className="bg-white rounded-2xl p-7 border border-heritage-sandstone/40 shadow-sm hover:shadow-heritage transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-heritage-terracotta bg-heritage-terracotta/10 px-2.5 py-1 rounded-full">
                    Pathway A
                  </span>
                  <Box className="w-6 h-6 text-heritage-navy" />
                </div>
                <h3 className="text-xl font-heritage font-bold text-heritage-dark">
                  Computer Vision & 3D WebGL
                </h3>
                <p className="text-xs text-heritage-navy/70 leading-relaxed">
                  Interactive real-time 3D rendering of architectural heritage monuments, carved steles, stepwell pavilions, and Buddhist stupas using WebGL and Three.js with full orbital controls.
                </p>
              </div>
              <div className="pt-6 border-t border-heritage-sandstone/20 mt-6">
                <Link
                  to="/3d-explorer"
                  className="inline-flex items-center text-xs font-bold text-heritage-terracotta hover:text-heritage-terracottaDark transition"
                >
                  <span>Launch 3D Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* Pathway B */}
            <div className="bg-white rounded-2xl p-7 border border-heritage-sandstone/40 shadow-sm hover:shadow-heritage transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-heritage-gold bg-heritage-gold/10 px-2.5 py-1 rounded-full">
                    Pathway B
                  </span>
                  <Cpu className="w-6 h-6 text-heritage-navy" />
                </div>
                <h3 className="text-xl font-heritage font-bold text-heritage-dark">
                  Archival NLP & OCR Engine
                </h3>
                <p className="text-xs text-heritage-navy/70 leading-relaxed">
                  Dual-tier OCR pipeline for scanned manuscripts and field PDFs, featuring bilingual Devanagari detection, deterministic architectural extraction, and Gemini AI synthesis.
                </p>
              </div>
              <div className="pt-6 border-t border-heritage-sandstone/20 mt-6">
                <Link
                  to="/processing"
                  className="inline-flex items-center text-xs font-bold text-heritage-gold hover:text-amber-700 transition"
                >
                  <span>Explore AI Processing</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* Pathway C */}
            <div className="bg-white rounded-2xl p-7 border border-heritage-sandstone/40 shadow-sm hover:shadow-heritage transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-heritage-sage bg-heritage-sage/10 px-2.5 py-1 rounded-full">
                    Pathway C
                  </span>
                  <MapPin className="w-6 h-6 text-heritage-navy" />
                </div>
                <h3 className="text-xl font-heritage font-bold text-heritage-dark">
                  Geospatial & Immersive Web
                </h3>
                <p className="text-xs text-heritage-navy/70 leading-relaxed">
                  Interactive Leaflet geospatial mapping with verified Indian monument coordinates, clustered archival discovery, state filters, and explicit handling for unlocated field notes.
                </p>
              </div>
              <div className="pt-6 border-t border-heritage-sandstone/20 mt-6">
                <Link
                  to="/map"
                  className="inline-flex items-center text-xs font-bold text-heritage-sage hover:text-emerald-800 transition"
                >
                  <span>Open Interactive Map</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW THE AI PROCESSING PIPELINE WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
            The Digitisation Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-heritage font-bold text-heritage-dark">
            From Unstructured File to Digital Knowledge
          </h2>
          <p className="text-heritage-navy/70 text-sm sm:text-base leading-relaxed">
            See how raw field reports and historical scans are automatically converted into structured, searchable records in four transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="p-6 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-full bg-heritage-navy text-heritage-gold font-bold flex items-center justify-center text-sm font-heritage">
              1
            </div>
            <h4 className="font-heritage font-bold text-base text-heritage-dark">
              Upload & Validation
            </h4>
            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              Drag-and-drop support for PDF, JPG, PNG, and WEBP formats up to 50 MB with MIME integrity checks and persistent storage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-full bg-heritage-navy text-heritage-gold font-bold flex items-center justify-center text-sm font-heritage">
              2
            </div>
            <h4 className="font-heritage font-bold text-base text-heritage-dark">
              Optical Character Recognition
            </h4>
            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              Extracts text streams from native PDFs or image scans with automatic bilingual Devanagari and Latin script detection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-full bg-heritage-navy text-heritage-gold font-bold flex items-center justify-center text-sm font-heritage">
              3
            </div>
            <h4 className="font-heritage font-bold text-base text-heritage-dark">
              AI / Deterministic NLP
            </h4>
            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              Infers architectural dynasties, periods, categories, and coordinates via Gemini or verified heritage knowledge bases.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-full bg-heritage-navy text-heritage-gold font-bold flex items-center justify-center text-sm font-heritage">
              4
            </div>
            <h4 className="font-heritage font-bold text-base text-heritage-dark">
              Human Review & Catalog
            </h4>
            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              Researchers can inspect, edit, and verify generated metadata before committing to permanent relational database storage.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/upload"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-heritage-terracotta hover:bg-heritage-terracottaLight text-white text-xs font-bold shadow-md transition"
          >
            <span>Try Digitising a Document Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. FEATURED HERITAGE DISCOVERIES */}
      <section className="py-20 bg-heritage-parchment border-t border-heritage-sandstone/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-heritage-gold">
                Curated Archives
              </span>
              <h2 className="text-3xl font-heritage font-bold text-heritage-dark mt-1">
                Featured Heritage Discoveries
              </h2>
            </div>
            <Link
              to="/archives"
              className="inline-flex items-center text-xs font-bold text-heritage-terracotta hover:text-heritage-terracottaDark transition"
            >
              <span>View All Archives ({analytics?.total_archives ?? 14})</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArchives.map((arc) => (
              <Link
                key={arc.id}
                to={`/archives/${arc.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-heritage-sandstone/40 shadow-sm hover:shadow-heritage transition-all duration-300 flex flex-col"
              >
                <div className="h-44 overflow-hidden relative bg-heritage-navy">
                  <img
                    src={getSafeArchiveImage(arc.file_path, arc.category)}
                    alt={arc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getSafeArchiveImage('', arc.category);
                    }}
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-heritage-dark/80 text-heritage-gold backdrop-blur-xs">
                      {arc.category?.split('&')[0].trim()}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center space-x-1 text-[11px] text-heritage-terracotta font-medium mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{arc.city ? `${arc.city}, ` : ''}{arc.state || 'India'}</span>
                    </div>
                    <h3 className="font-heritage font-bold text-sm text-heritage-dark group-hover:text-heritage-gold transition-colors line-clamp-2">
                      {arc.title}
                    </h3>
                    <p className="text-[11px] text-heritage-navy/70 line-clamp-2 mt-1.5 leading-relaxed">
                      {arc.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-heritage-sandstone/20 flex items-center justify-between text-[11px] text-heritage-sandstone">
                    <span className="text-heritage-dark/60 font-medium">{arc.historical_period?.split('(')[0].trim()}</span>
                    <span className="text-heritage-gold font-semibold group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED CULTURAL STORIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-heritage-terracotta">
              Oral Traditions & History
            </span>
            <h2 className="text-3xl font-heritage font-bold text-heritage-dark mt-1">
              Living Cultural Narratives
            </h2>
          </div>
          <Link
            to="/stories"
            className="inline-flex items-center text-xs font-bold text-heritage-terracotta hover:text-heritage-terracottaDark transition"
          >
            <span>Explore All Stories</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredStories.map((story) => (
            <Link
              key={story.id}
              to={`/stories/${story.slug}`}
              className="group rounded-2xl overflow-hidden bg-white border border-heritage-sandstone/40 shadow-sm hover:shadow-heritage transition-all duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden relative bg-heritage-navy">
                <img
                  src={story.hero_image || 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80'}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-heritage-gold">
                    {story.heritage_location}
                  </span>
                  <h3 className="font-heritage font-bold text-base line-clamp-1">
                    {story.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-heritage-navy/70 leading-relaxed line-clamp-3">
                  {story.summary}
                </p>
                <div className="pt-3 border-t border-heritage-sandstone/20 flex items-center justify-between text-xs text-heritage-terracotta font-semibold">
                  <span>Read Complete Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="bg-heritage-dark text-heritage-ivory py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-heritage-gold/20 text-heritage-gold text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preserve Our Living Heritage</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heritage font-bold text-white">
            Have an Ancient Manuscript or Architectural Photo?
          </h2>
          <p className="text-sm sm:text-base text-heritage-sandstone/80 max-w-2xl mx-auto leading-relaxed">
            Upload your field photographs, PDF papers, or regional language manuscripts. Let our AI pipeline extract epigraphy, georeference coordinates, and integrate it into the collective national archive.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/upload"
              className="px-8 py-3.5 rounded-full bg-heritage-terracotta hover:bg-heritage-terracottaLight text-white font-bold text-sm shadow-md transition"
            >
              Upload Document to Archive
            </Link>
            <Link
              to="/map"
              className="px-8 py-3.5 rounded-full bg-heritage-navy border border-heritage-border text-heritage-ivory hover:text-white font-semibold text-sm transition"
            >
              Explore Geospatial Map
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};


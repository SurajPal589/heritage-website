import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Archive as ArchiveIcon, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Grid, 
  List, 
  Sparkles,
  FileText,
  ArrowRight,
  X
} from 'lucide-react';
import { fetchArchives } from '../lib/api';
import { Archive } from '../types';

export const ArchivesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [archives, setArchives] = useState<Archive[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [sortBy, setSortBy] = useState('date_desc');

  const categories = [
    'Stepwells & Water Architecture',
    'Temple Architecture',
    'Forts & Palaces',
    'Ancient Manuscripts',
    'Traditional Crafts',
    'Buddhist & Jain Heritage',
  ];

  const states = [
    'Gujarat',
    'Rajasthan',
    'Karnataka',
    'Tamil Nadu',
    'Odisha',
    'Maharashtra',
    'Bihar',
    'Madhya Pradesh'
  ];

  const languages = [
    'English',
    'Sanskrit',
    'Hindi',
    'Tamil',
    'Devanagari'
  ];

  const loadData = () => {
    setLoading(true);
    fetchArchives({
      q: searchQuery || undefined,
      category: selectedCategory || undefined,
      state: selectedState || undefined,
      language: selectedLanguage || undefined,
      sort_by: sortBy,
      limit: 50
    })
      .then((res) => {
        setArchives(res.items);
        setTotal(res.total);
        setLoading(false);
      })
      .catch(() => {
        setArchives([]);
        setTotal(0);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedState, selectedLanguage, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedState('');
    setSelectedLanguage('');
    setSortBy('date_desc');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedState || selectedLanguage);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-heritage-sandstone/30 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-terracotta">
            National Cultural Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-heritage font-bold text-heritage-dark mt-1">
            Digital Heritage Archives
          </h1>
          <p className="text-xs text-heritage-navy/70 mt-1">
            Browsing {total} cataloged historical manuscripts, epigraphic surveys, and architectural records.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <div className="bg-white border border-heritage-sandstone/40 p-1 rounded-xl flex items-center shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs ${viewMode === 'grid' ? 'bg-heritage-navy text-heritage-gold' : 'text-heritage-navy/60 hover:text-heritage-dark'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs ${viewMode === 'list' ? 'bg-heritage-navy text-heritage-gold' : 'text-heritage-navy/60 hover:text-heritage-dark'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Link
            to="/upload"
            className="px-3.5 py-2 bg-heritage-terracotta hover:bg-heritage-terracottaLight text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            + New Archive
          </Link>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-5 rounded-2xl border border-heritage-sandstone/40 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by monument name, extracted text, dynasty or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-heritage-cream/40 border border-heritage-sandstone/60 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-heritage-gold"
            />
            <Search className="w-4 h-4 text-heritage-navy/50 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-heritage-navy hover:bg-heritage-surface text-heritage-ivory rounded-xl text-xs font-semibold transition"
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs text-heritage-dark focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* State */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs text-heritage-dark focus:outline-none"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Language */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs text-heritage-dark focus:outline-none"
          >
            <option value="">All Languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs text-heritage-dark focus:outline-none"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Active Filters Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2 pt-2 border-t border-heritage-sandstone/20">
            <span className="text-[11px] text-heritage-navy/60 font-medium">Active filters applied</span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center space-x-1 text-[11px] text-heritage-terracotta hover:underline font-semibold"
            >
              <X className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* ARCHIVES LIST / GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-heritage-sandstone/20 rounded-2xl"></div>
          ))}
        </div>
      ) : archives.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-heritage-sandstone/40 space-y-4">
          <ArchiveIcon className="w-12 h-12 text-heritage-sandstone mx-auto" />
          <h3 className="font-heritage font-bold text-lg text-heritage-dark">
            No matching archives found
          </h3>
          <p className="text-xs text-heritage-navy/70 max-w-md mx-auto">
            Try adjusting your search keywords or resetting category filters to browse all cataloged records.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-heritage-navy text-heritage-ivory rounded-xl text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {archives.map((arc) => (
            <Link
              key={arc.id}
              to={`/archives/${arc.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-heritage-sandstone/40 shadow-sm hover:shadow-heritage transition-all duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden relative bg-heritage-navy">
                <img
                  src={arc.file_path || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80'}
                  alt={arc.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-heritage-dark/85 text-heritage-gold backdrop-blur-xs">
                    {arc.category?.split('&')[0].trim()}
                  </span>
                </div>
                {arc.latitude && arc.longitude && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-900/80 text-emerald-300 backdrop-blur-xs flex items-center space-x-1">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>GPS Verified</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-1 text-[11px] text-heritage-terracotta font-medium mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{arc.city ? `${arc.city}, ` : ''}{arc.state || 'Unlocated Field Record'}</span>
                  </div>
                  <h3 className="font-heritage font-bold text-base text-heritage-dark group-hover:text-heritage-gold transition-colors line-clamp-2">
                    {arc.title}
                  </h3>
                  <p className="text-xs text-heritage-navy/70 line-clamp-2 mt-1 leading-relaxed">
                    {arc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-heritage-sandstone/20 flex items-center justify-between text-[11px] text-heritage-navy/60">
                  <span>{arc.historical_period?.split('(')[0].trim()}</span>
                  <span className="text-heritage-terracotta font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-heritage-sandstone/40 divide-y divide-heritage-sandstone/20 overflow-hidden shadow-sm">
          {archives.map((arc) => (
            <Link
              key={arc.id}
              to={`/archives/${arc.id}`}
              className="p-4 sm:p-5 flex items-center space-x-4 hover:bg-heritage-cream/20 transition group"
            >
              <img
                src={arc.file_path || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=200&q=80'}
                alt={arc.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-heritage-navy shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=200&q=80';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 text-[10px] text-heritage-terracotta font-medium">
                  <span>{arc.category}</span>
                  <span>·</span>
                  <span>{arc.state || 'Field Note'}</span>
                </div>
                <h3 className="font-heritage font-bold text-sm sm:text-base text-heritage-dark group-hover:text-heritage-gold transition-colors truncate">
                  {arc.title}
                </h3>
                <p className="text-xs text-heritage-navy/70 line-clamp-1 mt-0.5">
                  {arc.description}
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end text-xs text-heritage-navy/60 shrink-0">
                <span className="font-medium text-heritage-dark">{arc.language}</span>
                <span className="text-[10px] mt-0.5">{arc.historical_period?.split('(')[0].trim()}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-heritage-terracotta shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};


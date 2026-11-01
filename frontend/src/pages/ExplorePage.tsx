import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Layers, 
  Tag as TagIcon, 
  ArrowRight, 
  CheckCircle, 
  Filter, 
  FileText,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { executeSearch, getSafeArchiveImage } from '../lib/api';
import { SearchResponse, SearchResultItem } from '../types';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Facet Filters
  const [category, setCategory] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [hasCoords, setHasCoords] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState('relevance');

  const exampleQueries = [
    'Find ancient stepwells in Gujarat',
    'Show historical architecture from Rajasthan',
    'Find documents about traditional Indian crafts',
    'Search for historical Devanagari manuscripts',
    'Sun temples with astronomical alignments',
    'Monolithic rock-cut architecture in Maharashtra',
    'Chola granite temples and Tamil epigraphy'
  ];

  const handleSearch = (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : query;
    setLoading(true);

    executeSearch({
      q: q || '',
      category: category || undefined,
      state: state || undefined,
      period: period || undefined,
      language: language || undefined,
      has_coords: hasCoords,
      sort_by: sortBy
    })
      .then((res) => {
        setSearchResponse(res);
        setLoading(false);
      })
      .catch(() => {
        setSearchResponse(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch();
  }, [category, state, period, language, hasCoords, sortBy]);

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setSearchParams({ q: example });
    handleSearch(example);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    handleSearch();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="border-b border-heritage-sandstone/30 pb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-terracotta">
          Natural Language Heritage Engine
        </span>
        <h1 className="text-2xl sm:text-3xl font-heritage font-bold text-heritage-dark mt-1">
          Intelligent Archival Discovery
        </h1>
        <p className="text-xs text-heritage-navy/70 mt-1">
          Search across OCR transcripts, architectural styles, historical periods, and geographic coordinates using natural queries.
        </p>
      </div>

      {/* Main Search Bar & Quick Prompts */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sandstone/40 shadow-sm space-y-5">
        <form onSubmit={handleFormSubmit} className="relative">
          <input
            type="text"
            placeholder="Type a natural question, e.g., 'Find ancient stepwells in Gujarat'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-heritage-cream/30 text-sm sm:text-base text-heritage-dark placeholder-heritage-navy/40 rounded-2xl pl-12 pr-28 py-3.5 border-2 border-heritage-sandstone/70 focus:outline-none focus:border-heritage-gold transition"
          />
          <Search className="w-5 h-5 text-heritage-navy/50 absolute left-4 top-4" />
          <button
            type="submit"
            className="absolute right-2.5 top-2 px-5 py-2 rounded-xl bg-heritage-navy hover:bg-heritage-surface text-heritage-ivory text-xs font-bold transition shadow-xs"
          >
            Discover
          </button>
        </form>

        {/* Example Queries */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-heritage-navy/70 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-heritage-gold" />
            <span>Try Natural Language Queries:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleExampleClick(ex)}
                className="px-3 py-1 rounded-full text-xs bg-heritage-cream/60 hover:bg-heritage-cream text-heritage-navy border border-heritage-sandstone/50 transition-colors"
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>

        {/* Facet Filter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-heritage-sandstone/20">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-heritage-cream/20 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs text-heritage-dark focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Stepwells & Water Architecture">Stepwells & Water</option>
            <option value="Temple Architecture">Temple Architecture</option>
            <option value="Forts & Palaces">Forts & Palaces</option>
            <option value="Ancient Manuscripts">Ancient Manuscripts</option>
            <option value="Traditional Crafts">Traditional Crafts</option>
            <option value="Buddhist & Jain Heritage">Buddhist & Jain</option>
          </select>

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="bg-heritage-cream/20 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs text-heritage-dark focus:outline-none"
          >
            <option value="">All States</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Odisha">Odisha</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Bihar">Bihar</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-heritage-cream/20 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs text-heritage-dark focus:outline-none"
          >
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Sanskrit">Sanskrit</option>
            <option value="Hindi">Hindi / Devanagari</option>
            <option value="Tamil">Tamil</option>
          </select>

          <select
            value={hasCoords === undefined ? '' : hasCoords ? 'true' : 'false'}
            onChange={(e) => {
              if (e.target.value === 'true') setHasCoords(true);
              else if (e.target.value === 'false') setHasCoords(false);
              else setHasCoords(undefined);
            }}
            className="bg-heritage-cream/20 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs text-heritage-dark focus:outline-none"
          >
            <option value="">Any Location Status</option>
            <option value="true">GPS Mapped Only</option>
            <option value="false">Unlocated Notes Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-heritage-cream/20 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs text-heritage-dark focus:outline-none"
          >
            <option value="relevance">Sort: Relevance Score</option>
            <option value="date_desc">Sort: Newest First</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>
        </div>

      </div>

      {/* RESULTS LIST */}
      <div className="space-y-4">
        
        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-heritage-navy/70">
          <span>
            {searchResponse ? `Found ${searchResponse.total} verified historical records` : 'Searching...'}
          </span>
          {searchResponse?.query && (
            <span className="italic">
              Showing results for: <strong className="text-heritage-dark">"{searchResponse.query}"</strong>
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-44 bg-heritage-sandstone/20 rounded-2xl"></div>
            ))}
          </div>
        ) : !searchResponse || searchResponse.results.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-heritage-sandstone/40 space-y-3">
            <Compass className="w-12 h-12 text-heritage-sandstone mx-auto" />
            <h3 className="font-heritage font-bold text-lg text-heritage-dark">
              No matching archival records
            </h3>
            <p className="text-xs text-heritage-navy/70 max-w-md mx-auto">
              We couldn't find matching heritage documents for that query. Try broader keywords like "Stepwells", "Sun Temple", or "Manuscripts".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchResponse.results.map((item) => {
              const { archive, relevance_score, matched_fields, snippet } = item;
              const relevancePct = Math.min(100, Math.round(relevance_score * 8));

              return (
                <div
                  key={archive.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-heritage-sandstone/40 shadow-sm hover:shadow-heritage transition-all duration-200 flex flex-col md:flex-row gap-5"
                >
                  {/* Thumbnail */}
                  <img
                    src={getSafeArchiveImage(archive.file_path, archive.category)}
                    alt={archive.title}
                    className="w-full md:w-48 h-36 rounded-xl object-cover bg-heritage-navy shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getSafeArchiveImage('', archive.category);
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
                    <div>
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-heritage-navy text-heritage-gold">
                          {archive.category}
                        </span>
                        <span className="text-[11px] text-heritage-terracotta font-medium flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{archive.city ? `${archive.city}, ` : ''}{archive.state || 'Field Record'}</span>
                        </span>
                        <span className="text-[11px] text-heritage-navy/60 font-medium">
                          {archive.historical_period}
                        </span>
                      </div>

                      {/* Title */}
                      <Link
                        to={`/archives/${archive.id}`}
                        className="font-heritage font-bold text-base sm:text-lg text-heritage-dark hover:text-heritage-gold transition-colors block"
                      >
                        {archive.title}
                      </Link>

                      {/* Snippet */}
                      <p className="text-xs text-heritage-navy/80 leading-relaxed mt-1 line-clamp-2">
                        {snippet || archive.description}
                      </p>
                    </div>

                    {/* Matched Fields & Relevance */}
                    <div className="pt-3 border-t border-heritage-sandstone/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-heritage-navy/50 font-bold uppercase">Matched in:</span>
                        {matched_fields.map((mf) => (
                          <span
                            key={mf}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-heritage-cream text-heritage-navy font-semibold border border-heritage-sandstone/40"
                          >
                            {mf}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Relevance Indicator */}
                        <div className="flex items-center space-x-1.5 text-[11px]">
                          <span className="text-heritage-navy/60">Relevance:</span>
                          <span className="font-bold text-heritage-terracotta">{relevancePct}%</span>
                        </div>

                        <Link
                          to={`/archives/${archive.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-heritage-navy hover:text-heritage-gold transition"
                        >
                          <span>Open Record</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};


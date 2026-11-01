import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Clock, 
  Layers, 
  Compass, 
  Archive as ArchiveIcon, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { fetchStoryBySlug } from '../lib/api';
import { CulturalStory } from '../types';

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<CulturalStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchStoryBySlug(slug)
      .then((data) => {
        setStory(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-64 bg-heritage-sandstone/20 rounded-3xl"></div>
        <div className="h-8 bg-heritage-sandstone/30 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-heritage-sandstone/20 rounded"></div>
          <div className="h-4 bg-heritage-sandstone/20 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="p-12 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-heritage font-bold">Story not found</h2>
        <p className="text-xs text-heritage-navy/70">{error || 'Unable to locate cultural story.'}</p>
        <Link
          to="/stories"
          className="inline-flex items-center space-x-1 px-4 py-2 bg-heritage-navy text-heritage-ivory rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cultural Stories</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-16 space-y-12">
      
      {/* Hero Cover Header */}
      <div className="relative min-h-[50vh] flex items-end bg-heritage-dark text-heritage-ivory px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute inset-0 z-0">
          <img
            src={story.hero_image || 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1600&q=80'}
            alt={story.title}
            className="w-full h-full object-cover object-center opacity-40 filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark via-heritage-dark/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full space-y-4">
          <Link
            to="/stories"
            className="inline-flex items-center space-x-1.5 text-xs text-heritage-gold font-semibold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Stories Catalog</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-heritage-navy/90 text-heritage-gold border border-heritage-gold/30">
              {story.heritage_location}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-heritage-navy/80 text-heritage-sandstone border border-heritage-border">
              {story.historical_period}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heritage font-extrabold text-white leading-tight">
            {story.title}
          </h1>

          {story.subtitle && (
            <p className="text-base sm:text-lg text-heritage-sandstone/90 font-light italic max-w-3xl">
              "{story.subtitle}"
            </p>
          )}
        </div>
      </div>

      {/* Main Story Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Executive Summary Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-heritage-cream/40 border border-heritage-sandstone/50 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-heritage-terracotta">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-heritage font-bold text-xs uppercase tracking-wider">
              Cultural & Epigraphic Summary
            </span>
          </div>
          <p className="text-sm text-heritage-dark/90 leading-relaxed font-serif">
            {story.summary}
          </p>
        </div>

        {/* Narrative Essay Content */}
        <div className="prose prose-stone max-w-none text-heritage-dark leading-relaxed space-y-6 text-sm sm:text-base">
          {story.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="leading-relaxed font-light text-justify">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Architectural Features Card */}
        {story.architectural_features && (
          <div className="p-6 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-sm space-y-3">
            <h3 className="font-heritage font-bold text-base text-heritage-dark flex items-center space-x-2">
              <Layers className="w-4 h-4 text-heritage-terracotta" />
              <span>Architectural Elements & Engineering</span>
            </h3>
            <p className="text-xs text-heritage-navy/80 leading-relaxed">
              {story.architectural_features}
            </p>
          </div>
        )}

        {/* Historical Timeline */}
        {story.timeline_events && story.timeline_events.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-heritage-sandstone/30 pb-3 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-heritage-gold" />
              <h3 className="font-heritage font-bold text-lg text-heritage-dark">
                Historical Chronology & Milestones
              </h3>
            </div>

            <div className="relative pl-6 border-l-2 border-heritage-gold/50 space-y-8">
              {story.timeline_events.map((t, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-heritage-navy border-2 border-heritage-gold group-hover:scale-125 transition-transform" />
                  <div className="text-xs font-bold text-heritage-terracotta">
                    {t.year}
                  </div>
                  <div className="text-xs sm:text-sm text-heritage-dark/90 mt-0.5 leading-relaxed">
                    {t.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected Archival Records in Database */}
        {story.archives && story.archives.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-heritage-sandstone/30">
            <div className="flex items-center justify-between">
              <h3 className="font-heritage font-bold text-base text-heritage-dark flex items-center space-x-2">
                <ArchiveIcon className="w-4 h-4 text-heritage-navy" />
                <span>Connected Archival Records ({story.archives.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {story.archives.map((arc) => (
                <Link
                  key={arc.id}
                  to={`/archives/${arc.id}`}
                  className="p-4 rounded-2xl bg-white border border-heritage-sandstone/40 hover:shadow-card-warm transition group flex items-start space-x-3"
                >
                  <img
                    src={arc.file_path || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=200&q=80'}
                    alt={arc.title}
                    className="w-14 h-14 rounded-xl object-cover bg-heritage-navy shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-heritage-terracotta uppercase">
                      {arc.category?.split('&')[0].trim()}
                    </span>
                    <h4 className="font-heritage font-bold text-xs text-heritage-dark group-hover:text-heritage-gold transition-colors line-clamp-1">
                      {arc.title}
                    </h4>
                    <p className="text-[10px] text-heritage-navy/60 line-clamp-1 mt-0.5">
                      {arc.historical_period}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-heritage-sandstone shrink-0 self-center group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* References & Provenance */}
        {story.references && (
          <div className="p-4 rounded-xl bg-heritage-cream/30 border border-heritage-sandstone/30 text-[11px] text-heritage-navy/70 space-y-1">
            <span className="font-bold uppercase tracking-wider text-heritage-dark">
              Archival Sources & References:
            </span>
            <p className="leading-relaxed italic">{story.references}</p>
          </div>
        )}

      </div>

    </article>
  );
};


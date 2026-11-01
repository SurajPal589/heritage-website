import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Layers, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { fetchStories } from '../lib/api';
import { CulturalStory } from '../types';

export const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<CulturalStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories()
      .then((data) => {
        setStories(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-heritage-sandstone/30 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-heritage-sandstone/20 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="border-b border-heritage-sandstone/30 pb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-terracotta">
          Curated Archival Narratives
        </span>
        <h1 className="text-2xl sm:text-3xl font-heritage font-bold text-heritage-dark mt-1">
          Digital Cultural Storytelling
        </h1>
        <p className="text-xs text-heritage-navy/70 mt-1">
          Explore narrative historical syntheses connecting oral folklore, epigraphic records, and architectural survey reports.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story) => (
          <Link
            key={story.id}
            to={`/stories/${story.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-heritage-sandstone/40 shadow-sm hover:shadow-heritage-lg transition-all duration-300 flex flex-col"
          >
            {/* Cover Image */}
            <div className="h-64 overflow-hidden relative bg-heritage-navy">
              <img
                src={story.hero_image || 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80'}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark/90 via-heritage-dark/30 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-heritage-dark/85 text-heritage-gold backdrop-blur-xs flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{story.heritage_location}</span>
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-heritage-ivory">
                <span className="text-xs text-heritage-goldLight font-medium">
                  {story.historical_period}
                </span>
                <h2 className="font-heritage font-bold text-xl sm:text-2xl text-white line-clamp-2 mt-0.5">
                  {story.title}
                </h2>
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <p className="font-medium text-xs text-heritage-dark leading-relaxed italic">
                  "{story.subtitle}"
                </p>
                <p className="text-xs text-heritage-navy/70 leading-relaxed line-clamp-3">
                  {story.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-heritage-sandstone/20 flex items-center justify-between text-xs font-semibold text-heritage-terracotta">
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center">
                  <span>Read Full Narrative</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
                <span className="text-[11px] text-heritage-navy/50 font-normal">
                  {story.timeline_events ? `${story.timeline_events.length} Historical Milestones` : 'Archival Story'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};


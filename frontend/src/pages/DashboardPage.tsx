import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Archive as ArchiveIcon, 
  FileText, 
  MapPin, 
  Image as ImageIcon, 
  UploadCloud, 
  Search, 
  Compass, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';
import { fetchAnalytics, getSafeArchiveImage } from '../lib/api';
import { AnalyticsResponse } from '../types';

export const DashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-heritage-sandstone/30 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-heritage-sandstone/20 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-heritage-sandstone/20 rounded-2xl"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-heritage font-bold">Failed to load live platform analytics</h2>
        <p className="text-sm text-heritage-navy/70">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-heritage-terracotta text-white rounded-lg text-xs font-semibold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const {
    total_archives,
    total_digitised_documents,
    total_uploaded_documents,
    total_verified_records,
    total_pending_records,
    total_heritage_locations,
    total_processed_images,
    categories_distribution,
    language_distribution,
    geographic_distribution,
    recent_archives,
    recent_jobs
  } = analytics;

  const effectiveUploadedDocs = total_uploaded_documents ?? (total_digitised_documents + total_processed_images);
  const effectiveVerifiedRecords = total_verified_records ?? total_archives;
  const effectivePendingRecords = total_pending_records ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-heritage-sandstone/30 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-terracotta">
            Real-time Repository Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-heritage font-bold text-heritage-dark mt-1">
            Archival Analytics Dashboard
          </h1>
          <p className="text-xs text-heritage-navy/70 mt-1">
            Computed live from indexed database records and geospatial epigraphy coordinates.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/upload"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracottaLight text-white text-xs font-semibold shadow-sm transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Archive</span>
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-heritage-navy hover:bg-heritage-surface text-heritage-ivory text-xs font-semibold shadow-sm transition"
          >
            <MapPin className="w-4 h-4 text-heritage-gold" />
            <span>Open Map</span>
          </Link>
        </div>
      </div>

      {/* 4 PRIMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-sm hover:shadow-card-warm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-heritage-navy/60">
              Total Heritage Records
            </span>
            <div className="w-9 h-9 rounded-xl bg-heritage-navy text-heritage-gold flex items-center justify-center">
              <ArchiveIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heritage font-bold text-heritage-dark mt-3">
            {total_archives}
          </div>
          <div className="text-[11px] text-heritage-navy/60 mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Persisted in relational storage</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-sm hover:shadow-card-warm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-heritage-navy/60">
              Total Uploaded Docs
            </span>
            <div className="w-9 h-9 rounded-xl bg-heritage-terracotta text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heritage font-bold text-heritage-dark mt-3">
            {effectiveUploadedDocs}
          </div>
          <div className="text-[11px] text-heritage-navy/60 mt-1">
            Historical PDFs & Manuscript Scans
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-sm hover:shadow-card-warm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-heritage-navy/60">
              Verified Records
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heritage font-bold text-emerald-800 mt-3">
            {effectiveVerifiedRecords}
          </div>
          <div className="text-[11px] text-emerald-700/80 mt-1">
            Approved by human archivist
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-heritage-sandstone/40 shadow-sm hover:shadow-card-warm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-heritage-navy/60">
              Pending Verification
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-heritage font-bold text-amber-800 mt-3">
            {effectivePendingRecords}
          </div>
          <div className="text-[11px] text-amber-700/80 mt-1">
            Awaiting archival review
          </div>
        </div>
      </div>

      {/* Empty State when no records exist */}
      {total_archives === 0 && (
        <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-heritage-sandstone/40 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-heritage-cream flex items-center justify-center text-heritage-terracotta">
            <ArchiveIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heritage font-bold text-heritage-dark">
            No Archival Heritage Records Found
          </h2>
          <p className="text-sm text-heritage-navy/70 max-w-md mx-auto">
            Your repository is currently empty. Upload historical manuscripts, photographs, or architectural field reports to initiate AI text extraction and geospatial mapping.
          </p>
          <div className="pt-2">
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracottaLight text-white text-xs font-bold shadow-md transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Your First Heritage Document</span>
            </Link>
          </div>
        </div>
      )}

      {/* DISTRIBUTION & ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Categories Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-heritage-sandstone/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heritage font-bold text-base text-heritage-dark">
              Heritage Categories
            </h3>
            <span className="text-[10px] text-heritage-navy/50 font-bold uppercase">
              {Object.keys(categories_distribution).length} Types
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(categories_distribution).map(([cat, count]) => {
              const percentage = Math.round((count / (total_archives || 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-heritage-navy truncate pr-2">{cat}</span>
                    <span className="text-heritage-navy/70 font-semibold">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-heritage-cream overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-heritage-terracotta to-heritage-gold"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language & Epigraphy Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-heritage-sandstone/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heritage font-bold text-base text-heritage-dark">
              Language & Script Breakdown
            </h3>
            <span className="text-[10px] text-heritage-navy/50 font-bold uppercase">
              Bilingual OCR
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(language_distribution).map(([lang, count]) => {
              const percentage = Math.round((count / (total_archives || 1)) * 100);
              return (
                <div key={lang} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-heritage-navy truncate pr-2">{lang}</span>
                    <span className="text-heritage-navy/70 font-semibold">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-heritage-cream overflow-hidden">
                    <div
                      className="h-full rounded-full bg-heritage-navy"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-heritage-sandstone/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heritage font-bold text-base text-heritage-dark">
              Geographic Distribution
            </h3>
            <Link to="/map" className="text-[11px] text-heritage-terracotta font-semibold hover:underline">
              View on Map
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(geographic_distribution).map(([stateName, count]) => {
              const percentage = Math.round((count / (total_archives || 1)) * 100);
              return (
                <div key={stateName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-heritage-navy truncate pr-2">{stateName}</span>
                    <span className="text-heritage-navy/70 font-semibold">{count} sites</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-heritage-cream overflow-hidden">
                    <div
                      className="h-full rounded-full bg-heritage-sage"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RECENT ARCHIVES & PROCESSING JOBS ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recently Uploaded Archives */}
        <div className="bg-white rounded-2xl p-6 border border-heritage-sandstone/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heritage font-bold text-base text-heritage-dark">
                Recently Archived Records
              </h3>
              <p className="text-[11px] text-heritage-navy/60">
                Latest verified records added to the database
              </p>
            </div>
            <Link
              to="/archives"
              className="text-xs font-bold text-heritage-terracotta hover:underline inline-flex items-center"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-3 divide-y divide-heritage-sandstone/20">
            {recent_archives.map((arc) => (
              <div key={arc.id} className="pt-3 first:pt-0 flex items-start space-x-3 group">
                <img
                  src={getSafeArchiveImage(arc.file_path, arc.category)}
                  alt={arc.title}
                  className="w-12 h-12 rounded-lg object-cover bg-heritage-navy shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getSafeArchiveImage('', arc.category);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/archives/${arc.id}`}
                    className="font-heritage font-bold text-xs text-heritage-dark group-hover:text-heritage-gold transition-colors line-clamp-1"
                  >
                    {arc.title}
                  </Link>
                  <div className="flex items-center space-x-2 text-[10px] text-heritage-navy/60 mt-0.5">
                    <span>{arc.state || 'India'}</span>
                    <span>·</span>
                    <span>{arc.category?.split('&')[0].trim()}</span>
                  </div>
                  <p className="text-[10px] text-heritage-navy/70 line-clamp-1 mt-0.5">
                    {arc.historical_period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Processing Pipeline Activity */}
        <div className="bg-white rounded-2xl p-6 border border-heritage-sandstone/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heritage font-bold text-base text-heritage-dark">
                Processing Pipeline Activity
              </h3>
              <p className="text-[11px] text-heritage-navy/60">
                Real-time OCR & AI extraction jobs
              </p>
            </div>
            <Link
              to="/processing"
              className="text-xs font-bold text-heritage-gold hover:underline inline-flex items-center"
            >
              <span>Processing Centre</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-3 divide-y divide-heritage-sandstone/20">
            {recent_jobs.length === 0 ? (
              <div className="text-center py-8 text-xs text-heritage-navy/60">
                No active extraction jobs currently running.
                <div className="mt-2">
                  <Link to="/upload" className="text-heritage-terracotta font-semibold hover:underline">
                    Upload an archival document
                  </Link>
                </div>
              </div>
            ) : (
              recent_jobs.slice(0, 5).map((job) => (
                <div key={job.job_uuid} className="pt-3 first:pt-0 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-xs text-heritage-dark truncate">
                      {job.file_name}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-heritage-navy/60 mt-0.5">
                      <span className="uppercase">{job.file_type}</span>
                      <span>·</span>
                      <span>{job.ocr_engine}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      job.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      job.status === 'extracting' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                      job.status === 'failed' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {job.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {job.status === 'extracting' && <Clock className="w-3 h-3" />}
                      {job.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                      <span className="capitalize">{job.status}</span>
                    </span>
                    <Link
                      to={`/processing?job=${job.job_uuid}`}
                      className="text-[11px] text-heritage-navy font-semibold hover:text-heritage-gold"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};


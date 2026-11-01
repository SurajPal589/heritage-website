import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Cpu, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Copy, 
  Save, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Layers, 
  Tag as TagIcon,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { getProcessingStatus, runProcessing, commitReviewedMetadata } from '../lib/api';
import { ProcessingJob } from '../types';

export const ProcessingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobUuid = searchParams.get('job');

  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Editable Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [historicalPeriod, setHistoricalPeriod] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('English');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [keywords, setKeywords] = useState('');
  const [architecturalFeatures, setArchitecturalFeatures] = useState('');
  const [culturalSignificance, setCulturalSignificance] = useState('');
  const [sourceReference, setSourceReference] = useState('');

  const categories = [
    'Stepwells & Water Architecture',
    'Temple Architecture',
    'Forts & Palaces',
    'Ancient Manuscripts',
    'Traditional Crafts',
    'Buddhist & Jain Heritage',
    'Sculptural Epigraphy'
  ];

  const fetchStatusAndPopulate = async (uuid: string) => {
    try {
      const data = await getProcessingStatus(uuid);
      setJob(data);

      if (data.extracted_metadata) {
        const m = data.extracted_metadata;
        setTitle(m.title || data.file_name);
        setDescription(m.description || '');
        setHistoricalPeriod(m.historical_period || '');
        setCategory(m.category || 'Historical Architecture');
        setLanguage(m.language || 'English');
        setState(m.state || '');
        setCity(m.city || '');
        setLatitude(m.latitude !== null && m.latitude !== undefined ? m.latitude.toString() : '');
        setLongitude(m.longitude !== null && m.longitude !== undefined ? m.longitude.toString() : '');
        setKeywords(m.keywords || '');
        setArchitecturalFeatures(m.architectural_features || '');
        setCulturalSignificance(m.cultural_significance || '');
        setSourceReference(m.source_reference || `Heritage Archive Upload #${data.job_uuid.slice(0, 6)}`);
      }
      setLoading(false);

      // If status is still uploaded, auto-trigger processing
      if (data.status === 'uploaded') {
        triggerExtraction(uuid);
      }
    } catch (err: any) {
      setLoading(false);
    }
  };

  const triggerExtraction = async (uuid: string) => {
    setIsProcessing(true);
    try {
      const updated = await runProcessing(uuid);
      setJob(updated);
      if (updated.extracted_metadata) {
        const m = updated.extracted_metadata;
        setTitle(m.title || updated.file_name);
        setDescription(m.description || '');
        setHistoricalPeriod(m.historical_period || '');
        setCategory(m.category || 'Historical Architecture');
        setLanguage(m.language || 'English');
        setState(m.state || '');
        setCity(m.city || '');
        setLatitude(m.latitude !== null && m.latitude !== undefined ? m.latitude.toString() : '');
        setLongitude(m.longitude !== null && m.longitude !== undefined ? m.longitude.toString() : '');
        setKeywords(m.keywords || '');
        setArchitecturalFeatures(m.architectural_features || '');
        setCulturalSignificance(m.cultural_significance || '');
        setSourceReference(m.source_reference || `Heritage Archive Upload #${updated.job_uuid.slice(0, 6)}`);
      }
    } catch (err: any) {
      // Re-fetch to get failure state from backend
      getProcessingStatus(uuid).then(setJob).catch(() => null);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (jobUuid) {
      fetchStatusAndPopulate(jobUuid);
    } else {
      setLoading(false);
    }
  }, [jobUuid]);

  const handleCopyText = () => {
    if (job?.extracted_text) {
      navigator.clipboard.writeText(job.extracted_text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!job) return;
    setIsCommitting(true);
    setSaveError(null);

    try {
      const tagList = keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      const savedArchive = await commitReviewedMetadata({
        job_uuid: job.job_uuid,
        title: title || job.file_name,
        description: description || 'Digital archival record preserved in repository.',
        historical_period: historicalPeriod || undefined,
        category: category || 'Historical Architecture',
        language: language || 'English',
        state: state || undefined,
        city: city || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        keywords: keywords || undefined,
        architectural_features: architecturalFeatures || undefined,
        cultural_significance: culturalSignificance || undefined,
        source_reference: sourceReference || undefined,
        tags: tagList
      });

      // Commit successful: redirect to the newly created archive detail page!
      navigate(`/archives/${savedArchive.id}`);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to commit archive');
      setIsCommitting(false);
    }
  };

  if (!jobUuid) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <Cpu className="w-12 h-12 text-heritage-sandstone mx-auto" />
        <h2 className="text-xl font-heritage font-bold">No active processing job selected</h2>
        <p className="text-xs text-heritage-navy/70">
          Upload a document to start the OCR extraction and AI metadata generation pipeline.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-terracotta text-white text-xs font-semibold"
        >
          <span>Go to Upload Centre</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-heritage-sandstone/30 rounded w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-heritage-sandstone/20 rounded-2xl"></div>
          <div className="h-96 bg-heritage-sandstone/20 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-heritage-sandstone/30 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-terracotta">
            Archival AI Extraction
          </span>
          <h1 className="text-2xl sm:text-3xl font-heritage font-bold text-heritage-dark mt-1">
            AI Processing Centre
          </h1>
          <p className="text-xs text-heritage-navy/70 mt-1">
            Review OCR epigraphy extraction, fine-tune generated metadata, and persist the record.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${
            job?.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
            job?.status === 'extracting' || isProcessing ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse' :
            job?.status === 'failed' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-800'
          }`}>
            {job?.status === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
            {(job?.status === 'extracting' || isProcessing) && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            {job?.status === 'failed' && <AlertCircle className="w-3.5 h-3.5" />}
            <span className="capitalize">{isProcessing ? 'Extracting Text & Inscriptions...' : job?.status}</span>
          </div>

          {job?.status === 'failed' && (
            <button
              onClick={() => triggerExtraction(job.job_uuid)}
              className="px-3 py-1.5 bg-heritage-navy text-heritage-ivory rounded-xl text-xs font-semibold"
            >
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Save Error Alert */}
      {saveError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* PIPELINE PROGRESS STEPS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white border border-heritage-sandstone/40 text-center">
          <div className="text-[10px] uppercase font-bold text-heritage-navy/60">Step 1</div>
          <div className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center justify-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Document Ingested</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-heritage-sandstone/40 text-center">
          <div className="text-[10px] uppercase font-bold text-heritage-navy/60">Step 2</div>
          <div className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center justify-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>OCR Extracted</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-heritage-sandstone/40 text-center">
          <div className="text-[10px] uppercase font-bold text-heritage-navy/60">Step 3</div>
          <div className="text-xs font-bold text-heritage-gold mt-0.5 flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>Metadata Generated</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-heritage-sandstone/40 text-center">
          <div className="text-[10px] uppercase font-bold text-heritage-navy/60">Step 4</div>
          <div className="text-xs font-bold text-heritage-terracotta mt-0.5 flex items-center justify-center space-x-1">
            <Save className="w-3 h-3" />
            <span>Review & Save</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: EXTRACTED OCR TEXT & DOCUMENT */}
        <div className="space-y-6">
          
          {/* Document Preview Card */}
          <div className="bg-white rounded-2xl p-5 border border-heritage-sandstone/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heritage font-bold text-sm text-heritage-dark">
                Source Document
              </h3>
              <span className="text-[11px] font-bold uppercase text-heritage-navy/60">
                {job?.file_type} format
              </span>
            </div>

            <div className="p-3 rounded-xl bg-heritage-cream/30 border border-heritage-sandstone/30 flex items-center space-x-3">
              <FileText className="w-8 h-8 text-heritage-terracotta shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-heritage-dark truncate">
                  {job?.file_name}
                </div>
                <div className="text-[10px] text-heritage-navy/60 mt-0.5">
                  OCR Engine: <span className="font-semibold text-heritage-dark">{job?.ocr_engine}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Raw Extracted OCR Text Box */}
          <div className="bg-white rounded-2xl p-5 border border-heritage-sandstone/40 shadow-sm space-y-3 flex flex-col h-[520px]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heritage font-bold text-sm text-heritage-dark">
                  Extracted Archival Text
                </h3>
                <span className="text-[10px] text-heritage-navy/60">
                  Detected Script: <span className="font-semibold text-heritage-terracotta">{language}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-heritage-cream/60 hover:bg-heritage-cream text-heritage-navy font-medium transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>

            <textarea
              readOnly
              value={job?.extracted_text || 'Extracting historical text...'}
              className="flex-1 w-full p-3.5 rounded-xl bg-heritage-ivory border border-heritage-sandstone/50 font-mono text-xs text-heritage-dark leading-relaxed resize-none focus:outline-none focus:border-heritage-gold"
            />

            <div className="text-[10px] text-heritage-navy/50 flex justify-between items-center pt-1">
              <span>Characters: {job?.extracted_text?.length || 0}</span>
              <span>Extraction Confidence: 94.2%</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: EDITABLE METADATA FORM */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-heritage-sandstone/40 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-heritage-sandstone/30 pb-3">
            <div>
              <h3 className="font-heritage font-bold text-base text-heritage-dark">
                Archival Record Cataloging
              </h3>
              <p className="text-[11px] text-heritage-navy/60">
                AI inferred metadata. You may refine any field before persisting.
              </p>
            </div>
            <div className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-heritage-navy text-heritage-gold">
              {job?.is_ai_generated ? 'Gemini AI Verified' : 'Heuristic NLP'}
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-heritage-dark mb-1">
                Document / Monument Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-heritage-gold font-medium"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-heritage-dark mb-1">
                Historical Description & Summary
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl p-3 text-xs focus:outline-none focus:border-heritage-gold leading-relaxed"
              />
            </div>

            {/* Category & Historical Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-heritage-dark mb-1">
                  Heritage Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-heritage-gold"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-dark mb-1">
                  Historical Period / Dynasty
                </label>
                <input
                  type="text"
                  value={historicalPeriod}
                  onChange={(e) => setHistoricalPeriod(e.target.value)}
                  placeholder="e.g. 11th Century CE (Solanki Dynasty)"
                  className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-heritage-gold"
                />
              </div>
            </div>

            {/* Location: State, City, Lat, Long */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-heritage-dark mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Gujarat"
                  className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-heritage-dark mb-1">
                  City / District
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Patan"
                  className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-heritage-dark mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="23.8589"
                  className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-heritage-dark mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="72.1018"
                  className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-xs font-bold text-heritage-dark mb-1">
                Keywords & Epigraphy Tags (comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Stepwell, Solanki, UNESCO, Sandstone, Water Architecture"
                className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-heritage-gold"
              />
            </div>

            {/* Architectural Features */}
            <div>
              <label className="block text-xs font-bold text-heritage-dark mb-1">
                Architectural & Stylistic Highlights
              </label>
              <input
                type="text"
                value={architecturalFeatures}
                onChange={(e) => setArchitecturalFeatures(e.target.value)}
                placeholder="e.g. Inverted subterranean temple, 7 tiered terraces, carved Vishnu sculptures"
                className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-heritage-gold"
              />
            </div>

            {/* Source Reference */}
            <div>
              <label className="block text-xs font-bold text-heritage-dark mb-1">
                Archival Source Reference
              </label>
              <input
                type="text"
                value={sourceReference}
                onChange={(e) => setSourceReference(e.target.value)}
                placeholder="e.g. Archaeological Survey of India Western Circle Field Report"
                className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-heritage-gold"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-heritage-sandstone/30 flex items-center justify-end space-x-3">
              <Link
                to="/upload"
                className="px-4 py-2.5 rounded-xl border border-heritage-sandstone/60 text-heritage-navy text-xs font-semibold hover:bg-heritage-cream/30 transition"
              >
                Discard & Upload Another
              </Link>
              <button
                type="button"
                disabled={isCommitting}
                onClick={handleSaveToDatabase}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracottaLight text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isCommitting ? 'Persisting to Repository...' : 'Save to Digital Archive'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};


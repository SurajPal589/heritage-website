import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Archive as ArchiveIcon, 
  MapPin, 
  Calendar, 
  FileText, 
  Tag as TagIcon, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { fetchArchiveById, updateArchive, deleteArchive } from '../lib/api';
import { Archive } from '../types';

export const ArchiveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [archive, setArchive] = useState<Archive | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPeriod, setEditPeriod] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal State
  const [isDeleting, setIsDeleting] = useState(false);

  // Mini Map
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const loadArchive = () => {
    if (!id) return;
    setLoading(true);
    fetchArchiveById(parseInt(id, 10))
      .then((data) => {
        setArchive(data);
        setEditTitle(data.title);
        setEditDesc(data.description || '');
        setEditPeriod(data.historical_period || '');
        setEditCategory(data.category || '');
        setEditKeywords(data.keywords || '');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadArchive();
  }, [id]);

  // Initialize Mini Map when coordinates exist
  useEffect(() => {
    if (!archive || !archive.latitude || !archive.longitude || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [archive.latitude, archive.longitude],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(map);

    const iconHtml = `
      <div style="
        width: 28px; 
        height: 28px; 
        background: #bf533b; 
        border: 2px solid #ffffff; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      "></div>
    `;
    const icon = L.divIcon({
      html: iconHtml,
      className: 'mini-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    });

    L.marker([archive.latitude, archive.longitude], { icon }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [archive]);

  const handleCopyOcr = () => {
    if (archive?.extracted_text) {
      navigator.clipboard.writeText(archive.extracted_text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleSaveEdit = async () => {
    if (!archive) return;
    setIsSaving(true);
    try {
      const updated = await updateArchive(archive.id, {
        title: editTitle,
        description: editDesc,
        historical_period: editPeriod,
        category: editCategory,
        keywords: editKeywords,
      });
      setArchive(updated);
      setIsEditing(false);
      setIsSaving(false);
    } catch (err: any) {
      alert('Failed to update: ' + err.message);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!archive) return;
    try {
      await deleteArchive(archive.id);
      navigate('/archives');
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 bg-heritage-sandstone/30 rounded w-1/4"></div>
        <div className="h-80 bg-heritage-sandstone/20 rounded-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-heritage-sandstone/20 rounded-2xl"></div>
          <div className="h-64 bg-heritage-sandstone/20 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !archive) {
    return (
      <div className="p-12 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-heritage font-bold">Archive Record Not Found</h2>
        <p className="text-xs text-heritage-navy/70">{error || 'The requested archive does not exist.'}</p>
        <Link
          to="/archives"
          className="inline-flex items-center space-x-1 px-4 py-2 bg-heritage-navy text-heritage-ivory rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Archives</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-heritage-sandstone/30 pb-4">
        <Link
          to="/archives"
          className="inline-flex items-center space-x-1.5 text-xs text-heritage-terracotta font-semibold hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Digital Archives</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-heritage-sandstone/60 text-heritage-navy text-xs font-semibold hover:bg-heritage-cream/40 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Metadata</span>
          </button>
          <button
            onClick={() => setIsDeleting(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Hero Record Banner */}
      <div className="bg-white rounded-3xl overflow-hidden border border-heritage-sandstone/40 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left: High-Res Image / Document Preview */}
        <div className="lg:col-span-5 h-72 sm:h-96 lg:h-auto relative bg-heritage-navy overflow-hidden">
          <img
            src={archive.file_path || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80'}
            alt={archive.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-heritage-dark/85 text-heritage-gold backdrop-blur-xs">
              {archive.category}
            </span>
            {archive.latitude && archive.longitude && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-900/80 text-emerald-300 backdrop-blur-xs flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Georeferenced</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Primary Metadata */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-heritage-terracotta font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{archive.city ? `${archive.city}, ` : ''}{archive.state || 'Unlocated Field Observation'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heritage font-bold text-heritage-dark">
                {archive.title}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-heritage-navy/80 leading-relaxed font-light">
              {archive.description}
            </p>

            {/* Quick Metadata Table */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-heritage-cream/30 border border-heritage-sandstone/40 text-xs">
              <div>
                <span className="text-heritage-navy/50 font-medium block">Historical Period</span>
                <span className="font-bold text-heritage-dark">{archive.historical_period || 'Unspecified'}</span>
              </div>
              <div>
                <span className="text-heritage-navy/50 font-medium block">Language / Script</span>
                <span className="font-bold text-heritage-dark">{archive.language || 'English'}</span>
              </div>
              <div>
                <span className="text-heritage-navy/50 font-medium block">Coordinates</span>
                <span className="font-mono text-heritage-dark font-semibold">
                  {archive.latitude && archive.longitude 
                    ? `${archive.latitude.toFixed(4)}°N, ${archive.longitude.toFixed(4)}°E` 
                    : 'GPS Verification Pending'}
                </span>
              </div>
              <div>
                <span className="text-heritage-navy/50 font-medium block">Original Source File</span>
                <span className="font-mono text-heritage-dark text-[11px] truncate block">
                  {archive.original_filename || 'survey_document.pdf'}
                </span>
              </div>
            </div>

            {/* Keywords */}
            {archive.keywords && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-heritage-navy/60">
                  Epigraphy & Architecture Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {archive.keywords.split(',').map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md text-[11px] bg-heritage-cream/70 text-heritage-navy font-medium border border-heritage-sandstone/30"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-heritage-sandstone/20 text-[11px] text-heritage-navy/50 flex justify-between items-center">
            <span>Archival Record #{archive.id}</span>
            <span>Created: {new Date(archive.created_at).toLocaleDateString()}</span>
          </div>
        </div>

      </div>

      {/* EXTRACTED OCR TEXT & MAP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Full OCR Transcribed Text */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-heritage-sandstone/40 shadow-sm space-y-4 flex flex-col h-72 sm:h-96 lg:h-[460px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-heritage-terracotta" />
              <h3 className="font-heritage font-bold text-base text-heritage-dark">
                Extracted Archival Text (OCR)
              </h3>
            </div>
            <button
              onClick={handleCopyOcr}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-heritage-cream/60 hover:bg-heritage-cream text-heritage-navy text-xs font-semibold transition"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

          <textarea
            readOnly
            value={archive.extracted_text || 'No extracted text recorded.'}
            className="flex-1 w-full p-4 rounded-2xl bg-heritage-ivory border border-heritage-sandstone/50 font-mono text-xs text-heritage-dark leading-relaxed resize-none focus:outline-none"
          />

          <div className="text-[11px] text-heritage-navy/60 italic">
            Transcribed via {archive.extracted_texts?.[0]?.ocr_engine || 'Tesseract / PyPDF Native OCR Engine'}.
          </div>
        </div>

        {/* Location Map & Source Provenance */}
        <div className="space-y-6">
          
          {/* Mini Geospatial Map */}
          <div className="bg-white rounded-3xl p-6 border border-heritage-sandstone/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heritage font-bold text-base text-heritage-dark flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-heritage-terracotta" />
                <span>Geographic Location</span>
              </h3>
              {archive.latitude && archive.longitude && (
                <Link
                  to="/map"
                  className="text-xs font-bold text-heritage-terracotta hover:underline inline-flex items-center space-x-1"
                >
                  <span>Open Interactive Map</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            {archive.latitude && archive.longitude ? (
              <div className="h-44 rounded-2xl overflow-hidden border border-heritage-sandstone/40 relative">
                <div ref={mapContainerRef} className="w-full h-full" />
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-heritage-cream/40 border border-heritage-sandstone/40 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <div className="text-xs font-bold text-heritage-dark">Coordinates Pending Verification</div>
                <p className="text-[11px] text-heritage-navy/70 max-w-sm mx-auto">
                  This record is documented in the unlocated queue. Add latitude and longitude via the edit modal to place it on the map.
                </p>
              </div>
            )}
          </div>

          {/* Source Citation & Provenance */}
          <div className="bg-white rounded-3xl p-6 border border-heritage-sandstone/40 shadow-sm space-y-3">
            <h3 className="font-heritage font-bold text-base text-heritage-dark flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-heritage-gold" />
              <span>Archival Citation & Provenance</span>
            </h3>
            <p className="text-xs text-heritage-navy/80 leading-relaxed font-serif italic">
              "{archive.source_reference || 'National Heritage Documentation Cell, Archaeological Survey of India'}"
            </p>
            <div className="text-[11px] text-heritage-navy/50 pt-2 border-t border-heritage-sandstone/20">
              Verified by HeritageVerse AI Ingestion Engine.
            </div>
          </div>

        </div>

      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-heritage-sandstone/60 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-heritage-sandstone/30 pb-3">
              <h3 className="font-heritage font-bold text-lg text-heritage-dark">
                Edit Archive Metadata
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-heritage-navy/60 hover:text-heritage-dark p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-heritage-dark mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-dark mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-heritage-dark mb-1">Category</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-heritage-dark mb-1">Historical Period</label>
                  <input
                    type="text"
                    value={editPeriod}
                    onChange={(e) => setEditPeriod(e.target.value)}
                    className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-heritage-dark mb-1">Keywords</label>
                <input
                  type="text"
                  value={editKeywords}
                  onChange={(e) => setEditKeywords(e.target.value)}
                  className="w-full bg-heritage-cream/30 border border-heritage-sandstone/60 rounded-xl p-2 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-heritage-sandstone/30 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-heritage-sandstone/60 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isSaving}
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-heritage-terracotta text-white text-xs font-bold shadow-xs"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-heritage-sandstone/60 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-heritage font-bold text-lg text-heritage-dark">
              Delete Archival Record?
            </h3>
            <p className="text-xs text-heritage-navy/70">
              Are you sure you want to permanently delete <strong className="text-heritage-dark">"{archive.title}"</strong>? This will remove associated extracted OCR text and files.
            </p>
            <div className="pt-3 flex justify-center space-x-3">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 rounded-xl border border-heritage-sandstone/60 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


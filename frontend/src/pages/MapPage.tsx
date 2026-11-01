import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Layers, 
  Search, 
  Filter, 
  Compass, 
  AlertTriangle, 
  ExternalLink, 
  ArrowRight,
  Info,
  ChevronRight,
  Building
} from 'lucide-react';
import { fetchGeospatialData } from '../lib/api';
import { GeospatialResponse, LocationMarker, Archive } from '../types';

export const MapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [geoData, setGeoData] = useState<GeospatialResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<LocationMarker | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [showUnlocatedDrawer, setShowUnlocatedDrawer] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered on India (approx 21.7°N, 78.9°E)
    const map = L.map(mapContainerRef.current, {
      center: [22.5, 78.9],
      zoom: 5,
      zoomControl: true,
      minZoom: 4,
      maxZoom: 18,
    });

    // Elegant CartoDB Positron / OSM Parchment Basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Fetch geospatial data
  useEffect(() => {
    fetchGeospatialData()
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Update Markers on filter change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !geoData) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    const filtered = geoData.markers.filter((m) => {
      if (selectedCategory && m.monument_type !== selectedCategory) return false;
      if (selectedState && m.state !== selectedState) return false;
      return true;
    });

    filtered.forEach((m) => {
      // Create Custom SVG Terracotta & Gold Pin
      const iconHtml = `
        <div style="
          width: 32px; 
          height: 32px; 
          background: #bf533b; 
          border: 2px solid #ffffff; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg); 
          box-shadow: 0 4px 12px rgba(12,21,36,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <div style="
            width: 10px; 
            height: 10px; 
            background: #e8dcc4; 
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-heritage-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([m.latitude, m.longitude], { icon: customIcon });

      // Click opens sidebar preview
      marker.on('click', () => {
        setSelectedMarker(m);
      });

      // Marker Popup
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="font-family: inherit; width: 220px; padding: 2px;">
          <img src="${m.sample_thumbnail || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=300&q=80'}" 
               style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: #bf533b;">
            ${m.monument_type || 'Monument'}
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #0c1524; margin-bottom: 4px;">
            ${m.name}
          </div>
          <div style="font-size: 11px; color: #4b5563; margin-bottom: 8px;">
            ${m.city ? m.city + ', ' : ''}${m.state} · ${m.archive_count} Archive${m.archive_count > 1 ? 's' : ''}
          </div>
          <a href="/archives/${m.archives[0]?.id || ''}" 
             style="display: block; text-align: center; background: #0c1524; color: #ffffff; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
            Open Archive Detail &rarr;
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      layer.addLayer(marker);
    });

  }, [geoData, selectedCategory, selectedState]);

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

  const zoomToMarker = (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 12, { duration: 1.2 });
    }
  };

  return (
    <div className="relative h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-heritage-ivory">
      
      {/* Top Floating Filter Bar */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-heritage-sandstone/50 shadow-heritage">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-heritage-navy text-heritage-gold flex items-center justify-center shrink-0">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h1 className="font-heritage font-bold text-xs sm:text-sm text-heritage-dark truncate">
                Geospatial Heritage Map
              </h1>
              <p className="text-[9px] sm:text-[10px] text-heritage-navy/60 truncate">
                {geoData?.total_locations || 0} Sites · {geoData?.total_mapped_archives || 0} Verified Monuments
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="sm:hidden px-2.5 py-1 rounded-xl bg-heritage-cream/60 border border-heritage-sandstone/60 text-heritage-navy text-xs font-semibold flex items-center space-x-1"
            >
              <Filter className="w-3 h-3" />
              <span>Filters</span>
            </button>

            {/* Desktop Direct Selects */}
            <div className="hidden sm:flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-heritage-cream/40 border border-heritage-sandstone/60 rounded-xl px-2.5 py-1 text-xs text-heritage-dark focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-heritage-cream/40 border border-heritage-sandstone/60 rounded-xl px-2.5 py-1 text-xs text-heritage-dark focus:outline-none"
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Unlocated Archives Drawer Toggle */}
            <button
              onClick={() => setShowUnlocatedDrawer(!showUnlocatedDrawer)}
              className="px-2.5 sm:px-3 py-1 rounded-xl bg-heritage-navy hover:bg-heritage-surface text-heritage-gold text-[11px] sm:text-xs font-semibold flex items-center space-x-1 sm:space-x-1.5 transition shadow-xs shrink-0"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="hidden xs:inline">Unlocated ({geoData?.unlocated_archives.length || 0})</span>
              <span className="xs:hidden">Notes ({geoData?.unlocated_archives.length || 0})</span>
            </button>
          </div>
        </div>

        {/* Mobile Expanded Filters Accordion */}
        {showFiltersMobile && (
          <div className="sm:hidden grid grid-cols-2 gap-2 pt-2.5 mt-2 border-t border-heritage-sandstone/30 animate-fade-in">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-heritage-cream/40 border border-heritage-sandstone/60 rounded-xl px-2 py-1.5 text-xs text-heritage-dark focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-heritage-cream/40 border border-heritage-sandstone/60 rounded-xl px-2 py-1.5 text-xs text-heritage-dark focus:outline-none"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full z-10 touch-pan-y" />

      {/* Selected Monument Inspector: Responsive Bottom Sheet on Mobile / Floating Card on Desktop */}
      {selectedMarker && (
        <div className="fixed inset-x-0 bottom-16 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-96 z-30 bg-white/98 backdrop-blur-lg p-4 sm:p-5 rounded-t-3xl sm:rounded-2xl border-t sm:border border-heritage-sandstone/60 shadow-2xl space-y-3 animate-fade-in max-h-[70vh] flex flex-col">
          {/* Mobile Sheet Grab Indicator */}
          <div className="w-10 h-1 bg-heritage-sandstone/70 rounded-full mx-auto sm:hidden shrink-0" />

          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-heritage-terracotta tracking-wider">
                {selectedMarker.monument_type}
              </span>
              <h3 className="font-heritage font-bold text-sm sm:text-base text-heritage-dark truncate">
                {selectedMarker.name}
              </h3>
              <p className="text-[11px] text-heritage-navy/60 truncate">
                {selectedMarker.city ? `${selectedMarker.city}, ` : ''}{selectedMarker.state} · GPS [{selectedMarker.latitude.toFixed(4)}, {selectedMarker.longitude.toFixed(4)}]
              </p>
            </div>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-heritage-navy/50 hover:text-heritage-dark p-1.5 rounded-lg text-xs bg-heritage-cream/50 sm:bg-transparent shrink-0"
              aria-label="Close Inspector"
            >
              ✕
            </button>
          </div>

          <img
            src={selectedMarker.sample_thumbnail || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=400&q=80'}
            alt={selectedMarker.name}
            className="w-full h-28 sm:h-32 rounded-xl object-cover shrink-0"
          />

          <div className="space-y-1.5 overflow-y-auto max-h-36 pr-1">
            <span className="text-[10px] font-bold uppercase text-heritage-navy/60">
              Connected Archival Records ({selectedMarker.archives.length}):
            </span>
            {selectedMarker.archives.map((a) => (
              <Link
                key={a.id}
                to={`/archives/${a.id}`}
                className="p-2 rounded-lg bg-heritage-cream/30 hover:bg-heritage-cream/70 flex items-center justify-between text-xs text-heritage-dark transition active:scale-[0.98]"
              >
                <span className="truncate pr-2">{a.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-heritage-terracotta shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Floating Map Legend (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-heritage-sandstone/50 shadow-md text-xs space-y-2 hidden md:block">
        <div className="font-bold text-[11px] text-heritage-dark font-heritage">
          Geospatial Map Legend
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-heritage-navy/70">
          <span className="w-3 h-3 rounded-full bg-heritage-terracotta inline-block shadow-xs"></span>
          <span>Verified Monument Location</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-heritage-navy/70">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-xs"></span>
          <span>GPS Epigraphy Ground-Truth</span>
        </div>
      </div>

      {/* Unlocated Archives Drawer */}
      {showUnlocatedDrawer && (
        <div className="absolute inset-y-0 right-0 z-30 w-full sm:w-96 bg-white border-l border-heritage-sandstone/60 shadow-2xl p-6 flex flex-col justify-between animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-heritage-sandstone/30 pb-3">
              <div className="flex items-center space-x-2 text-heritage-terracotta">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-heritage font-bold text-base text-heritage-dark">
                  Unlocated Field Records
                </h3>
              </div>
              <button
                onClick={() => setShowUnlocatedDrawer(false)}
                className="text-heritage-navy/60 hover:text-heritage-dark p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-heritage-navy/70 leading-relaxed">
              In accordance with our strict archival ethics, these documents do not yet have verified GPS coordinates. Rather than assigning arbitrary points on the map, they are held in this georeferencing queue.
            </p>

            <div className="space-y-3 overflow-y-auto max-h-[65vh]">
              {geoData?.unlocated_archives.length === 0 ? (
                <div className="text-center py-6 text-xs text-heritage-navy/50">
                  All archival records are currently georeferenced.
                </div>
              ) : (
                geoData?.unlocated_archives.map((a) => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-heritage-cream/40 border border-heritage-sandstone/50 space-y-1.5">
                    <span className="text-[10px] font-bold text-heritage-terracotta uppercase">
                      {a.category}
                    </span>
                    <h4 className="font-heritage font-bold text-xs text-heritage-dark">
                      {a.title}
                    </h4>
                    <p className="text-[11px] text-heritage-navy/70 line-clamp-2">
                      {a.description}
                    </p>
                    <div className="pt-2 flex justify-between items-center text-[10px]">
                      <span className="text-amber-700 font-semibold">GPS Pending Verification</span>
                      <Link
                        to={`/archives/${a.id}`}
                        className="text-heritage-navy font-bold hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Inspect Record</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-heritage-sandstone/30 text-[11px] text-heritage-navy/60 text-center">
            Coordinates can be assigned via the Archive Detail Edit tool.
          </div>
        </div>
      )}

    </div>
  );
};


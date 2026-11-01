export interface Tag {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface ExtractedText {
  id: number;
  page_number: number;
  raw_text?: string;
  cleaned_text?: string;
  confidence_score: number;
  ocr_engine: string;
  created_at: string;
}

export interface ArchiveFile {
  id: number;
  file_path: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  is_primary: boolean;
  created_at: string;
}

export interface ArchiveSource {
  id: number;
  source_name: string;
  contributor?: string;
  institution?: string;
  publication_year?: string;
  citation_url?: string;
}

export interface Archive {
  id: number;
  title: string;
  description?: string;
  file_path?: string;
  original_filename?: string;
  file_type?: string;
  extracted_text?: string;
  language?: string;
  historical_period?: string;
  category?: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  keywords?: string;
  processing_status?: string;
  source_reference?: string;
  architectural_features?: string;
  cultural_significance?: string;
  is_verified?: boolean;
  is_ai_generated?: boolean;
  created_at: string;
  updated_at?: string;
  tags?: Tag[];
  files?: ArchiveFile[];
  extracted_texts?: ExtractedText[];
  sources?: ArchiveSource[];
}

export interface ArchiveListResponse {
  total: number;
  items: Archive[];
}

export interface UploadResponse {
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  job_uuid: string;
}

export interface ProcessingJob {
  job_uuid: string;
  file_name: string;
  file_path: string;
  file_type: string;
  status: 'uploaded' | 'pending' | 'extracting' | 'generating_metadata' | 'completed' | 'failed';
  ocr_engine: string;
  ai_engine: string;
  extracted_text?: string;
  extracted_metadata?: {
    title?: string;
    description?: string;
    historical_period?: string;
    category?: string;
    language?: string;
    state?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    keywords?: string;
    architectural_features?: string;
    cultural_significance?: string;
    source_reference?: string;
    tags?: string[];
    is_ai_generated?: boolean;
    engine?: string;
  };
  is_ai_generated: boolean;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface SearchResultItem {
  archive: Archive;
  relevance_score: number;
  matched_fields: string[];
  snippet: string;
}

export interface SearchResponse {
  total: number;
  query: string;
  applied_filters: Record<string, any>;
  is_semantic: boolean;
  results: SearchResultItem[];
}

export interface LocationMarker {
  id: number;
  name: string;
  city?: string;
  state: string;
  latitude: number;
  longitude: number;
  monument_type?: string;
  archive_count: number;
  sample_thumbnail?: string;
  archives: {
    id: number;
    title: string;
    category?: string;
    period?: string;
    thumbnail?: string;
    description?: string;
  }[];
}

export interface GeospatialResponse {
  total_locations: number;
  total_mapped_archives: number;
  markers: LocationMarker[];
  unlocated_archives: Archive[];
}

export interface TimelineEvent {
  year: string;
  event: string;
}

export interface CulturalStory {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  summary: string;
  content: string;
  hero_image?: string;
  heritage_location?: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  historical_period?: string;
  cultural_importance?: string;
  architectural_features?: string;
  timeline_events?: TimelineEvent[];
  references?: string;
  created_at: string;
  archives?: Archive[];
}

export interface AnalyticsResponse {
  total_archives: number;
  total_digitised_documents: number;
  total_heritage_locations: number;
  total_processed_images: number;
  categories_distribution: Record<string, number>;
  language_distribution: Record<string, number>;
  geographic_distribution: Record<string, number>;
  historical_period_distribution: Record<string, number>;
  recent_archives: Archive[];
  recent_jobs: ProcessingJob[];
}


import {
  Archive,
  ArchiveListResponse,
  UploadResponse,
  ProcessingJob,
  SearchResponse,
  GeospatialResponse,
  CulturalStory,
  AnalyticsResponse
} from '../types';

const RAW_API_URL = (import.meta.env.VITE_API_URL as string | undefined) || '';
export const API_BASE = RAW_API_URL ? `${RAW_API_URL.replace(/\/$/, '')}/api` : '/api';

export function getAssetUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return RAW_API_URL ? `${RAW_API_URL.replace(/\/$/, '')}${path}` : path;
}

export function getSafeArchiveImage(filePath?: string, category?: string): string {
  if (filePath && !filePath.toLowerCase().endsWith('.pdf')) {
    return filePath;
  }
  
  const cat = (category || '').toLowerCase();
  if (cat.includes('stepwell') || cat.includes('water')) {
    return 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80';
  } else if (cat.includes('temple')) {
    return 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80';
  } else if (cat.includes('fort') || cat.includes('palace')) {
    return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80';
  } else if (cat.includes('manuscript')) {
    return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80';
  } else if (cat.includes('craft')) {
    return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80';
  } else if (cat.includes('buddhist') || cat.includes('jain') || cat.includes('stupa')) {
    return 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80';
}

export async function fetchHealth(): Promise<{ status: string; service: string; version: string; gemini_enabled: boolean }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to connect to backend');
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch(`${API_BASE}/analytics/`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchArchives(params?: {
  skip?: number;
  limit?: number;
  category?: string;
  state?: string;
  language?: string;
  period?: string;
  q?: string;
  sort_by?: string;
}): Promise<ArchiveListResponse> {
  const query = new URLSearchParams();
  if (params?.skip !== undefined) query.set('skip', params.skip.toString());
  if (params?.limit !== undefined) query.set('limit', params.limit.toString());
  if (params?.category) query.set('category', params.category);
  if (params?.state) query.set('state', params.state);
  if (params?.language) query.set('language', params.language);
  if (params?.period) query.set('period', params.period);
  if (params?.q) query.set('q', params.q);
  if (params?.sort_by) query.set('sort_by', params.sort_by);

  const res = await fetch(`${API_BASE}/archives/?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch archives');
  return res.json();
}

export async function fetchArchiveById(id: number): Promise<Archive> {
  const res = await fetch(`${API_BASE}/archives/${id}`);
  if (!res.ok) throw new Error(`Archive #${id} not found`);
  return res.json();
}

export async function updateArchive(id: number, data: Partial<Archive> & { tag_names?: string[] }): Promise<Archive> {
  const res = await fetch(`${API_BASE}/archives/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update archive');
  return res.json();
}

export async function deleteArchive(id: number): Promise<{ message: string; id: number }> {
  const res = await fetch(`${API_BASE}/archives/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete archive');
  return res.json();
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload/`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

export async function runProcessing(jobUuid: string): Promise<ProcessingJob> {
  const res = await fetch(`${API_BASE}/processing/run/${jobUuid}`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Processing failed' }));
    throw new Error(err.detail || 'Processing failed');
  }
  return res.json();
}

export async function getProcessingStatus(jobUuid: string): Promise<ProcessingJob> {
  const res = await fetch(`${API_BASE}/processing/${jobUuid}`);
  if (!res.ok) throw new Error('Failed to get job status');
  return res.json();
}

export async function commitReviewedMetadata(payload: {
  job_uuid: string;
  title: string;
  description: string;
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
}): Promise<Archive> {
  const res = await fetch(`${API_BASE}/processing/commit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to commit archive' }));
    throw new Error(err.detail || 'Failed to commit archive');
  }
  return res.json();
}

export async function executeSearch(params: {
  q: string;
  category?: string;
  state?: string;
  period?: string;
  language?: string;
  has_coords?: boolean;
  sort_by?: string;
}): Promise<SearchResponse> {
  const query = new URLSearchParams();
  query.set('q', params.q);
  if (params.category) query.set('category', params.category);
  if (params.state) query.set('state', params.state);
  if (params.period) query.set('period', params.period);
  if (params.language) query.set('language', params.language);
  if (params.has_coords !== undefined) query.set('has_coords', params.has_coords.toString());
  if (params.sort_by) query.set('sort_by', params.sort_by);

  const res = await fetch(`${API_BASE}/search/?${query.toString()}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function fetchGeospatialData(): Promise<GeospatialResponse> {
  const res = await fetch(`${API_BASE}/locations/`);
  if (!res.ok) throw new Error('Failed to fetch geospatial locations');
  return res.json();
}

export async function fetchStories(): Promise<CulturalStory[]> {
  const res = await fetch(`${API_BASE}/stories/`);
  if (!res.ok) throw new Error('Failed to fetch cultural stories');
  return res.json();
}

export async function fetchStoryBySlug(slug: string): Promise<CulturalStory> {
  const res = await fetch(`${API_BASE}/stories/${slug}`);
  if (!res.ok) throw new Error(`Story "${slug}" not found`);
  return res.json();
}


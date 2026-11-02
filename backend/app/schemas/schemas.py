from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

# Tag & Category Schemas
class TagBase(BaseModel):
    name: str

class TagResponse(TagBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# Extracted Text Schemas
class ExtractedTextResponse(BaseModel):
    id: int
    page_number: int
    raw_text: Optional[str] = None
    cleaned_text: Optional[str] = None
    confidence_score: float
    ocr_engine: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Archive File Schemas
class ArchiveFileResponse(BaseModel):
    id: int
    file_path: str
    original_filename: str
    file_type: str
    file_size: int
    is_primary: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Archive Source Schemas
class ArchiveSourceResponse(BaseModel):
    id: int
    source_name: str
    contributor: Optional[str] = None
    institution: Optional[str] = None
    publication_year: Optional[str] = None
    citation_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# Archive Schemas
class ArchiveBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_path: Optional[str] = None
    original_filename: Optional[str] = None
    file_type: Optional[str] = None
    extracted_text: Optional[str] = None
    language: Optional[str] = "English"
    historical_period: Optional[str] = None
    category: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = "India"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    keywords: Optional[str] = None
    processing_status: Optional[str] = "completed"
    source_reference: Optional[str] = None
    source_document: Optional[str] = None
    source_page: Optional[str] = None
    architectural_features: Optional[str] = None
    cultural_significance: Optional[str] = None
    is_verified: Optional[bool] = True
    verification_status: Optional[str] = "verified"  # verified, pending, rejected
    is_ai_generated: Optional[bool] = False

class ArchiveCreate(ArchiveBase):
    tag_names: Optional[List[str]] = []

class ArchiveUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    historical_period: Optional[str] = None
    category: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    keywords: Optional[str] = None
    architectural_features: Optional[str] = None
    cultural_significance: Optional[str] = None
    source_reference: Optional[str] = None
    source_document: Optional[str] = None
    source_page: Optional[str] = None
    verification_status: Optional[str] = None
    is_verified: Optional[bool] = None
    tag_names: Optional[List[str]] = None

class ArchiveResponse(ArchiveBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    tags: List[TagResponse] = []
    files: List[ArchiveFileResponse] = []
    extracted_texts: List[ExtractedTextResponse] = []
    sources: List[ArchiveSourceResponse] = []
    model_config = ConfigDict(from_attributes=True)

class ArchiveListResponse(BaseModel):
    total: int
    items: List[ArchiveResponse]

# Upload & Processing Schemas
class UploadResponse(BaseModel):
    file_name: str
    file_path: str
    file_type: str
    file_size: int
    job_uuid: str

class ProcessingJobResponse(BaseModel):
    job_uuid: str
    file_name: str
    file_path: str
    file_type: str
    status: str  # uploaded, pending, extracting, generating_metadata, completed, failed
    ocr_engine: str
    ai_engine: str
    extracted_text: Optional[str] = None
    extracted_metadata: Optional[Dict[str, Any]] = None
    is_ai_generated: bool = False
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

class MetadataReviewRequest(BaseModel):
    job_uuid: str
    title: str
    description: str
    historical_period: Optional[str] = None
    category: Optional[str] = None
    language: Optional[str] = "English"
    state: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = "India"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    keywords: Optional[str] = None
    architectural_features: Optional[str] = None
    cultural_significance: Optional[str] = None
    source_reference: Optional[str] = None
    source_document: Optional[str] = None
    source_page: Optional[str] = None
    verification_status: Optional[str] = "verified"
    is_verified: Optional[bool] = True
    tags: Optional[List[str]] = []

# Search Schemas
class SearchQuery(BaseModel):
    query: str
    category: Optional[str] = None
    state: Optional[str] = None
    historical_period: Optional[str] = None
    language: Optional[str] = None
    has_coordinates: Optional[bool] = None
    sort_by: Optional[str] = "relevance"  # relevance, date_desc, date_asc, title

class SearchResultItem(BaseModel):
    archive: ArchiveResponse
    relevance_score: float
    matched_fields: List[str]
    snippet: str

class SearchResponse(BaseModel):
    total: int
    query: str
    applied_filters: Dict[str, Any]
    is_semantic: bool
    results: List[SearchResultItem]

# Geospatial Schemas
class LocationMarker(BaseModel):
    id: int
    name: str
    city: Optional[str] = None
    state: str
    latitude: float
    longitude: float
    monument_type: Optional[str] = None
    archive_count: int
    sample_thumbnail: Optional[str] = None
    archives: List[Dict[str, Any]] = []

class GeospatialResponse(BaseModel):
    total_locations: int
    total_mapped_archives: int
    markers: List[LocationMarker]
    unlocated_archives: List[ArchiveResponse]

# Story Schemas
class CulturalStoryResponse(BaseModel):
    id: int
    title: str
    slug: str
    subtitle: Optional[str] = None
    summary: str
    content: str
    hero_image: Optional[str] = None
    heritage_location: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    historical_period: Optional[str] = None
    cultural_importance: Optional[str] = None
    architectural_features: Optional[str] = None
    timeline_events: Optional[List[Dict[str, Any]]] = None
    references: Optional[str] = None
    created_at: datetime
    archives: List[ArchiveResponse] = []
    model_config = ConfigDict(from_attributes=True)

# Analytics Schemas
class AnalyticsResponse(BaseModel):
    total_archives: int
    total_digitised_documents: int
    total_uploaded_documents: int = 0
    total_verified_records: int = 0
    total_pending_records: int = 0
    total_rejected_records: int = 0
    total_heritage_locations: int
    total_processed_images: int
    categories_distribution: Dict[str, int]
    language_distribution: Dict[str, int]
    geographic_distribution: Dict[str, int]
    historical_period_distribution: Dict[str, int]
    recent_archives: List[ArchiveResponse]
    recent_jobs: List[ProcessingJobResponse]

import datetime
from datetime import timezone

def utc_now():
    return datetime.datetime.now(timezone.utc)
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Table
)
from sqlalchemy.orm import relationship
from app.database.session import Base

# Association Tables
archive_tags = Table(
    'archive_tags',
    Base.metadata,
    Column('archive_id', Integer, ForeignKey('archives.id', ondelete="CASCADE"), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id', ondelete="CASCADE"), primary_key=True)
)

story_archives = Table(
    'story_archives',
    Base.metadata,
    Column('story_id', Integer, ForeignKey('cultural_stories.id', ondelete="CASCADE"), primary_key=True),
    Column('archive_id', Integer, ForeignKey('archives.id', ondelete="CASCADE"), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(200), nullable=True)
    role = Column(String(50), default="archivist")  # archivist, researcher, explorer, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

class Category(Base):
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)

class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    archives = relationship("Archive", secondary=archive_tags, back_populates="tags")

class HeritageLocation(Base):
    __tablename__ = 'heritage_locations'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=False, index=True)
    country = Column(String(100), default="India")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    monument_type = Column(String(100), nullable=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

class Archive(Base):
    __tablename__ = 'archives'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    original_filename = Column(String(255), nullable=True)
    file_path = Column(String(500), nullable=True)
    file_type = Column(String(50), nullable=True)  # pdf, jpg, png, webp, etc.
    extracted_text = Column(Text, nullable=True)
    language = Column(String(100), default="English")
    historical_period = Column(String(150), nullable=True, index=True)
    category = Column(String(100), nullable=True, index=True)
    state = Column(String(100), nullable=True, index=True)
    city = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    keywords = Column(Text, nullable=True)  # comma-separated
    processing_status = Column(String(50), default="completed")  # pending, extracting, completed, failed
    source_reference = Column(String(255), nullable=True)
    architectural_features = Column(Text, nullable=True)
    cultural_significance = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=True)
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    
    # Relationships
    files = relationship("ArchiveFile", back_populates="archive", cascade="all, delete-orphan")
    extracted_texts = relationship("ExtractedText", back_populates="archive", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary=archive_tags, back_populates="archives")
    sources = relationship("ArchiveSource", back_populates="archive", cascade="all, delete-orphan")
    stories = relationship("CulturalStory", secondary=story_archives, back_populates="archives")

class ArchiveFile(Base):
    __tablename__ = 'archive_files'
    
    id = Column(Integer, primary_key=True, index=True)
    archive_id = Column(Integer, ForeignKey('archives.id', ondelete="CASCADE"), nullable=False)
    file_path = Column(String(500), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, default=0)
    is_primary = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    
    archive = relationship("Archive", back_populates="files")

class ExtractedText(Base):
    __tablename__ = 'extracted_texts'
    
    id = Column(Integer, primary_key=True, index=True)
    archive_id = Column(Integer, ForeignKey('archives.id', ondelete="CASCADE"), nullable=False)
    page_number = Column(Integer, default=1)
    raw_text = Column(Text, nullable=True)
    cleaned_text = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.95)
    ocr_engine = Column(String(50), default="Tesseract/PyPDF")
    created_at = Column(DateTime, default=utc_now)
    
    archive = relationship("Archive", back_populates="extracted_texts")

class ArchiveSource(Base):
    __tablename__ = 'archive_sources'
    
    id = Column(Integer, primary_key=True, index=True)
    archive_id = Column(Integer, ForeignKey('archives.id', ondelete="CASCADE"), nullable=False)
    source_name = Column(String(255), nullable=False)
    contributor = Column(String(200), nullable=True)
    institution = Column(String(255), nullable=True)
    publication_year = Column(String(50), nullable=True)
    citation_url = Column(String(500), nullable=True)
    
    archive = relationship("Archive", back_populates="sources")

class ProcessingJob(Base):
    __tablename__ = 'processing_jobs'
    
    id = Column(Integer, primary_key=True, index=True)
    job_uuid = Column(String(100), unique=True, index=True, nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, default=0)
    status = Column(String(50), default="uploaded")  # uploaded, pending, extracting, generating_metadata, completed, failed
    error_message = Column(Text, nullable=True)
    ocr_engine = Column(String(50), default="PaddleOCR/Tesseract")
    ai_engine = Column(String(50), default="Gemini-Flash / Deterministic-NLP")
    extracted_text = Column(Text, nullable=True)
    extracted_metadata = Column(Text, nullable=True)  # JSON serialized
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)

class CulturalStory(Base):
    __tablename__ = 'cultural_stories'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    subtitle = Column(String(300), nullable=True)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    hero_image = Column(String(500), nullable=True)
    heritage_location = Column(String(255), nullable=True)
    state = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    historical_period = Column(String(150), nullable=True)
    cultural_importance = Column(Text, nullable=True)
    architectural_features = Column(Text, nullable=True)
    timeline_events = Column(Text, nullable=True)  # JSON formatted
    references = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    
    archives = relationship("Archive", secondary=story_archives, back_populates="stories")

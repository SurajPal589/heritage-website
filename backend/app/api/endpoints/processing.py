import json
import datetime
from pathlib import Path
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.config import BASE_DIR
from app.database.session import get_db
from app.models.models import (
    ProcessingJob, Archive, ArchiveFile, ExtractedText, HeritageLocation, Tag
)
from app.schemas.schemas import (
    ProcessingJobResponse, MetadataReviewRequest, ArchiveResponse
)
from app.services.ocr_service import OCRService
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/run/{job_uuid}", response_model=ProcessingJobResponse)
def run_processing(job_uuid: str, db: Session = Depends(get_db)):
    """Run OCR extraction and AI metadata generation for an uploaded archival file."""
    job = db.query(ProcessingJob).filter(ProcessingJob.job_uuid == job_uuid).first()
    if not job:
        raise HTTPException(status_code=404, detail="Processing job not found")

    job.status = "extracting"
    db.commit()

    # Locate the file on disk
    relative_path = job.file_path.lstrip("/")
    physical_path = BASE_DIR / relative_path

    if not physical_path.exists():
        job.status = "failed"
        job.error_message = f"Uploaded file not found on disk at {physical_path}"
        db.commit()
        raise HTTPException(status_code=404, detail="File missing from storage")

    try:
        # Step 1: Run OCR extraction
        extracted_text, pages_data, ocr_engine, detected_lang = OCRService.process_file(physical_path)
        job.extracted_text = extracted_text
        job.ocr_engine = ocr_engine
        job.status = "generating_metadata"
        db.commit()

        # Step 2: Run AI/Deterministic Metadata Extraction
        metadata = AIService.extract_metadata(
            extracted_text=extracted_text,
            filename=job.file_name,
            language=detected_lang
        )
        
        job.extracted_metadata = json.dumps(metadata)
        job.ai_engine = metadata.get("engine", "Heritage AI")
        job.is_ai_generated = metadata.get("is_ai_generated", False)
        job.status = "completed"
        job.completed_at = datetime.datetime.now(datetime.timezone.utc)
        db.commit()

        return ProcessingJobResponse(
            job_uuid=job.job_uuid,
            file_name=job.file_name,
            file_path=job.file_path,
            file_type=job.file_type,
            status=job.status,
            ocr_engine=job.ocr_engine,
            ai_engine=job.ai_engine,
            extracted_text=job.extracted_text,
            extracted_metadata=metadata,
            is_ai_generated=job.is_ai_generated,
            error_message=job.error_message,
            created_at=job.created_at,
            completed_at=job.completed_at
        )

    except Exception as e:
        job.status = "failed"
        job.error_message = f"Extraction failed: {str(e)}"
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{job_uuid}", response_model=ProcessingJobResponse)
def get_job_status(job_uuid: str, db: Session = Depends(get_db)):
    """Retrieve current processing status and results for a job."""
    job = db.query(ProcessingJob).filter(ProcessingJob.job_uuid == job_uuid).first()
    if not job:
        raise HTTPException(status_code=404, detail="Processing job not found")

    meta_dict = None
    if job.extracted_metadata:
        try:
            meta_dict = json.loads(job.extracted_metadata)
        except Exception:
            pass

    return ProcessingJobResponse(
        job_uuid=job.job_uuid,
        file_name=job.file_name,
        file_path=job.file_path,
        file_type=job.file_type,
        status=job.status,
        ocr_engine=job.ocr_engine,
        ai_engine=job.ai_engine,
        extracted_text=job.extracted_text,
        extracted_metadata=meta_dict,
        is_ai_generated=job.is_ai_generated,
        error_message=job.error_message,
        created_at=job.created_at,
        completed_at=job.completed_at
    )

@router.post("/commit", response_model=ArchiveResponse)
def commit_reviewed_metadata(payload: MetadataReviewRequest, db: Session = Depends(get_db)):
    """Save reviewed and user-edited archival metadata into permanent database."""
    job = db.query(ProcessingJob).filter(ProcessingJob.job_uuid == payload.job_uuid).first()
    if not job:
        raise HTTPException(status_code=404, detail="Associated processing job not found")

    # Determine verification status
    v_status = (payload.verification_status or "verified").lower()
    is_v = True if v_status == "verified" else False

    # Create new permanent Archive
    archive = Archive(
        title=payload.title,
        description=payload.description,
        original_filename=job.file_name,
        file_path=job.file_path,
        file_type=job.file_type,
        extracted_text=job.extracted_text,
        language=payload.language or "English",
        historical_period=payload.historical_period,
        category=payload.category,
        state=payload.state,
        city=payload.city,
        country=payload.country or "India",
        latitude=payload.latitude,
        longitude=payload.longitude,
        keywords=payload.keywords,
        processing_status="completed",
        source_reference=payload.source_reference,
        source_document=payload.source_document or job.file_name,
        source_page=payload.source_page or "1",
        architectural_features=payload.architectural_features,
        cultural_significance=payload.cultural_significance,
        verification_status=v_status,
        is_verified=is_v,
        is_ai_generated=job.is_ai_generated
    )

    # Attach or create tags
    if payload.tags:
        for tname in payload.tags:
            clean_tag = tname.strip()
            if not clean_tag:
                continue
            tag_obj = db.query(Tag).filter(Tag.name == clean_tag).first()
            if not tag_obj:
                tag_obj = Tag(name=clean_tag)
                db.add(tag_obj)
                db.commit()
                db.refresh(tag_obj)
            archive.tags.append(tag_obj)

    db.add(archive)
    db.commit()
    db.refresh(archive)

    # Add ArchiveFile
    arc_file = ArchiveFile(
        archive_id=archive.id,
        file_path=job.file_path,
        original_filename=job.file_name,
        file_type=job.file_type,
        file_size=job.file_size,
        is_primary=True
    )
    db.add(arc_file)

    # Add ExtractedText record
    if job.extracted_text:
        ext_rec = ExtractedText(
            archive_id=archive.id,
            page_number=1,
            raw_text=job.extracted_text,
            cleaned_text=job.extracted_text,
            confidence_score=0.92,
            ocr_engine=job.ocr_engine
        )
        db.add(ext_rec)

    # Add HeritageLocation if coordinates present
    if payload.latitude and payload.longitude:
        loc = HeritageLocation(
            name=payload.title.split(":")[0].strip(),
            city=payload.city,
            state=payload.state or "India",
            latitude=payload.latitude,
            longitude=payload.longitude,
            monument_type=payload.category,
            is_verified=True
        )
        db.add(loc)

    db.commit()
    db.refresh(archive)
    return archive

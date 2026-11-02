from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.session import get_db
from app.models.models import Archive, ProcessingJob, HeritageLocation
from app.schemas.schemas import AnalyticsResponse, ArchiveResponse, ProcessingJobResponse

router = APIRouter()

@router.get("/", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    """Dynamically compute live platform statistics directly from the database."""
    archives = db.query(Archive).all()
    jobs = db.query(ProcessingJob).order_by(desc(ProcessingJob.created_at)).limit(10).all()

    total_archives = len(archives)
    total_digitised_docs = sum(1 for a in archives if (a.file_type or '').lower() == "pdf")
    total_processed_images = sum(1 for a in archives if (a.file_type or '').lower() in ["jpg", "jpeg", "png", "webp"])
    
    total_jobs_count = db.query(ProcessingJob).count()
    total_uploaded_documents = max(total_jobs_count, total_digitised_docs + total_processed_images)

    total_verified_records = sum(1 for a in archives if (getattr(a, 'verification_status', None) == 'verified' or (getattr(a, 'verification_status', None) is None and a.is_verified)))
    total_pending_records = sum(1 for a in archives if getattr(a, 'verification_status', None) == 'pending')
    total_rejected_records = sum(1 for a in archives if getattr(a, 'verification_status', None) == 'rejected')
    
    unique_locations = set()
    categories_counter = Counter()
    languages_counter = Counter()
    geography_counter = Counter()
    periods_counter = Counter()

    for a in archives:
        if a.latitude and a.longitude:
            unique_locations.add(f"{round(a.latitude, 3)},{round(a.longitude, 3)}")
        if a.category:
            categories_counter[a.category] += 1
        if a.language:
            languages_counter[a.language] += 1
        if a.state:
            geography_counter[a.state] += 1
        else:
            geography_counter["Unspecified / Field Note"] += 1
        if a.historical_period:
            # Shorten period for clean chart labels
            clean_p = a.historical_period.split("(")[0].strip()
            periods_counter[clean_p] += 1

    recent_archives = db.query(Archive).order_by(desc(Archive.created_at)).limit(6).all()

    recent_job_responses = []
    for j in jobs:
        meta_dict = None
        if j.extracted_metadata:
            try:
                import json
                meta_dict = json.loads(j.extracted_metadata)
            except Exception:
                pass
        recent_job_responses.append(
            ProcessingJobResponse(
                job_uuid=j.job_uuid,
                file_name=j.file_name,
                file_path=j.file_path,
                file_type=j.file_type,
                status=j.status,
                ocr_engine=j.ocr_engine,
                ai_engine=j.ai_engine,
                extracted_text=j.extracted_text,
                extracted_metadata=meta_dict,
                is_ai_generated=j.is_ai_generated,
                error_message=j.error_message,
                created_at=j.created_at,
                completed_at=j.completed_at
            )
        )

    return AnalyticsResponse(
        total_archives=total_archives,
        total_digitised_documents=total_digitised_docs,
        total_uploaded_documents=total_uploaded_documents,
        total_verified_records=total_verified_records,
        total_pending_records=total_pending_records,
        total_rejected_records=total_rejected_records,
        total_heritage_locations=len(unique_locations),
        total_processed_images=total_processed_images,
        categories_distribution=dict(categories_counter),
        language_distribution=dict(languages_counter),
        geographic_distribution=dict(geography_counter),
        historical_period_distribution=dict(periods_counter),
        recent_archives=[ArchiveResponse.model_validate(a) for a in recent_archives],
        recent_jobs=recent_job_responses
    )

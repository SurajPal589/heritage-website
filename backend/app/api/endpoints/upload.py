import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.config import settings, UPLOAD_DIR
from app.database.session import get_db
from app.models.models import ProcessingJob
from app.schemas.schemas import UploadResponse

router = APIRouter()

@router.post("/", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and validate an archival heritage file (image or PDF)."""
    # 1. Check extension
    filename = file.filename or "unnamed_archive"
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '.{ext}'. Supported formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # 2. Generate unique filename & save
    job_uuid = str(uuid.uuid4())
    safe_filename = f"{job_uuid}_{Path(filename).name}"
    target_path = UPLOAD_DIR / safe_filename

    try:
        with target_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store file: {str(e)}")

    file_size = target_path.stat().st_size
    if file_size > settings.MAX_FILE_SIZE:
        target_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE // (1024*1024)} MB"
        )

    # 3. Create ProcessingJob record
    web_file_path = f"/uploads/{safe_filename}"
    job = ProcessingJob(
        job_uuid=job_uuid,
        file_name=filename,
        file_path=web_file_path,
        file_type=ext,
        file_size=file_size,
        status="uploaded"
    )
    db.add(job)
    db.commit()

    return UploadResponse(
        file_name=filename,
        file_path=web_file_path,
        file_type=ext,
        file_size=file_size,
        job_uuid=job_uuid
    )


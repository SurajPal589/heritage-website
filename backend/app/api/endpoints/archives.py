from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.database.session import get_db
from app.models.models import Archive, Tag
from app.schemas.schemas import (
    ArchiveResponse, ArchiveListResponse, ArchiveCreate, ArchiveUpdate
)

router = APIRouter()

@router.get("/", response_model=ArchiveListResponse)
def list_archives(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category: Optional[str] = None,
    state: Optional[str] = None,
    language: Optional[str] = None,
    period: Optional[str] = None,
    q: Optional[str] = None,
    sort_by: Optional[str] = "date_desc",
    db: Session = Depends(get_db)
):
    """Retrieve paginated archival records with optional filtering."""
    query = db.query(Archive)

    if category:
        query = query.filter(Archive.category == category)
    if state:
        query = query.filter(Archive.state.ilike(f"%{state}%"))
    if language:
        query = query.filter(Archive.language.ilike(f"%{language}%"))
    if period:
        query = query.filter(Archive.historical_period.ilike(f"%{period}%"))
    if q:
        search_filter = or_(
            Archive.title.ilike(f"%{q}%"),
            Archive.description.ilike(f"%{q}%"),
            Archive.extracted_text.ilike(f"%{q}%"),
            Archive.keywords.ilike(f"%{q}%"),
            Archive.city.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)

    total = query.count()

    if sort_by == "date_desc":
        query = query.order_by(desc(Archive.created_at))
    elif sort_by == "date_asc":
        query = query.order_by(asc(Archive.created_at))
    elif sort_by == "title":
        query = query.order_by(asc(Archive.title))
    else:
        query = query.order_by(desc(Archive.id))

    items = query.offset(skip).limit(limit).all()
    return ArchiveListResponse(total=total, items=items)

@router.get("/{archive_id}", response_model=ArchiveResponse)
def get_archive_by_id(archive_id: int, db: Session = Depends(get_db)):
    """Retrieve complete metadata, extracted texts, files and tags for a single archive."""
    archive = db.query(Archive).filter(Archive.id == archive_id).first()
    if not archive:
        raise HTTPException(status_code=404, detail="Archive not found")
    return archive

@router.put("/{archive_id}", response_model=ArchiveResponse)
def update_archive(archive_id: int, payload: ArchiveUpdate, db: Session = Depends(get_db)):
    """Update editable fields of an archive."""
    archive = db.query(Archive).filter(Archive.id == archive_id).first()
    if not archive:
        raise HTTPException(status_code=404, detail="Archive not found")

    update_data = payload.dict(exclude_unset=True)
    tag_names = update_data.pop("tag_names", None)

    for field, value in update_data.items():
        setattr(archive, field, value)

    if tag_names is not None:
        archive.tags.clear()
        for tname in tag_names:
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

    db.commit()
    db.refresh(archive)
    return archive

@router.delete("/{archive_id}")
def delete_archive(archive_id: int, db: Session = Depends(get_db)):
    """Permanently delete an archive and its associated relations."""
    archive = db.query(Archive).filter(Archive.id == archive_id).first()
    if not archive:
        raise HTTPException(status_code=404, detail="Archive not found")

    db.delete(archive)
    db.commit()
    return {"message": f"Archive #{archive_id} successfully deleted", "id": archive_id}


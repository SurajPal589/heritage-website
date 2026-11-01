import json
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import CulturalStory
from app.schemas.schemas import CulturalStoryResponse

router = APIRouter()

@router.get("/", response_model=List[CulturalStoryResponse])
def get_all_stories(db: Session = Depends(get_db)):
    """Retrieve all curated cultural heritage stories."""
    stories = db.query(CulturalStory).all()
    results = []
    for s in stories:
        timeline = None
        if s.timeline_events:
            try:
                timeline = json.loads(s.timeline_events)
            except Exception:
                pass
        results.append(
            CulturalStoryResponse(
                id=s.id,
                title=s.title,
                slug=s.slug,
                subtitle=s.subtitle,
                summary=s.summary,
                content=s.content,
                hero_image=s.hero_image,
                heritage_location=s.heritage_location,
                state=s.state,
                city=s.city,
                latitude=s.latitude,
                longitude=s.longitude,
                historical_period=s.historical_period,
                cultural_importance=s.cultural_importance,
                architectural_features=s.architectural_features,
                timeline_events=timeline,
                references=s.references,
                created_at=s.created_at,
                archives=s.archives
            )
        )
    return results

@router.get("/{slug}", response_model=CulturalStoryResponse)
def get_story_by_slug(slug: str, db: Session = Depends(get_db)):
    """Retrieve a single cultural story by its slug."""
    story = db.query(CulturalStory).filter(CulturalStory.slug == slug).first()
    if not story:
        raise HTTPException(status_code=404, detail="Cultural story not found")

    timeline = None
    if story.timeline_events:
        try:
            timeline = json.loads(story.timeline_events)
        except Exception:
            pass

    return CulturalStoryResponse(
        id=story.id,
        title=story.title,
        slug=story.slug,
        subtitle=story.subtitle,
        summary=story.summary,
        content=story.content,
        hero_image=story.hero_image,
        heritage_location=story.heritage_location,
        state=story.state,
        city=story.city,
        latitude=story.latitude,
        longitude=story.longitude,
        historical_period=story.historical_period,
        cultural_importance=story.cultural_importance,
        architectural_features=story.architectural_features,
        timeline_events=timeline,
        references=story.references,
        created_at=story.created_at,
        archives=story.archives
    )


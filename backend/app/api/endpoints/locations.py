from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Archive
from app.schemas.schemas import GeospatialResponse, LocationMarker, ArchiveResponse

router = APIRouter()

@router.get("", response_model=GeospatialResponse)
@router.get("/", response_model=GeospatialResponse)
def get_heritage_locations(db: Session = Depends(get_db)):
    """Retrieve verified geographic markers and unlocated archive records for the map module."""
    archives = db.query(Archive).all()

    mapped_locations_dict = {}
    unlocated = []

    for arc in archives:
        if arc.latitude is not None and arc.longitude is not None:
            # Group by coordinates to combine multiple archives for the same monument
            coord_key = f"{round(arc.latitude, 4)}_{round(arc.longitude, 4)}"
            if coord_key not in mapped_locations_dict:
                monument_name = arc.title.split(":")[0].strip()
                mapped_locations_dict[coord_key] = {
                    "id": arc.id,
                    "name": monument_name,
                    "city": arc.city,
                    "state": arc.state or "India",
                    "latitude": arc.latitude,
                    "longitude": arc.longitude,
                    "monument_type": arc.category,
                    "archive_count": 0,
                    "sample_thumbnail": arc.file_path,
                    "archives": []
                }
            
            mapped_locations_dict[coord_key]["archive_count"] += 1
            mapped_locations_dict[coord_key]["archives"].append({
                "id": arc.id,
                "title": arc.title,
                "category": arc.category,
                "period": arc.historical_period,
                "thumbnail": arc.file_path,
                "description": arc.description[:140] + "..." if arc.description else ""
            })
        else:
            unlocated.append(arc)

    markers = [LocationMarker(**m) for m in mapped_locations_dict.values()]

    return GeospatialResponse(
        total_locations=len(markers),
        total_mapped_archives=sum(m.archive_count for m in markers),
        markers=markers,
        unlocated_archives=[ArchiveResponse.model_validate(a) for a in unlocated]
    )

from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import SearchResponse, SearchResultItem
from app.services.search_service import SearchService

router = APIRouter()

@router.get("/", response_model=SearchResponse)
def search_heritage(
    q: str = Query("", description="Natural language search query or keywords"),
    category: Optional[str] = Query(None, description="Category filter"),
    state: Optional[str] = Query(None, description="State filter"),
    period: Optional[str] = Query(None, description="Historical period filter"),
    language: Optional[str] = Query(None, description="Language filter"),
    has_coords: Optional[bool] = Query(None, description="Filter for mapped records"),
    sort_by: Optional[str] = Query("relevance", description="Sorting method"),
    db: Session = Depends(get_db)
):
    """Intelligent discovery engine with natural language understanding and multi-facet filtering."""
    scored_items, applied_filters = SearchService.execute_search(
        db=db,
        query=q,
        category=category,
        state=state,
        historical_period=period,
        language=language,
        has_coordinates=has_coords,
        sort_by=sort_by
    )

    results = [
        SearchResultItem(
            archive=item["archive"],
            relevance_score=item["relevance_score"],
            matched_fields=item["matched_fields"],
            snippet=item["snippet"]
        )
        for item in scored_items
    ]

    return SearchResponse(
        total=len(results),
        query=q,
        applied_filters=applied_filters,
        is_semantic=False,
        results=results
    )


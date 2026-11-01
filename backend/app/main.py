import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings, UPLOAD_DIR
from app.database.session import engine, Base, SessionLocal
from app.services.seed_data import seed_database

# Endpoints
from app.api.endpoints import (
    archives,
    upload,
    processing,
    search,
    locations,
    stories,
    analytics
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads directory for static image serving
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include Routers
app.include_router(archives.router, prefix="/api/archives", tags=["Archives"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(processing.router, prefix="/api/processing", tags=["Processing"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(locations.router, prefix="/api/locations", tags=["Locations & Geospatial"])
app.include_router(stories.router, prefix="/api/stories", tags=["Cultural Stories"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics & Dashboard"])

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "gemini_enabled": bool(settings.GEMINI_API_KEY)
    }


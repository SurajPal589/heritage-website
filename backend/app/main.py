import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings, UPLOAD_DIR, BASE_DIR
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
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://heritage-website.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|https://.*\.loca\.lt|http://localhost:.*|http://127\.0\.0\.1:.*",
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

# Mount and serve compiled production frontend (React / Vite bundle)
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"
if FRONTEND_DIST.exists():
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="static-assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Do not catch API or upload endpoints
        if full_path.startswith("api") or full_path.startswith("uploads"):
            raise HTTPException(status_code=404, detail="Endpoint not found")
        
        # Check if direct static file
        target_file = FRONTEND_DIST / full_path
        if full_path and target_file.is_file():
            return FileResponse(target_file)
        
        # Default to index.html for client-side routing
        index_file = FRONTEND_DIST / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")



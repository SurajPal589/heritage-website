import io
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import SessionLocal
from app.models.models import Archive

client = TestClient(app)

def create_sample_heritage_image() -> bytes:
    """Generate an in-memory sample historical survey image."""
    img = Image.new("RGB", (600, 300), color=(245, 237, 224))
    draw = ImageDraw.Draw(img)
    draw.text((30, 40), "ARCHAEOLOGICAL FIELD SURVEY", fill=(12, 21, 36))
    draw.text((30, 80), "Site: Adalaj Subterranean Water Sanctum", fill=(191, 83, 59))
    draw.text((30, 120), "Date: 1498 CE - Vaghela & Sultanate Confluence", fill=(42, 59, 94))
    draw.text((30, 160), "Carvings: Solanki Hindu motifs and Islamic floral jaali", fill=(12, 21, 36))
    
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf.getvalue()

def test_full_heritage_revitalisation_e2e_lifecycle():
    # -------------------------------------------------------------
    # TEST 1: Upload an actual historical document/image
    # -------------------------------------------------------------
    image_bytes = create_sample_heritage_image()
    upload_res = client.post(
        "/api/upload/",
        files={"file": ("adalaj_field_survey_1498.jpg", io.BytesIO(image_bytes), "image/jpeg")}
    )
    assert upload_res.status_code == 200
    upload_data = upload_res.json()
    assert "job_uuid" in upload_data
    job_uuid = upload_data["job_uuid"]
    assert upload_data["file_type"] == "jpg"
    assert upload_data["file_size"] > 0

    # -------------------------------------------------------------
    # TEST 2: Extract text using the OCR / Vision engine
    # -------------------------------------------------------------
    proc_res = client.post(f"/api/processing/run/{job_uuid}")
    assert proc_res.status_code == 200
    proc_data = proc_res.json()
    assert proc_data["status"] == "completed"
    assert proc_data["extracted_text"] is not None
    assert len(proc_data["extracted_text"]) > 0

    # -------------------------------------------------------------
    # TEST 3: Generate and edit archive metadata
    # -------------------------------------------------------------
    meta = proc_data["extracted_metadata"]
    assert meta is not None
    
    # Review & refine metadata
    reviewed_payload = {
        "job_uuid": job_uuid,
        "title": "Adalaj Subterranean Stepwell Epigraphic Survey",
        "description": "Field documentation of the 5-tiered octagonal stepwell built by Queen Rudabai in 1498 CE.",
        "historical_period": "15th Century CE (1498 CE)",
        "category": "Stepwells & Water Architecture",
        "language": "English & Sanskrit",
        "state": "Gujarat",
        "city": "Gandhinagar",
        "latitude": 23.1667,
        "longitude": 72.5800,
        "keywords": "Adalaj, Stepwell, Rudabai, Subterranean, Gandhinagar",
        "architectural_features": "5 levels underground, 3 entrance staircases meeting at octagonal shaft",
        "cultural_significance": "Confluence of Solanki craft guilds and Islamic decorative arabesques",
        "source_reference": "Field Survey Expedition Record #E2E-2024",
        "tags": ["Stepwells", "Gujarat", "Indo-Islamic", "Fieldwork"]
    }

    # -------------------------------------------------------------
    # TEST 4: Save the archive to the database
    # -------------------------------------------------------------
    commit_res = client.post("/api/processing/commit", json=reviewed_payload)
    assert commit_res.status_code == 200
    saved_archive = commit_res.json()
    archive_id = saved_archive["id"]
    assert archive_id > 0
    assert saved_archive["title"] == reviewed_payload["title"]
    assert saved_archive["state"] == "Gujarat"
    assert saved_archive["latitude"] == 23.1667
    assert saved_archive["longitude"] == 72.5800

    # -------------------------------------------------------------
    # TEST 5: Find the saved archive through natural language search
    # -------------------------------------------------------------
    search_res = client.get("/api/search/?q=ancient stepwells in Gujarat")
    assert search_res.status_code == 200
    search_data = search_res.json()
    assert search_data["total"] > 0
    # Our newly saved archive should be discovered
    found_ids = [item["archive"]["id"] for item in search_data["results"]]
    assert archive_id in found_ids

    # -------------------------------------------------------------
    # TEST 6: Open its detail page and verify completeness
    # -------------------------------------------------------------
    detail_res = client.get(f"/api/archives/{archive_id}")
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    assert detail_data["id"] == archive_id
    assert detail_data["title"] == reviewed_payload["title"]
    assert len(detail_data["extracted_texts"]) > 0
    assert len(detail_data["tags"]) >= 4

    # -------------------------------------------------------------
    # TEST 7: Display its location on the geospatial map endpoint
    # -------------------------------------------------------------
    loc_res = client.get("/api/locations/")
    assert loc_res.status_code == 200
    loc_data = loc_res.json()
    assert loc_data["total_locations"] > 0
    # Check that Adalaj marker exists with coordinates
    matching_markers = [
        m for m in loc_data["markers"]
        if abs(m["latitude"] - 23.1667) < 0.01 and abs(m["longitude"] - 72.5800) < 0.01
    ]
    assert len(matching_markers) > 0

    # -------------------------------------------------------------
    # TEST 8 & 9: Verify persistence directly in database session
    # -------------------------------------------------------------
    db = SessionLocal()
    try:
        db_archive = db.query(Archive).filter(Archive.id == archive_id).first()
        assert db_archive is not None
        assert db_archive.title == reviewed_payload["title"]
        assert db_archive.state == "Gujarat"
        assert db_archive.latitude == 23.1667
    finally:
        db.close()


import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "HeritageLens AI" in data["service"]

def test_list_archives():
    response = client.get("/api/archives/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 12
    assert len(data["items"]) >= 12
    first = data["items"][0]
    assert "title" in first
    assert "category" in first

def test_archive_detail():
    response = client.get("/api/archives/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert "Rani ki Vav" in data["title"]
    assert data["state"] == "Gujarat"

def test_natural_language_search():
    response = client.get("/api/search/?q=ancient stepwells in Gujarat")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    # Top result should be stepwell related
    top_result = data["results"][0]
    assert "stepwell" in top_result["archive"]["category"].lower()

def test_locations_endpoint():
    response = client.get("/api/locations/")
    assert response.status_code == 200
    data = response.json()
    assert data["total_locations"] > 0
    assert len(data["markers"]) > 0
    assert len(data["unlocated_archives"]) > 0  # Confirms unlocated handling works!

def test_stories_endpoint():
    response = client.get("/api/stories/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4
    first_story = data[0]
    assert "slug" in first_story
    assert "title" in first_story

def test_analytics_endpoint():
    response = client.get("/api/analytics/")
    assert response.status_code == 200
    data = response.json()
    assert data["total_archives"] >= 12
    assert data["total_heritage_locations"] > 0
    assert "categories_distribution" in data
    assert "language_distribution" in data
    assert "geographic_distribution" in data

def test_upload_and_ocr_flow():
    # Test file upload with an in-memory test file
    test_content = b"ARCHAEOLOGICAL FIELD REPORT: ADALAJ WATER MONUMENT\nFounding Date: 1498 CE. Inscribed in Sanskrit."
    file = io.BytesIO(test_content)
    
    upload_res = client.post(
        "/api/upload/",
        files={"file": ("test_field_report.pdf", file, "application/pdf")}
    )
    assert upload_res.status_code == 200
    upload_data = upload_res.json()
    assert "job_uuid" in upload_data
    job_uuid = upload_data["job_uuid"]

    # Run processing
    proc_res = client.post(f"/api/processing/run/{job_uuid}")
    assert proc_res.status_code == 200
    proc_data = proc_res.json()
    assert proc_data["status"] == "completed"
    assert proc_data["extracted_metadata"] is not None

    # Commit metadata
    commit_payload = {
        "job_uuid": job_uuid,
        "title": "Adalaj Water Survey 1498 CE",
        "description": "Test field documentation of Adalaj subterranean monument",
        "historical_period": "15th Century CE",
        "category": "Stepwells & Water Architecture",
        "language": "English & Sanskrit",
        "state": "Gujarat",
        "city": "Gandhinagar",
        "latitude": 23.1667,
        "longitude": 72.5800,
        "keywords": "Test, Adalaj, Fieldwork",
        "tags": ["Fieldwork", "Stepwells"]
    }
    commit_res = client.post("/api/processing/commit", json=commit_payload)
    assert commit_res.status_code == 200
    created_archive = commit_res.json()
    assert created_archive["title"] == "Adalaj Water Survey 1498 CE"
    assert created_archive["id"] > 0

def test_verification_and_analytics_breakdown():
    # Verify analytics contains the breakdown fields
    res = client.get("/api/analytics/")
    assert res.status_code == 200
    data = res.json()
    assert "total_verified_records" in data
    assert "total_pending_records" in data
    assert "total_uploaded_documents" in data

    # Verify archives filter by verification_status
    v_res = client.get("/api/archives/?verification_status=verified")
    assert v_res.status_code == 200
    v_data = v_res.json()
    assert v_data["total"] >= 1
    for item in v_data["items"]:
        assert item.get("verification_status") in [None, "verified"]



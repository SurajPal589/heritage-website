import json
import re
from pathlib import Path
from typing import Dict, Any, Optional, List
from app.core.config import settings

# Verified monument coordinates database
VERIFIED_MONUMENT_COORDINATES = {
    "rani ki vav": {"city": "Patan", "state": "Gujarat", "lat": 23.8589, "lng": 72.1018, "period": "11th Century CE (Solanki Dynasty)", "category": "Stepwells & Water Architecture"},
    "adalaj": {"city": "Gandhinagar", "state": "Gujarat", "lat": 23.1667, "lng": 72.5800, "period": "15th Century CE (Vaghela Dynasty)", "category": "Stepwells & Water Architecture"},
    "modhera": {"city": "Mehsana", "state": "Gujarat", "lat": 23.5835, "lng": 72.1331, "period": "11th Century CE (Solanki Dynasty)", "category": "Temple Architecture"},
    "konark": {"city": "Puri", "state": "Odisha", "lat": 19.8876, "lng": 86.0945, "period": "13th Century CE (Eastern Ganga Dynasty)", "category": "Temple Architecture"},
    "hampi": {"city": "Vijayanagara", "state": "Karnataka", "lat": 15.3350, "lng": 76.4600, "period": "14th–16th Century CE (Vijayanagara Empire)", "category": "Forts & Palaces"},
    "mehrangarh": {"city": "Jodhpur", "state": "Rajasthan", "lat": 26.2980, "lng": 73.0189, "period": "15th Century CE (Rathore Dynasty)", "category": "Forts & Palaces"},
    "kailasa": {"city": "Aurangabad / Chhatrapati Sambhaji Nagar", "state": "Maharashtra", "lat": 20.0268, "lng": 75.1780, "period": "8th Century CE (Rashtrakuta Dynasty)", "category": "Temple Architecture"},
    "brihadisvara": {"city": "Thanjavur", "state": "Tamil Nadu", "lat": 10.7828, "lng": 79.1318, "period": "11th Century CE (Chola Dynasty)", "category": "Temple Architecture"},
    "nalanda": {"city": "Nalanda", "state": "Bihar", "lat": 25.1357, "lng": 85.4439, "period": "5th–12th Century CE (Gupta & Pala Empires)", "category": "Ancient Manuscripts"},
    "sanchi": {"city": "Raisen", "state": "Madhya Pradesh", "lat": 23.4793, "lng": 77.7397, "period": "3rd Century BCE–12th Century CE (Mauryan)", "category": "Buddhist & Jain Heritage"},
    "patola": {"city": "Patan", "state": "Gujarat", "lat": 23.8500, "lng": 72.1300, "period": "12th Century CE–Present", "category": "Traditional Crafts"},
    "kalamkari": {"city": "Machilipatnam", "state": "Andhra Pradesh", "lat": 16.1875, "lng": 81.1389, "period": "Medieval–Modern Era", "category": "Traditional Crafts"},
}

class AIService:
    @classmethod
    def extract_metadata(
        cls, 
        extracted_text: str, 
        filename: str, 
        language: str = "English"
    ) -> Dict[str, Any]:
        """Extract structured metadata using Gemini if key is provided, or deterministic NLP fallback."""
        if settings.GEMINI_API_KEY:
            try:
                ai_meta = cls._extract_with_gemini(extracted_text, filename, language)
                if ai_meta:
                    ai_meta["is_ai_generated"] = True
                    ai_meta["engine"] = "Gemini AI"
                    return cls._normalize_metadata(ai_meta, filename, language)
            except Exception as e:
                print(f"[AIService] Gemini API error, falling back to deterministic extractor: {e}")

        # Deterministic Heritage NLP Engine Fallback
        deterministic_meta = cls._extract_deterministic(extracted_text, filename, language)
        deterministic_meta["is_ai_generated"] = False
        deterministic_meta["engine"] = "Deterministic Heritage NLP Engine (Fallback)"
        return cls._normalize_metadata(deterministic_meta, filename, language)

    @classmethod
    def _normalize_metadata(cls, meta: Dict[str, Any], filename: str, language: str) -> Dict[str, Any]:
        """Standardize metadata to conform with both master schema and HeritageLens database."""
        h_name = meta.get("heritage_name") or meta.get("title") or Path(filename).stem.replace("_", " ").title()
        cat = meta.get("heritage_category") or meta.get("category") or "Historical Architecture"
        loc = meta.get("location") or meta.get("city") or None
        st = meta.get("state") or None
        cntry = meta.get("country") or "India"
        period = meta.get("historical_period") or None
        desc = meta.get("description") or f"Historical archival record documenting {h_name}."
        
        # Keywords handling
        raw_keywords = meta.get("keywords")
        if isinstance(raw_keywords, list):
            keywords_list = raw_keywords
            keywords_str = ", ".join(str(k) for k in raw_keywords)
        elif isinstance(raw_keywords, str):
            keywords_str = raw_keywords
            keywords_list = [k.strip() for k in raw_keywords.split(",") if k.strip()]
        else:
            keywords_list = ["Heritage", "Archival Record"]
            keywords_str = "Heritage, Archival Record"

        # Coordinates safety check: never invent coordinates
        lat = meta.get("latitude")
        lng = meta.get("longitude")
        if lat is not None and lng is not None:
            try:
                lat = float(lat)
                lng = float(lng)
                if not (8.0 <= lat <= 37.0 and 68.0 <= lng <= 97.5):
                    # Coordinates outside India boundary
                    lat, lng = None, None
            except (ValueError, TypeError):
                lat, lng = None, None

        norm = {
            # Master Prompt Exact Schema Fields
            "heritage_name": h_name,
            "heritage_category": cat,
            "location": loc or (st or "Unspecified Location"),
            "state": st,
            "country": cntry,
            "historical_period": period or "Undated Historical Period (Pending Verification)",
            "description": desc,
            "keywords": keywords_list,
            "source_document": meta.get("source_document") or filename,
            "source_page": str(meta.get("source_page") or "1"),
            "latitude": lat,
            "longitude": lng,
            "verification_status": "pending",  # AI output must never automatically become verified

            # Backwards compatibility fields for database and frontend components
            "title": h_name,
            "category": cat,
            "city": loc,
            "language": language,
            "architectural_features": meta.get("architectural_features") or "Stylistic carvings, masonry structural joints, and regional motifs cataloged.",
            "cultural_significance": meta.get("cultural_significance") or "Represents regional community identity, historic engineering, and cultural traditions.",
            "source_reference": meta.get("source_reference") or f"HeritageLens Archival Reference – Doc: {filename}",
            "tags": keywords_list,
            "is_ai_generated": meta.get("is_ai_generated", False),
            "engine": meta.get("engine", "HeritageLens AI")
        }
        return norm

    @classmethod
    def _extract_with_gemini(cls, text: str, filename: str, language: str) -> Optional[Dict[str, Any]]:
        """Call Gemini API using official google-genai library."""
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            prompt = f"""
            You are a specialist cultural heritage and architectural historian archiving Indian cultural records for HeritageLens AI.
            Analyze the following extracted archival document text and file name to produce structured historical metadata.

            Rules:
            1. Return ONLY a valid JSON object.
            2. Never invent dates or geographical coordinates. If unknown or uncertain, return null.
            3. Do not mark verification_status as verified; always set "verification_status": "pending".

            File Name: {filename}
            Detected Script/Language: {language}
            Document Text:
            {text[:4000]}

            Return ONLY this JSON format:
            {{
                "heritage_name": "Concise historical title for this heritage asset",
                "heritage_category": "One of: Stepwells & Water Architecture, Temple Architecture, Forts & Palaces, Ancient Manuscripts, Traditional Crafts, Buddhist & Jain Heritage, Sculptural Epigraphy",
                "location": "City or site location in India, or null if unknown",
                "state": "State in India or null",
                "country": "India",
                "historical_period": "Historical Era or Dynasty or null if unknown",
                "description": "2-3 sentences synthesizing the historical importance and contents",
                "keywords": ["keyword1", "keyword2", "keyword3"],
                "source_document": "{filename}",
                "source_page": "1",
                "latitude": null,
                "longitude": null,
                "verification_status": "pending"
            }}
            """
            
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            
            content = response.text
            return json.loads(content)
        except Exception as e:
            print(f"[AIService] Gemini call failed: {e}")
            return None

    @classmethod
    def _extract_deterministic(cls, text: str, filename: str, language: str) -> Dict[str, Any]:
        """High-precision deterministic rule-based extractor for heritage archives."""
        content = f"{filename} {text}".lower()
        
        # 1. Check for known monuments in verified database
        matched_monument = None
        matched_name = None
        for key, info in VERIFIED_MONUMENT_COORDINATES.items():
            if key in content:
                matched_monument = info
                matched_name = key.title()
                break

        # 2. Determine Category
        category = "Historical Architecture"
        if any(w in content for w in ["stepwell", "vav", "baoli", "water architecture", "well", "cistern"]):
            category = "Stepwells & Water Architecture"
        elif any(w in content for w in ["temple", "shikhara", "mandapa", "vimana", "sanctum", "garbhagriha"]):
            category = "Temple Architecture"
        elif any(w in content for w in ["fort", "palace", "bastion", "citadel", "rampart", "mahal", "gate"]):
            category = "Forts & Palaces"
        elif any(w in content for w in ["manuscript", "folio", "devanagari", "palm-leaf", "script", "epigraphy", "inscription"]):
            category = "Ancient Manuscripts"
        elif any(w in content for w in ["craft", "patola", "weaving", "textile", "kalamkari", "metalwork", "pottery"]):
            category = "Traditional Crafts"
        elif any(w in content for w in ["stupa", "buddhist", "jain", "chaitya", "vihara", "tirthankara"]):
            category = "Buddhist & Jain Heritage"

        # 3. Determine Location & Coordinates (only if verified)
        state = None
        city = None
        lat = None
        lng = None
        
        if matched_monument:
            state = matched_monument["state"]
            city = matched_monument["city"]
            lat = matched_monument["lat"]
            lng = matched_monument["lng"]
        else:
            state_map = {
                "gujarat": "Gujarat",
                "rajasthan": "Rajasthan",
                "karnataka": "Karnataka",
                "tamil nadu": "Tamil Nadu",
                "odisha": "Odisha",
                "maharashtra": "Maharashtra",
                "bihar": "Bihar",
                "madhya pradesh": "Madhya Pradesh",
                "uttar pradesh": "Uttar Pradesh",
            }
            for s_key, s_val in state_map.items():
                if s_key in content:
                    state = s_val
                    break

        # 4. Determine Historical Period
        historical_period = None
        if matched_monument:
            historical_period = matched_monument["period"]
        elif "solanki" in content or "chaulukya" in content:
            historical_period = "11th Century CE (Solanki Dynasty)"
        elif "chola" in content:
            historical_period = "10th–11th Century CE (Imperial Cholas)"
        elif "vijayanagara" in content:
            historical_period = "14th–16th Century CE (Vijayanagara Empire)"
        elif "mughal" in content:
            historical_period = "16th–17th Century CE (Mughal Era)"
        elif "gupta" in content:
            historical_period = "4th–6th Century CE (Gupta Empire)"
        elif "mauryan" in content or "ashoka" in content:
            historical_period = "3rd Century BCE (Mauryan Empire)"
        elif "maratha" in content:
            historical_period = "17th–18th Century CE (Maratha Confederacy)"
        else:
            historical_period = "Historical Era (Pending Verification)"

        # 5. Build Title and Summary
        clean_name = re.sub(r'[\-_.]+', ' ', Path(filename).stem).title()
        if matched_monument:
            title = f"{matched_name} Archival Survey Record"
            desc = (
                f"Archival survey and architectural documentation of {matched_name} located in {city}, {state}. "
                f"Dating from the {historical_period}, this record details key structural, decorative and epigraphic features."
            )
        else:
            title = f"{clean_name} Cultural Documentation"
            desc = (
                f"Digital archival record documenting {category.lower()} in {state or 'India'}. "
                f"Preserves structural observations, epigraphic notes and visual heritage attributes."
            )

        # 6. Extract Keywords
        keywords_list = ["Indian Heritage", category.split("&")[0].strip()]
        if state:
            keywords_list.append(state)
        if city:
            keywords_list.append(city)
        if matched_monument:
            keywords_list.append(matched_name)
        keywords_list.extend(["Archival Preservation", "Architectural Heritage"])

        return {
            "heritage_name": title,
            "title": title,
            "heritage_category": category,
            "category": category,
            "location": city or state or "Unspecified Location",
            "city": city,
            "state": state,
            "country": "India",
            "historical_period": historical_period,
            "description": desc,
            "keywords": keywords_list,
            "source_document": filename,
            "source_page": "1",
            "latitude": lat,
            "longitude": lng,
            "verification_status": "pending",
            "architectural_features": (
                "Carved stone embellishments, traditional load-bearing masonry, "
                "sculptural reliefs, and period-specific motifs cataloged during field survey."
            ),
            "cultural_significance": (
                "Exemplifies regional architectural ingenuity, community heritage preservation, "
                "and historical craftsmanship."
            ),
            "source_reference": f"HeritageLens Archival Survey – Record #{abs(hash(filename)) % 10000:04d}",
            "tags": keywords_list
        }

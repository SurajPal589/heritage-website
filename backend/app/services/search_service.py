import re
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.models import Archive

class SearchService:
    @staticmethod
    def parse_natural_language_query(query: str) -> Dict[str, Any]:
        """Extract implicit intent, entities and filters from natural language search."""
        q_lower = query.lower()
        inferred = {
            "keywords": [],
            "inferred_category": None,
            "inferred_state": None,
            "inferred_language": None,
            "inferred_period": None
        }

        # Categories
        if any(w in q_lower for w in ["stepwell", "vav", "baoli", "water"]):
            inferred["inferred_category"] = "Stepwells & Water Architecture"
        elif any(w in q_lower for w in ["temple", "shikhara", "mandapa", "vimana"]):
            inferred["inferred_category"] = "Temple Architecture"
        elif any(w in q_lower for w in ["fort", "palace", "citadel", "bastion"]):
            inferred["inferred_category"] = "Forts & Palaces"
        elif any(w in q_lower for w in ["manuscript", "devanagari", "folio", "sanskrit", "inscription"]):
            inferred["inferred_category"] = "Ancient Manuscripts"
        elif any(w in q_lower for w in ["craft", "patola", "textile", "weaving", "kalamkari"]):
            inferred["inferred_category"] = "Traditional Crafts"
        elif any(w in q_lower for w in ["stupa", "buddhist", "jain", "chaitya"]):
            inferred["inferred_category"] = "Buddhist & Jain Heritage"

        # States
        states = [
            "Gujarat", "Rajasthan", "Karnataka", "Tamil Nadu", "Odisha",
            "Maharashtra", "Bihar", "Madhya Pradesh", "Uttar Pradesh", "Andhra Pradesh"
        ]
        for s in states:
            if s.lower() in q_lower:
                inferred["inferred_state"] = s
                break

        # Languages
        if "devanagari" in q_lower or "hindi" in q_lower or "sanskrit" in q_lower:
            inferred["inferred_language"] = "Devanagari"
        elif "tamil" in q_lower:
            inferred["inferred_language"] = "Tamil"

        # Clean search keywords
        clean_q = re.sub(
            r'\b(find|show|search|documents|records|archives|about|from|in|during|constructed|ancient|historical|the|a|an)\b',
            '',
            q_lower
        )
        tokens = [t.strip() for t in clean_q.split() if len(t.strip()) > 2]
        inferred["keywords"] = tokens
        return inferred

    @classmethod
    def execute_search(
        cls,
        db: Session,
        query: str,
        category: str = None,
        state: str = None,
        historical_period: str = None,
        language: str = None,
        has_coordinates: bool = None,
        sort_by: str = "relevance"
    ) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """Search archives with relevance scoring and highlights."""
        inferred = cls.parse_natural_language_query(query) if query else {}
        
        # Base query
        archives = db.query(Archive).all()
        scored_results = []
        
        tokens = inferred.get("keywords", []) if query else []
        query_lower = query.lower() if query else ""

        for arc in archives:
            # Check explicit and inferred filters
            target_category = category or inferred.get("inferred_category")
            if target_category and arc.category != target_category:
                continue

            target_state = state or inferred.get("inferred_state")
            if target_state and (not arc.state or target_state.lower() not in arc.state.lower()):
                continue

            if historical_period and (not arc.historical_period or historical_period.lower() not in arc.historical_period.lower()):
                continue

            target_lang = language or inferred.get("inferred_language")
            if target_lang and (not arc.language or target_lang.lower() not in arc.language.lower()):
                continue

            if has_coordinates is True and (arc.latitude is None or arc.longitude is None):
                continue
            if has_coordinates is False and (arc.latitude is not None and arc.longitude is not None):
                continue

            # Compute Relevance Score
            score = 0.0
            matched_fields = []
            
            title_text = (arc.title or "").lower()
            desc_text = (arc.description or "").lower()
            ocr_text = (arc.extracted_text or "").lower()
            kw_text = (arc.keywords or "").lower()
            cat_text = (arc.category or "").lower()
            state_text = (arc.state or "").lower()
            period_text = (arc.historical_period or "").lower()
            
            if not query_lower:
                score = 1.0
            else:
                # Exact phrase match
                if query_lower in title_text:
                    score += 10.0
                    matched_fields.append("Title (Exact Match)")
                if query_lower in kw_text:
                    score += 6.0
                    matched_fields.append("Keywords")
                if query_lower in desc_text:
                    score += 5.0
                    matched_fields.append("Description")
                if query_lower in ocr_text:
                    score += 4.0
                    matched_fields.append("Extracted OCR Text")

                # Token matches
                for tok in tokens:
                    if tok in title_text:
                        score += 3.0
                        if "Title" not in matched_fields:
                            matched_fields.append("Title")
                    if tok in kw_text:
                        score += 2.0
                        if "Keywords" not in matched_fields:
                            matched_fields.append("Keywords")
                    if tok in cat_text:
                        score += 2.5
                        if "Category" not in matched_fields:
                            matched_fields.append("Category")
                    if tok in state_text:
                        score += 2.0
                        if "Location/State" not in matched_fields:
                            matched_fields.append("Location/State")
                    if tok in desc_text:
                        score += 1.5
                        if "Description" not in matched_fields:
                            matched_fields.append("Description")
                    if tok in ocr_text:
                        score += 1.0
                        if "Extracted OCR Text" not in matched_fields:
                            matched_fields.append("Extracted OCR Text")

            if query_lower and score <= 0.0:
                continue

            # Generate Snippet
            snippet = arc.description or ""
            if query_lower and arc.extracted_text:
                for tok in tokens:
                    pos = arc.extracted_text.lower().find(tok)
                    if pos != -1:
                        start = max(0, pos - 60)
                        end = min(len(arc.extracted_text), pos + 120)
                        snippet = f"...{arc.extracted_text[start:end]}..."
                        break

            scored_results.append({
                "archive": arc,
                "relevance_score": round(score, 2),
                "matched_fields": matched_fields or ["General Index"],
                "snippet": snippet
            })

        # Sorting
        if sort_by == "relevance":
            scored_results.sort(key=lambda x: x["relevance_score"], reverse=True)
        elif sort_by == "date_desc":
            scored_results.sort(key=lambda x: x["archive"].created_at, reverse=True)
        elif sort_by == "date_asc":
            scored_results.sort(key=lambda x: x["archive"].created_at)
        elif sort_by == "title":
            scored_results.sort(key=lambda x: x["archive"].title)

        applied = {
            "category": category or inferred.get("inferred_category"),
            "state": state or inferred.get("inferred_state"),
            "historical_period": historical_period,
            "language": language or inferred.get("inferred_language"),
            "sort_by": sort_by
        }
        return scored_results, applied


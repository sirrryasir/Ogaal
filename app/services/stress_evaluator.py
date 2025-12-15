from app.domain.stress_rules import calculate_stress_level
from app.domain.priority_scoring import calculate_priority_score
from app.services.explanation_builder import build_explanation

def evaluate_water_stress(data: dict) -> dict:
    stress_level = calculate_stress_level(data)
    priority_score = calculate_priority_score(data)
    reasons = build_explanation(data, stress_level)

    return {
        "location_id": data["location_id"],
        "stress_level": stress_level,
        "priority_score": priority_score,
        "reasons": reasons
    }

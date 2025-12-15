def calculate_priority_score(data: dict) -> int:
    score = 0

    score += data["reports_last_7_days"] * 10
    score += data["days_since_last_intervention"] * 2
    score += (data["total_water_sources"] - data["working_sources"]) * 15

    return min(score, 100)

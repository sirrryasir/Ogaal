def build_explanation(data: dict, stress_level: str) -> list:
    reasons = []

    if data["working_sources"] == 0:
        reasons.append("No functional water sources")

    if data["reports_last_7_days"] > 5:
        reasons.append("High number of community reports")

    if data["days_since_last_intervention"] > 14:
        reasons.append("No recent intervention")

    if stress_level in ["HIGH", "CRITICAL"]:
        reasons.append("Majority of water sources are non-functional")

    return reasons

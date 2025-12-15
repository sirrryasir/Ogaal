def calculate_stress_level(data: dict) -> str:
    broken_ratio = 1 - (data["working_sources"] / data["total_water_sources"])

    if broken_ratio >= 0.75 or data["reports_last_7_days"] >= 7:
        return "CRITICAL"
    elif broken_ratio >= 0.5:
        return "HIGH"
    elif broken_ratio >= 0.25:
        return "MEDIUM"
    else:
        return "LOW"

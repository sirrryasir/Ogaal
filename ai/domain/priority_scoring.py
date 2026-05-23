# app/domain/priority_scoring.py

def recommend_action(stress_level: str, days_to_failure: int) -> str:
    """
    Decide the recommended action based on stress and remaining days.
    """
    if stress_level == "DANGER" or days_to_failure < 7:
        return "Immediate Intervention Required"
    elif stress_level == "CAUTION" or days_to_failure < 14:
        return "Prepare Early Intervention"
    else:
        return "No Action Needed"
    if stress_level == "DANGER" or (days_to_failure is not None and days_to_failure < 7):
        return "Immediate Intervention Required"
    elif stress_level == "CAUTION" or (days_to_failure is not None and days_to_failure < 14):
        return "Prepare Early Intervention"
    else:
        return "No Action Needed"
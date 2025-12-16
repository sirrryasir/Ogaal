from typing import Dict

def get_decision(sr: float, days_to_failure: float) -> Dict[str, str]:
    """
    Convert stress metrics into recommended action.
    - sr: Stress Ratio
    - days_to_failure: Days remaining before water source collapses
    """
    if sr < 0.8:
        return {"condition": "Safe", "recommendation": "No action needed"}
    elif 0.8 <= sr < 1.0:
        return {"condition": "Caution", "recommendation": "Monitor usage closely"}
    elif sr >= 1.0:
        if days_to_failure > 14:
            return {"condition": "High Stress", "recommendation": "Reduce peak usage"}
        elif 7 < days_to_failure <= 14:
            return {"condition": "Critical", "recommendation": "Prepare early intervention"}
        elif days_to_failure <= 7:
            return {"condition": "Danger", "recommendation": "Shift load / provide support"}
    return {"condition": "Unknown", "recommendation": "Inspect manually"}

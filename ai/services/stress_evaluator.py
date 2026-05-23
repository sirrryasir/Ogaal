from ai.domain.stress_rules import calculate_stress_level

def evaluate_water_stress(payload):
    score, level = calculate_stress_level(
        rainfall=payload.rainfall_mm,
        population=payload.population,
        supply=payload.water_supply_mcm
    )

    return {
        "stress_level": level,
        "score": score,
        "explanation": f"Water stress is classified as {level}"
    }

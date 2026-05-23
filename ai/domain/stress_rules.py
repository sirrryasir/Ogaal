def calculate_stress_level(rainfall: float, population: int, supply: float):
    demand = population * 0.05
    stress_index = demand / max(supply, 1)

    if stress_index < 0.5:
        return stress_index, "Low"
    elif stress_index < 1:
        return stress_index, "Medium"
    else:
        return stress_index, "High"

    if stress_index < 0.5:
        return stress_index, "LOW"
    elif stress_index < 1:
        return stress_index, "MEDIUM"
    else:
        return stress_index, "HIGH"
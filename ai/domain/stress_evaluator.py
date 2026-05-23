export function evaluateWaterStress(source: any) {
  let score = 0;

  if (source.total_extracted_liters > source.current_capacity_liters * 0.8)
    score += 3;

  if (source.climate.rainfall_mm < 2)
    score += 2;

  if (source.downtime_hours > 3)
    score += 2;

  if (source.population_served > 1000)
    score += 1;

  if (score >= 6) return "HIGH";
  if (score >= 3) return "MEDIUM";
  return "LOW";
}

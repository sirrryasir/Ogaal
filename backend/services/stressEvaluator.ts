import { query } from "../lib/db";

// Simplified AI logic using capacity, usage, and rainfall
export async function evaluateWaterStress() {
  // Get water sources
  const sources = await query(`
  SELECT ws.id, ws.name, ws.district, ws.village, ws.source_type,
         ws.design_capacity_liters, ws.current_capacity_liters,
         ws.population_served, ws.operational_status
         
  FROM water_sources ws
  LEFT JOIN climate_observations co
    ON co.district = ws.district
    AND co.observation_date = CURRENT_DATE
`);

  // Get latest usage
  const usages = await query(`
    SELECT water_source_id, total_extracted_liters
    FROM daily_usage
    WHERE usage_date = CURRENT_DATE
  `);

  const usageMap: Record<number, number> = {};
  usages.forEach((u) => {
    usageMap[u.water_source_id] = u.total_extracted_liters;
  });

  return sources.map((src) => {
    const extracted = usageMap[src.id] || 0;
    const usageRatio = extracted / src.design_capacity_liters;

    // Simple stress evaluation
    let stressLevel = "LOW";
    if (usageRatio > 0.8) stressLevel = "HIGH";
    else if (usageRatio > 0.5) stressLevel = "MEDIUM";

    // If operational status is limited or non-functional, raise stress
    if (src.operational_status !== "OPERATIONAL") {
      stressLevel = "HIGH";
    }

    return {
      id: src.id,
      name: src.name,
      district: src.district,
      village: src.village,
      type: src.source_type,
      population_served: src.population_served,
      design_capacity_liters: src.design_capacity_liters,
      current_capacity_liters: src.current_capacity_liters,
      rainfall_mm: src.rainfall_mm,
      stress_level: stressLevel,
      usage_ratio: usageRatio.toFixed(2),
    };
  });
}

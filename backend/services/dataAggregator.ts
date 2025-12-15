import { query } from "../lib/db";
import { getClimateData } from "../lib/climateClient";

export async function getWaterStressPayload() {
  const sources = await query<any>(`
    SELECT
      ws.id,
      ws.district,
      ws.latitude,
      ws.longitude,
      ws.current_capacity_liters,
      ws.population_served,
      du.total_extracted_liters,
      du.avg_flow_rate_lpm,
      du.downtime_hours
    FROM water_sources ws
    JOIN daily_usage du
      ON du.water_source_id = ws.id
    WHERE du.usage_date = CURRENT_DATE
  `);

  const enriched = await Promise.all(
    sources.map(async (s) => {
      const climate = await getClimateData(s.latitude, s.longitude);

      return {
        ...s,
        climate,
      };
    })
  );

  return enriched;
}


export async function computeWaterSourceDecisions() {
  const sources = await query("SELECT * FROM water_sources");

  const decisions = sources.map((ws: any) => {
    const sr = Math.random() * 1.5; // Example computation, replace with real AI logic
    const sa = Math.random() * 0.5;
    const days_to_failure = sr >= 1 ? Math.floor(Math.random() * 10) + 1 : 999;
    let recommendation = "No action";

    if (sr >= 1.0) recommendation = "Reduce peak usage";
    else if (sr >= 0.8) recommendation = "Caution: monitor closely";

    return {
      water_source_id: ws.id,
      sr,
      sa,
      days_to_failure,
      recommendation,
    };
  });

  // Insert or update decisions in DB
  for (const d of decisions) {
    await query(`
      INSERT INTO water_source_decisions (water_source_id, sr, sa, days_to_failure, recommendation)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (water_source_id)
      DO UPDATE SET sr=$2, sa=$3, days_to_failure=$4, recommendation=$5
    `, [d.water_source_id, d.sr, d.sa, d.days_to_failure, d.recommendation]);
  }

  return decisions;
}
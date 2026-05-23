import { query } from "./db";

const USGS_API = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01581680";

const AI_URL = "http://127.0.0.1:8000/ai/water-stress";

export async function getLocationsData() {
  // --- 1. Local DB fetch ---
  const sql = `
    SELECT l.id AS location_id, l.name, l.population_served,
           COUNT(ws.id) AS total_water_sources,
           SUM(CASE WHEN ws.status='working' THEN 1 ELSE 0 END) AS working_sources,
           COUNT(cr.id) FILTER (WHERE cr.report_date >= CURRENT_DATE - INTERVAL '7 days') AS reports_last_7_days,
           COALESCE(MAX(i.intervention_date), CURRENT_DATE - INTERVAL '30 days') AS last_intervention
    FROM locations l
    LEFT JOIN water_sources ws ON ws.location_id = l.id
    LEFT JOIN community_reports cr ON cr.location_id = l.id
    LEFT JOIN interventions i ON i.location_id = l.id
    GROUP BY l.id
  `;
  const dbRows = await query(sql);

  // --- 2. External USGS API fetch ---
  const usgsRes = await fetch(USGS_API);
  const usgsData = await usgsRes.json();
  const streamflow = usgsData?.value?.timeSeries?.[0]?.values?.[0]?.value?.[0]?.value || 0;

  // --- 3. Merge DB + API ---
  const merged = dbRows.map((row: any) => ({
    location_id: row.location_id,
    name: row.name,
    total_water_sources: Number(row.total_water_sources),
    working_sources: Number(row.working_sources),
    reports_last_7_days: Number(row.reports_last_7_days),
    days_since_last_intervention: Math.max(
      0,
      Math.floor((Date.now() - new Date(row.last_intervention).getTime()) / (1000 * 60 * 60 * 24))
    ),
    population_served: row.population_served,
    external_streamflow: Number(streamflow)
  }));

  return merged;
}

export async function callAI(payload: any) {
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("AI call failed");
  return res.json();
}

import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

// Helper: fetch data from backend DB
async function getWaterSources() {
  const rows = await query(`
    SELECT
      ws.id AS water_source_id,
      ws.name,
      ws.current_capacity_liters AS remaining_usable_water_liters,
      COALESCE(du.total_extracted_liters, 0) AS daily_usage_liters
    FROM water_sources ws
    LEFT JOIN LATERAL (
      SELECT *
      FROM daily_usage
      WHERE water_source_id = ws.id
      ORDER BY usage_date DESC
      LIMIT 1
    ) du ON TRUE
  `);
  return rows || [];
}

export async function POST(req: Request) {
  // ✅ Always fetch DB sources if no body sent
  let payload;
  try {
    payload = await req.json();
  } catch {
    // If empty or invalid JSON, use DB
    payload = await getWaterSources();
  }

  // Normalize: must be array
  if (!Array.isArray(payload)) payload = [payload];
  if (payload.length === 0) return NextResponse.json({ count: 0, data: [] });

  // Forward to FastAPI
  try {
    const aiResponse = await fetch("http://127.0.0.1:8000/failure-countdown/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Handle empty response
    let data;
    try {
      data = await aiResponse.json();
    } catch {
      data = { count: payload.length, data: payload.map((p) => ({ id: p.water_source_id, name: p.name, days_to_failure: null })) };
    }

    return NextResponse.json(data, { status: aiResponse.status });
  } catch (err: any) {
    console.error("Failure Countdown POST Error:", err);
    return NextResponse.json({ error: err.message || "AI Failure Countdown error" }, { status: 500 });
  }
}

import { query } from "../lib/db";

interface WaterSource {
  id: number;
  name: string;
  design_capacity_liters: number;
  operational_status: string;
  total_extracted_liters: number | null;
}

export async function getStressAcceleration() {
  try {
    const sources: WaterSource[] = await query(`
      SELECT
        ws.id,
        ws.name,
        ws.design_capacity_liters,
        ws.operational_status,
        du.total_extracted_liters
      FROM water_sources ws
      LEFT JOIN daily_usage du
        ON du.water_source_id = ws.id
        AND du.usage_date = CURRENT_DATE
    `);

    const results = [];

    for (const src of sources) {
      /* -----------------------------
         1️⃣ DATA AVAILABILITY
      ------------------------------ */
      const hasTodayData = src.total_extracted_liters !== null;

      const today_sr = hasTodayData
        ? src.total_extracted_liters! / src.design_capacity_liters
        : null;

      /* -----------------------------
         2️⃣ LAST 7 DAYS STRESS
      ------------------------------ */
      const last7Rows: { total_extracted_liters: number }[] = await query(
        `
        SELECT total_extracted_liters
        FROM daily_usage
        WHERE water_source_id = $1
          AND usage_date >= CURRENT_DATE - INTERVAL '7 days'
          AND usage_date < CURRENT_DATE
      `,
        [src.id]
      );

      const last7Sr = last7Rows.map(
        r => r.total_extracted_liters / src.design_capacity_liters
      );

      const avgLast7 =
        last7Sr.length > 0
          ? last7Sr.reduce((a, b) => a + b, 0) / last7Sr.length
          : 0;

      /* -----------------------------
         3️⃣ STRESS ACCELERATION
      ------------------------------ */
      const sa =
        today_sr !== null
          ? today_sr - avgLast7
          : null;

      /* -----------------------------
         4️⃣ STATUS ENGINE (FIXED)
      ------------------------------ */
      let status: string;
      let severity: "OK" | "WARNING" | "CRITICAL";

      if (!hasTodayData) {
        status = "No data — reporting gap";
        severity = "WARNING";
      }
      else if (avgLast7 > 0.3 && today_sr === 0) {
        status = "CRITICAL — sudden extraction stop (possible failure)";
        severity = "CRITICAL";
      }
      else if (sa !== null && sa < -0.3) {
        status = "Stress collapse — abrupt usage drop";
        severity = "CRITICAL";
      }
      else if (today_sr !== null && today_sr > 1) {
        status = "Overuse — exceeds design capacity";
        severity = "CRITICAL";
      }
      else if (sa !== null && sa > 0.1) {
        status = "Rapid stress increase ⚠️";
        severity = "WARNING";
      }
      else if (sa !== null && sa > 0) {
        status = "Moderate stress acceleration";
        severity = "WARNING";
      }
      else {
        status = "Stable";
        severity = "OK";
      }

      if (src.operational_status !== "OPERATIONAL") {
        status = "High stress — source not fully operational";
        severity = "CRITICAL";
      }

      /* -----------------------------
         5️⃣ FINAL RESPONSE
      ------------------------------ */
      results.push({
        id: src.id,
        name: src.name,
        today_sr: today_sr !== null ? Number(today_sr.toFixed(2)) : null,
        avg_sr_last_7_days: Number(avgLast7.toFixed(2)),
        stress_acceleration: sa !== null ? Number(sa.toFixed(2)) : null,
        severity,
        status
      });
    }

    return results;
  } catch (error) {
    console.error("Stress Acceleration API error:", error);
    throw new Error("Failed to fetch stress acceleration");
  }
}

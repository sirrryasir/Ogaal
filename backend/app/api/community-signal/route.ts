// app/api/community-signal/route.ts
import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

/**
 * Humanization rules:
 * - Assumes individual scores are numeric (scale flexible).
 * - We use these thresholds (tunable) to map numeric values to labels:
 *    0..3   -> "Low"
 *    4..6   -> "Moderate"
 *    7..10+ -> "High"
 * - Overall aggregated label (Safe/Caution/Danger):
 *    overall <= 3 -> "Safe"
 *    overall <= 6 -> "Caution"
 *    overall > 6  -> "Danger"
 *
 * If your stored scores use a different scale (e.g. 0-5), adjust thresholds accordingly.
 */

function scoreLabel(score: number): "Low" | "Moderate" | "High" {
  if (typeof score !== "number" || Number.isNaN(score)) return "Low";
  if (score <= 3) return "Low";
  if (score <= 6) return "Moderate";
  return "High";
}

function overallLabel(score: number): "Safe" | "Caution" | "Danger" {
  if (typeof score !== "number" || Number.isNaN(score)) return "Safe";
  if (score <= 3) return "Safe";
  if (score <= 6) return "Caution";
  return "Danger";
}

function buildReasons(row: any) {
  const reasons: string[] = [];

  const q = Number(row.queue_length_score ?? 0);
  const f = Number(row.fetch_time_score ?? 0);
  const c = Number(row.complaints_score ?? 0);
  const o = Number(row.overall_signal_score ?? (q + f + c) / 3);

  if (q >= 7) reasons.push("Long community queues observed");
  else if (q >= 4) reasons.push("Queue length above normal");

  if (f >= 7) reasons.push("Fetch times are very long");
  else if (f >= 4) reasons.push("Fetch time increased");

  if (c >= 5) reasons.push("Multiple water quality complaints reported");
  else if (c >= 2) reasons.push("Some complaints about water quality");

  // escalation reasons
  if (o > 7) reasons.push("Overall community stress is high — immediate action recommended");
  else if (o > 4) reasons.push("Overall stress moderate — monitor and plan intervention");
  else reasons.push("Community reports indicate low immediate stress");

  return reasons;
}

function buildRecommendation(overallScore: number) {
  const label = overallLabel(overallScore);
  if (label === "Danger") {
    return {
      short: "Immediate intervention required",
      detail:
        "High overall community stress. Consider emergency refill, temporary water delivery, repairing infrastructure, or reducing load immediately."
    };
  }
  if (label === "Caution") {
    return {
      short: "Plan inspection / mitigation",
      detail:
        "Moderate stress. Schedule inspection, community communication, and targeted maintenance. Monitor daily signals for escalation."
    };
  }
  return {
    short: "No immediate action required",
    detail:
      "Stress is low. Continue monitoring community signals and routine maintenance."
  };
}

export async function GET() {
  try {
    // Fetch latest community signals and join with water source info
    const rows = await query(`
      SELECT cs.id,
             cs.water_source_id,
             cs.queue_length_score,
             cs.fetch_time_score,
             cs.complaints_score,
             cs.overall_signal_score,
             ws.name AS water_source_name,
             ws.district,
             ws.village,
             ws.source_type
      FROM community_signals cs
      JOIN water_sources ws ON ws.id = cs.water_source_id
      ORDER BY cs.id DESC
      LIMIT 50
    `);

    // Map DB rows to humanized responses while preserving numbers
    const payload = (rows || []).map((r: any) => {
      // coerce numeric values (DB may return strings)
      const q = Number(r.queue_length_score ?? 0);
      const f = Number(r.fetch_time_score ?? 0);
      const c = Number(r.complaints_score ?? 0);
      const o = Number(r.overall_signal_score ?? ((q + f + c) / 3));

      const queue_label = scoreLabel(q);
      const fetch_time_label = scoreLabel(f);
      const complaints_label = scoreLabel(c);
      const overall_label = overallLabel(o);

      const reasons = buildReasons(r);
      const recommendation = buildRecommendation(o);

      return {
        // original DB fields (numbers preserved)
        id: r.id,
        water_source_id: r.water_source_id,
        queue_length_score: q,
        fetch_time_score: f,
        complaints_score: c,
        overall_signal_score: o,

        // water source info
        water_source_name: r.water_source_name,
        district: r.district,
        village: r.village,
        source_type: r.source_type,

        // humanized fields (readable)
        human: {
          queue_label,         // "Low" | "Moderate" | "High"
          fetch_time_label,    // "Low" | "Moderate" | "High"
          complaints_label,    // "Low" | "Moderate" | "High"
          overall_label,       // "Safe" | "Caution" | "Danger"
          reasons,             // array of short human-friendly reasons
          recommendation       // { short, detail }
        }
      };
    });

    return NextResponse.json(payload);
  } catch (err) {
    console.error("Community Signal GET Error:", err);
    return NextResponse.json({ error: "Failed to fetch community signals from DB" }, { status: 500 });
  }
}

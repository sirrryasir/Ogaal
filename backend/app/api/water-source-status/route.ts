// backend/app/api/water-source-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const sql = `
      SELECT 
        ws.id,
        ws.name,
        ws.district,
        ws.village,
        ws.source_type,
        ws.design_capacity_liters,
        ws.current_capacity_liters,
        ws.population_served,
        ws.operational_status,

        du.total_extracted_liters,
        du.avg_flow_rate_lpm,
        du.hours_of_operation,

        cs.overall_signal_score

      FROM water_sources ws

      LEFT JOIN LATERAL (
        SELECT 
          total_extracted_liters,
          avg_flow_rate_lpm,
          hours_of_operation
        FROM daily_usage
        WHERE water_source_id = ws.id
        ORDER BY usage_date DESC
        LIMIT 1
      ) du ON TRUE

      LEFT JOIN LATERAL (
        SELECT overall_signal_score
        FROM community_signals
        WHERE water_source_id = ws.id
        ORDER BY signal_date DESC
        LIMIT 1
      ) cs ON TRUE;
    `;

    const rows = await query(sql);

    const decisions = rows.map((ws: any) => {
      let recommended_action = "MONITOR";

      if (ws.operational_status === "NON_FUNCTIONAL") {
        recommended_action = "REPAIR";
      } else if (
        ws.current_capacity_liters <
        ws.design_capacity_liters * 0.3
      ) {
        recommended_action = "EMERGENCY_REFILL";
      } else if (
        ws.overall_signal_score !== null &&
        ws.overall_signal_score >= 7
      ) {
        recommended_action = "MANAGE_QUEUE";
      }

      return {
        water_source_id: ws.id,
        name: ws.name,
        district: ws.district,
        village: ws.village,
        source_type: ws.source_type,

        operational_status: ws.operational_status,
        population_served: ws.population_served,

        current_capacity_liters: ws.current_capacity_liters,
        design_capacity_liters: ws.design_capacity_liters,

        total_extracted_liters: ws.total_extracted_liters ?? 0,
        avg_flow_rate_lpm: ws.avg_flow_rate_lpm ?? 0,
        hours_of_operation: ws.hours_of_operation ?? 0,

        overall_signal_score: ws.overall_signal_score ?? 0,

        recommended_action,
      };
    });

    return NextResponse.json({
      count: decisions.length,
      data: decisions,
    });
  } catch (err) {
    console.error("Water Source Status GET Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch water source decisions" },
      { status: 500 }
    );
  }
}

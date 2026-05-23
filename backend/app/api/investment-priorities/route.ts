import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET() {
  try {
    /**
     * 1. Load required joined data
     */
    const sql = `
      SELECT
        ws.id,
        ws.name,
        ws.district,
        ws.village,
        ws.source_type,
        ws.operational_status,
        ws.population_served,
        ws.design_capacity_liters,
        ws.current_capacity_liters,

        COALESCE(cs.overall_signal_score, 0) AS signal_score,

        COALESCE(co.rainfall_mm, 0) AS rainfall_mm,
        COALESCE(co.temperature_c, 0) AS temperature_c

      FROM water_sources ws

      LEFT JOIN LATERAL (
        SELECT *
        FROM community_signals
        WHERE water_source_id = ws.id
        ORDER BY signal_date DESC
        LIMIT 1
      ) cs ON TRUE

      LEFT JOIN LATERAL (
        SELECT *
        FROM climate_observations
        WHERE district = ws.district
        ORDER BY observation_date DESC
        LIMIT 1
      ) co ON TRUE;
    `;

    const rows = await query(sql);

    /**
     * 2. Decision + scoring logic
     */
    const decisions = rows.map((ws: any) => {
      // --- Infrastructure stress
      const capacityRatio =
        ws.current_capacity_liters / ws.design_capacity_liters;

      let infraScore = 0;
      if (capacityRatio < 0.3) infraScore = 30;
      else if (capacityRatio < 0.6) infraScore = 20;
      else infraScore = 10;

      // --- Population impact
      const populationScore =
        ws.population_served > 3000
          ? 25
          : ws.population_served > 1500
          ? 18
          : 10;

      // --- Community pressure
      const signalScore =
        ws.signal_score > 7 ? 20 : ws.signal_score > 4 ? 12 : 5;

      // --- Climate stress
      const climateScore =
        ws.rainfall_mm < 10 || ws.temperature_c > 35 ? 15 : 5;

      // --- Operational status
      const statusScore =
        ws.operational_status === "NON_FUNCTIONAL"
          ? 10
          : ws.operational_status === "LIMITED"
          ? 6
          : 3;

      const priority_score =
        infraScore +
        populationScore +
        signalScore +
        climateScore +
        statusScore;

      /**
       * 3. Investment type decision
       */
      let investment_type = "MONITOR";

      if (ws.operational_status === "NON_FUNCTIONAL") {
        investment_type = "REPAIR_OR_REPLACE";
      } else if (capacityRatio < 0.4) {
        investment_type = "EMERGENCY_REFILL";
      } else if (ws.operational_status === "LIMITED") {
        investment_type = "UPGRADE";
      }

      /**
       * 4. Size estimation
       */
      const required_daily_liters = ws.population_served * 20;
      const recommended_storage_liters = Math.round(
        required_daily_liters * 2.5
      );

      /**
       * 5. Budget estimation
       */
      const baseCosts: any = {
        WELL: 12000,
        BOREHOLE: 45000,
        BERKAD: 25000,
        SPRING: 18000,
      };

      let estimated_budget = baseCosts[ws.source_type] || 15000;

      if (priority_score > 70) estimated_budget *= 1.2;
      if (climateScore > 10) estimated_budget *= 1.15;
      if (investment_type === "EMERGENCY_REFILL")
        estimated_budget *= 1.25;

      return {
        priority_rank: priority_score,
        location: {
          district: ws.district,
          village: ws.village,
        },
        water_source: {
          id: ws.id,
          name: ws.name,
          type: ws.source_type,
        },
        recommended_investment: investment_type,
        sizing: {
          required_daily_liters,
          recommended_storage_liters,
        },
        estimated_budget_usd: {
          min: Math.round(estimated_budget * 0.9),
          max: Math.round(estimated_budget * 1.1),
        },
        explanation: {
          infra_score: infraScore,
          population_score: populationScore,
          community_score: signalScore,
          climate_score: climateScore,
          status_score: statusScore,
        },
      };
    });

    /**
     * 6. Sort by priority
     */
    decisions.sort((a, b) => b.priority_rank - a.priority_rank);

    return NextResponse.json({
      count: decisions.length,
      data: decisions,
    });
  } catch (error) {
    console.error("Investment Prioritization Error:", error);
    return NextResponse.json(
      { error: "Failed to calculate investment priorities" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { evaluateWaterStress } from "../../../services/stressEvaluator";

export async function GET() {
  try {
    const data = await evaluateWaterStress();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Water Stress API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch water stress data" },
      { status: 500 }
    );
  }
}

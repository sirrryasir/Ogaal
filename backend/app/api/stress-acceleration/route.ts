import { NextRequest, NextResponse } from "next/server";
import { getStressAcceleration } from "../../../services/stressAccelerationService";

export async function GET(req: NextRequest) {
  try {
    const data = await getStressAcceleration();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Stress Acceleration API error:", err);
    return NextResponse.json({ error: "Failed to fetch stress acceleration" }, { status: 500 });
  }
}



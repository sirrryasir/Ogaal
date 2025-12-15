import { NextResponse } from "next/server";
import { getLocationsData, callAI } from "../../../lib/aiClient";

export async function GET() {
  try {
    const locations = await getLocationsData();

    // --- batch call AI ---
    const results = await Promise.all(
      locations.map(async (loc: any) => {
        const aiResult = await callAI(loc);
        return { ...loc, ...aiResult };
      })
    );

    return NextResponse.json({ count: results.length, results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch water stress data" }, { status: 500 });
  }
}

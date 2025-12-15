import { NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Simple mock for OpenAI if no key
const mockOpenAI = {
  chat: {
    completions: {
      create: async () => ({
        choices: [
          {
            message: {
              content:
                "DIGNIIN: Roob yar ayaa la filayaa. Kaydi biyaha. (WARNING: Low rain expected. Save water.)",
            },
          },
        ],
      }),
    },
  },
};

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : mockOpenAI;

export async function POST(req: Request) {
  try {
    // 1. Fetch Weather Data (Hargeisa)
    const weatherRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=9.56&longitude=44.06&daily=precipitation_sum,temperature_2m_max&past_days=7&timezone=auto"
    );
    const weatherData = await weatherRes.json();

    // Calculate 7-day total rain
    const recentRain = weatherData.daily.precipitation_sum.reduce(
      (a: number, b: number) => a + b,
      0
    );
    const avgTemp =
      weatherData.daily.temperature_2m_max.reduce(
        (a: number, b: number) => a + b,
        0
      ) / 7;

    // 2. Fetch Report Stats
    let lowWaterReports = 0;
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7);

      // Simple keyword search in report_content
      lowWaterReports = await prisma.report.count({
        where: {
          report_content: { contains: "low", mode: "insensitive" },
          timestamp: { gt: cutoffDate },
        },
      });
    } catch (e) {
      console.warn("DB Access failed in route (read):", e);
      // Fallback to mock data if DB fails (e.g. during build)
      lowWaterReports = 5;
    }

    // 3. Determine Risk Rules
    let riskLevel = "Low";
    if (recentRain < 5 && lowWaterReports > 3) riskLevel = "Medium";
    if (recentRain < 2 && lowWaterReports > 5) riskLevel = "High";
    if (recentRain < 1 && lowWaterReports > 10) riskLevel = "Severe";

    // 4. Generate AI Message
    let aiMessage = "DIGNIIN: Roob yar ayaa la filayaa. Kaydi biyaha."; // Default
    try {
      // @ts-ignore
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert drought analyst. Speak in Somali. Keep it very short.",
          },
          {
            role: "user",
            content: `Generate a short drought warning for Hargeisa. Rain: ${recentRain}mm. Low water reports: ${lowWaterReports}. Risk: ${riskLevel}.`,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      aiMessage = completion.choices[0].message.content || aiMessage;
    } catch (e) {
      console.warn("OpenAI failed:", e);
    }

    // 5. Save Prediction (Update Village Risk & Create Alert)
    try {
      // Assuming 'Hargeisa' exists or we find first
      const village = await prisma.village.findFirst({
        where: { name: { contains: "Hargeisa", mode: "insensitive" } },
      });

      if (village) {
        await prisma.village.update({
          where: { id: village.id },
          data: { drought_risk_level: riskLevel },
        });

        await prisma.alert.create({
          data: {
            village_id: village.id,
            message: aiMessage,
            severity: riskLevel === "Low" ? "Info" : "Warning",
          },
        });
      }
    } catch (e) {
      console.warn("DB Access failed in route (write):", e);
    }

    return NextResponse.json({
      village: "Hargeisa",
      riskLevel,
      rainfall: recentRain,
      temp: avgTemp,
      message: aiMessage,
      reports: lowWaterReports,
    });
  } catch (error) {
    console.error("AI Drought Error:", error);
    return NextResponse.json(
      { error: "Failed to generate alert" },
      { status: 500 }
    );
  }
}

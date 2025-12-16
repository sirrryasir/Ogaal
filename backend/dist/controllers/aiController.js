import { prisma } from "../config/prisma.js";
import OpenAI from "openai";
const mockOpenAI = {
    chat: {
        completions: {
            create: async () => ({
                choices: [
                    {
                        message: {
                            content: "DIGNIIN: Roob yar ayaa la filayaa. Kaydi biyaha. (WARNING: Low rain expected. Save water.)",
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
const getForecast = async (req, res) => {
    try {
        const { village_id } = req.query;
        const prediction = await prisma.aIPrediction.findFirst({
            where: { village_id: Number(village_id) },
            orderBy: { created_at: "desc" },
        });
        if (prediction) {
            res.json(prediction);
            return;
        }
        res.status(404).json({ message: "No recent forecast available" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
const saveForecast = async (req, res) => {
    try {
        const { village_id, prediction_date, drought_risk, predicted_level, confidence_score, } = req.body;
        const prediction = await prisma.aIPrediction.create({
            data: {
                village_id,
                prediction_date: new Date(prediction_date),
                drought_risk,
                predicted_level,
                confidence_score,
            },
        });
        await prisma.village.update({
            where: { id: village_id },
            data: { drought_risk_level: predicted_level },
        });
        res.status(201).json(prediction);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
const generateDroughtAlert = async (req, res) => {
    try {
        // 1. Fetch Weather Data (Hargeisa) - Hardcoded for demo/Hargeisa
        const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=9.56&longitude=44.06&daily=precipitation_sum,temperature_2m_max&past_days=7&timezone=auto");
        const weatherData = await weatherRes.json();
        const recentRain = weatherData.daily.precipitation_sum.reduce((a, b) => a + b, 0);
        const avgTemp = weatherData.daily.temperature_2m_max.reduce((a, b) => a + b, 0) / 7;
        // 2. Fetch Report Stats
        let lowWaterReports = 0;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        lowWaterReports = await prisma.report.count({
            where: {
                content: { contains: "low", mode: "insensitive" }, // Changed 'report_content' to 'content' to match backend schema? No, backend schema has 'content'
                timestamp: { gt: cutoffDate },
            },
        });
        // 3. Determine Risk Rules
        let riskLevel = "Low";
        if (recentRain < 5 && lowWaterReports > 3)
            riskLevel = "Medium";
        if (recentRain < 2 && lowWaterReports > 5)
            riskLevel = "High";
        if (recentRain < 1 && lowWaterReports > 10)
            riskLevel = "Severe";
        // 4. Generate AI Message
        let aiMessage = "DIGNIIN: Roob yar ayaa la filayaa. Kaydi biyaha.";
        try {
            // @ts-ignore
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert drought analyst. Speak in Somali. Keep it very short.",
                    },
                    {
                        role: "user",
                        content: `Generate a short drought warning for Hargeisa. Rain: ${recentRain}mm. Low water reports: ${lowWaterReports}. Risk: ${riskLevel}.`,
                    },
                ],
                model: "gpt-3.5-turbo",
            });
            aiMessage = completion.choices[0].message.content || aiMessage;
        }
        catch (e) {
            console.warn("OpenAI failed:", e);
        }
        // 5. Save/Update
        // Find Hargeisa
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
        res.json({
            village: "Hargeisa",
            riskLevel,
            rainfall: recentRain,
            temp: avgTemp,
            message: aiMessage,
            reports: lowWaterReports,
        });
    }
    catch (error) {
        console.error("AI Drought Error:", error);
        res.status(500).json({ error: "Failed to generate alert" });
    }
};
export default {
    getForecast,
    saveForecast,
    generateDroughtAlert,
};
//# sourceMappingURL=aiController.js.map
import { prisma } from "../config/prisma.js";
const getForecast = async (req, res) => {
    try {
        const { village_id } = req.query;
        // Check if we have a recent prediction
        const prediction = await prisma.aIPrediction.findFirst({
            where: { village_id: Number(village_id) },
            orderBy: { created_at: "desc" },
        });
        if (prediction) {
            res.json(prediction);
            return;
        }
        // If no prediction, we might trigger one or return "No data"
        // For now, return empty
        res.status(404).json({ message: "No recent forecast available" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
const saveForecast = async (req, res) => {
    try {
        const { village_id, prediction_date, drought_risk, predicted_level, confidence_score, } = req.body;
        // This endpoint would be called by the Python AI Engine
        const prediction = await prisma.aIPrediction.create({
            data: {
                village_id,
                prediction_date: new Date(prediction_date),
                drought_risk,
                predicted_level,
                confidence_score,
            },
        });
        // Also update village risk level
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
export default {
    getForecast,
    saveForecast,
};
//# sourceMappingURL=aiController.js.map
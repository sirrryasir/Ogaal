import { prisma } from "../config/prisma.js";
// Get all Villages
export const getVillages = async (req, res) => {
    try {
        const villages = await prisma.village.findMany();
        res.json(villages);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all WaterSources (with Village data)
export const getWaterSources = async (req, res) => {
    try {
        const sources = await prisma.waterSource.findMany({
            include: {
                village: true,
            },
        });
        // Map to flat structure
        const flatSources = sources.map((b) => ({
            ...b,
            village_name: b.village.name,
            drought_risk_level: b.village.drought_risk_level,
        }));
        res.json(flatSources);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Submit Report (Agent App)
export const submitReport = async (req, res) => {
    const { water_source_id, village_id, reporter_type, report_content } = req.body;
    try {
        const report = await prisma.report.create({
            data: {
                water_source_id: Number(water_source_id),
                village_id: Number(village_id),
                reporter_type,
                content: report_content, // Changed from report_content to content in schema
            },
        });
        res.json({ success: true, id: report.id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get Reports
export const getReports = async (req, res) => {
    try {
        const reports = await prisma.report.findMany({
            orderBy: {
                timestamp: "desc",
            },
        });
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get Alerts
export const getAlerts = async (req, res) => {
    try {
        const alerts = await prisma.alert.findMany({
            orderBy: {
                created_at: "desc",
            },
        });
        res.json(alerts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Create Alert (Admin/AI)
export const createAlert = async (req, res) => {
    const { village_id, message, severity } = req.body;
    try {
        await prisma.alert.create({
            data: {
                village_id,
                message,
                severity,
            },
        });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Add WaterSource (Dashboard)
export const addWaterSource = async (req, res) => {
    const { village_id, name, status, water_level, type } = req.body;
    try {
        const source = await prisma.waterSource.create({
            data: {
                village_id,
                name,
                status,
                water_level,
                type: type || "Borehole",
            },
        });
        res.json({ success: true, id: source.id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Send SMS Mock
export const sendSms = (req, res) => {
    const { to, message } = req.body;
    console.log(`[SMS MOCK] Sending to ${to}: "${message}"`);
    res.json({ success: true, status: "sent", message: "SMS request received" });
};
// AI Simulation Endpoint
export const updateRisk = async (req, res) => {
    const riskLevels = ["Low", "Medium", "High", "Severe"];
    const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    let aiSummary = "";
    try {
        const allVillages = await prisma.village.findMany();
        if (allVillages.length > 0) {
            const village = allVillages[Math.floor(Math.random() * allVillages.length)];
            await prisma.village.update({
                where: { id: village.id },
                data: { drought_risk_level: randomRisk },
            });
            aiSummary += `Updated ${village.name} risk to ${randomRisk}. `;
            if (randomRisk === "High" || randomRisk === "Severe") {
                const messages = [
                    `Drought Risk escalated to ${randomRisk}. Immediate water rationing required.`,
                    `AI Prediction: Water tables dropping rapidly in ${village.name}.`,
                    `Urgent: ${randomRisk} drought conditions detected.`,
                ];
                const msg = messages[Math.floor(Math.random() * messages.length)];
                await prisma.alert.create({
                    data: {
                        village_id: village.id,
                        message: msg,
                        severity: "Critical",
                    },
                });
                aiSummary += "Critical Alert generated. ";
            }
            else {
                if (Math.random() > 0.5) {
                    const advisories = [
                        `Predicted rainfall in 3 days. Prepare catchment systems.`,
                        `Water usage optimization recommended.`,
                        `Groundwater levels stable.`,
                    ];
                    const adv = advisories[Math.floor(Math.random() * advisories.length)];
                    await prisma.alert.create({
                        data: {
                            village_id: village.id,
                            message: `AI Advisory: ${adv}`,
                            severity: "Info",
                        },
                    });
                    aiSummary += "Advisory generated.";
                }
            }
        }
        const allSources = await prisma.waterSource.findMany();
        if (allSources.length > 0) {
            const source = allSources[Math.floor(Math.random() * allSources.length)];
            const change = Math.random() * 10 - 5; // +/- 5%
            let newLevel = Math.max(0, Math.min(100, (source.water_level || 100) + change));
            await prisma.waterSource.update({
                where: { id: source.id },
                data: { water_level: newLevel },
            });
            aiSummary += ` Adjusted ${source.name} water level to ${newLevel.toFixed(1)}%.`;
        }
        res.json({ success: true, summary: aiSummary });
    }
    catch (error) {
        res.status(500).json({ error: "Simulation failed" });
    }
};
export default {
    getVillages,
    getWaterSources, // Renamed
    submitReport,
    getReports,
    getAlerts,
    createAlert,
    addWaterSource, // Renamed
    sendSms,
    updateRisk,
};
//# sourceMappingURL=apiController.js.map
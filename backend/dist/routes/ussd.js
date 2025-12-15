import express from "express";
import { prisma } from "../config/prisma.js";
const router = express.Router();
router.post("/", async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let response = "";
    let type = "CON"; // CON = Continue, END = End
    // text is a string like "1*2*1" representing the input path
    const parts = text ? text.split("*") : [];
    try {
        if (text === "") {
            // Main Menu
            response = `Welcome to AquaGuard
1. Check Water Availability
2. Check Drought Risk
3. Report Borehole Status
4. Get Water-Saving Tips`;
        }
        else if (parts[0] === "1") {
            // 1. Check Water Availability
            if (parts.length === 1) {
                // Ask for village
                response = "Enter Village Name:";
            }
            else if (parts.length === 2) {
                // Return status
                const villageName = parts[1];
                // Mock lookup
                const village = await prisma.village.findFirst({
                    where: {
                        name: {
                            contains: villageName,
                            mode: "insensitive", // SQLite LIKE is case-insensitive usually, safe to match here
                        },
                    },
                });
                if (village) {
                    const boreholes = await prisma.borehole.findMany({
                        where: { village_id: village.id },
                    });
                    if (boreholes.length > 0) {
                        const bh = boreholes[0];
                        response = `${village.name} Water: ${bh.status}
Level: ${bh.water_level}%
Price: 5 KES/20L
Last Update: Today`;
                    }
                    else {
                        response = `No boreholes found for ${village.name}`;
                    }
                }
                else {
                    response = `Village ${villageName} not found.`;
                }
                type = "END";
            }
        }
        else if (parts[0] === "2") {
            // 2. Drought Risk
            if (parts.length === 1) {
                response = "Enter Village Name:";
            }
            else if (parts.length === 2) {
                const villageName = parts[1];
                const village = await prisma.village.findFirst({
                    where: {
                        name: {
                            contains: villageName,
                            mode: "insensitive",
                        },
                    },
                });
                if (village) {
                    response = `Drought Risk for ${village.name}: ${village.drought_risk_level}
Rain Prob: 20%
Advice: Store water now.`;
                }
                else {
                    response = `Village not found.`;
                }
                type = "END";
            }
        }
        else if (parts[0] === "3") {
            // 3. Report Status
            if (parts.length === 1) {
                response = "Enter Borehole ID:";
            }
            else if (parts.length === 2) {
                response = `Select Status:
1. Water Finished
2. Pump Broken
3. Water Available`;
            }
            else if (parts.length === 3) {
                const statusMap = {
                    "1": "Low Water",
                    "2": "Broken",
                    "3": "Working",
                };
                const status = statusMap[parts[2]] || "Unknown";
                const bhId = parseInt(parts[1]); // Ensure Int
                // Update DB
                if (!isNaN(bhId)) {
                    await prisma.report.create({
                        data: {
                            borehole_id: bhId,
                            reporter_type: "USSD",
                            report_content: `User reported status: ${status}`,
                        },
                    });
                    response = `Report received for Borehole ${bhId}. Thank you.`;
                }
                else {
                    response = "Invalid Borehole ID.";
                }
                type = "END";
            }
        }
        else if (parts[0] === "4") {
            // 4. Tips
            response = `1. Use drip irrigation
2. Harvest rainwater
3. Cover water tanks`;
            type = "END";
        }
        else {
            response = "Invalid option.";
            type = "END";
        }
    }
    catch (error) {
        console.error("USSD Error:", error);
        response = "An error occurred. Please try again.";
        type = "END";
    }
    res.json({ message: response, type });
});
export default router;
//# sourceMappingURL=ussd.js.map
import express, { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

const handleUssdRequest = async (req: Request, res: Response) => {
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
3. Report Water Source Status
4. Get Water-Saving Tips`;
    } else if (parts[0] === "1") {
      // 1. Check Water Availability
      if (parts.length === 1) {
        // Ask for village
        response = "Enter Village Name:";
      } else if (parts.length === 2) {
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
          const sources = await prisma.waterSource.findMany({
            where: { village_id: village.id },
          });
          if (sources.length > 0) {
            const src = sources[0]; // Just showing first one for demo
            response = `${village.name} Water: ${src.status}
Level: ${src.water_level}%
Last Update: Today`;
          } else {
            response = `No water sources found for ${village.name}`;
          }
        } else {
          response = `Village ${villageName} not found.`;
        }
        type = "END";
      }
    } else if (parts[0] === "2") {
      // 2. Drought Risk
      if (parts.length === 1) {
        response = "Enter Village Name:";
      } else if (parts.length === 2) {
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
Advice: Store water now.`;
        } else {
          response = `Village not found.`;
        }
        type = "END";
      }
    } else if (parts[0] === "3") {
      // 3. Report Status
      if (parts.length === 1) {
        response = "Enter Source ID:";
      } else if (parts.length === 2) {
        response = `Select Status:
1. Water Finished
2. Pump Broken
3. Water Available`;
      } else if (parts.length === 3) {
        const statusMap: Record<string, string> = {
          "1": "Low Water",
          "2": "Broken",
          "3": "Working",
        };
        const status = statusMap[parts[2]] || "Unknown";
        const srcId = parseInt(parts[1]); // Ensure Int
        // Update DB
        if (!isNaN(srcId)) {
          await prisma.report.create({
            data: {
              water_source_id: srcId,
              reporter_type: "USSD",
              content: `User reported status: ${status}`,
            },
          });
          response = `Report received for Source ${srcId}. Thank you.`;
        } else {
          response = "Invalid Source ID.";
        }
        type = "END";
      }
    } else if (parts[0] === "4") {
      // 4. Tips
      response = `1. Use drip irrigation
2. Harvest rainwater
3. Cover water tanks`;
      type = "END";
    } else {
      response = "Invalid option.";
      type = "END";
    }
  } catch (error) {
    console.error("USSD Error:", error);
    response = "An error occurred. Please try again.";
    type = "END";
  }
  res.json({ message: response, type });
};

export default handleUssdRequest;

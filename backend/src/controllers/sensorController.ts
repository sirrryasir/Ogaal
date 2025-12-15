import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

const reportData = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      water_source_id,
      soil_moisture,
      temperature,
      humidity,
      water_level,
    } = req.body;

    const reading = await prisma.sensorReading.create({
      data: {
        water_source_id: Number(water_source_id),
        soil_moisture: soil_moisture ? parseFloat(soil_moisture) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        humidity: humidity ? parseFloat(humidity) : null,
        water_level: water_level ? parseFloat(water_level) : null,
        timestamp: new Date(),
      },
    });

    // Update water source current status/level
    if (water_level) {
      await prisma.waterSource.update({
        where: { id: Number(water_source_id) },
        data: { water_level: parseFloat(water_level) },
      });
    }

    res.status(201).json(reading);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const readings = await prisma.sensorReading.findMany({
      where: { water_source_id: Number(id) },
      orderBy: { timestamp: "desc" },
      take: 50,
    });
    res.json(readings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  reportData,
  getHistory,
};

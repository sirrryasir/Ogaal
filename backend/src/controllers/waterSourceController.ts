import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Get all water sources
const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const sources = await prisma.waterSource.findMany({
      include: {
        village: true,
        sensor_readings: {
          take: 1,
          orderBy: { timestamp: "desc" },
        },
      },
    });
    res.json(sources);
  } catch (error) {
    console.error("GET /water-sources error:", error);
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

// Create a new water source
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      village_id, 
      village_name, 
      district_name,
      name, 
      type, 
      latitude, 
      longitude,
      status,
      water_level,
      design_capacity_liters,
      current_capacity_liters,
      population_served,
      installation_date,
    } = req.body;

    let finalVillageId = village_id;

    // If village_name and district_name are provided, find or create village
    if (village_name && district_name && !village_id) {
      // Find or create region
      let region = await prisma.region.findFirst({
        where: { name: "Maroodi Jeex" },
      });
      if (!region) {
        region = await prisma.region.create({
          data: { name: "Maroodi Jeex" },
        });
      }

      // Find or create district
      let district = await prisma.district.findFirst({
        where: { 
          name: district_name,
          region_id: region.id,
        },
      });
      if (!district) {
        district = await prisma.district.create({
          data: {
            name: district_name,
            region_id: region.id,
          },
        });
      }

      // Find or create village
      let village = await prisma.village.findFirst({
        where: {
          name: village_name,
          district_id: district.id,
        },
      });
      if (!village) {
        village = await prisma.village.create({
          data: {
            name: village_name,
            district_id: district.id,
            latitude: latitude || null,
            longitude: longitude || null,
            drought_risk_level: "Low",
          },
        });
      }
      finalVillageId = village.id;
    }

    if (!finalVillageId) {
      res.status(400).json({ message: "Village ID or village/district names required" });
      return;
    }

    const source = await prisma.waterSource.create({
      data: {
        village_id: Number(finalVillageId),
        name,
        type: type || "Borehole",
        latitude: latitude || null,
        longitude: longitude || null,
        status: status || "Working",
        water_level: water_level || null,
      },
    });
    res.status(201).json(source);
  } catch (error: any) {
    console.error("Create water source error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update status
const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, water_level } = req.body;

    const source = await prisma.waterSource.update({
      where: { id: Number(id) },
      data: {
        status,
        water_level,
        last_maintained: new Date(),
      },
    });
    res.json(source);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  getAll,
  create,
  updateStatus,
  deleteSource: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await prisma.waterSource.delete({ where: { id: Number(id) } });
      res.json({ message: "Water source deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};

import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Get all water sources
// Get all water sources with filtering
const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = (req.query.search as string) || "";
    const region = (req.query.region as string) || "";
    const district = (req.query.district as string) || "";
    const status = (req.query.status as string) || "";

    const skip = (page - 1) * limit;

    // Build filter object
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
        { village: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (district) {
      whereClause.village = {
        ...(whereClause.village || {}),
        district: {
          name: district,
        },
      };
    }

    if (region && !district) {
      // If filtering by region but not specific district
      whereClause.village = {
        ...(whereClause.village || {}),
        district: {
          ...(whereClause.village?.district || {}),
          region: {
            name: region,
          },
        },
      };
    }

    // Execute query with pagination and filters
    const [total, sources] = await Promise.all([
      prisma.waterSource.count({ where: whereClause }),
      prisma.waterSource.findMany({
        where: whereClause,
        include: {
          village: {
            include: {
              district: {
                include: {
                  region: true,
                },
              },
            },
          },
          sensor_readings: {
            take: 1,
            orderBy: { timestamp: "desc" },
          },
        },
        skip,
        take: limit,
        orderBy: { id: "desc" },
      }),
    ]);

    res.json({
      data: sources,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /water-sources error:", error);
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

// Create a new water source
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { village_id, name, type, latitude, longitude } = req.body;
    const source = await prisma.waterSource.create({
      data: {
        village_id: Number(village_id),
        name,
        type,
        latitude,
        longitude,
      },
    });
    res.status(201).json(source);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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

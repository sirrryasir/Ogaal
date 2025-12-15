import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const interventions = await prisma.intervention.findMany({
      include: {
        ngo: { select: { name: true } },
        water_source: { select: { name: true, type: true } },
        village: {
          select: { name: true, district: { select: { name: true } } },
        },
      },
    });
    res.json(interventions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      ngo_id,
      water_source_id,
      village_id,
      type,
      description,
      start_date,
    } = req.body;

    // Validate that the user belongs to the NGO if they are an NGO worker
    // @ts-ignore
    if (req.user.role === "NGO_WORKER" && req.user.ngo_id !== ngo_id) {
      res
        .status(403)
        .json({ message: "You can only create interventions for your NGO" });
      return;
    }

    const intervention = await prisma.intervention.create({
      data: {
        ngo_id,
        water_source_id,
        village_id,
        type,
        description,
        start_date: start_date ? new Date(start_date) : null,
        status: "Planned",
      },
    });
    res.status(201).json(intervention);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const intervention = await prisma.intervention.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(intervention);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  getAll,
  create,
  updateStatus,
};

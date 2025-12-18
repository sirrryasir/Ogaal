import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Get all reports
const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        water_source: true,
        village: true,
        user: true,
      },
      orderBy: { timestamp: "desc" },
    });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new report
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { village_id, water_source_id, content, reporter_type, status } = req.body;

    console.log("Raw req.body:", JSON.stringify(req.body, null, 2));
    console.log("Extracted data:", {
      village_id,
      water_source_id,
      content,
      reporter_type,
    });
    console.log(
      "Content type:",
      typeof content,
      "Content value:",
      JSON.stringify(content)
    );

    // Validate required fields
    if (!village_id || !water_source_id || !content || content.trim() === "") {
      console.log("Validation failed:", {
        village_id: !!village_id,
        water_source_id: !!water_source_id,
        content: !!content,
        contentTrimmed: content?.trim(),
      });
      res.status(400).json({
        message:
          "Missing required fields: village_id, water_source_id, and content are required",
      });
      return;
    }

    const trimmedContent = content.trim();
    console.log("Creating report with trimmed content:", trimmedContent);

    const report = await prisma.report.create({
      data: {
        village_id: Number(village_id),
        water_source_id: Number(water_source_id),
        content: trimmedContent,
        reporter_type: reporter_type || "App",
        status: status,
        timestamp: new Date(),
      },
    });

    console.log("Report created successfully:", report);
    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify a report (Approve)
const verifyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const report = await prisma.report.update({
      where: { id: Number(id) },
      data: { is_verified: true },
    });
    res.json(report);
  } catch (error) {
    console.error("Error verifying report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a report (Reject)
const deleteReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.report.delete({ where: { id: Number(id) } });
    res.json({ message: "Report deleted" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  getAll,
  create,
  verifyReport,
  deleteReport,
};

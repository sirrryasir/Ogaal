import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// Get all Villages
export const getVillages = async (req: Request, res: Response) => {
  try {
    const villages = await prisma.village.findMany();
    res.json(villages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all WaterSources (with Village data), optionally filter by village_id
export const getWaterSources = async (req: Request, res: Response) => {
  try {
    const { village_id } = req.query;
    const whereClause = village_id ? { village_id: Number(village_id) } : {};

    const sources = await prisma.waterSource.findMany({
      where: whereClause,
      include: {
        village: true,
      },
    });

    // Map to flat structure
    const flatSources = sources.map((b: any) => ({
      ...b,
      village_name: b.village.name,
      drought_risk_level: b.village.drought_risk_level,
    }));

    res.json(flatSources);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Submit Report (Agent App)
export const submitReport = async (req: Request, res: Response) => {
  const { water_source_id, village_id, reporter_type, content, status } =
    req.body;

  try {
    const report = await prisma.report.create({
      data: {
        water_source: { connect: { id: Number(water_source_id) } },
        village: { connect: { id: Number(village_id) } },
        reporter_type,
        content: content,
        status: status, // Store the report status
      },
    });

    // Update water source status if provided
    if (status && water_source_id) {
      await prisma.waterSource.update({
        where: { id: Number(water_source_id) },
        data: { status },
      });
    }

    res.json({ success: true, id: report.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Reports
export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        timestamp: "desc",
      },
      include: {
        village: true,
        water_source: true,
      },
    });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Alerts
export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create Alert (Admin/AI)
export const createAlert = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Add WaterSource (Dashboard)
export const addWaterSource = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Send SMS Mock
export const sendSms = (req: Request, res: Response) => {
  const { to, message } = req.body;
  console.log(`[SMS MOCK] Sending to ${to}: "${message}"`);
  res.json({ success: true, status: "sent", message: "SMS request received" });
};

// AI Simulation Endpoint
export const updateRisk = async (req: Request, res: Response) => {
  const riskLevels = ["Low", "Medium", "High", "Severe"];
  const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
  let aiSummary = "";

  try {
    const allVillages = await prisma.village.findMany();

    if (allVillages.length > 0) {
      const village =
        allVillages[Math.floor(Math.random() * allVillages.length)];

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
      } else {
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
      let newLevel = Math.max(
        0,
        Math.min(100, (source.water_level || 100) + change)
      );

      await prisma.waterSource.update({
        where: { id: source.id },
        data: { water_level: newLevel },
      });

      aiSummary += ` Adjusted ${source.name} water level to ${newLevel.toFixed(
        1
      )}%.`;
    }

    res.json({ success: true, summary: aiSummary });
  } catch (error) {
    res.status(500).json({ error: "Simulation failed" });
  }
};

// Dashboard Stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalSources, pendingReports, criticalZones, recentReports] =
      await Promise.all([
        prisma.waterSource.count(),
        prisma.report.count({ where: { is_verified: false } }),
        prisma.village.count({
          where: {
            OR: [
              { drought_risk_level: "High" },
              { drought_risk_level: "Severe" },
            ],
          },
        }),
        prisma.report.findMany({
          take: 5,
          orderBy: { timestamp: "desc" },
          include: { village: true, water_source: true },
        }),
      ]);

    res.json({
      totalSources,
      pendingReports,
      criticalZones,
      recentReports,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Admin Water Sources (hierarchical with filtering)
export const getAdminWaterSources = async (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;

    const regions = await prisma.region.findMany({
      include: {
        districts: {
          include: {
            villages: {
              include: {
                water_sources: true
              }
            }
          }
        }
      }
    });

    // Map to frontend structure
    const mappedRegions = regions.map(region => {
      const districts = region.districts.map(district => {
        const villages = district.villages.map(village => {
          let sources = village.water_sources.map(source => {
            let mappedStatus = 'functional'; // default
            if (source.status === 'Working') mappedStatus = 'functional';
            else if (source.status === 'Needed Maintenance') mappedStatus = 'needs_repair';
            else if (source.status === 'Broken') mappedStatus = 'non_functional';
            else mappedStatus = source.status?.toLowerCase().replace(' ', '_') || 'functional';

            return {
              id: source.id,
              source_name: source.name,
              water_source_type: source.type,
              status: mappedStatus,
              lat: source.latitude,
              lng: source.longitude
            };
          });

          // Filter sources if status or type provided
          if (status) {
            sources = sources.filter(s => s.status === status);
          }
          if (type) {
            sources = sources.filter(s => s.water_source_type === type);
          }

          const totalSources = sources.length;
          const functional = sources.filter(s => s.status === 'functional').length;
          const needsRepair = sources.filter(s => s.status === 'needs_repair').length;
          const nonFunctional = sources.filter(s => s.status === 'non_functional').length;
          const avgStatus = totalSources > 0 ? Math.round((functional / totalSources) * 100) : 0;

          return {
            name: village.name,
            totalSources,
            avgStatus,
            functional,
            needsRepair,
            nonFunctional,
            sources
          };
        });

        const totalSources = villages.reduce((sum, v) => sum + v.totalSources, 0);
        const avgStatus = villages.length > 0 ? Math.round(villages.reduce((sum, v) => sum + v.avgStatus, 0) / villages.length) : 0;

        return {
          name: district.name,
          totalSources,
          avgStatus,
          villages
        };
      });

      const totalSources = districts.reduce((sum, d) => sum + d.totalSources, 0);
      const avgStatus = districts.length > 0 ? Math.round(districts.reduce((sum, d) => sum + d.avgStatus, 0) / districts.length) : 0;

      return {
        region: region.name,
        totalSources,
        avgStatus,
        districts
      };
    });

    res.json(mappedRegions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
  getDashboardStats,
  getAdminWaterSources,
};

"use server";

import prisma from "./prisma";

export interface WaterSource {
  id: number;
  name: string;
  lat: number;
  lng: number;
  village: string;
  status: string; // Changed to string to match Prisma model, or we could use an Enum in Prisma
  last_updated: Date;
}

export async function getWaterSources(): Promise<WaterSource[]> {
  try {
    const res = await prisma.borehole.findMany({
      include: {
        village: true,
      },
    });

    return res.map((b) => ({
      id: b.id,
      name: b.name,
      lat: b.village.latitude || 0,
      lng: b.village.longitude || 0,
      village: b.village.name,
      status: b.status || "unknown", // Map backend status
      last_updated: b.last_maintained || new Date(),
    }));
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error);
    return [
      {
        id: 1,
        name: "Central Borehole",
        lat: 9.562,
        lng: 44.065,
        village: "Hargeisa",
        status: "working",
        last_updated: new Date(),
      },
      {
        id: 2,
        name: "Village Well North",
        lat: 9.55,
        lng: 44.05,
        village: "Hargeisa",
        status: "low",
        last_updated: new Date(),
      },
      {
        id: 3,
        name: "Community Pump",
        lat: 9.57,
        lng: 44.08,
        village: "Hargeisa",
        status: "broken",
        last_updated: new Date(),
      },
      {
        id: 4,
        name: "River Access Point",
        lat: 9.54,
        lng: 44.04,
        village: "Hargeisa",
        status: "no_water",
        last_updated: new Date(),
      },
    ];
  }
}

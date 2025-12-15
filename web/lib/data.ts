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
      lat: b.latitude ?? b.village.latitude ?? 0,
      lng: b.longitude ?? b.village.longitude ?? 0,
      village: b.village.name,
      status: b.status || "unknown", // Map backend status
      last_updated: b.last_maintained || new Date(),
    }));
  } catch (error) {
    console.error("Database connection failed:", error);
    // Return empty array or throw error to enforce real data usage
    return [];
  }
}

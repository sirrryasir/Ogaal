import api from "./api";

export interface Village {
  id: number;
  name: string;
}

export interface WaterSource {
  id: number;
  name: string;
  lat: number;
  lng: number;
  village_id: number;
  village: string;
  status: string;
  last_updated: Date;
}

export async function getVillages(): Promise<Village[]> {
  try {
    const res = await api.get("/villages");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch villages:", error);
    return [];
  }
}

export async function getWaterSources(): Promise<WaterSource[]> {
  try {
    const res = await api.get("/water-sources");
    return res.data.map((b: any) => ({
      id: b.id,
      name: b.name,
      lat: b.latitude ?? b.village?.latitude ?? 0,
      lng: b.longitude ?? b.village?.longitude ?? 0,
      village_id: b.village_id,
      village: b.village?.name || "Unknown",
      status: b.status || "unknown",
      last_updated: b.last_maintained
        ? new Date(b.last_maintained)
        : new Date(),
    }));
  } catch (error) {
    console.error("API Fetch failed:", error);
    return [];
  }
}

export async function submitReport(data: {
  village_id: number;
  water_source_id: number;
  report_content: string;
  reporter_type: string;
}) {
  const res = await api.post("/reports", data);
  return res.data;
}

export interface DashboardStats {
  totalSources: number;
  pendingReports: number;
  criticalZones: number;
  recentReports: any[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await api.get("/stats");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalSources: 0,
      pendingReports: 0,
      criticalZones: 0,
      recentReports: [],
    };
  }
}

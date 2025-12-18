import api from "./api";

export interface Village {
  id: number;
  name: string;
  district_id?: number;
}

export interface Region {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  region_id: number;
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

export async function getRegions(): Promise<Region[]> {
  try {
    const res = await api.get("/regions");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch regions:", error);
    return [];
  }
}

export async function getDistricts(): Promise<District[]> {
  try {
    const res = await api.get("/districts");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch districts:", error);
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
  content: string;
  reporter_type: string;
  status: string;
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

export interface AnalyticsData {
  statusData: {
    status: string;
    count: number;
    color: string;
    description?: string;
  }[];
  villageData: {
    village: string;
    count: number;
    functional: number;
    nonFunctional: number;
    population: number;
  }[];
  sourceTypeData: { type: string; count: number; functional: number }[];
  trendData: {
    month: string;
    functional: number;
    nonFunctional: number;
    repairs: number;
  }[];
}

export async function getAnalyticsData(): Promise<AnalyticsData | null> {
  try {
    const res = await api.get("/analytics");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    return null;
  }
}

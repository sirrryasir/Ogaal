import api from "./api";

export interface WaterSource {
  id: number;
  name: string;
  lat: number;
  lng: number;
  village: string;
  district?: string;
  region?: string;
  status: string;
  type?: string;
  water_level?: number;
  last_updated: Date;
}

export async function getWaterSources(): Promise<WaterSource[]> {
  try {
    const res = await api.get("/water-sources");
    if (!res.data || !Array.isArray(res.data)) {
      console.warn("API returned invalid data format:", res.data);
      return [];
    }
    return res.data.map((b: any) => ({
      id: b.id,
      name: b.name,
      lat: b.latitude ?? b.village?.latitude ?? 0,
      lng: b.longitude ?? b.village?.longitude ?? 0,
      village: b.village_name || b.village?.name || "Unknown",
      district: b.district_name || b.village?.district?.name,
      region: b.region_name || b.village?.district?.region?.name,
      status: b.status || b.operational_status || "unknown",
      type: b.type || b.source_type,
      water_level: b.water_level,
      last_updated: b.last_maintained
        ? new Date(b.last_maintained)
        : new Date(),
    }));
  } catch (error: any) {
    console.error("API Fetch failed:", error?.message || error);
    // Return empty array on error to prevent infinite loading
    return [];
  }
}

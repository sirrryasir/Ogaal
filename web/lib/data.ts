import api from "./api";

export interface WaterSource {
  id: number;
  name: string;
  lat: number;
  lng: number;
  village: string;
  status: string;
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
      village: b.village?.name || "Unknown",
      status: b.status || "unknown",
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

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
  } catch (error) {
    console.error("API Fetch failed:", error);
    return [];
  }
}

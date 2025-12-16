import api from './client';

export interface WaterSource {
  id: number;
  village_id: number;
  name: string;
  type: string;
  status: string | null;
  water_level: number | null;
  latitude: number | null;
  longitude: number | null;
  village_name: string;
  drought_risk_level: string | null;
}

export const getWaterSources = async (villageId?: number): Promise<WaterSource[]> => {
  const params = villageId ? { village_id: villageId } : {};
  const response = await api.get('/api/water-sources', { params });
  return response.data;
};
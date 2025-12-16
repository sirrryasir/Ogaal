import api from './client';

export interface Village {
  id: number;
  name: string;
  district_id: number | null;
  latitude: number | null;
  longitude: number | null;
  drought_risk_level: string | null;
}

export const getVillages = async (): Promise<Village[]> => {
  const response = await api.get('/api/villages');
  return response.data;
};
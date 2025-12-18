import api from './client';

export interface SubmitReportRequest {
  village_id: number;
  water_source_id: number;
  content: string;
  status: string;
  reporter_type?: string;
}

export interface SubmitReportResponse {
  success: boolean;
  id: number;
}

export const submitReport = async (data: SubmitReportRequest): Promise<SubmitReportResponse> => {
  const payload = {
    village_id: data.village_id,
    water_source_id: data.water_source_id,
    content: data.content,
    status: data.status,
    reporter_type: data.reporter_type || 'App',
  };

  console.log('Mobile: Sending report data:', JSON.stringify(payload, null, 2));
  console.log('Mobile: Content length:', data.content?.length, 'Content value:', JSON.stringify(data.content));

  const response = await api.post('/api/reports', payload);
  console.log('Mobile: Response received:', response.data);
  return response.data;
};
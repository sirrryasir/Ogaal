import api from './client';

export interface SubmitReportRequest {
  village_id: number;
  water_source_id?: number;
  reporter_type: string;
  report_content: string;
  status?: string;
}

export interface SubmitReportResponse {
  success: boolean;
  id: number;
}

export const submitReport = async (data: SubmitReportRequest): Promise<SubmitReportResponse> => {
  const response = await api.post('/api/reports', data);
  return response.data;
};
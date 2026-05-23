import { query } from "../lib/db";

export interface CommunityReport {
  water_source_id: number;
  queue_length?: number;
  fetch_time_minutes?: number;
  complaints_count?: number;
}

export interface CommunitySignal {
  water_source_id: number;
  queue_length_score: number;
  fetch_time_score: number;
  complaints_score: number;
  overall_signal_score: number;
}

// Save raw report to DB
export const saveCommunityReport = async (report: CommunityReport) => {
  const res = await query(
    `INSERT INTO community_reports 
     (water_source_id, queue_length, fetch_time_minutes, complaints_count) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [
      report.water_source_id,
      report.queue_length || 0,
      report.fetch_time_minutes || 0,
      report.complaints_count || 0,
    ]
  );
  return res.rows[0];
};

// Compute a signal score from a report
export const computeSignal = (report: CommunityReport): CommunitySignal => {
  const queue_length_score = Math.min(report.queue_length || 0, 10);
  const fetch_time_score = Math.min((report.fetch_time_minutes || 0) / 10, 10);
  const complaints_score = Math.min(report.complaints_count || 0, 10);

  const overall_signal_score = Math.round(
    (queue_length_score + fetch_time_score + complaints_score) / 3
  );

  return {
    water_source_id: report.water_source_id,
    queue_length_score,
    fetch_time_score,
    complaints_score,
    overall_signal_score,
  };
};

// Save computed signal to DB
export const saveCommunitySignal = async (signal: CommunitySignal) => {
  const res = await query(
    `INSERT INTO community_signals 
     (water_source_id, queue_length_score, fetch_time_score, complaints_score, overall_signal_score) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      signal.water_source_id,
      signal.queue_length_score,
      signal.fetch_time_score,
      signal.complaints_score,
      signal.overall_signal_score,
    ]
  );
  return res.rows[0];
};

// Full pipeline: report -> signal -> save
export const processCommunityReport = async (report: CommunityReport) => {
  const savedReport = await saveCommunityReport(report);
  const signal = computeSignal(report);
  const savedSignal = await saveCommunitySignal(signal);
  return savedSignal;
};

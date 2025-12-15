export async function analyzeWaterStress(payload: any) {
  const res = await fetch("http://127.0.0.1:8000/ai/water-stress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("AI engine failed");
  }

  return res.json();
}

// DECISION RESPONSE INTERFACE
export interface WaterSource {
  id: number;
  name: string;
  usable_capacity: number;
  refill_rate: number;
  daily_extracted: number;
}

export interface DecisionResponse {
  id: number;
  name: string;
  sr: number;
  sa: number;
  days_to_failure: number;
  condition: string;
  recommendation: string;
}

export async function getWaterSourceDecisions(sources: WaterSource[]): Promise<DecisionResponse[]> {
  const response = await fetch("http://localhost:8000/api/water-source-status", {  // AI FastAPI URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sources),
  });

  if (!response.ok) {
    throw new Error(`AI service error: ${response.statusText}`);
  }

  const data: DecisionResponse[] = await response.json();
  return data;
}
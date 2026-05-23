from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from domain.stress_engine import calculate_stress_metrics
from domain.decision_rules import get_decision

app = FastAPI(title="Water Source Status AI")

class WaterSourceInput(BaseModel):
    id: int
    name: str
    usable_capacity: float
    refill_rate: float
    daily_extracted: float

class WaterSourceOutput(BaseModel):
    id: int
    name: str
    sr: float
    sa: float
    days_to_failure: float
    condition: str
    recommendation: str

@app.post("/api/water-source-status", response_model=List[WaterSourceOutput])
async def water_source_status(sources: List[WaterSourceInput]):
    output = []
    for ws in sources:
        metrics = calculate_stress_metrics(
            usable_capacity=ws.usable_capacity,
            refill_rate=ws.refill_rate,
            daily_extracted=ws.daily_extracted
        )
        decision = get_decision(metrics["sr"], metrics["days_to_failure"])
        output.append(
            WaterSourceOutput(
                id=ws.id,
                name=ws.name,
                sr=metrics["sr"],
                sa=metrics["sa"],
                days_to_failure=metrics["days_to_failure"],
                condition=decision["condition"],
                recommendation=decision["recommendation"]
            )
        )
    return output

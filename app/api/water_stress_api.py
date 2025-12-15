from fastapi import APIRouter
from app.schemas.input import WaterStressInput
from app.schemas.output import WaterStressOutput
from app.services.stress_evaluator import evaluate_water_stress

router = APIRouter(prefix="/ai", tags=["Water Stress"])

@router.post("/water-stress", response_model=WaterStressOutput)
def assess_water_stress(payload: WaterStressInput):
    return evaluate_water_stress(payload.dict())

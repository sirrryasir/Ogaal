from fastapi import APIRouter
from ai.schemas.input import WaterStressInput
from ai.schemas.output import WaterStressOutput
from ai.services.stress_evaluator import evaluate_water_stress

router = APIRouter(prefix="/ai", tags=["Water Stress"])

@router.post("/water-stress", response_model=WaterStressOutput)
def assess_water_stress(payload: WaterStressInput):
    return evaluate_water_stress(payload)

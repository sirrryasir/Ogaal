from fastapi import APIRouter
from typing import List, Dict
from ai.services.stress_acceleration_service import StressAccelerationService

router = APIRouter(prefix="/stress-acceleration", tags=["AI"])

@router.get("/", response_model=List[Dict])
async def get_stress_acceleration():
    results = await StressAccelerationService.evaluate_all_sources()
    return results

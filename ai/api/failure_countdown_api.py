from fastapi import APIRouter
from typing import List, Optional
from ai.domain.failure_countdown_engine import FailureCountdownEngine
from ai.schemas.failure_countdown import FailureCountdownInput, FailureCountdownOutput

router = APIRouter(prefix="/failure-countdown", tags=["AI"])

def human_readable(days: Optional[int]) -> str:
    if days is None:
        return "Stable — no immediate risk"
    if days == 0:
        return "Emergency — immediate intervention required"
    if days < 7:
        return f"High risk — {days} day(s) remaining"
    if days < 30:
        return f"Moderate risk — {days} day(s) remaining"
    return f"Low risk — {days} day(s) remaining"

@router.post("/", response_model=dict)
def calculate_failure_countdown(sources: List[FailureCountdownInput]):
    results = []

    for source in sources:
        days = FailureCountdownEngine.calculate(
            remaining_usable_water_liters=source.remaining_usable_water_liters,
            daily_usage_liters=source.daily_usage_liters,
            refill_rate_liters_per_day=source.refill_rate_liters_per_day or 0
        )

        results.append({
            "id": source.water_source_id,
            "name": source.name,
            "days_to_failure": days,
            "status": human_readable(days)
        })

    return {"count": len(results), "data": results}

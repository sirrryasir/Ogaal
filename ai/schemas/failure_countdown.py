from pydantic import BaseModel
from typing import Optional, List

class FailureCountdownInput(BaseModel):
    water_source_id: int
    name: Optional[str] = None
    remaining_usable_water_liters: float
    daily_usage_liters: float
    refill_rate_liters_per_day: float = 0  # ✅ default 0


class FailureCountdownOutput(BaseModel):
    id: int
    name: Optional[str]
    days_to_failure: Optional[int]

class FailureCountdownResponse(BaseModel):   # ✅ Make sure this is here
    count: int
    data: List[FailureCountdownOutput]

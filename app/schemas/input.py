from pydantic import BaseModel
from typing import Optional

class WaterStressInput(BaseModel):
    rainfall_mm: float
    population: int
    water_supply_mcm: float
class WaterStressOutput(BaseModel):
    stress_level: str
    recommended_actions: Optional[str]

from pydantic import BaseModel

class WaterStressOutput(BaseModel):
    stress_level: str
    score: float
    explanation: str

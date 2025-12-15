from pydantic import BaseModel, Field
from typing import List


class WaterStressOutput(BaseModel):
    location_id: int = Field(..., example=12)

    stress_level: str = Field(
        ..., example="CRITICAL",
        description="Water stress classification"
    )

    priority_score: int = Field(
        ..., ge=0, le=100, example=100,
        description="Priority score for intervention"
    )

    reasons: List[str] = Field(
        ..., example=[
            "High number of community reports",
            "No recent intervention",
            "Majority of water sources are non-functional"
        ]
    )

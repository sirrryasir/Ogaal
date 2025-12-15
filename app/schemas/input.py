from pydantic import BaseModel, Field
from typing import List


class WaterStressInput(BaseModel):
    location_id: int = Field(..., example=12)

    total_water_sources: int = Field(
        ..., ge=0, example=4, description="Total water sources in the location"
    )

    working_sources: int = Field(
        ..., ge=0, example=1, description="Currently functional water sources"
    )

    reports_last_7_days: int = Field(
        ..., ge=0, example=6, description="Community reports in the last 7 days"
    )

    days_since_last_intervention: int = Field(
        ..., ge=0, example=21, description="Days since last maintenance or aid"
    )

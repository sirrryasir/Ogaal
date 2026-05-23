from typing import List, Dict
from ai.services.usage_collector import get_water_sources_with_last_7_days_sr
from ai.domain.stress_engine import WaterStressEngine

class StressAccelerationService:

    @staticmethod
    async def evaluate_all_sources() -> List[Dict]:
        # Returns sources + today SR + last 7 days SR
        sources = await get_water_sources_with_last_7_days_sr()
        results = []

        for src in sources:
            today_sr = src.get("today_sr", 0)
            last_7_days_sr = src.get("last_7_days_sr", [])

            sa = WaterStressEngine.compute_stress_acceleration(today_sr, last_7_days_sr)
            sa_status = WaterStressEngine.human_readable_sa(sa)

            results.append({
                "id": src["id"],
                "name": src["name"],
                "today_sr": today_sr,
                "stress_acceleration": sa,
                "status": sa_status
            })
        return results
S
# ai/services/failure_countdown_evaluator.py

from typing import Optional
from ai.domain.failure_countdown_engine import FailureCountdownEngine


class FailureCountdownEvaluator:

    def evaluate(
        self,
        remaining_usable_water_liters: float,
        daily_usage_liters: float,
        refill_rate_liters_per_day: float
    ) -> dict:

        days = FailureCountdownEngine.calculate(
            remaining_usable_water_liters=remaining_usable_water_liters,
            daily_usage_liters=daily_usage_liters,
            refill_rate_liters_per_day=refill_rate_liters_per_day
        )

        return {
            "days_to_failure": days,
            "is_stable": days is None,
            "risk_level": self._risk_level(days)
        }

    def _risk_level(self, days: Optional[int]) -> str:
        if days is None:
            return "STABLE"
        if days < 7:
            return "EMERGENCY"
        if days < 30:
            return "URGENT"
        if days < 90:
            return "WATCH"
        return "LOW"

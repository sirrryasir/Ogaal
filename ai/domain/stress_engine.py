from typing import List, Dict, Optional
from datetime import date, timedelta

class WaterStressEngine:
    @staticmethod
    def compute_stress_acceleration(
        today_sr: float, last_7_days_sr: List[float]
    ) -> float:
        """Stress Acceleration (SA) = SR_today − Average_SR_last_7_days"""
        if not last_7_days_sr:
            return 0.0
        avg_sr = sum(last_7_days_sr) / len(last_7_days_sr)
        return today_sr - avg_sr

    @staticmethod
    def compute_days_to_failure(
        remaining_liters: float, daily_usage: float, refill_rate: float
    ) -> Optional[int]:
        """Days to Failure = Remaining / (Usage − Refill)"""
        net_usage = daily_usage - refill_rate
        if net_usage <= 0:
            return None  # stable, no failure expected
        return max(int(remaining_liters / net_usage), 0)

    @staticmethod
    def human_readable_status(days_to_failure: Optional[int], sa: float) -> str:
        """Generate status message"""
        if days_to_failure is None:
            return "Stable — no immediate risk"
        if days_to_failure == 0:
            return "Emergency — immediate intervention required"
        if sa > 0.1:
            return f"Rapid stress increase — {days_to_failure} day(s) remaining"
        return f"High risk — {days_to_failure} day(s) remaining"

    @staticmethod
    def evaluate_source(
        today_sr: float,
        last_7_days_sr: List[float],
        remaining_liters: float,
        daily_usage: float,
        refill_rate: float
    ) -> Dict:
        sa = WaterStressEngine.compute_stress_acceleration(today_sr, last_7_days_sr)
        dtf = WaterStressEngine.compute_days_to_failure(remaining_liters, daily_usage, refill_rate)
        status = WaterStressEngine.human_readable_status(dtf, sa)
        return {
            "stress_ratio": today_sr,
            "stress_acceleration": sa,
            "days_to_failure": dtf,
            "status": status,
        }

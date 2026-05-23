from typing import Optional

class FailureCountdownEngine:
    """
    Predicts how many days remain before a water source becomes unusable.
    """

    @staticmethod
    def calculate(
        remaining_usable_water_liters: float,
        daily_usage_liters: float,
        refill_rate_liters_per_day: float = 0
    ) -> Optional[int]:

        net_daily_loss = daily_usage_liters - refill_rate_liters_per_day

        # Stable or recovering
        if net_daily_loss <= 0:
            return None

        if remaining_usable_water_liters <= 0:
            return 0

        days_to_failure = remaining_usable_water_liters / net_daily_loss
        return max(int(days_to_failure), 0)

        if remaining_usable_water_liters <= 0:
            return 0

        days_to_failure = remaining_usable_water_liters / net_daily_loss
        return max(int(days_to_failure), 0)
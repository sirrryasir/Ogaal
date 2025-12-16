from fastapi import FastAPI

from app.api.water_stress_api import router as water_stress_router
from app.api.failure_countdown_api import router as failure_countdown_router

app = FastAPI(title="Barwaaqo AI Engine")

app.include_router(water_stress_router)
app.include_router(failure_countdown_router)

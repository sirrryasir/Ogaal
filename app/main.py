from fastapi import FastAPI
from app.api.water_stress_api import router as water_stress_router

app = FastAPI(
    title="Water Intelligence Engine",
    description="Analyzes water system stress and intervention priority"
)

app.include_router(water_stress_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

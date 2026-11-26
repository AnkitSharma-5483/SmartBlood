
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import forecast
from routes import risk
from routes import explanation
from routes import inventory

app = FastAPI(
    title="SmartBlood API",
    description="Blood Demand Forecasting and Inventory Risk Management",
    version="1.0.0"
)

# Allow Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(forecast.router)
app.include_router(risk.router)
app.include_router(explanation.router)
app.include_router(inventory.router)

@app.get("/dashboard")
def dashboard():
    return {
        "total_inventory": 1248,
        "predicted_demand_7_days": 1090,
        "critical_shortages": 7,
        "near_expiry_units": 25
    }

@app.get("/")
def home():
    return {
        "message": "Welcome to SmartBlood API",
        "status": "Running"
    }

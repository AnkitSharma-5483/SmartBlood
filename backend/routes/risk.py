
import pandas as pd
import math

from fastapi import APIRouter, HTTPException

from .forecast import blood_data, get_forecast

router = APIRouter()


# ==========================================
# 1. SHORTAGE RISK DETECTION
# ==========================================

@router.get("/shortage-risk")
def detect_shortage(
    group: str,
    component: str = "RBC",
    lead_time_days: int = 2
):
    try:
        if lead_time_days < 1:
            raise HTTPException(
                status_code=400,
                detail="Lead time must be at least 1 day."
            )

        # Filter selected blood group and component
        filtered_data = blood_data[
            (blood_data["blood_group"] == group)
            & (blood_data["component"] == component)
        ].copy()

        if filtered_data.empty:
            raise HTTPException(
                status_code=404,
                detail="Blood product not found."
            )

        # Get latest historical stock
        current_stock = float(
            filtered_data.iloc[-1]["closing_stock"]
        )

        # Get 7-day forecast
        forecast_result = get_forecast(group, component)

        forecast_demand = float(
            forecast_result["total_forecast_demand"]
        )

        # Calculate daily demand standard deviation
        recent_demand = pd.to_numeric(
            filtered_data["demand"],
            errors="coerce"
        ).dropna().tail(28)

        if len(recent_demand) < 2:
            raise HTTPException(
                status_code=422,
                detail="Not enough historical demand records."
            )

        daily_demand_std = float(recent_demand.std())

        # Safety stock calculation
        z_score = 1.645

        safety_stock = (
            z_score
            * daily_demand_std
            * math.sqrt(lead_time_days)
        )

        safety_stock = math.ceil(safety_stock)

        # Calculate required stock
        required_stock = forecast_demand + safety_stock

        shortage_gap = max(
            0,
            required_stock - current_stock
        )

        # Classify shortage risk
        if current_stock < forecast_demand:
            risk_level = "CRITICAL"

        elif current_stock < required_stock:
            risk_level = "WARNING"

        else:
            risk_level = "LOW"

        return {
            "blood_group": group,
            "component": component,
            "current_stock": current_stock,
            "forecast_demand_7_days": round(
                forecast_demand, 2
            ),
            "daily_demand_std": round(
                daily_demand_std, 2
            ),
            "lead_time_days": lead_time_days,
            "safety_stock": safety_stock,
            "required_stock": round(
                required_stock, 2
            ),
            "shortage_gap": round(
                shortage_gap, 2
            ),
            "risk_level": risk_level
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Shortage detection failed: {str(error)}"
        )


# ==========================================
# 2. AGGREGATED EXPIRY RISK ESTIMATION
# ==========================================

@router.get("/expiry-risk")
def detect_expiry_risk(
    group: str,
    component: str = "RBC"
):
    try:
        # Filter selected blood group and component
        filtered_data = blood_data[
            (blood_data["blood_group"] == group)
            & (blood_data["component"] == component)
        ].copy()

        if filtered_data.empty:
            raise HTTPException(
                status_code=404,
                detail="Blood product not found."
            )

        # Check required dataset columns
        required_columns = [
            "date",
            "collected",
            "expired",
            "closing_stock"
        ]

        for column in required_columns:
            if column not in filtered_data.columns:
                raise HTTPException(
                    status_code=422,
                    detail=f"Required column missing: {column}"
                )

        # Convert columns to numeric
        for column in [
            "collected",
            "expired",
            "closing_stock"
        ]:
            filtered_data[column] = pd.to_numeric(
                filtered_data[column],
                errors="coerce"
            )

        filtered_data = filtered_data.dropna(
            subset=["collected", "expired", "closing_stock"]
        )

        if filtered_data.empty:
            raise HTTPException(
                status_code=422,
                detail="No valid inventory records available."
            )

        # ----------------------------------
        # A. Latest stock estimate
        # ----------------------------------

        latest_record = filtered_data.iloc[-1]

        current_stock = float(
            latest_record["closing_stock"]
        )

        inventory_date = latest_record["date"]

        # ----------------------------------
        # B. Historical expiry rate
        # ----------------------------------

        total_collected = float(
            filtered_data["collected"].sum()
        )

        total_expired = float(
            filtered_data["expired"].sum()
        )

        if total_collected <= 0:
            raise HTTPException(
                status_code=422,
                detail="Historical collected units must be greater than zero."
            )

        historical_expiry_rate = (
            total_expired / total_collected
        )

        # ----------------------------------
        # C. Estimated expiry exposure
        # ----------------------------------

        estimated_expiry_exposure = (
            historical_expiry_rate * current_stock
        )

        expiry_exposure_percentage = (
            historical_expiry_rate * 100
        )

        return {
            "blood_group": group,
            "component": component,

            "current_stock": round(
                current_stock, 2
            ),

            "inventory_date": str(inventory_date),

            "historical_expired_units": round(
                total_expired, 2
            ),

            "historical_collected_units": round(
                total_collected, 2
            ),

            "historical_expiry_rate": round(
                historical_expiry_rate, 6
            ),

            "expiry_exposure_percentage": round(
                expiry_exposure_percentage, 4
            ),

            "estimated_expiry_exposure": round(
                estimated_expiry_exposure, 2
            ),

            "method": (
                "Historical expired units / "
                "historical collected units "
                "× latest recorded stock"
            ),

            "limitation": (
                "Aggregate expiry exposure estimate only. "
                "The dataset does not contain batch IDs "
                "or individual expiry dates. "
                "This is not a batch-level expiry prediction."
            )
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Expiry risk estimation failed: {str(error)}"
        )

#  here we are going to implement a more robust forecasting endpoint that predicts blood demand for the next seven days, rather than just one day. This will involve building features for each future day based on historical demand and other relevant factors, and then using the trained XGBoost model to generate predictions for each of those days. The endpoint will return a structured response containing the daily forecasts, total forecast demand, and any assumptions made regarding emergency requests.


from pathlib import Path
import joblib
import pandas as pd

from fastapi import APIRouter, HTTPException

router = APIRouter()

# --------------------------------------------------
# 1. PROJECT PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "backend" / "models" / "xgboost_model.pkl"

FEATURE_PATH = BASE_DIR / "backend" / "models" / "feature_columns.pkl"

DATA_PATH = (
    BASE_DIR / "ml" / "data" / "features" / "blood_demand_features.csv"
)

HORIZON_DAYS = 7


# --------------------------------------------------
# 2. LOAD MODEL, FEATURES AND DATASET ONCE
# --------------------------------------------------

try:
    xgb_model = joblib.load(MODEL_PATH)

    feature_columns = joblib.load(FEATURE_PATH)

    blood_data = pd.read_csv(DATA_PATH)

    blood_data["date"] = pd.to_datetime(
        blood_data["date"],
        errors="coerce"
    )

    blood_data = blood_data.dropna(subset=["date"])

    blood_data = blood_data.sort_values(
        ["blood_group", "component", "date"]
    ).reset_index(drop=True)

    print("SmartBlood XGBoost model loaded!")
    print("Feature columns loaded:", len(feature_columns))
    print("Historical dataset loaded:", blood_data.shape)

except Exception as error:
    raise RuntimeError(
        f"Failed to initialize ML resources: {error}"
    )


# --------------------------------------------------
# 3. BUILD FEATURES FOR A FUTURE DAY
# --------------------------------------------------

def build_future_features(
    demand_history,
    forecast_date,
    group,
    component,
    emergency_lag
):
    """
    Builds one future input row using the same feature
    names and lag/rolling logic used during model training.
    """

    if len(demand_history) < 31:
        raise ValueError(
            "At least 31 historical demand records are required."
        )

    # Initialize all model features to zero.
    row = {
        column: 0.0
        for column in feature_columns
    }

    # ----------------------------------------------
    # DEMAND FEATURES
    # ----------------------------------------------

    demand_features = {
        "demand": demand_history[-1],

        "demand_lag_1": demand_history[-2],
        "demand_lag_7": demand_history[-8],
        "demand_lag_14": demand_history[-15],
        "demand_lag_30": demand_history[-31],

        # Rolling averages exclude the current row's demand.
        "demand_rolling_7": (
            sum(demand_history[-8:-1]) / 7
        ),

        "demand_rolling_14": (
            sum(demand_history[-15:-1]) / 14
        ),

        "demand_rolling_30": (
            sum(demand_history[-31:-1]) / 30
        ),

        "emergency_requests_lag_1": emergency_lag
    }

    for name, value in demand_features.items():

        if name not in row:
            raise ValueError(
                f"Missing trained model feature: {name}"
            )

        row[name] = float(value)

    # ----------------------------------------------
    # CALENDAR FEATURES
    # ----------------------------------------------

    calendar_features = {
        "target_day_of_week_num": forecast_date.dayofweek,
        "target_month": forecast_date.month,
        "target_quarter": forecast_date.quarter,
        "target_is_weekend": int(
            forecast_date.dayofweek >= 5
        )
    }

    for name, value in calendar_features.items():

        if name not in row:
            raise ValueError(
                f"Missing calendar feature: {name}"
            )

        row[name] = float(value)

    # ----------------------------------------------
    # BLOOD GROUP AND COMPONENT ENCODING
    # ----------------------------------------------

    group_column = f"blood_group_{group}"
    component_column = f"component_{component}"

    if group_column not in row:
        raise ValueError(
            f"Blood group {group} was not present during model training."
        )

    if component_column not in row:
        raise ValueError(
            f"Component {component} was not present during model training."
        )

    row[group_column] = 1.0
    row[component_column] = 1.0

    # ----------------------------------------------
    # CREATE MODEL INPUT
    # ----------------------------------------------

    input_df = pd.DataFrame(
        [row],
        columns=feature_columns
    )

    input_df = input_df.astype(float)

    return input_df


# --------------------------------------------------
# 4. SEVEN-DAY FORECASTING ENDPOINT
# --------------------------------------------------

@router.get("/forecast")
def get_forecast(
    group: str,
    component: str = "RBC"
):

    try:

        # ------------------------------------------
        # FILTER REQUESTED BLOOD PRODUCT
        # ------------------------------------------

        filtered_data = blood_data[
            (blood_data["blood_group"] == group)
            &
            (blood_data["component"] == component)
        ].copy()

        if filtered_data.empty:
            raise HTTPException(
                status_code=404,
                detail="No historical data found for this blood product."
            )

        # Convert demand to numeric values.
        filtered_data["demand"] = pd.to_numeric(
            filtered_data["demand"],
            errors="coerce"
        )

        filtered_data = filtered_data.dropna(
            subset=["demand"]
        )

        if len(filtered_data) < 31:
            raise HTTPException(
                status_code=422,
                detail="At least 31 historical demand records are required."
            )

        # ------------------------------------------
        # GET HISTORICAL DEMAND
        # ------------------------------------------

        demand_history = (
            filtered_data["demand"]
            .astype(float)
            .tolist()
        )

        latest_record = filtered_data.iloc[-1]

        latest_date = latest_record["date"]

        # First forecast date.
        forecast_date = latest_date + pd.Timedelta(days=1)

        # ------------------------------------------
        # EMERGENCY REQUEST ASSUMPTION
        # ------------------------------------------

        # For the first forecast day, use the latest
        # already-engineered emergency lag feature.

        if "emergency_requests_lag_1" not in latest_record.index:
            raise ValueError(
                "emergency_requests_lag_1 is missing from the dataset."
            )

        first_emergency_lag = float(
            latest_record["emergency_requests_lag_1"]
        )

        # Future emergency requests are unknown.
        # Use the average of the last 7 observed records
        # as a constant assumption for future days.

        if "emergency_requests" in filtered_data.columns:

            recent_emergency = pd.to_numeric(
                filtered_data["emergency_requests"],
                errors="coerce"
            ).tail(7).dropna()

            if not recent_emergency.empty:
                future_emergency_estimate = float(
                    recent_emergency.mean()
                )
            else:
                future_emergency_estimate = first_emergency_lag

        else:
            future_emergency_estimate = first_emergency_lag

        # ------------------------------------------
        # RECURSIVE SEVEN-DAY PREDICTION
        # ------------------------------------------

        daily_forecasts = []

        current_emergency_lag = first_emergency_lag

        for day in range(HORIZON_DAYS):

            # Date being predicted.
            target_date = forecast_date + pd.Timedelta(
                days=day
            )

            # Build input features.
            input_df = build_future_features(
                demand_history=demand_history,
                forecast_date=target_date,
                group=group,
                component=component,
                emergency_lag=current_emergency_lag
            )

            # Generate XGBoost prediction.
            prediction = float(
                xgb_model.predict(input_df)[0]
            )

            # Demand cannot be negative.
            prediction = max(0.0, prediction)

            # Save daily prediction.
            daily_forecasts.append({
                "date": target_date.strftime("%Y-%m-%d"),
                "predicted_demand": round(prediction, 2)
            })

            # Add prediction to history.
            # This is used to calculate the next day's
            # lag and rolling features.
            demand_history.append(prediction)

            # Future emergency requests are unknown.
            # Use the recent historical average.
            current_emergency_lag = future_emergency_estimate

        # ------------------------------------------
        # TOTAL FORECAST DEMAND
        # ------------------------------------------

        total_forecast_demand = sum(
            item["predicted_demand"]
            for item in daily_forecasts
        )

        # ------------------------------------------
        # API RESPONSE
        # ------------------------------------------

        return {
            "blood_group": group,
            "component": component,

            "forecast_date": daily_forecasts[0]["date"],

            # Numeric list retained for compatibility
            # with the existing one-day forecast field.
            "forecast": [
                item["predicted_demand"]
                for item in daily_forecasts
            ],

            # Date-wise predictions for dashboard charts.
            "daily_forecasts": daily_forecasts,

            "forecast_horizon": HORIZON_DAYS,

            "total_forecast_demand": round(
                total_forecast_demand, 2
            ),

            "lower_bound": None,
            "upper_bound": None,

            "emergency_assumption": (
                "Future emergency requests use the average "
                "of the last 7 observed records."
            ),

            "model": "XGBoost"
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Forecast prediction failed: {str(error)}"
        )

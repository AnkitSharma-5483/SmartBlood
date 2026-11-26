
import shap
import pandas as pd

from fastapi import APIRouter, HTTPException

from .forecast import (
    xgb_model,
    feature_columns,
    blood_data,
    build_future_features
)

router = APIRouter()


@router.get("/explanation")
def explain_prediction(group: str, component: str = "RBC"):

    try:
        # 1. Filter historical data
        filtered_data = blood_data[
            (blood_data["blood_group"] == group)
            & (blood_data["component"] == component)
        ].copy()

        if len(filtered_data) < 31:
            raise HTTPException(
                status_code=422,
                detail="At least 31 historical records are required."
            )

        # 2. Get latest historical record
        latest_record = filtered_data.iloc[-1]

        latest_date = latest_record["date"]

        forecast_date = (
            latest_date + pd.Timedelta(days=1)
        )

        emergency_lag = float(
            latest_record["emergency_requests_lag_1"]
        )

        # 3. Build the same features used by forecasting
        demand_history = (
            filtered_data["demand"].astype(float).tolist()
        )

        input_df = build_future_features(
            demand_history=demand_history,
            forecast_date=forecast_date,
            group=group,
            component=component,
            emergency_lag=emergency_lag
        )

        # 4. Predict demand
        prediction = float(
            xgb_model.predict(input_df)[0]
        )

        # 5. Create SHAP explainer
        explainer = shap.TreeExplainer(xgb_model)

        shap_values = explainer.shap_values(input_df)

        # 6. Extract feature contributions
        contributions = shap_values[0]

        base_value = float(
            explainer.expected_value
        )

        explanation_results = []

        for feature, value, contribution in zip(
            feature_columns,
            input_df.iloc[0].values,
            contributions
        ):

            explanation_results.append({
                "feature": feature,
                "feature_value": round(float(value), 4),
                "shap_value": round(float(contribution), 4)
            })

        # 7. Sort by strongest contribution
        explanation_results.sort(
            key=lambda item: abs(item["shap_value"]),
            reverse=True
        )

        return {
            "blood_group": group,
            "component": component,
            "forecast_date": forecast_date.strftime("%Y-%m-%d"),
            "predicted_demand": round(max(0, prediction), 2),
            "base_value": round(base_value, 4),
            "top_features": explanation_results[:10],
            "explanation": (
                "Positive SHAP values increase the model prediction. "
                "Negative SHAP values decrease the model prediction."
            )
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"SHAP explanation failed: {str(error)}"
        )

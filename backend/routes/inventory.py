
import pandas as pd

from fastapi import APIRouter, HTTPException

from .forecast import blood_data

router = APIRouter()


@router.get("/inventory/summary")
def get_inventory_summary(group: str = None):

    try:
        # 1. Make a copy of historical data
        data = blood_data.copy()

        # 2. Check required columns
        required_columns = [
            "date",
            "blood_group",
            "component",
            "closing_stock"
        ]

        for column in required_columns:
            if column not in data.columns:
                raise HTTPException(
                    status_code=422,
                    detail=f"Missing required column: {column}"
                )

        # 3. Convert date and numeric columns
        data["date"] = pd.to_datetime(
            data["date"], errors="coerce"
        )

        numeric_columns = [
            "closing_stock",
            "collected",
            "issued",
            "expired"
        ]

        for column in numeric_columns:
            if column in data.columns:
                data[column] = pd.to_numeric(
                    data[column], errors="coerce"
                ).fillna(0)

        data = data.dropna(
            subset=["date", "blood_group", "component"]
        )

        if data.empty:
            raise HTTPException(
                status_code=404,
                detail="No inventory records found."
            )

        # 4. Optional blood group filter
        if group:
            data = data[
                data["blood_group"] == group
            ].copy()

            if data.empty:
                raise HTTPException(
                    status_code=404,
                    detail=f"No inventory found for {group}."
                )

        # 5. Find the latest stock for each blood product
        latest_stock = (
            data.sort_values("date")
            .drop_duplicates(
                subset=["blood_group", "component"],
                keep="last"
            )
        )

        # 6. Calculate total stock by component
        component_summary = (
            latest_stock.groupby("component")["closing_stock"]
            .sum()
            .to_dict()
        )

        # 7. Prepare blood group-wise inventory
        inventory = []

        for _, record in latest_stock.iterrows():

            inventory.append({
                "blood_group": record["blood_group"],
                "component": record["component"],
                "current_stock": round(
                    float(record["closing_stock"]), 2
                ),
                "inventory_date": record["date"].strftime(
                    "%Y-%m-%d"
                )
            })

        # 8. Calculate recent activity (latest 7 calendar days)
        latest_date = data["date"].max()

        start_date = (
            latest_date - pd.Timedelta(days=6)
        )

        recent_data = data[
            data["date"] >= start_date
        ].copy()

        def calculate_total(column):
            if column not in recent_data.columns:
                return 0

            return round(
                float(recent_data[column].sum()), 2
            )

        activity_summary = {
            "period": "Last 7 calendar days in dataset",
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": latest_date.strftime("%Y-%m-%d"),
            "collected_units": calculate_total("collected"),
            "issued_units": calculate_total("issued"),
            "expired_units": calculate_total("expired")
        }

        # 9. Calculate total available stock
        total_stock = round(
            float(latest_stock["closing_stock"].sum()), 2
        )

        return {
            "inventory_date": latest_date.strftime("%Y-%m-%d"),
            "filter_blood_group": group,
            "total_available_stock": total_stock,
            "component_summary": {
                key: round(float(value), 2)
                for key, value in component_summary.items()
            },
            "inventory": inventory,
            "activity_summary": activity_summary
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Inventory API failed: {str(error)}"
        )

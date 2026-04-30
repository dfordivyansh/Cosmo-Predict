import requests
import pandas as pd
import numpy as np
import os

from django.utils.timezone import make_aware, is_naive
from api.models import SpaceWeather, SpaceWeatherAlert


# =============================
# CONFIG
# =============================
DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

PLASMA_URL = "https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json"
MAG_URL = "https://services.swpc.noaa.gov/products/solar-wind/mag-7-day.json"
KP_URL = "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json"
ALERT_URL = "https://services.swpc.noaa.gov/products/alerts.json"
FLARE_URL = "https://services.swpc.noaa.gov/json/goes/primary/xrays-7-day.json"


# =============================
# SAFE FETCH
# =============================
def fetch_json(url):
    try:
        res = requests.get(url, timeout=10)
        if res.status_code != 200:
            print(f"❌ Failed: {url}")
            return None
        return res.json()
    except Exception as e:
        print(f"❌ Fetch error ({url}):", e)
        return None


# =============================
# ALERT CLASSIFIER
# =============================
def classify_alert(msg):
    msg = msg.lower()

    if "warning" in msg:
        return "high"
    elif "watch" in msg:
        return "moderate"
    else:
        return "low"


# =============================
# FLARE DETECTOR
# =============================
def get_flare_class():
    try:
        res = fetch_json(FLARE_URL)
        if not res:
            return "N/A"

        flux = res[-1].get("flux", 0)

        if flux > 1e-4:
            return "X"
        elif flux > 1e-5:
            return "M"
        elif flux > 1e-6:
            return "C"
        else:
            return "B"

    except:
        return "N/A"


# =============================
# NOAA ALERT SAVE
# =============================
def fetch_noaa_alerts():
    try:
        print("🚀 Fetching NOAA alerts...")

        data = fetch_json(ALERT_URL)

        if not data or len(data) == 0:
            print("⚠ No alert data")
            return

        print("📡 Total alerts:", len(data))

        objects = []
        flare = get_flare_class()

        for item in data:
            try:
                # 🔥 DIRECT DICT ACCESS
                timestamp_str = item.get("issue_datetime")
                message = item.get("message")

                if not timestamp_str or not message:
                    continue

                timestamp = pd.to_datetime(timestamp_str, utc=True, errors="coerce")

                if pd.isna(timestamp):
                    continue

                severity = classify_alert(message)

                objects.append(
                    SpaceWeatherAlert(
                        timestamp=timestamp,
                        message=message.strip(),
                        severity=severity,
                        flare_class=flare
                    )
                )

            except Exception as inner:
                print("⚠ Row error:", inner)

        if objects:
            SpaceWeatherAlert.objects.bulk_create(
                objects,
                ignore_conflicts=True
            )
            print(f"🚨 {len(objects)} alerts inserted")

        else:
            print("☀ No valid alerts")

    except Exception as e:
        print("❌ ALERT ERROR:", e)

# =============================
# MAIN FETCH FUNCTION
# =============================
def fetch_data():
    try:
        
        print("🚀 Fetching NOAA data...")

        plasma = fetch_json(PLASMA_URL)
        mag = fetch_json(MAG_URL)
        kp = fetch_json(KP_URL)

        if not plasma or not mag or not kp:
            print("❌ API failed")
            return

        # =============================
        # DATAFRAMES
        # =============================
        plasma_df = pd.DataFrame(plasma[1:], columns=plasma[0])
        mag_df = pd.DataFrame(mag[1:], columns=mag[0])
        kp_df = pd.DataFrame(kp)

        # =============================
        # CLEAN TIME
        # =============================
        for df in [plasma_df, mag_df, kp_df]:
            df["time_tag"] = pd.to_datetime(df["time_tag"], errors="coerce", utc=True)
            df.dropna(subset=["time_tag"], inplace=True)

        # =============================
        # NUMERIC CLEAN
        # =============================
        for df in [plasma_df, mag_df, kp_df]:
            for col in df.columns:
                if col != "time_tag":
                    df[col] = pd.to_numeric(df[col], errors="coerce")

        # =============================
        # SORT
        # =============================
        plasma_df.sort_values("time_tag", inplace=True)
        mag_df.sort_values("time_tag", inplace=True)
        kp_df.sort_values("time_tag", inplace=True)

        # =============================
        # MERGE
        # =============================
        df = pd.merge_asof(plasma_df, mag_df, on="time_tag")
        df = pd.merge_asof(df, kp_df, on="time_tag")

        # =============================
        # SELECT
        # =============================
        df = df[[
            "time_tag",
            "speed",
            "density",
            "bx_gsm",
            "by_gsm",
            "bz_gsm",
            "bt",
            "kp_index"
        ]]

        # =============================
        # FINAL CLEAN
        # =============================
        df.replace([np.inf, -np.inf], np.nan, inplace=True)
        df.dropna(inplace=True)
        df.sort_values("time_tag", inplace=True)
        df.reset_index(drop=True, inplace=True)

        # =============================
        # SAVE CSV
        # =============================
        csv_path = os.path.join(DATA_DIR, "space_weather.csv")
        df.to_csv(csv_path, index=False)

        print(f"✅ CSV saved | Rows: {len(df)}")

        # =============================
        # DB INSERT (FAST)
        # =============================
        last_entry = SpaceWeather.objects.order_by("-timestamp").first()

        new_objects = []

        for row in df.itertuples():
            ts = row.time_tag

            if is_naive(ts):
                ts = make_aware(ts)

            if last_entry and ts <= last_entry.timestamp:
                continue

            new_objects.append(
                SpaceWeather(
                    timestamp=ts,
                    speed=row.speed,
                    density=row.density,
                    bx=row.bx_gsm,
                    by=row.by_gsm,
                    bz=row.bz_gsm,
                    bt=row.bt,
                    kp_index=row.kp_index
                )
            )

        if new_objects:
            SpaceWeather.objects.bulk_create(new_objects)
            print(f"🚀 Inserted {len(new_objects)} rows")
        else:
            print("ℹ Already up-to-date")

        # =============================
        # ALERT FETCH
        # =============================
        fetch_noaa_alerts()

    except Exception as e:
        print("❌ CRITICAL ERROR:", e)


# =============================
# RUN
# =============================
if __name__ == "__main__":
    fetch_data()
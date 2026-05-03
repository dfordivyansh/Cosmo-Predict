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
MAG_URL    = "https://services.swpc.noaa.gov/products/solar-wind/mag-7-day.json"
KP_URL     = "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json"
ALERT_URL  = "https://services.swpc.noaa.gov/products/alerts.json"
FLARE_URL  = "https://services.swpc.noaa.gov/json/goes/primary/xrays-7-day.json"


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
            SpaceWeatherAlert.objects.bulk_create(objects, ignore_conflicts=True)
            print(f"🚨 {len(objects)} alerts inserted")
        else:
            print("☀ No valid alerts")

    except Exception as e:
        print("❌ ALERT ERROR:", e)


# =============================
# KP DATAFRAME BUILDER
# =============================
def build_kp_df(raw_kp: list) -> pd.DataFrame:
    """
    NOAA planetary_k_index_1m.json returns a list of dicts like:
      [{"time_tag": "2026-05-01 00:01:00", "kp": 2.33, ...}, ...]

    This function finds the real Kp column name robustly
    and renames it to 'kp_index' for downstream use.
    """
    df = pd.DataFrame(raw_kp)

    print("📋 KP columns raw:", df.columns.tolist())
    print("📋 KP sample:\n", df.head(3))

    # ── Normalise column names ──────────────────────────────
    df.columns = [c.strip().lower() for c in df.columns]

    # ── Find the actual Kp value column ────────────────────
    # NOAA uses 'kp_index', 'kp', or 'estimated_kp' depending on endpoint
    kp_candidates = ["kp_index", "kp", "estimated_kp", "kp_index_1m"]
    kp_col = None
    for candidate in kp_candidates:
        if candidate in df.columns:
            kp_col = candidate
            break

    if kp_col is None:
        # Last resort: pick first numeric column that isn't time
        for col in df.columns:
            if col != "time_tag" and pd.api.types.is_numeric_dtype(
                pd.to_numeric(df[col], errors="coerce")
            ):
                kp_col = col
                print(f"⚠ KP column not found by name, using fallback: '{kp_col}'")
                break

    if kp_col is None:
        raise ValueError("❌ Cannot find KP value column in NOAA response")

    print(f"✅ Using KP column: '{kp_col}'")

    # ── Standardise to 'kp_index' ──────────────────────────
    if kp_col != "kp_index":
        df.rename(columns={kp_col: "kp_index"}, inplace=True)

    # Keep only what we need
    df = df[["time_tag", "kp_index"]].copy()

    return df


# =============================
# MAIN FETCH FUNCTION
# =============================
def fetch_data():
    try:
        print("🚀 Fetching NOAA data...")

        plasma_raw = fetch_json(PLASMA_URL)
        mag_raw    = fetch_json(MAG_URL)
        kp_raw     = fetch_json(KP_URL)

        if not plasma_raw or not mag_raw or not kp_raw:
            print("❌ API failed")
            return

        # ─────────────────────────────────────────────────────
        # BUILD DATAFRAMES
        # ─────────────────────────────────────────────────────
        plasma_df = pd.DataFrame(plasma_raw[1:], columns=plasma_raw[0])
        mag_df    = pd.DataFrame(mag_raw[1:],    columns=mag_raw[0])
        kp_df     = build_kp_df(kp_raw)   # ✅ robust KP builder

        # ─────────────────────────────────────────────────────
        # CLEAN TIMESTAMPS
        # ─────────────────────────────────────────────────────
        for df in [plasma_df, mag_df, kp_df]:
            df["time_tag"] = pd.to_datetime(
                df["time_tag"], errors="coerce", utc=True
            )
            df.dropna(subset=["time_tag"], inplace=True)

        # ─────────────────────────────────────────────────────
        # NUMERIC CLEAN
        # ─────────────────────────────────────────────────────
        for df in [plasma_df, mag_df, kp_df]:
            for col in df.columns:
                if col != "time_tag":
                    df[col] = pd.to_numeric(df[col], errors="coerce")

        # ─────────────────────────────────────────────────────
        # SORT (required for merge_asof)
        # ─────────────────────────────────────────────────────
        plasma_df.sort_values("time_tag", inplace=True)
        mag_df.sort_values("time_tag",    inplace=True)
        kp_df.sort_values("time_tag",     inplace=True)

        # ─────────────────────────────────────────────────────
        # MERGE
        # merge_asof matches each plasma row to the nearest
        # past (or equal) mag/kp row within 5-minute tolerance
        # so real measured Kp is always preserved.
        # ─────────────────────────────────────────────────────
        tolerance = pd.Timedelta("5min")

        df = pd.merge_asof(
            plasma_df, mag_df,
            on="time_tag",
            tolerance=tolerance,
            direction="nearest"
        )

        df = pd.merge_asof(
            df, kp_df,
            on="time_tag",
            tolerance=tolerance,   # ✅ keeps real KP, won't fill garbage
            direction="nearest"
        )

        # ─────────────────────────────────────────────────────
        # SELECT COLUMNS
        # ─────────────────────────────────────────────────────
        required = ["time_tag", "speed", "density", "bx_gsm", "by_gsm", "bz_gsm", "bt", "kp_index"]
        missing  = [c for c in required if c not in df.columns]
        if missing:
            print(f"❌ Missing columns after merge: {missing}")
            print("   Available:", df.columns.tolist())
            return

        df = df[required].copy()

        # ─────────────────────────────────────────────────────
        # FINAL CLEAN
        # ─────────────────────────────────────────────────────
        df.replace([np.inf, -np.inf], np.nan, inplace=True)
        df.dropna(inplace=True)
        df.sort_values("time_tag", inplace=True)
        df.reset_index(drop=True, inplace=True)

        # Sanity check: kp_index must be 0–9
        invalid_kp = df[(df["kp_index"] < 0) | (df["kp_index"] > 9)]
        if len(invalid_kp) > 0:
            print(f"⚠ Dropping {len(invalid_kp)} rows with out-of-range kp_index")
            df = df[(df["kp_index"] >= 0) & (df["kp_index"] <= 9)]

        print(f"✅ Final rows: {len(df)} | KP range: {df['kp_index'].min():.2f} – {df['kp_index'].max():.2f}")

        # ─────────────────────────────────────────────────────
        # SAVE CSV
        # ─────────────────────────────────────────────────────
        csv_path = os.path.join(DATA_DIR, "space_weather.csv")
        df.to_csv(csv_path, index=False)
        print(f"✅ CSV saved | Rows: {len(df)}")

        # ─────────────────────────────────────────────────────
        # DB INSERT (only new rows)
        # ─────────────────────────────────────────────────────
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
                    kp_index=row.kp_index   # ✅ real measured value
                )
            )

        if new_objects:
            SpaceWeather.objects.bulk_create(new_objects)
            print(f"🚀 Inserted {len(new_objects)} rows")
        else:
            print("ℹ Already up-to-date")

        fetch_noaa_alerts()

    except Exception as e:
        import traceback
        print("❌ CRITICAL ERROR:", e)
        traceback.print_exc()


# =============================
# RUN
# =============================
if __name__ == "__main__":
    fetch_data()
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SpaceWeather, SpaceWeatherAlert
from .ml.predict_lstm import predict_lstm

import numpy as np
import requests

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware



# ==============================
# 🔥 TEST API
# ==============================
@api_view(['GET'])
def test_api(request):
    return Response({"message": "Backend working 🚀"})


# ==============================
# 🔥 SAFE NOAA ALERT (LATEST)
# ==============================
def get_latest_alert():
    alert = SpaceWeatherAlert.objects.order_by('-timestamp').first()

    if alert:
        # 🔥 CLEAN MESSAGE FOR UI
        return alert.message.replace("\r\n", " ")[:200]

    return "Quiet conditions"


# ==============================
# 🔥 FLARE CLASS (SAFE)
# ==============================
def get_flare_class():
    try:
        url = "https://services.swpc.noaa.gov/json/goes/primary/xrays-7-day.json"
        res = requests.get(url, timeout=5)

        if res.status_code != 200:
            return "N/A"

        data = res.json()

        if not isinstance(data, list) or len(data) == 0:
            return "N/A"

        flux = data[-1].get("flux", 0)

        if flux > 1e-4:
            return "X"
        elif flux > 1e-5:
            return "M"
        elif flux > 1e-6:
            return "C"
        else:
            return "B"

    except Exception as e:
        print("FLARE ERROR:", e)
        return "N/A"


# ==============================
# 🔥 ALERT GENERATOR
# ==============================
def generate_alert(kp):
    if kp > 5:
        return "⚠️ High geomagnetic storm risk"
    elif kp > 3:
        return "⚡ Moderate activity"
    else:
        return "✅ Quiet conditions"


# ==============================
# 🔥 WEBSOCKET PUSH
# ==============================
def send_ws(data):
    try:
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            "dashboard",
            {
                "type": "send_data",
                "data": data
            }
        )
    except Exception as e:
        print("WS ERROR:", e)


# ==============================
# 🔥 DASHBOARD API (FINAL)
# ==============================
@api_view(['GET'])
def dashboard_data(request):
    try:
        qs = SpaceWeather.objects.order_by('-timestamp')[:10]

        if len(qs) < 5:
            return Response({"error": "Not enough data"})

        data = list(qs)[::-1]
        latest = data[-1]

        kp = float(latest.kp_index)  # ✅ REAL ONLY

        # severity
        if kp > 5:
            severity = "high"
        elif kp > 3:
            severity = "moderate"
        else:
            severity = "low"

        response_data = {
            "solarWind": float(latest.speed),
            "protonDensity": float(latest.density),
            "magneticField": float(latest.bt),

            "kpIndex": round(kp, 2),
            "severity": severity,

            "flareClass": get_flare_class(),
            "noaaAlert": get_latest_alert(),
            "alert": generate_alert(kp),

            "timestamp": latest.timestamp
        }

        send_ws(response_data)
        return Response(response_data)

    except Exception as e:
        return Response({"error": str(e)})
# ==============================
# 🔥 GRAPH DATA
# ==============================
@api_view(['GET'])
def history_data(request):
    try:
        data = SpaceWeather.objects.all().order_by('-timestamp')[:50]

        result = []
        for d in reversed(data):
            result.append({
                "timestamp": d.timestamp,
                "kp": d.kp_index,
                "speed": d.speed
            })

        return Response(result)

    except Exception as e:
        return Response({"error": str(e)})


# ==============================
# 🔥 ALERT FEED (CLEAN)
# ==============================
@api_view(['GET'])
def all_alerts(request):
    try:
        alerts = SpaceWeatherAlert.objects.all().order_by('-timestamp')[:100]

        data = []
        for a in alerts:
            data.append({
                "time": a.timestamp,
                "message": a.message.replace("\r\n", " ")
            })

        return Response(data)

    except Exception as e:
        return Response({"error": str(e)})
    


@api_view(['GET'])
def range_data(request):
    start = request.GET.get("start")
    end = request.GET.get("end")

    qs = SpaceWeather.objects.all()

    if start:
        s = parse_datetime(start)
        if s and s.tzinfo is None:
            s = make_aware(s)
        qs = qs.filter(timestamp__gte=s)

    if end:
        e = parse_datetime(end)
        if e and e.tzinfo is None:
            e = make_aware(e)
        qs = qs.filter(timestamp__lte=e)

    qs = qs.order_by("timestamp")[:500]

    return Response([
        {
            "timestamp": d.timestamp,
            "speed": d.speed,
            "density": d.density,
            "bt": d.bt,
            "kp": d.kp_index
        }
        for d in qs
    ])


@api_view(['GET'])
def analytics(request):
    qs = list(SpaceWeather.objects.all()[:200])

    # ✅ Filter valid data
    qs = [d for d in qs if d.speed and d.kp_index is not None]

    if not qs:
        return Response({"error": "No valid data"})

    speeds = [float(d.speed) for d in qs]
    kp_vals = [float(d.kp_index) for d in qs]

    result = {
        "avg_speed": round(sum(speeds) / len(speeds), 2),
        "max_speed": max(speeds),
        "avg_kp": round(sum(kp_vals) / len(kp_vals), 2),
        "max_kp": max(kp_vals),
        "storm_risk": "high" if max(kp_vals) > 5 else "low"
    }

    return Response(result)


def calculate_final_kp(data):
    try:
        sequence = np.array([
            [d.speed, d.density, d.bx, d.by, d.bz, d.bt]
            for d in data
        ], dtype=float)

        kp_pred, _ = predict_lstm(sequence)
        kp_pred = float(kp_pred)

    except Exception as e:
        print("ML ERROR:", e)
        return None

    return max(0, min(9, kp_pred))


@api_view(['GET'])
def prediction(request):
    qs = SpaceWeather.objects.order_by('-timestamp')[:20]

    qs = [d for d in qs if d.kp_index is not None]

    if len(qs) < 5:
        return Response({"error": "Not enough valid data"})

    data = list(reversed(qs))

    # ✅ REAL KP (same as dashboard)
    real_kp = float(data[-1].kp_index)

    # 🤖 ML prediction
    predicted_kp = calculate_final_kp(data)

    # 🚨 SAFETY FIX (NO CRAZY JUMPS)
    if predicted_kp is not None:
        if abs(predicted_kp - real_kp) > 2:
            predicted_kp = real_kp   # clamp

    # stats
    kp_values = [float(d.kp_index) for d in data]
    avg_kp = sum(kp_values) / len(kp_values)

    latest = data[-1]
    oldest = data[0]

    if latest.kp_index > oldest.kp_index:
        trend = "increasing"
    elif latest.kp_index < oldest.kp_index:
        trend = "decreasing"
    else:
        trend = "stable"

    if avg_kp > 5:
        prediction_text = "Storm very likely"
    elif avg_kp > 3:
        prediction_text = "Moderate activity"
    else:
        prediction_text = "Quiet"

    confidence = round(min(100, (avg_kp / 9) * 100), 2)

    return Response({
        "current_kp": round(real_kp, 2),   # ✅ REAL
        "predicted_kp": round(predicted_kp, 2) if predicted_kp else None,
        "avg_kp": round(avg_kp, 2),
        "trend": trend,
        "prediction": prediction_text,
        "confidence": confidence
    })



@api_view(['GET'])
def alert_stats(request):
    alerts = list(SpaceWeatherAlert.objects.order_by('-timestamp')[:100])

    high = sum(1 for a in alerts if getattr(a, "severity", "") == "high")
    moderate = sum(1 for a in alerts if getattr(a, "severity", "") == "moderate")

    return Response({
        "total": len(alerts),
        "high": high,
        "moderate": moderate,
        "low": len(alerts) - (high + moderate)
    })





NASA_KEY = "pgsaa4VmeIP5ba0fajHv3I3BT1Np8ifmvnkt9hUC"

def safe_get(url):
    try:
        res = requests.get(url, timeout=5)

        if res.status_code != 200:
            return None

        if not res.text:
            return None

        return res.json()

    except Exception as e:
        print("NASA API Error:", e)
        return None


@api_view(['GET'])
def nasa_data(request):
    try:
        # ✅ APOD
        apod = safe_get(
            f"https://api.nasa.gov/planetary/apod?api_key={NASA_KEY}"
        )

        # fallback
        if not apod:
            apod = {
                "url": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
                "title": "Fallback Space Image",
                "explanation": "NASA data unavailable"
            }

        # ✅ ASTEROIDS
        neo = safe_get(
            f"https://api.nasa.gov/neo/rest/v1/feed?api_key={NASA_KEY}"
        )

        asteroids = []
        if neo and "near_earth_objects" in neo:
            for day in neo["near_earth_objects"].values():
                asteroids.extend(day)

        # ✅ DONKI
        alerts = safe_get(
            f"https://api.nasa.gov/DONKI/notifications?startDate=2026-04-01&endDate=2026-04-15&api_key={NASA_KEY}"
        )

        if not isinstance(alerts, list):
            alerts = []

        return Response({
            "apod": apod,
            "asteroids": asteroids[:10],
            "alerts": alerts[:5]
        })

    except Exception as e:
        return Response({
            "error": "Backend failed",
            "details": str(e)
        })
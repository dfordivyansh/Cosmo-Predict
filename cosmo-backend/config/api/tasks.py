from .models import SpaceWeather
import requests

def fetch_data():
    plasma = requests.get(plasma_url).json()
    latest = plasma[-1]

    SpaceWeather.objects.create(
        timestamp = latest[0],
        speed = float(latest[2]),
        density = float(latest[1]),
        bx = 0,
        by = 0,
        bz = 0,
        bt = 0,
        kp_index = 3
    )
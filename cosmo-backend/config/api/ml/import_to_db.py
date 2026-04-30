import pandas as pd
from api.models import SpaceWeather
from django.utils.dateparse import parse_datetime

# Load CSV
df = pd.read_csv("data/space_weather.csv")

print("Total rows:", len(df))

# Insert into DB
for _, row in df.iterrows():
    SpaceWeather.objects.create(
        timestamp=parse_datetime(row["time_tag"]),
        speed=float(row["speed"]),
        density=float(row["density"]),
        bx=float(row["bx_gsm"]),
        by=float(row["by_gsm"]),
        bz=float(row["bz_gsm"]),
        bt=float(row["bt"]),
        kp_index=float(row["kp_index"]),
    )

print("Data inserted into DB ✅")
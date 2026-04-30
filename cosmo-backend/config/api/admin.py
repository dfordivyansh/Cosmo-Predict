from django.contrib import admin
from .models import SpaceWeather, SpaceWeatherAlert


# 🔥 SPACE WEATHER ADMIN
@admin.register(SpaceWeather)
class SpaceWeatherAdmin(admin.ModelAdmin):
    list_display = (
        "timestamp",
        "speed",
        "density",
        "bx",
        "by",
        "bz",
        "bt",
        "kp_index"
    )

    list_filter = ("timestamp",)
    search_fields = ("timestamp",)
    ordering = ("-timestamp",)


# 🔥 ALERT ADMIN (NEW)
@admin.register(SpaceWeatherAlert)
class SpaceWeatherAlertAdmin(admin.ModelAdmin):
    list_display = (
        "timestamp",
        "message",
        "severity",
        "flare_class"
    )

    list_filter = ("severity", "flare_class", "timestamp")
    search_fields = ("message",)
    ordering = ("-timestamp",)
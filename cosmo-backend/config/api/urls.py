from django.urls import path
from . import views

urlpatterns = [
    # 🔥 BASIC
    path('test/', views.test_api),

    # 🔥 MAIN DASHBOARD
    path('dashboard/', views.dashboard_data),

    # 🔥 GRAPH
    path('history/', views.history_data),

    # 🔥 ALERT FEED
    path('all-alerts/', views.all_alerts),

    path('range/', views.range_data),
    path('analytics/', views.analytics),
    path('prediction/', views.prediction),
    path('alert-stats/', views.alert_stats),
    path('nasa/', views.nasa_data),
]

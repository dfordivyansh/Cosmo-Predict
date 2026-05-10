from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_api),

    path('dashboard/', views.dashboard_data),

    path('history/', views.history_data),

    path('all-alerts/', views.all_alerts),

    path('range/', views.range_data),
    path('analytics/', views.analytics),
    path('prediction/', views.prediction),
    path('alert-stats/', views.alert_stats),
    path('nasa/', views.nasa_data),
]

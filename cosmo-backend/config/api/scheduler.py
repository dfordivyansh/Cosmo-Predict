from apscheduler.schedulers.background import BackgroundScheduler
from .ml.fetch_data import fetch_data

scheduler = None

def start():
    global scheduler

    # 🔥 prevent multiple schedulers (IMPORTANT)
    if scheduler and scheduler.running:
        return

    scheduler = BackgroundScheduler()

    # 🔥 run every 1 minute
    scheduler.add_job(fetch_data, 'interval', minutes=1)

    scheduler.start()

    print("🚀 Scheduler started (every 1 min)")
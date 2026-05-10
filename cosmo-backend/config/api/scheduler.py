from apscheduler.schedulers.background import BackgroundScheduler
from .ml.fetch_data import fetch_data

scheduler = None

def start():
    global scheduler

    if scheduler and scheduler.running:
        return

    scheduler = BackgroundScheduler()

    scheduler.add_job(fetch_data, 'interval', minutes=1)

    scheduler.start()

    print("🚀 Scheduler started (every 1 min)")
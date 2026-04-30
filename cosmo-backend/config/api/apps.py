from django.apps import AppConfig
import threading

class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        from .scheduler import start
        threading.Thread(target=start, daemon=True).start()
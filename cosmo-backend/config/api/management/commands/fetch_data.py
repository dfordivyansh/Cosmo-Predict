from django.core.management.base import BaseCommand
from api.ml.fetch_data import fetch_data


class Command(BaseCommand):
    help = "Fetch space weather data from NOAA and store in DB"

    def handle(self, *args, **kwargs):
        self.stdout.write("Fetching data... 🚀")

        fetch_data()

        self.stdout.write(self.style.SUCCESS("Done ✅"))
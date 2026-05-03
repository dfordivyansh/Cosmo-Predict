from django.db import models


class SpaceWeather(models.Model):
    timestamp = models.DateTimeField(db_index=True, unique=True)

    speed = models.FloatField(default=0)
    density = models.FloatField(default=0)

    bx = models.FloatField(default=0)
    by = models.FloatField(default=0)
    bz = models.FloatField(default=0)

    bt = models.FloatField(default=0)
    kp_index = models.FloatField(default=0)

    def __str__(self):
        return str(self.timestamp)

    class Meta:
        ordering = ['-timestamp']


# 🔥 ALERT MODEL
class SpaceWeatherAlert(models.Model):
    timestamp = models.DateTimeField()
    message = models.TextField()
    flare_class = models.CharField(max_length=5, default="N/A")
    severity = models.CharField(max_length=10, default="low")

    def __str__(self):
        return f"{self.flare_class} | {self.message[:40]}"

    class Meta:
        ordering = ['-timestamp']
        unique_together = ('timestamp', 'message')  # 🔥 IMPORTANT
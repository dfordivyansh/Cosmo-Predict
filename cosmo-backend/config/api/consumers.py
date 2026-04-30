import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DataConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # 🔥 join group
        await self.channel_layer.group_add(
            "dashboard",
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # 🔥 leave group
        await self.channel_layer.group_discard(
            "dashboard",
            self.channel_name
        )

    # 🔥 receive data from backend
    async def send_data(self, event):
        await self.send(text_data=json.dumps(event["data"]))
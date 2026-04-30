import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Input
import joblib
import os

# Load clean data
df = pd.read_csv("data/space_weather.csv")

# Ensure numeric
# 🔥 Keep only required columns (best practice)
features = ["speed","density","bx_gsm","by_gsm","bz_gsm","bt"]
target = "kp_index"

df = df[features + [target]]

# Convert numeric safely
df = df.astype(float)

features = ["speed","density","bx_gsm","by_gsm","bz_gsm","bt"]
target = "kp_index"

# Scaling
scaler = MinMaxScaler()
scaled = scaler.fit_transform(df[features + [target]])

# Check NaN
print("NaN in scaled:", np.isnan(scaled).sum())

# Create sequences
def create_seq(data, step=10):
    X, y = [], []
    for i in range(len(data)-step):
        X.append(data[i:i+step, :-1])
        y.append(data[i+step, -1])
    return np.array(X), np.array(y)

X, y = create_seq(scaled)

print("Shape:", X.shape, y.shape)

# Model
model = Sequential([
    Input(shape=(X.shape[1], X.shape[2])),
    LSTM(64),
    Dense(1)
])

model.compile(optimizer="adam", loss="mse")

# Train
model.fit(X, y, epochs=10, batch_size=16)

# 🔥 SAVE FIX
model_dir = os.path.join("api", "ml", "model")
os.makedirs(model_dir, exist_ok=True)

model.save(os.path.join(model_dir, "lstm.h5"))
joblib.dump(scaler, os.path.join(model_dir, "scaler.pkl"))

print("Model trained & saved ✅")
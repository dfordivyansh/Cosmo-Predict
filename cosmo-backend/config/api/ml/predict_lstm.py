import numpy as np
import joblib
import os
import pandas as pd
from tensorflow.keras.models import load_model

# =============================
# PATHS
# =============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "model", "lstm.h5")
scaler_path = os.path.join(BASE_DIR, "model", "scaler.pkl")

model = load_model(model_path, compile=False)
scaler = joblib.load(scaler_path)


# =============================
# PREDICT FUNCTION
# =============================
def predict_lstm(sequence):
    """
    sequence shape: (10, 6)
    features:
    [speed, density, bx, by, bz, bt]
    """

    # 🔥 Step 1: add dummy target (same as training)
    dummy_target = np.zeros((sequence.shape[0], 1))
    data = np.concatenate([sequence, dummy_target], axis=1)

    # 🔥 Step 2: MATCH TRAINING COLUMN NAMES
    df = pd.DataFrame(data, columns=[
        "speed",
        "density",
        "bx_gsm",   # 🔥 IMPORTANT FIX
        "by_gsm",
        "bz_gsm",
        "bt",
        "kp_index"
    ])

    # 🔥 Step 3: SCALE
    scaled = scaler.transform(df)

    # 🔥 Step 4: REMOVE TARGET
    X = scaled[:, :-1]

    # 🔥 Step 5: RESHAPE FOR LSTM
    X = np.array([X])  # (1, 10, 6)

    # 🔥 Step 6: PREDICT
    pred = model.predict(X)[0][0]

    # 🔥 Step 7: SCALE BACK (0–9 KP)
    kp = float(pred * 9)

    # 🔥 Step 8: CLAMP (SAFE)
    kp = max(0, min(9, kp))

    # 🔥 Step 9: SEVERITY
    if kp > 5:
        severity = "high"
    elif kp > 3:
        severity = "moderate"
    else:
        severity = "low"

    return kp, severity
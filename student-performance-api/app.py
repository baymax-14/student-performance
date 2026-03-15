from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app)

# =============================
# LOAD MODEL & SCALER
# =============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "final_student_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))

feature_names = [
    "attendance",
    "internal_avg",
    "studytime",
    "backlogs",
    "schoolsup",
    "activities",
    "higher"
]

# =============================
# LABEL MAPPING
# =============================
label_map = {
    0: "Poor Performance",
    1: "Average Performance",
    2: "Good Performance"
}

# =============================
# HOME ROUTE
# =============================
@app.route("/")
def home():
    return "Student Performance Prediction API is running"

# =============================
# PREDICTION ROUTE
# =============================
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    try:
        # Extract features in correct order
        features = [
            data["attendance"],
            data["internal_avg"],
            data["studytime"],
            data["backlogs"],
            data["schoolsup"],
            data["activities"],
            data["higher"]
        ]

        features = np.array(features).reshape(1, -1)

        # Scale input
        features_scaled = scaler.transform(features)

        # Predict
        prediction = model.predict(features_scaled)[0]
        probabilities = model.predict_proba(features_scaled)[0]
        confidence = float(max(probabilities))

        importances = model.feature_importances_

        feature_importance = {
            feature_names[i]: float(importances[i])
            for i in range(len(feature_names))
        }

        return jsonify({
            "prediction": int(prediction),
            "performance": label_map[prediction],
            "confidence": round(confidence, 2),
            "feature_importance": feature_importance
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# =============================
# RUN SERVER
# =============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

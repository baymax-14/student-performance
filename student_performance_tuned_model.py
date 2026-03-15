import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, accuracy_score, f1_score
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# =============================
# 1. LOAD DATA
# =============================
data = pd.read_csv("student-mat.csv", sep=";")

# =============================
# 2. FEATURE ENGINEERING
# =============================
data["attendance"] = 100 - data["absences"]
data["internal_avg"] = (data["G1"] + data["G2"]) / 2
data["backlogs"] = data["failures"]

features = [
    "attendance",
    "internal_avg",
    "studytime",
    "backlogs",
    "schoolsup",
    "activities",
    "higher"
]

X = data[features]
y = data["G3"]

# Target conversion
def grade_to_label(g):
    if g < 10:
        return 0
    elif g < 14:
        return 1
    else:
        return 2

y = y.apply(grade_to_label)

# Encode categorical
categorical_cols = ["schoolsup", "activities", "higher"]
encoder = LabelEncoder()
for col in categorical_cols:
    X[col] = encoder.fit_transform(X[col])

# =============================
# 3. SPLIT & SCALE
# =============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# =============================
# 4. RANDOM FOREST TUNING
# =============================
rf_params = {
    "n_estimators": [200, 300, 400],
    "max_depth": [8, 12, 16],
    "min_samples_split": [2, 5],
    "min_samples_leaf": [1, 2]
}

rf = RandomForestClassifier(random_state=42)

rf_grid = GridSearchCV(
    rf,
    rf_params,
    cv=5,
    scoring="f1_weighted",
    n_jobs=-1
)

rf_grid.fit(X_train, y_train)

print("✅ Best Random Forest Params:", rf_grid.best_params_)

# =============================
# 5. XGBOOST TUNING
# =============================
xgb_params = {
    "n_estimators": [200, 300],
    "learning_rate": [0.03, 0.05],
    "max_depth": [4, 6],
    "subsample": [0.8, 1],
    "colsample_bytree": [0.8, 1]
}

xgb = XGBClassifier(
    objective="multi:softprob",
    num_class=3,
    eval_metric="mlogloss",
    random_state=42
)

xgb_grid = GridSearchCV(
    xgb,
    xgb_params,
    cv=5,
    scoring="f1_weighted",
    n_jobs=-1
)

xgb_grid.fit(X_train, y_train)

print("✅ Best XGBoost Params:", xgb_grid.best_params_)

# =============================
# 6. FINAL EVALUATION
# =============================
models = {
    "Random Forest": rf_grid.best_estimator_,
    "XGBoost": xgb_grid.best_estimator_
}

best_model = None
best_f1 = 0

for name, model in models.items():
    preds = model.predict(X_test)
    f1 = f1_score(y_test, preds, average="weighted")
    acc = accuracy_score(y_test, preds)

    print(f"\n{name}")
    print(f"Accuracy: {acc:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print(classification_report(y_test, preds))

    if f1 > best_f1:
        best_f1 = f1
        best_model = model
        best_name = name

# =============================
# 7. SAVE BEST MODEL
# =============================
joblib.dump(best_model, "final_student_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print(f"\n🏆 Final Selected Model: {best_name}")

import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, f1_score, classification_report
from sklearn.ensemble import RandomForestClassifier

from xgboost import XGBClassifier
import joblib

# =============================
# 1. LOAD DATASET
# =============================
# Download UCI student-mat.csv and place it in same folder
data = pd.read_csv("student-mat.csv", sep=";")

# =============================
# 2. FEATURE ENGINEERING
# =============================
data["attendance"] = 100 - data["absences"]
data["internal_avg"] = (data["G1"] + data["G2"]) / 2
data["backlogs"] = data["failures"]

# Select useful features
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

# =============================
# 3. TARGET ENCODING (3 CLASSES)
# =============================
def grade_to_label(g):
    if g < 10:
        return 0  # Poor
    elif g < 14:
        return 1  # Average
    else:
        return 2  # Good

y = y.apply(grade_to_label)

# =============================
# 4. ENCODE CATEGORICAL DATA
# =============================
categorical_cols = ["schoolsup", "activities", "higher"]

encoder = LabelEncoder()
for col in categorical_cols:
    X[col] = encoder.fit_transform(X[col])

# =============================
# 5. TRAIN-TEST SPLIT
# =============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# =============================
# 6. FEATURE SCALING
# =============================
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# =============================
# 7. MODELS
# =============================
rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    random_state=42
)

xgb = XGBClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    objective="multi:softprob",
    num_class=3,
    eval_metric="mlogloss",
    random_state=42
)

models = {
    "Random Forest": rf,
    "XGBoost": xgb
}

# =============================
# 8. TRAIN & EVALUATE
# =============================
best_model = None
best_score = 0

for name, model in models.items():
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    f1 = f1_score(y_test, preds, average="weighted")

    cv_score = cross_val_score(model, X_train, y_train, cv=5).mean()

    print(f"\n{name}")
    print(f"Accuracy: {acc:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print(f"CV Score: {cv_score:.4f}")

    if f1 > best_score:
        best_score = f1
        best_model = model
        best_model_name = name

# =============================
# 9. SAVE BEST MODEL
# =============================
joblib.dump(best_model, "best_student_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print(f"\n✅ Best Model Selected: {best_model_name}")

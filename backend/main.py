from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

# Load model and feature names
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, '../model/model.pkl'))
features = joblib.load(os.path.join(BASE_DIR, '../model/features.pkl'))

# Create FastAPI app
app = FastAPI(title="LoanGuard API")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define what input data looks like
class LoanApplication(BaseModel):
    Gender: int
    Married: int
    Dependents: int
    Education: int
    Self_Employed: int
    ApplicantIncome: float
    CoapplicantIncome: float
    LoanAmount: float
    Loan_Amount_Term: float
    Credit_History: float
    Property_Area_Semiurban: int
    Property_Area_Urban: int

# Health check endpoint
@app.get("/health")
def health():
    return {"status": "LoanGuard API is running"}

# Prediction endpoint
@app.post("/predict")
def predict(data: LoanApplication):
    # Convert input to array in correct feature order
    input_data = np.array([[
        data.Gender,
        data.Married,
        data.Dependents,
        data.Education,
        data.Self_Employed,
        np.log(data.ApplicantIncome),
        np.log(data.CoapplicantIncome) if data.CoapplicantIncome > 0 else 0,
        np.log(data.LoanAmount),
        data.Loan_Amount_Term,
        data.Credit_History,
        data.Property_Area_Semiurban,
        data.Property_Area_Urban
    ]])

    # Get prediction and probability
    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]

    # Risk label
    if probability >= 0.75:
        risk = "Low Risk"
    elif probability >= 0.5:
        risk = "Medium Risk"
    else:
        risk = "High Risk"

    return {
        "approved": bool(prediction),
        "probability": round(float(probability), 4),
        "risk": risk
    }
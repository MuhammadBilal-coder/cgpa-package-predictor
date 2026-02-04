from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# CORS - Frontend se connection ke liye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model load karo (ek baar hi)
try:
    model = joblib.load("model.pkl")
    print("✅ Model successfully loaded!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Input data structure
class CGPAInput(BaseModel):
    cgpa: float

# Prediction endpoint
@app.post("/predict")
def predict(data: CGPAInput):
    try:
        if model is None:
            return {"result": "❌ Model load nahi hua!"}
        
        # CGPA se prediction karo
        cgpa = data.cgpa
        prediction = model.predict([[cgpa]])
        package_lpa = round(prediction[0], 2)
        
        # Result with emoji based on package
        if package_lpa >= 10:
            emoji = "🔥🎉"
            message = f"Amazing! {package_lpa} LPA package expected!"
        elif package_lpa >= 7:
            emoji = "🚀"
            message = f"Great! {package_lpa} LPA package expected!"
        elif package_lpa >= 5:
            emoji = "👍"
            message = f"Good! {package_lpa} LPA package expected!"
        elif package_lpa >= 3:
            emoji = "📚"
            message = f"{package_lpa} LPA - Keep improving!"
        else:
            emoji = "💪"
            message = f"{package_lpa} LPA - Focus on skills!"
        
        result = f"{emoji} {message}"
        
        return {"result": result}
        
    except Exception as e:
        return {"result": f"❌ Error: {str(e)}"}

# Test endpoint
@app.get("/")
def home():
    return {
        "message": "✅ CGPA to Package Predictor API",
        "status": "Model loaded!" if model else "Model not loaded!"
    }
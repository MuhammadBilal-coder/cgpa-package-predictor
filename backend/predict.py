import joblib

model = joblib.load("model.pkl")

cgpa = float(input("Enter CGPA: "))

result = model.predict([[cgpa]])

print("Predicted Package LPA:", result[0])

from flask import Flask, request, jsonify, render_template
import json

app = Flask(__name__)

# Load the existing JSON data from the file
def load_data():
    with open('data.json', 'r') as json_file:
        return json.load(json_file)

# Function to register a new patient
def register_patient(patient_name, patient_email, patient_age, patient_id, username, password):
    data = load_data()

    # Check if patient is pre-registered
    if any(patient["patient_id"] == patient_id for patient in data["patients"]):
        # Ensure the username is not already taken
        if not any(user["username"] == username for user in data["auth"]["users"]):
            # Add new patient to the auth system
            new_user = {
                "username": username,
                "password": password,  
                "role": "patient",
                "patient_id": patient_id
            }
            data["auth"]["users"].append(new_user)

            # Add the new patient to the "users" list
            new_patient = {
                "id": len(data["users"]) + 1,  # Incremental user ID
                "name": patient_name,
                "email": patient_email,
                "age": patient_age,
                "patient_id": patient_id
            }
            data["users"].append(new_patient)

            # Save the updated data back to the JSON file
            with open('patients_data.json', 'w') as json_file:
                json.dump(data, json_file, indent=4)
                
            return True
        else:
            return False  # Username already taken
    else:
        return False  # Patient ID not registered

# Route for the registration page
@app.route('/registration.html')
def registration_page():
    return render_template('registration.html')

# API endpoint for registering a patient
@app.route('/register', methods=['POST'])
def register():
    data = request.form
    patient_name = data['name']
    patient_email = data['email']
    patient_age = int(data['age'])
    patient_id = int(data['patient_id'])
    username = data['username']
    password = data['password']

    if register_patient(patient_name, patient_email, patient_age, patient_id, username, password):
        return jsonify({"message": "Registration successful!"}), 200
    else:
        return jsonify({"message": "Registration failed. Please check your data."}), 400

if __name__ == "__main__":
    app.run(debug=True)

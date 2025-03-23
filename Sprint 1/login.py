from flask import Flask, request, jsonify, render_template
import json

app = Flask(__name__)

def load_data():
    try:
        with open('data.json', 'r') as json_file:
            return json.load(json_file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"auth": {"users": []}}  

def authenticate_login(username, password):
    data = load_data()
    
    # Iterate through the list of users 
    for user in data.get("auth", {}).get("users", []):
        if user.get("username") == username and user.get("password") == password:
            return user.get("role")
    return None

@app.route('/login', methods=['POST'])
def login():
    request_data = request.get_json()
    username = request_data.get("username")
    password = request_data.get("password")

    role = authenticate_login(username, password)
    
    if role:
        return jsonify({"message": "Login successful", "role": role}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


@app.route('/patient_menu.html')
def patient_menu():
    return render_template('patient_menu.html')

@app.route('/provider_menu.html')
def provider_menu():
    return render_template('provider_menu.html')

if __name__ == "__main__":
    app.run(debug=True)

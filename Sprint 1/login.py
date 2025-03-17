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
            return True
    return False

@app.route('/login', methods=['POST'])
def login():
    request_data = request.get_json()
    username = request_data.get("username")
    password = request_data.get("password")

    if authenticate_login(username, password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/patient_menu.html')
def menu_page():
    return render_template('patient_menu.html')

if __name__ == "__main__":
    app.run(debug=True)

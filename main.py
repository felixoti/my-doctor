from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import random
import admin
import smtplib
import requests
import os
import google.generativeai as genai
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env
import logging


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
app.secret_key = '123456789'

logging.basicConfig(level=logging.DEBUG)

# Initialize Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'doctor'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

EMAIL_ADDRESS = "d84838937@gmail.com"
EMAIL_PASSWORD = "@Mydoctor123" 

# User Model
class User(UserMixin):
    def __init__(self, id, email, password):
        self.id = id
        self.email = email
        self.password = password

@login_manager.user_loader
def load_user(user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    cur.close()
    if user:
        return User(user['id'], user['email'], user['password'])
    return None

# Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    country = data.get('country')
    email = data.get('email')
    password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
    
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cur.fetchone()
    if existing_user:
        cur.close()
        return jsonify({"error": "Email already registered"}), 403
    
    cur.execute("INSERT INTO users (first_name, last_name, country, email, password) VALUES (%s, %s, %s, %s, %s)", 
                (first_name, last_name, country, email, password))
    mysql.connection.commit()
    cur.close()
    
    return jsonify({"message": "Registration successful!"}), 201

# Login 
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    
    if user and bcrypt.check_password_hash(user['password'], password):
        login_user(User(user['id'], user['email'], user['password']))
        return jsonify({"message": "Login successful!"})
    else:
        return jsonify({"error": "Invalid credentials."}), 401

# Protected Dashboard 
@app.route('/dashboard', methods=['GET'])
@login_required
def dashboard():
    return jsonify({"message": f"Welcome {current_user.email}!"})

# Logout 
@app.route('/logout', methods=['POST'])
def logout():
    if not current_user.is_authenticated:
        return jsonify({"message": "Already logged out."})
    
    logout_user()
    return jsonify({"message": "You have been logged out."})

# Forgot Password
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required."}), 400

    cur = mysql.connection.cursor()
    try:
        # Check if the email exists in the database
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if not user:
            cur.close()
            return jsonify({"error": "Email not found."}), 404

        # Generate a 4-digit reset code
        reset_code = str(random.randint(1000, 9999))
        expiry = datetime.utcnow() + timedelta(minutes=20)  # Set expiry to 20 minutes

        # Save the reset code and expiry time in the database
        cur.execute("""
            UPDATE users SET reset_code = %s, reset_code_expiry = %s WHERE email = %s
        """, (reset_code, expiry, email))
        mysql.connection.commit()

        # Send the reset code to the user's email address
        try:
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                # Authenticate with Gmail SMTP server
                smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)

                # Prepare the email
                subject = "Your Password Reset Code"
                body = f"Your 4-digit password reset code is: {reset_code}"
                msg = f"Subject: {subject}\n\n{body}"

                # Send the email
                smtp.sendmail(EMAIL_ADDRESS, email, msg)

        except smtplib.SMTPException as e:
            return jsonify({"error": "Failed to send email", "details": str(e)}), 500

    except Exception as e:
        logging.error(f"Database error: {str(e)}")
        cur.close()
        return jsonify({"error": "Database error", "details": str(e)}), 500

    cur.close()
    return jsonify({"message": "Reset code sent to your email."}), 200



# 2. Verify reset code
@app.route('/verify-reset-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if not email or not code:
        return jsonify({"error": "Email and code are required."}), 400

    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT reset_code, reset_code_expiry FROM users WHERE email = %s", (email,))
        result = cur.fetchone()

        if not result:
            cur.close()
            return jsonify({"error": "Invalid email."}), 400

        stored_code, expiry = result

        if stored_code != code:
            cur.close()
            return jsonify({"error": "Invalid code."}), 400

        if datetime.utcnow() > expiry:
            cur.close()
            return jsonify({"error": "Code expired."}), 400

    except Exception as e:
        logging.error(f"Database error: {str(e)}")
        cur.close()
        return jsonify({"error": "Database error", "details": str(e)}), 500

    cur.close()
    return jsonify({"message": "Code verified. You may now reset your password."}), 200


# 3. Reset password after code is verified
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    new_password = data.get('new_password')

    if not email or not code or not new_password:
        return jsonify({"error": "Email, code, and new password are required."}), 400

    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT reset_code, reset_code_expiry FROM users WHERE email = %s", (email,))
        result = cur.fetchone()

        if not result:
            cur.close()
            return jsonify({"error": "Invalid email."}), 400

        stored_code, expiry = result

        if stored_code != code or datetime.utcnow() > expiry:
            cur.close()
            return jsonify({"error": "Invalid or expired code."}), 400

        # Hash the new password
        if not new_password:
            return jsonify({"error": "New password is required."}), 400
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

        cur.execute("""
            UPDATE users 
            SET password = %s, reset_code = NULL, reset_code_expiry = NULL 
            WHERE email = %s
        """, (hashed_password, email))
        mysql.connection.commit()

    except Exception as e:
        logging.error(f"Database error: {str(e)}")
        cur.close()
        return jsonify({"error": "Database error", "details": str(e)}), 500

    cur.close()
    return jsonify({"message": "Password has been successfully updated."}), 200

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        # Retrieve incoming data
        data = request.get_json()
        symptoms = data.get('symptoms')
        conversation_id = data.get('conversation_id')

        # Check if symptoms were provided
        if not symptoms:
            return jsonify({"error": "No symptoms provided"}), 400

        # Initialize Gemini AI Model
        model = genai.GenerativeModel("gemini-2.0-flash")

        # System Instruction for AI Diagnosis
        system_instruction = """
        You are a friendly and professional AI doctor. You should respond in a warm and empathetic tone, 
        like a caring physician having a conversation with a patient. If the user greets you or says something casual like 
        'hello', 'hi', or 'how are you', respond politely and invite them to describe their symptoms.

        When symptoms are mentioned, diagnose the most likely disease, explain it simply, and suggest appropriate medication and prevention methods. 
        Always remain conversational and approachable while being medically accurate. Retain context for ongoing conversations.
        """

        # Initialize conversation history
        conversation_history = []

        if conversation_id:
            cur = mysql.connection.cursor()
            cur.execute("SELECT history FROM chatbot_conversations WHERE conversation_id = %s", (conversation_id,))
            conversation_data = cur.fetchone()
            cur.close()

            if conversation_data:
                conversation_history = conversation_data['history']

        # Add user message to history
        conversation_history.append(f"User: {symptoms}")

        # Build the prompt
        prompt = f"""
        {system_instruction}

        Previous Conversation:
        {conversation_history}

        Current Symptoms:
        "{symptoms}"

        Your Response Guidelines:
        1. If the user greets you or sends casual text (like “hi”, “hello”, “how are you”), greet them warmly and ask them to describe how they’re feeling or list their symptoms.
        2. If the user provides symptoms, diagnose the most probable disease in a friendly but professional way.
        3. Provide a one-line diagnosis in simple terms.
        4. Give a brief, easy-to-understand explanation of the disease.
        5. Suggest an appropriate medication (and clearly mention if they should consult a real doctor).
        6. Provide prevention tips if applicable.
        7. Maintain a friendly, conversational tone like a compassionate doctor talking to a patient.
        8. If symptoms are unclear or invalid, kindly ask the user to rephrase or provide more detail.
        9. Keep the format clear and structured but not robotic.

        Respond in the following format:
        Disease: <disease_name>
        Description: <disease_description>
        Medication: <medication>
        Prevention: <prevention_methods>

        Please follow the format exactly and avoid adding extra text or lines outside this format.
        """

        # Generate AI Response
        response = model.generate_content(prompt)
        response_lines = response.text.strip().splitlines()

        # Initialize variables with defaults
        diagnosis = ""
        disease_description = "No description available."
        medication = "Consult a doctor for proper medication."
        prevention = "No specific prevention provided."

        # Extract using keyword parsing
        for line in response_lines:
            if line.lower().startswith("disease:"):
                diagnosis = line.split(":", 1)[1].strip()
            elif line.lower().startswith("description:"):
                disease_description = line.split(":", 1)[1].strip()
            elif line.lower().startswith("medication:"):
                medication = line.split(":", 1)[1].strip()
            elif line.lower().startswith("prevention:"):
                prevention = line.split(":", 1)[1].strip()

        # Add further note for uncertain cases
        if "requires further tests" in disease_description.lower() or "consult a specialist" in disease_description.lower():
            disease_description += " It is advisable to seek medical attention for further tests or a more accurate diagnosis."
            medication = "Over-the-counter pain relievers like ibuprofen or paracetamol can help relieve discomfort, but please see a doctor for further tests."

        # Save disease details
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO disease_medicine (disease_name, description, medication, prevention) VALUES (%s, %s, %s, %s)",
                    (diagnosis, disease_description, medication, prevention))
        mysql.connection.commit()
        cur.close()

        # Save user symptoms
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO user_symptoms (symptoms) VALUES (%s)", (symptoms,))
        mysql.connection.commit()
        cur.close()

        # Retrieve updated disease data (for fallback logic)
        cur = mysql.connection.cursor()
        cur.execute("SELECT description, medication, prevention FROM disease_medicine WHERE disease_name = %s", (diagnosis,))
        disease_data = cur.fetchone()
        cur.close()

        if disease_data:
            disease_description = disease_data['description']
            medication = disease_data['medication'] or medication
            prevention = disease_data['prevention'] or prevention

        # Save or update conversation history
        if not conversation_id:
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO chatbot_conversations (history) VALUES (%s)", (" ".join(conversation_history),))
            conversation_id = cur.lastrowid
            mysql.connection.commit()
            cur.close()
        else:
            cur = mysql.connection.cursor()
            cur.execute("UPDATE chatbot_conversations SET history = %s WHERE conversation_id = %s",
                        (" ".join(conversation_history), conversation_id))
            mysql.connection.commit()
            cur.close()

        # Final response
        return jsonify({
            "conversation_id": conversation_id,
            "diagnosis": diagnosis,
            "description": disease_description,
            "medicine": medication,
            "prevention": prevention
        })

    except Exception as e:
        return jsonify({"error": f"Failed to generate response: {str(e)}"}), 500

# GPS Hospital Locator
@app.route('/find-hospital', methods=['POST'])
def find_hospital():
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    google_maps_api_url = f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius=5000&type=hospital&key=YOUR_GOOGLE_MAPS_API_KEY'
    response = requests.get(google_maps_api_url)
    hospitals = response.json().get('results', [])
    
    return jsonify({"hospitals": hospitals})

if __name__ == '__main__':
    app.run(debug=True)
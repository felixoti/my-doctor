from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'doctor'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

# 1. Endpoint to get count of each disease for a bar chart
@app.route('/disease-chart', methods=['GET'])
def disease_chart():
    cur = mysql.connection.cursor()
    cur.execute("SELECT disease_name, COUNT(*) as count FROM disease_medicine GROUP BY disease_name")
    result = cur.fetchall()
    cur.close()
    return jsonify(result), 200

# 2. Endpoint to save prediction history
@app.route('/save-prediction', methods=['POST'])
def save_prediction():
    data = request.get_json()
    symptoms = data.get('symptoms')
    disease = data.get('disease')
    timestamp = datetime.utcnow()

    if not symptoms or not disease:
        return jsonify({"error": "Symptoms and disease are required"}), 400

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO prediction_history (symptoms, disease, timestamp) VALUES (%s, %s, %s)", 
                (symptoms, disease, timestamp))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Prediction saved successfully"}), 201

# 3. Endpoint to get prediction history
@app.route('/prediction-history', methods=['GET'])
def prediction_history():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM prediction_history ORDER BY timestamp DESC")
    history = cur.fetchall()
    cur.close()
    return jsonify(history), 200

# 4. Endpoint to save symptoms with associated disease
@app.route('/save-symptoms', methods=['POST'])
def save_symptoms():
    data = request.get_json()
    symptoms = data.get('symptoms')
    disease = data.get('disease')

    if not symptoms or not disease:
        return jsonify({"error": "Symptoms and disease are required"}), 400

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO user_symptoms (symptoms, disease) VALUES (%s, %s)", (symptoms, disease))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Symptoms saved with disease"}), 201

if __name__ == '__main__':
    app.run(debug=True)

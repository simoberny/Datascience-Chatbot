from flask import g, Flask, render_template, session, flash, redirect, request, send_from_directory, url_for, Response, jsonify
from flask_session import Session
from werkzeug import secure_filename

import requests
import os.path
import sys
import json
import io
import pandas as pd
from pandas.io.json import json_normalize 
import dialogflow
import csv

app = Flask(__name__, template_folder="../static", static_folder="../static/dist")
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') or 'e5ac358c-f0bf-11e5-9e39-d3b532c10a28'

Session(app)

ALLOWED_EXTENSIONS = set(['csv', 'xls', 'data'])

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'RNode-Unitn-9444d4019101.json'
language_code = 'it-IT'

datasets = {}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def speak_json(message):
    session_client = dialogflow.SessionsClient()

    sessiondag = session_client.session_path('rnode-unitn', "001")
    print('Session path: {}\n'.format(sessiondag))

    text_input = dialogflow.types.TextInput(
        text=message, language_code=language_code)

    query_input = dialogflow.types.QueryInput(text=text_input)

    response = session_client.detect_intent(
        session=sessiondag, query_input=query_input)

    print('=' * 20)
    print('Query text: {}'.format(response.query_result.query_text))
    print('Detected intent: {} (confidence: {})\n'.format(
        response.query_result.intent.display_name,
        response.query_result.intent_detection_confidence))
    print('Fulfillment text: {}\n'.format(
        response.query_result.fulfillment_text))

    print(response.query_result.fulfillment_text)

    if 'messages' not in session:
        session['messages'] = []

    session['messages'].append(["me", message, "markdown", "null", "null"])
    session['messages'].append(["comp", response.query_result.fulfillment_text, "markdown", "null", "null"])

    return (response.query_result)

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/api/message', methods=['GET'])
def sendMessage():
    message = request.args.get('message')

    print(message)

    bot_response = speak_json(message)
    bot_speech = bot_response.fulfillment_text
    actual_intent = bot_response.intent.display_name
    
    return jsonify(response=bot_speech)


@app.route('/api/messages', methods=['GET'])
def getmessages():
    if 'messages' not in session:
        session['messages'] = []
    
    print(session['messages'])
    return jsonify(messages=session['messages'])

@app.route('/api/clear', methods=['GET'])
def clearsession():
    if 'messages' in session:
        session['messages'] = []

    return jsonify(result="ok")

@app.before_first_request
def _run_on_start():
    session.permanent = True
    command_history = ["Salvataggio comandi python"]


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    print('I am at upload file')
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
            csv_input = pd.read_csv(stream, sep=None, engine='python')
            temp_name = file.filename.split(".")[0]
            datasets[temp_name] = csv_input.describe().to_json(orient='table')
            print(csv_input.describe())
            return Response(json.dumps({'name': temp_name}), content_type="application/json")

    return redirect(url_for('index'))

@app.route('/variable/<filename>')
def getDataset(filename):
    return jsonify(datasets[filename])

if __name__ == '__main__':
    app.debug = True;
    app.run()

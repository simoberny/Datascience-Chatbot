# Flask Server

Simple server to support basic CRUD test operation on React UI


### Prerequisites

Highly recommended to create a Virtual Environment with virtualenv

```
pip install virtualenv
virtualenv server (folder)
cd server/Script
activate
```
Then install the dependencies with

```
pip install -r requirements.txt 
```
To be able to communicate with Dialogflow you need to create your own Service Account on Google and download the .json key from their server. Once you have the key copy in the /server folder and change in main.py

```
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'YOUR_FILE.json'
```

### Instructions

To start the server 

```
python main.py
```

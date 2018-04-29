# Node.js

Simple server to support basic CRUD test operation on React UI


### Prerequisites

To install the node dependencies

```
node install
```
To be able to communicate with Dialogflow you need to create your own Service Account on Google and download the .json key from their server. Once you have the key copy in the /server folder and change in config_dialog.js

```
const keyFilename = __dirname + '/YOUR_SERVICE_ACCOUNT.json';
```

### Instructions

To start the server 

```
node run start
```

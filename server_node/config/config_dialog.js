const keyFilename = __dirname + '/RNode-Unitn-9444d4019101.json';
const projectId = 'rnode-unitn';
const sessionId = 'quickstart-session-id';
const keyFilename = __dirname + '/RNode-Unitn-9444d4019101.json';
const languageCode = 'it-IT';

const sessionClient = new dialogflow.SessionsClient({
    keyFilename: keyFilename
});

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

module.exports = sessionPath;
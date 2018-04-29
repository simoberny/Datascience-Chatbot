var exports = module.exports = {};
var PythonShell = require('python-shell');

const projectId = 'rnode-unitn';
const sessionId = 'quickstart-session-id';
const keyFilename = __dirname + '/RNode-Unitn-9444d4019101.json';
const languageCode = 'it-IT';

const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: keyFilename
});

const sessionPath = sessionClient.sessionPath(projectId, sessionId);
var express = require('express');
var router = express.Router();


const ALLOWED_EXTENSION = ["csv", "xls", "data"];

function allowed_file(mime){
    return ALLOWED_EXTENSION.includes(mime.split('.')[1]);
}

router.get('/message', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var data = req.query.message;
    console.log(data);
    const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: data,
            languageCode: languageCode,
          },
        },
      };

    sessionClient
    .detectIntent(request)
    .then(responses => {
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);

        req.session.messages.push({who: 'me', what: 'markdown', message: data, output: { type: null, content: null}});

        if(result.action == "somma" && (result.parameters.fields.number.numberValue && result.parameters.fields.number1.numberValue)){
            var add1 = result.parameters.fields.number.numberValue;
            var add2 = result.parameters.fields.number1.numberValue;

            var comando = add1 + "+" + add2;

            var pyshell = new PythonShell('script.py');
            pyshell.send(comando);

            req.session.commands.push(comando);
            console.log(req.session.commands);
     
            pyshell.on('message', function (message) {
                res.write(JSON.stringify({response: message, output: {type: "text/plain", content: message}}));  
                req.session.messages.push({who: 'comp', what: 'markdown', message: result.fulfillmentText, output: { type: "text/plain", content: message}});
            });
            pyshell.end(function (err,code,signal) {
              if (err) throw err;
              res.end();
            });
        }else{
            res.write(JSON.stringify({response: result.fulfillmentText, output: {type: null, content: null}}));  
            req.session.messages.push({who: 'comp', what: 'markdown', message: result.fulfillmentText, output: { type: null, content: null}});
            res.end();
        }
    })
    .catch(err => {
        console.error('ERRORE:', err);
    });
});

router.get('/messages', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(req.session.messages));   
    res.end();
});

router.get('/clear', (req, res) => {
    req.session.messages = [];
    res.write(JSON.stringify({clear: true}));
    res.end();
});

router.post('/upload', (req, res) => {
    var name = "";
    if(req.files.file && req.files.file.name && allowed_file(req.files.file.name)){
        var stream = req.files.file.data;
        name = req.files.file.name.split('.')[0];

        var pyshell = new PythonShell('readfile.py');
        pyshell.send(stream.toString('utf8'));
 
        pyshell.on('message', function (message) {
            req.session.datasets.push({name: name, data: stream.toString('utf8'), describe: message});
            res.write(JSON.stringify(name));   
        });
        pyshell.end(function (err,code,signal) {
          if (err) throw err;
          res.end();
        });
    }else{
        res.write(JSON.stringify(name));   
        res.end();
    } 
})

router.get('/variable/:filename', (req, res) => {
    var data = req.params.filename;
    var el = req.session.datasets.find((element) => { return element.name == data });
    var ret = '';
    if(el){
        ret = el.describe;
    }else{
        ret = "Variabile non trovata";
    }
    res.write(JSON.stringify(ret));   
    res.end();
});

module.exports = router;
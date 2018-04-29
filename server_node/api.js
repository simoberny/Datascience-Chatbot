var exports = module.exports = {};
var PythonShell = require('python-shell');
const dialogflow = require('dialogflow');

const conf_dialog = require('./config/config_dialog');
const config = require('./config/config');

const sessionClient = new dialogflow.SessionsClient({
    keyFilename: conf_dialog.keyFilename
});

const sessionPath = sessionClient.sessionPath(conf_dialog.projectId, conf_dialog.sessionId);

var express = require('express');
var router = express.Router();

function allowed_file(mime){
    return config.ALLOWED_EXTENSION.includes(mime.split('.')[1]);
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
            languageCode: conf_dialog.languageCode,
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
                var sanit = "" + parseInt(message);
                res.write(JSON.stringify({response: result.fulfillmentText, output: {type: "text/plain", content: sanit}, code: comando}));  
                req.session.messages.push({who: 'comp', what: 'markdown', message: result.fulfillmentText, output: { type: "text/plain", content: sanit}, code: comando});
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
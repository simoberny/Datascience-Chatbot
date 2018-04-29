var express     = require('express');
var bodyParser  = require('body-parser');
var session     = require('express-session');
const fileUpload = require('express-fileupload');
var morgan      = require('morgan');
var app         = express();
var api      = require('./api.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 8080));
app.use('/static', express.static('../static'));

app.use(session({ secret: 'r_node_unitn', resave: true, saveUninitialized: true}));

app.use(morgan('dev'));

app.use(fileUpload());
app.use(function (req, res, next) {
    if(!req.session.messages) req.session.messages = []
    if(!req.session.datasets) req.session.datasets = []
    if(!req.session.commands) req.session.commands = []
    next();
});
  

app.get("/", (req, res) => { res.sendFile("static/index.html", {root: "../" });});

app.use("/api", api);

app.listen(app.get('port'), () => {
    console.log('Magic happens at http://localhost:' + app.get('port'));
});

var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var config = require('./config');

var app = express();
app.use(compression());
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Simple message showing that server is running
app.get('/', (req, res, next) => res.send('Knowledge API is Running!'));

// Load all the routes
app.use('/graph', require('./app/routes/graph'));
app.use('/entity', require('./app/routes/entity'));

app.listen(config.PORT, () => console.log('App listening on port ', config.PORT));

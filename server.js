var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');

var app = express();
app.use(bodyParser.json());

// Simple message showing that server is running
app.get('/', (req, res) => res.send('Knowledge API is Running!'));

// Load all the routes
app.use('/dbpedia', require('./app/routes/dbpedia'));

app.listen(config.PORT, () => console.log('App listening on port ', config.PORT));

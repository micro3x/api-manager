var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var router = express.Router();

app.use('/api', router);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// development time route
app.get('/api/hello', function (request: any, response: any) {
  return response.status(200).send({ "hello": "world" })
});

// static file handling
app.use(express.static(__dirname + '/client/app'));


app.listen(3000);

var plugins = require('./app/plugins');
plugins.init(app, router);

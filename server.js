var express = require('express'),
  bodyParser = require('body-parser'),
  nconf = require('nconf');

nconf.env().argv().file('config.json');

nconf.defaults({
  'http': {
    'port': 3000
  }
});

nconf.required(['project','bearerToken']);

global.conf = nconf;

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/highcharts', express.static(__dirname + '/node_modules/highcharts/dist'));
app.use('/bootswatch', express.static(__dirname + '/node_modules/bootswatch/dist'));

var routes = require('./api/routes/retroRoutes.js');
routes(app)

app.listen(conf.get('http:port'));

console.log('Retrograde Appplication : ' + conf.get('http:port'));

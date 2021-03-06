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
app.use('/highcharts', express.static(__dirname + '/node_modules/highcharts'));
app.use('/bootswatch', express.static(__dirname + '/node_modules/bootswatch/dist'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/popper.js', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use('/react', express.static(__dirname + '/node_modules/react/'));
app.use('/react-dom', express.static(__dirname + '/node_modules/react-dom/'));
app.use('/babel-standalone', express.static(__dirname + '/node_modules/babel-standalone/'));
app.use('/react-highcharts', express.static(__dirname + '/node_modules/react-highcharts/dist/'));

var routes = require('./api/routes/retroRoutes.js');
routes(app)

app.listen(conf.get('http:port'));

console.log('Retrograde Appplication : ' + conf.get('http:port'));


// 1: Intialize 
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');
var mongojs = require('mongojs');
var databaseUrl = "news-scrape";
var collections = ["news"];
var session = require('express-session');
// var orm = require('./configuration/orm.js');
// var PORT = 8080 || process.env;

// use mongojs to hook the database to the db variable 
var db = mongojs(databaseUrl, collections);

//Handlebars-------------------------------------------------------
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//-----------------------------------------------------------------

//Middleware-------------------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));


app.use(express.static('public'));
//-----------------------------------------------------------------

//Routes-----------------------------------------------------------
require('./routes/html-routes.js')(app);
//-----------------------------------------------------------------

// this makes sure that any errors are logged if mongodb runs into an issue
db.on('error', function(err) {
  console.log('Database Error:', err);
});

app.get('/', function (req, res) {
  res.send('The News Scraper!');
});



app.get('/all', function (req, res) {
  db.news-scrape.find({}, function (err, data) {
    if (err) throw err;
    res.json(data);
});



// 2: Name: sort results by name in ascending order, in a json
app.get('/name', function (req, res) {
  db.news-scrape.find().sort({name: 1}, function (err, data) {
    if (err) throw err;
    res.json(data);
});


// 3: Weight: sort results by weight in descending order, in a json
app.get('/weight', function (req, res) {
  db.news-scrape.find().sort({name: -1}, function (err, data) {
    if (err) throw err;
    res.json(data);
});


// set app to run at port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
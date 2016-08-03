
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
app.get('/scrape', function(req, res){
    
    url = 'http://www.roboticstrends.com/';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            // loop through each article
			$('article').each(function(i, element) {

				// declare an empty object to pass to mongo
				var article = {};

				// grab the title, href and content of each article
				var title = $(this).find('h2.title').text();
				var href = $(this).find('a').attr('href');
				var slug = $(this).find('.slug').text();
				var slug_href = $(this).find('.slug a').attr('href');
				var affiliation = $(this).find('.affiliation').text();
				var affiliation_href = $(this).find('.affiliation a').attr('href');
				var content = $(this).find('p.teaser').text();

				console.log(slug_href, affiliation_href);

				// only add article elements that have content for a title
				if (title !== '') {
					// build the article object
					article = {
						title: title,
						href: href,
						slug: slug,
						slug_href: slug_href,
						affiliation: affiliation,
						affiliation_href: affiliation_href,
						content: content,
						comments: []
					}

					// update the db with articles
					db.articles.update(article, article, {upsert: true}, function(err, saved) {
						
						if (err) throw err;

						console.log(saved);

					}); // end db.articles.update()

				} // end if

			}); // end article.each()

		});


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
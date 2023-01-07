const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const request = require('request')





// use whatever webhost port is in their settings OR using local port 5000
const PORT = process.env.PORT || 3000;

// api key and alpha vantage url
const API_KEY = "LT6DW2P19QXZP6QV";
const intradayUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=SPY&interval=60min&apikey=${API_KEY}`;
// calling indices will return an empty object for fundamentals overview. Must be a ticker like AAPL, IBM, TSLA, etc...
const fundamentalsUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=AAPL&apikey=${API_KEY}`;
// function to call API and also how we connect to api
function call_intra(finishedApiCallIntra) {
    request.get({
        url: intradayUrl,
        json: true,
        headers: {'User-Agent': 'request'}
      }, (err, res, data) => {
        if (err) {
          console.log('Error:', err);
        } else if (res.statusCode !== 200) {
          console.log('Status:', res.statusCode);
        } else {
          // data is successfully parsed as a JSON object:
          console.log(data);
          finishedApiCallIntra(data);
        }
    });
}

function call_fundamentals(finishedApiCallFund) {
    request.get({
        url: fundamentalsUrl,
        json: true,
        headers: {'User-Agent': 'request'}
      }, (err, res, data) => {
        if (err) {
          console.log('Error:', err);
        } else if (res.statusCode !== 200) {
          console.log('Status:', res.statusCode);
        } else {
          // data is successfully parsed as a JSON object:
          console.log(data);
          finishedApiCallFund(data);
        }
    });
}

// Set Handlebars Middleware
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

const otherstuff = "this is other stuff!"

// Set handlebar routes
app.get('/', function(req,res) {
    call_fundamentals(function(apiCallFund) { // callback function
        res.render('home', {
            fundamentals: apiCallFund
        });   
    }); 
});

app.get('/', function(req,res) {
    call_intra(function(apiCallIntra) { // callback function
        res.render('home', {
            prices: apiCallIntra
        });   
    });
});

// create about page route
app.get('/about.html', function(req,res) {
    res.render('about');
});

// Set static folder and point app to it
// this is all the routing for static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server is listening on port ' + PORT));






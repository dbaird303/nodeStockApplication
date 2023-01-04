const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');

// use whatever webhost port is in their settings OR using local port 5000
const PORT = process.env.PORT || 3000;

// Set Handlebars Middleware
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

const otherstuff = "this is other stuff!"

// Set handlebar routes
app.get('/', function(req,res) {
    res.render('home', {
        stuff: otherstuff
    });
});



// Set static folder and point app to it
// this is all the routing for static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server is listening on port ' + PORT));






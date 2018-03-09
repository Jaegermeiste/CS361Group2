// 'use strict';
// var http = require('http');

var port = process.env.PORT || 1337;

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', port);



// Request Handler to Add Employee
app.get('/add-employee', function(req, res){

	// Parse request body

	// Check for existence of Group
	// Add to employee JSON file if found

	// Send response code [Error if unable to add]

	res.render('employee', 'This is a test.')


});


// Request Handler to Add Group
app.post('/add-group', function(req, res){

	// Parse request body

	// Add Group to JSON file if it does not exist

	// Send response code [Error if unable to add]

});


// Request Handler to View Employees / Groups




// Default 404 Error -- From CS 290 lecture "Hello Express"
app.use(function(req,res){
 res.type('text/plain');
 res.status(404);
 res.send('404 - Not Found');
});



// Default 500 Error -- From CS 290 lecture "Hello Express"
app.use(function(err, req, res, next){
 console.error(err.stack);
 res.type('plain/text');
 res.status(500);
 res.send('500 - Server Error');
});


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
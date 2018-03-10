// 'use strict';
// var http = require('http');


// Boilerplate code from Hello Node, Hello Express, Hello Handlebars & Form Handling CS 290 lectures 
var port = process.env.PORT || 64351; // changing port so can be run on engr server
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', port);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function addEmployee(employee){
	console.log('Added employee' + employee.firstName + ' ' + employee.lastName);
};

// Request Handler to Add Employee
app.get('/add-employee', function(req, res){

	var context = {};
	res.render('employee', context);

});

// Request Handler to Add Employee
app.post('/add-employee', function(req, res){

	var context = {};

	// Parse request body

	var employee = {};

	employee.firstName = req.body.first;
	employee.lastName = req.body.last;
	employee.group = req.body.group_selected;

	// Check for existence of Group
	// Add to employee JSON file if found

	// Send response code [Error if unable to add]

	addEmployee(employee);

	res.render('employee', context);

});


// Request Handler to Add Group
app.post('/add-group', function(req, res){

	// Parse request body

	// Add Group to JSON file if it does not exist

	// Send response code [Error if unable to add]

});


// Request Handler to View Employees / Groups
app.get('/select-group', function(req, res){

	// Define select statement 
	//
	//
	var select_stmt = "SELECT groupName, groupID, firstName, lastName FROM employeeGroup ORDER BY groupName;";
	db_response = db_simulator(select_stmt);

	res.send(db_response);   
}); 



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

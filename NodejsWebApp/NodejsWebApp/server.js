// server.js

// Boilerplate code from Hello Node, Hello Express, Hello Handlebars, Using MySQL with Node & Form Handling CS 290 lectures 

// Set up port, express, body-parser, handlebars

var port = process.env.PORT || 65351; // changing port so can be run on engr server
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
// var mysql = require('mysql');
// var pool = mysql.pool;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', port);

// DB Simulators 

// // Select Functions
function getEmployee() {
        var select_stmt = "SELECT groupName, groupId, firstName, lastName FROM employeeGroup ORDER BY groupName";

    // Reference: Using MySQL with Node Lecture - CS 290 re: format of DB response
	var select_response = JSON.stringify([{"groupName": "Group2", "groupId": "2", "lastName": "Kvavle", "firstName": "Natasha"}, 
						{"groupName": "TheLesserGroup", "groupId": "3", "lastName":"Foo", "firstName":"Bar"}]);  
	return select_response; 
}


// // Insert Functions 
function addEmployee(first, last, group) {

	var context = {};

	// Create query
	var add_query = "INSERT INTO employees(first, last, groupID) VALUES (?, ?, ?)";

	// Handle in db -- de-comment when db is live
	// pool.query(add_query, [first, last, group], function (err, result) {

 //        if (err) {
 //            next(err);
 //            return;
 //        });


	// Log
    console.log('Added employee ' + first + ' ' + last + ' to ' + group );
	var confirmation_msg = 'Succesfully Added Employee';  
	return context;
}

function addGroup(group) {

	// create query 
	var add_query = "INSERT INTO group(groupName) VALUES (?)";

	// Handle in db -- de-comment when db is live
	// pool.query(add_query, [group], function (err, result) {

 //        if (err) {
 //            next(err);
 //            return;
 //        });


	// Log
	var context = {};
	context.confirmation_msg = 'Successfully Added Group'; 
 	return context; 
}

// Request Handlers 

// // Request Handler for Main/Home Page 
app.get('/home', function(req,res){
    res.render('home'); 
});


// // Request Handler for Main Employee Page
app.get('/employee', function(req, res){
    res.render('employee');
});


// // Request Handler to Add Employee
app.post('/add-employee', function (req, res) {

    var context = {};

    // This could be (and prob should be) it's own function so we can easily do a unit test
    // Below code is meant to operate with a live SQL DB. Non-functional currently

    first = req.body.first;
    last = req.body.last;
    group = req.body.group;

    addEmployee(first, last, group);

    res.status(200);

    context.port = port;
    context.confirmation_msg = 'Successfully Added Employee';

    console.log('Added employee' + employee.firstName + ' ' + employee.lastName);

    res.render('employee', context);

});


// // Request Handler to Add Group
app.post('/add-group', function (req, res) {

    var context = {};

    // This should be a function for unit test purposes
    // Below code is meant to operate with a live SQL DB. Non-functional currently

    groupName = req.body.group_name;

    addGroup(groupName);

    res.status(200);

    context.port = port;
    context.confirmation_msg = 'Successfully Added Group ' + groupName;
 
    res.render('employee', context);

});


// // Request Handler to View Employees / Groups
app.get('/view-employee', function(req, res){

    // Make query to "DB"
    db_response = getEmployee();

    // Log request 
    console.log("Sending the following response from DB: " + db_response);

    // Return response to the calling client-side function 
    res.send(db_response);
}); 


// Testing Harness => Expand if time
app.get('/employeetest', function(req, res, next){

    	// test addEmployee()
    	// happy paths
    	
    	var result = addEmployee('Trevor', 'Worthey', 'Group2');  
    	if (result.confirmation_msg == 'Successfully Added Employee') {
		console.log('Adding Employee: Trevor Worthey; Group: Group2 - Passed'); 
	}
	else {
		console.log('Adding Employee: Trevor Worthey; Group: Group2 - Failed');  
	} 

	// sad paths 
	result = addEmployee('', '', ''); 
	if (result.confirmation_msg != 'Successfully Added Employee') {
		console.log('Adding Employee: Empty; Group: Empty - Passed'); 
	} 
	else {
		console.log('Adding Employee: Empty; Group: Empty - Failed'); 
	
	}		  
    		
    	result = addEmployee(1234, 1234, 1234); 
	if (result.confirmation_msg != 'Successfully Added Employee') {
		console.log('Adding Employee: 1234 1234; Group: 1234 - Passed');  
	}
	else {
		console.log('Adding Employee: 1234 1234; Group: 1234 - Failed'); 
	} 

    	// test getEmployee() 
    	// happy paths 
    	
	result = JSON.parse(getEmployee())
	if (result.length > 0) {
		console.log('Getting Employees: Result length > 0 - Passed');  
	}
	else {
		console.log('Getting Employees: Result length <= 0 - Failed');  
	} 
	for (r in result) {
		for (key in result[r]){ 
			if (key == 'groupName' || key == 'firstName' || key == 'lastName' || key == 'groupId') {
				console.log('Getting Employees: result attribute is ' + key + ' - Passed'); 
			}    
			else {
				console.log('Getting Employees: result attribute is ' + key + ' - Failed'); 
			}
		}
	}

	// could implement more, but unless I hardcode that we expect certain employees, will always fail 
 	
    	// test addGroup() 
    	groupName_happyPaths = [ 'group1', '1234', 'group2', 'supercalifragilisticexpialidocious' ]; 
	groupName_sadPaths = [ '', null, 1234 ]; 
 
	for ( group in groupName_happyPaths ) { 
		result = addGroup(groupName_happyPaths[group]); 
		if (result.confirmation_msg == 'Successfully Added Group') {
			console.log('Adding Group: ' + groupName_happyPaths[group] + ' - Passed'); 
		}
		else {
			console.log('Adding Group: ' + groupName_happyPaths[group] + ' - Failed'); 
		}	
	}  

	for ( group in groupName_sadPaths ) { 
		result = addGroup(groupName_sadPaths[group]); 
		if (result.confirmation_msg != 'Successfully Added Group') {
			console.log('Adding Group: ' + groupName_sadPaths[group] + ' - Passed'); 
		}
		else {
			console.log('Adding Group: ' + groupName_sadPaths[group]  + ' - Failed'); 
		}
	}

   
});
 
// // Default 404 Error -- From CS 290 lecture "Hello Express"
app.use(function(req,res){
 res.type('text/plain');
 res.status(404);
 res.send('404 - Not Found');
});


// // Default 500 Error -- From CS 290 lecture "Hello Express"
app.use(function(err, req, res, next){
 console.error(err.stack);
 res.type('plain/text');
 res.status(500);
 res.send('500 - Server Error');
});


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

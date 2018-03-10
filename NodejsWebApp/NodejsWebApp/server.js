// server.js

// Boilerplate code from Hello Node, Hello Express, Hello Handlebars & Form Handling CS 290 lectures 

var port = process.env.PORT || 65351; // changing port so can be run on engr server
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
// var mysql = require('mysql');
// var pool = mysql.pool;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public")); 

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', port);




function db_select_simulator(stmt){
	var select_response = JSON.stringify([{"groupName": "Group2", "groupId": "2", "lastName": "Kvavle", "firstName": "Natasha"}, 
						{"groupName": "TheLesserGroup", "groupId": "3", "lastName":"Foo", "firstName":"Bar"}]);  
	return select_response; 
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function addEmployee(employee){
	console.log('Added employee' + employee.firstName + ' ' + employee.lastName);
};


// Request Handler for Main/Home Page 
app.get('/home', function(req,res){
	res.render('home'); 
});

// Request Handler for Employee Page
app.get('/employee', function(req, res){
	res.render('employee');
});

// Request Handler to Add Employee
app.post('/add-employee', function(req, res){

	var context = {};

	// Below code is meant to operate with a live SQL DB. Non-functional currently
	pool.query("INSERT INTO employees(first, last, groupID) VALUES (?, ?, ?)", [req.body.first, req.body.last, req.body.group_selected], function (err, result){

		if(err){
			next(err);
			return;
		}

		res.status(200);

		context.port = port;
		context.confirmation_msg = 'Successfully Added Employee';

		console.log('Added employee' + employee.firstName + ' ' + employee.lastName);

	});

	res.render('employee', context);

});


// Request Handler to Add Group
app.post('/add-group', function(req, res){

	var context = {};

	// Below code is meant to operate with a live SQL DB. Non-functional currently
	pool.query("INSERT INTO group(groupName) VALUES (?)", req.body.group_name, function (err, result){

		if(err){
			next(err);
			return;
		}

		res.status(200);

		context.port = port;
		context.confirmation_msg = 'Successfully Added Group';

	});

	res.render('employee', context);

});


// Request Handler to View Employees / Groups
app.get('/view-employee', function(req, res){

	// Define select statement 
	//
	//
	var select_stmt = "SELECT groupName, groupID, firstName, lastName FROM employeeGroup ORDER BY groupName;";
	db_response = db_select_simulator(select_stmt);
	console.log("Sending the following response from DB: " + db_response);  	 
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

// server.js

// Boilerplate code from Hello Node, Hello Express, Hello Handlebars, Using MySQL with Node & Form Handling CS 290 lectures 
// Set up port, express, body-parser, handlebars

var port = process.env.PORT || 65351; // changing port so can be run on engr server
// var port = process.argv[2]

var Express = require('express');
var Handlebars = require('express-handlebars').create({ defaultLayout: "main" });
var BodyParser = require('body-parser');
var App = Express();
var mysql = require('mysql');
var pool = mysql.pool;

App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());

App.use(Express.static("public"));

App.engine('handlebars', Handlebars.engine);
App.set('view engine', 'handlebars');
App.set('port', port);

// Exports
module.exports.Express = Express;
module.exports.Handlebars = Handlebars;
module.exports.BodyParser = BodyParser;
module.exports.App = App;
module.exports.MySQL = mysql;
module.exports.Pool = pool;

// ANOMALIES 
//app.use('/anomalies', require('./anomalies.js'));
//app.use('/anomalies-employees', require('./anomalies-employees.js'));
//app.use('/anomalies-types', require('./anomalies-types.js'));
//app.use('/anomalies-groups', require('./anomalies-groups.js'));


// LOGIN 
var Login = require('./loginServer.js');
var Login_Page = Login.Login_Page;
var Logout = Login.Logout_Page;

// EMPLOYEES 
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
    console.log('Added employee ' + first + ' ' + last + ' to ' + group);
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

// *** Request Handlers ***

// Request Handler for Main/Home Page 
/*App.get('/', function(req,res){
    var context = {};
    res.render('home', context);
});*/ // Login handles / for get and post

App.get('/home', function(req,res){
    var context = {};

    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }

    // Handle Logout Request
    if ((req.body['Logout']) || (req.query.Logout === "Logout")) {
        Logout(req);
        //Login_Page(req, res, "Logged out successfully.");
        //res.setHeader("Message", "Logged out successfully.");
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    res.render('home', context);
});


// // Default GET Handlers for Main Employee Page
App.get('/employee', function(req, res){
    var context = {};

    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }

    // Handle Logout Request
    if ((req.body['Logout']) || (req.query.Logout === "Logout")) {
        Logout(req);
        //Login_Page(req, res, "Logged out successfully.");
        //res.setHeader("Message", "Logged out successfully.");
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    res.render('employee', context);
});

App.get('/add-employee', function(req, res){
    var context = {};

    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }

    // Handle Logout Request
    if ((req.body['Logout']) || (req.query.Logout === "Logout")) {
        Logout(req);
        //Login_Page(req, res, "Logged out successfully.");
        //res.setHeader("Message", "Logged out successfully.");
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    var confirmation_msg = "No employee added, use POST.";
    res.render('employee', context);
});


App.get('/add-group', function(req, res){
    var context = {};

    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }

    // Handle Logout Request
    if ((req.body['Logout']) || (req.query.Logout === "Logout")) {
        Logout(req);
        //Login_Page(req, res, "Logged out successfully.");
        //res.setHeader("Message", "Logged out successfully.");
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    var confirmation_msg = "No group added, use POST.";
    res.render('employee', context);
});



// // Request Handler to Add Employee
App.post('/add-employee', function (req, res) {

    var context = {};

    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }

    // Handle Logout Request
    if ((req.body['Logout']) || (req.query.Logout === "Logout")) {
        Logout(req);
        //Login_Page(req, res, "Logged out successfully.");
        //res.setHeader("Message", "Logged out successfully.");
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    // This could be (and prob should be) it's own function so we can easily do a unit test
    // Below code is meant to operate with a live SQL DB. Non-functional currently

    first = req.body.first;
    last = req.body.last;
    group = req.body.group_selected;

    addEmployee(first, last, group);

    res.status(200);

    context.port = port;
    context.confirmation_msg = 'Successfully Added Employee ' + first + ' ' + last + ' to ' + group;

    console.log('Added employee' + first + ' ' + last);

    res.render('employee', context);

});


// // Request Handler to Add Group
App.post('/add-group', function (req, res) {

    var context = {};

    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }

    // Handle Logout Request
    if ((req.body['Logout']) || (req.query.Logout === "Logout")) {
        Logout(req);
        //Login_Page(req, res, "Logged out successfully.");
        //res.setHeader("Message", "Logged out successfully.");
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

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
App.get('/view-employee', function (req, res) {

    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }

    // Handle Logout Request
    if ((req.body['Logout']) || (req.query.Logout === "Logout")) {
        Logout(req);
        //Login_Page(req, res, "Logged out successfully.");
        //res.setHeader("Message", "Logged out successfully.");
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    // Make query to "DB"
    db_response = getEmployee();

    // Log request 
    console.log("Sending the following response from DB: " + db_response);

    // Return response to the calling client-side function 
    res.send(db_response);
}); 


// Testing Harness => Needs to be updated with changes made to code
App.get('/employeetest', function (req, res, next) {

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

/*
// // Default 404 Error -- From CS 290 lecture "Hello Express"
App.use(function(req,res){
 res.type('text/plain');
 res.status(404);
 res.send('404 - Not Found');
 res.render('404');

});


// // Default 500 Error -- From CS 290 lecture "Hello Express"
App.use(function(err, req, res, next){
 console.error(err.stack);
 res.type('plain/text');
 res.status(500);
 res.send('500 - Server Error');
 res.render('500');
});
*/

App.use(function (req, res) {
    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }

    // Handle Logout Request
    if ((req.body['Logout']) || (req.query.Logout === "Logout")) {
        Logout(req);
        //Login_Page(req, res, "Logged out successfully.");
        //res.setHeader("Message", "Logged out successfully.");
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    res.status = (404);
    res.render("404");
});

App.use(function (err, req, res, next) {
    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }

    // Handle Logout Request
    if ((req.body['Logout']) || (req.query.Logout === "Logout")) {
        Logout(req);
        //Login_Page(req, res, "Logged out successfully.");
        //res.setHeader("Message", "Logged out successfully.");
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    console.error(err.stack);
    res.type("plain/text");
    res.status(500);
    res.render("500");
});



App.listen(App.get('port'), function(){
  console.log('Express started on http://localhost:' + App.get('port') + '; press Ctrl-C to terminate.');
});


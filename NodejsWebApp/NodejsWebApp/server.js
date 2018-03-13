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
var pool = mysql.createPool({
 	connectionLimit: 10,
 	host: 'classmysql.engr.oregonstate.edu',
 	user: 'cs361_kvavlen',
 	password: '8534', 
 	database: 'cs361_kvavlen',
});
  
module.exports.pool = pool; 

App.use(BodyParser.urlencoded({ extended: true }));
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
//module.exports.MySQL = mysql;
//module.exports.Pool = pool;

// ANOMALIES 
App.use('/anomalies', require('./anomalies.js'));
App.use('/anomalies-employees', require('./anomalies-employees.js'));
App.use('/anomalies-types', require('./anomalies-types.js'));
App.use('/anomalies-groups', require('./anomalies-groups.js'));


// LOGIN 
var Login = require('./loginServer.js');
var Login_Page = Login.Login_Page;
var Logout = Login.Logout_Page;

// EMPLOYEES 
// DB Handlers
// Reference: Using MySQL with Node Lecture, CS 290 

// // Select Functions
function getEmployee(next) {
    

}


// // Insert Functions 
function addEmployee(first, last, group, next) {
    
    var sql = "INSERT INTO employee_group (employeeId, groupId) values ((SELECT employeeId FROM employee WHERE firstName = ? AND lastName = ?), (SELECT groupId from `group` WHERE groupName = ?));";
    var vars = [first, last, group]; 
    pool.query(sql, vars, function (err, results) {
        if (err) {
            next(err);
            return;
        } 

	var context = {}; 
        console.log('Added employee ' + first + ' ' + last + ' to ' + group);
        context.confirmation_msg = 'Succesfully Added Employee';
        console.log('confirmation sent: ' + context.confirmation_msg); 	
        return context;
    })	
}

function addGroup(group, next) {
    
    var sql = "INSERT INTO `group` (`groupName`) VALUES (?)";
    var vars = [group]
    pool.query(sql, vars, function(err, results) {
        if (err) {
            next(err);
            console.log('There was an error in the DB INSERT statement'); 
            return;
        }
        var context = {};  
        console.log('Added group ' + group);
        context.confirmation_msg = 'Succesfully Added Group';
	return context; 
    })
}

// *** Request Handlers ***

// Request Handler for Main/Home Page 
/*App.get('/', function(req,res){
    var context = {};
    res.render('home', context);
});*/ // Login handles / for get and post

App.get('/home', function(req,res, next){
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
App.get('/employee', function(req, res, next){
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
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    res.render('employee', context);
});

App.get('/add-employee', function(req, res, next){
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
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    var confirmation_msg = "No employee added, use POST.";
    res.render('employee', context);
});

// GET 
App.get('/add-group', function(req, res, next){
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
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    var confirmation_msg = "No group added, use POST.";
    res.render('employee', context);
});



// // Request Handler to Add Employee
App.post('/add-employee', function (req, res, next) {

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

    // Grab first name, last name, and group name from body 	
    var first = req.body.first;
    var last = req.body.last;
    var group = req.body.group_selected;

    console.log('Attempting add of ' + first + ' ' + last + ' into group ' + group);  
    // Insert into DB and save result
    addEmployee(first, last, group, next);

    // Successful if got to this point, save confirmation msg
    context.confirmation_msg = 'Succesfully Added Employee ' + first + ' ' + last + ' to ' + group;  	
    console.log('Added employee' + first + ' ' + last);
    
    // Rendering confirmation msg on employee.handlebars 
    res.render('employee', context);
});


// // Request Handler to Add Group
App.post('/add-group', function (req, res, next) {

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
        res.redirect('/?Message=Logged out successfully.');
        return;
    }

    var groupName = req.body.group_name; 
     
    // Insert group via SQL INSERT statement 	
    addGroup(groupName, next);
    
    // If made it here, successful
    context.confirmation_msg = 'Successfully Added Group ' + groupName;
    console.log('Added group ' + groupName); 

    // Render confirmation msg on employee.handlebars 			
    res.render('employee', context);

});


// // Request Handler to View Employees / Groups
App.get('/view-employee', function (req, res, next) {

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

    var sql = "SELECT group.groupName, employee.firstName, employee.lastName FROM `employee` INNER JOIN `employee_group` ON employee_group.employeeId = employee.employeeId INNER JOIN `group` ON employee_group.groupId = group.groupId ORDER BY group.groupName;";
    pool.query(sql, function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }

        var db_result = rows;
        console.log('getEmployee() returning: ' + db_result);

        // Make query to "DB"
        // Return response to the calling client-side function 
        res.send(JSON.stringify(db_result));
    })


}); 


// Testing Harness => Needs to be updated with changes made to code
App.get('/unittest-employee', function (req, res, next) {
    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }
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

App.get('/integrationtest-employee', function (req, res, next) {

    //If there is no session, go to the login page.
    if ((!req.session) || (!req.session.user)) {
        console.log("No active session. Redirect to login screen.");
        res.redirect('/');
        return;
    }
	res.render('integrationtest-employee'); 
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


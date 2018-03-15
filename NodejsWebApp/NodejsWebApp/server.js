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
// ENGR MySQL
var pool = mysql.createPool({
 	connectionLimit: 10,
 	host: 'classmysql.engr.oregonstate.edu',
 	user: 'cs361_kvavlen',
 	password: '8534', 
 	database: 'cs361_kvavlen',
});

// Local MySQL
/*var pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'cs361_kvavlen',
    password: '8534',
    database: 'cs361_kvavlen',
});*/

App.engine('handlebars', Handlebars.engine);
App.set('view engine', 'handlebars');
App.set('port', port);
  
App.use(BodyParser.urlencoded({ extended: true }));
App.use(BodyParser.json());

App.use(Express.static("public"));



// Exports
module.exports.Express = Express;
module.exports.Handlebars = Handlebars;
module.exports.BodyParser = BodyParser;
module.exports.App = App;
module.exports.MySQL = mysql;
module.exports.Pool = pool;


// ANOMALIES 
var Anomalies = require('./anomalies.js');
//App.use('/anomalies-employees', require('./anomalies-employees.js'));
//App.use('/anomalies-types', require('./anomalies-types.js'));
//App.use('/anomalies-groups', require('./anomalies-groups.js'));


// LOGIN 
var Login = require('./loginServer.js');
var Login_Page = Login.Login_Page;
var Logout = Login.Logout_Page;
var CheckSession = Login.CheckSession;

// EMPLOYEES 
// DB Handlers
// Reference: Using MySQL with Node Lecture, CS 290 

// // Insert Functions 
function addEmployee(first, last, group, next) {
    
    var sql = "INSERT INTO employee_group (employeeId, groupId) values ((SELECT id AS `employeeId` FROM employees WHERE f_name = (?) AND l_name = (?)), (SELECT id AS `groupId` FROM `groups` WHERE name = (?)));";
    var vars = [first, last, group]; 
    pool.query(sql, vars, function (err, results) {
        if (err) {
        //    next(err);
            return false;
        } 
    })	
    return true; 
}

function addGroup(group, next) {
    
    var sql = "INSERT INTO `groups` (`name`) VALUES (?)";
    var vars = [group]
    pool.query(sql, vars, function(err, results) {
        if (err) {
            console.log(err);
        //    next(err);
            return false;
        }
    })
    return true; 	 
}

// *** Request Handlers ***
App.get('/home', function(req,res, next){
    var context = {};

    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    res.render('home', context);
});


// // Default GET Handlers for Main Employee Page
App.get('/employee', function(req, res, next){
    var context = {};

    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    res.render('employee', context);
});

App.get('/add-employee', function(req, res, next){
    var context = {};

    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    var confirmation_msg = "No employee added, use POST.";
    res.render('employee', context);
});

// GET 
App.get('/add-group', function(req, res, next){
    var context = {};

    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    var confirmation_msg = "No group added, use POST.";
    res.render('employee', context);
});



// // Request Handler to Add Employee
App.post('/add-employee', function (req, res, next) {

    var context = {};

    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    // Grab first name, last name, and group name from body 	
    var first = req.body.first;
    var last = req.body.last;
    var group = req.body.group_selected;

    console.log('Attempting add of ' + first + ' ' + last + ' into group ' + group);  
    // Insert into DB and save result
    if ( addEmployee(first, last, group, next) == true ) {
	// Successful if got to this point, save confirmation msg
        context.confirmation_msg = 'Succesfully Added Employee ' + first + ' ' + last + ' to ' + group;  	
        console.log('Added employee' + first + ' ' + last);
    }   
    // Rendering confirmation msg on employee.handlebars 
    res.render('employee', context);
});


// // Request Handler to Add Group
App.post('/add-group', function (req, res, next) {

    var context = {};

    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    var groupName = req.body.group_name; 
     
    // Insert group via SQL INSERT statement 	
    if (addGroup(groupName, next) == true ) {
   
        // If made it here, successful
        context.confirmation_msg = 'Successfully Added Group ' + groupName;
        console.log('Added group ' + groupName); 
    }
	
    // Render confirmation msg on employee.handlebars 			
    res.render('employee', context);

});


// // Request Handler to View Employees / Groups
App.get('/view-employee', function (req, res, next) {

    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    console.log("Getting employee list.");
    var sql = "SELECT groups.name AS `groupName`, employees.f_name AS `firstName`, employees.l_name AS `lastName` FROM `employees` INNER JOIN `employee_group` ON employee_group.employeeId = employees.id INNER JOIN `groups` ON employee_group.groupId = groups.id ORDER BY groups.name;";
    pool.query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
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


// Unit Tests - Employee 
// Mimicking structure of Unit Tests - Login for consistency 
App.get('/unittest-employee', function (req, res, next) {

    var context = {};
    context.title = "Employee Unit Tests";
    context.row = [];

    // test addEmployee()
    // Happy Paths
    	
    var result = addEmployee('Cody', 'Hannan', 'Red');
    var sql = "SELECT groups.name AS `groupName`, employees.f_name AS `firstName`, employees.l_name AS `lastName` FROM `employees` INNER JOIN `employee_group` ON employee_group.employeeId = employees.id INNER JOIN `groups` ON employee_group.groupId = groups.id WHERE employees.f_name = 'Cody' AND employees.l_name = 'Hannan' AND groups.name = 'Red';";
    pool.query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            next(err);
            return;
        }

        // Make sure addition to DB happened 
        if (result == true && rows[0].groupName == 'Red' && rows[0].firstName == 'Cody' && rows[0].lastName == 'Hannan') {
            context.row.push({"name": "addEmployee() - Happy Path - Adding known employee to known group"}, {"status": "Passed"});
        }
        else {
            context.row.push({ "name": "addEmployee() - Happy Path - Adding known employee to known group" }, { "status": "Failed" });
        }
    })

	// Sad Paths 
	var result2 = addEmployee('', '', ''); 
	var sql = "SELECT groups.name AS `groupName`, employees.f_name AS `firstName`, employees.l_name AS `lastName` FROM `employees` INNER JOIN `employee_group` ON employee_group.employeeId = employees.id INNER JOIN `groups` ON employee_group.groupId = groups.id WHERE employees.f_name = '' AND employees.l_name = '' AND groups.name = '';";
	pool.query(sql, function (err, rows, fields) {
	    if (err) {
	        console.log(err);
	        next(err);
	        return;
	    }
	    console.log(rows); 
	    // Make sure addition of value (not null) to DB did not happen 
	    if (result2 == false && rows[0] == null) {
	        context.row.push({ "name": "addEmployee() - Sad Path - Adding unknown employee to unknown group" }, { "status": "Passed" });
	    }
	    else {
	        context.row.push({ "name": "addEmployee() - Sad Path - Adding unknown employee to unknown group" }, { "status": "Failed" });
	    }
	})

	var result3 = addEmployee('Cody', 'Hannan', 'GROUP12345');
	var sql = "SELECT groups.name AS `groupName`, employees.f_name AS `firstName`, employees.l_name AS `lastName` FROM `employees` INNER JOIN `employee_group` ON employee_group.employeeId = employees.id INNER JOIN `groups` ON employee_group.groupId = groups.id WHERE employees.f_name = 'Cody' AND employees.l_name = 'Hannan' AND groups.name = 'GROUP12345';";
	pool.query(sql, function (err, rows, fields) {
	    if (err) {
	        console.log(err);
	        next(err);
	        return;
	    }

	    // Make sure addition ov value (not null) to DB did not happen 
	    if (result3 == false && rows[0] == null) {
	        context.row.push({ "name": "addEmployee() - Sad Path - Adding known employee to unknown group" }, { "status": "Passed" });
	    }
	    else {
	        context.row.push({ "name": "addEmployee() - Sad Path - Adding known employee to unknown group" }, { "status": "Failed" });
	    }
	})


	var result4 = addEmployee('Natasha', 'Kvavle', 'Yellow');

	var sql = "SELECT groups.name AS `groupName`, employees.f_name AS `firstName`, employees.l_name AS `lastName` FROM `employees` INNER JOIN `employee_group` ON employee_group.employeeId = employees.id INNER JOIN `groups` ON employee_group.groupId = groups.id WHERE employees.f_name = 'Natasha' AND employees.l_name = 'Kvavle' AND groups.name = 'Yellow';";
	pool.query(sql, function (err, rows, fields) {
	    if (err) {
	        console.log(err);
	        next(err);
	        return;
	    }

	    // Make sure addition to DB didn't happen 
	    if (result4 == false && rows[0] == null) {
	        context.row.push({ "name": "addEmployee() - Sad Path - Adding unknown employee to known group" }, { "status": "Passed" });
	    }
	    else {
	        context.row.push({ "name": "addEmployee() - Sad Path - Adding unknown employee to known group" }, { "status": "Failed" });
	    }
	})
    
    // test getEmployee() 
    
/*
	result = JSON.parse(getEmployee())
	if (result.length > 0) {
		console.log('/view-employee: Result length > 0 - Passed');  
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
*/

   	// test addGroup() 
    // Hapy paths 
	var result5 = addGroup('supercalifragilistic'); 
	var sql = "SELECT name FROM `groups` WHERE name = 'supercalifragilistic';";  // This is not great practice, however it's not retrieving user input so less risk
	pool.query(sql, function (err, rows, fields) {
	    if (err) {
	        console.log(err);
	        next(err);
	        return;
	    }

	    // Make sure addition to db happened 
	    if (result5 == true && rows[0].name == 'supercalifragilistic') {
	        context.row.push({ "name": "addGroup() - Happy Path - Adding valid group" }, { "status": "Passed" });
	    }
	    else {
	        context.row.push({ "name": "addGroup() - Happy Path - Adding valid group" }, { "status": "Failed" });
	    }
	})
	  

	// Sad path 
	var result6 = addGroup(''); 
	var sql = "SELECT name FROM `groups` WHERE name = ''";
	pool.query(sql, function (err, rows, fields) {
	    if (err) {
	        console.log(err);
	        next(err);
	        return;
	    }

	    // Make sure addition to DB didn't happen 
	    if (result5 == false && rows[0] == null) {
	        context.row.push({ "name": "addGroup() - Sad Path - Adding invalid group" }, { "status": "Passed" });
	    }
	    else {
	        context.row.push({ "name": "addGroup() - Sad Path - Adding invalid group" }, { "status": "Failed - Requires more stringent rules on adding empty groups" });
	    }
	})
	

	console.log("Test complete");
	res.render('loginTest', context); //using same template for employeeTest as loginTest
	return;

});

App.get('/integrationtest-employee', function (req, res, next) {
    // Ensure we are logged in 
    if (!CheckSession(req, res)) { 
	return; 
    }  	
    // Tests are client side
    res.render('integrationtest-employee'); 
}); 

App.use(function (req, res) {
    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    res.status = (404);
    res.render("404");
});

App.use(function (err, req, res, next) {
    // Ensure we are logged in
    if (!CheckSession(req, res)) {
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


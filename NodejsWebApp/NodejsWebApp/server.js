// server.js

// Boilerplate code from Hello Node, Hello Express, Hello Handlebars, Using MySQL with Node & Form Handling CS 290 lectures 
// Set up port, express, body-parser, handlebars

var port = process.env.PORT || 45689; // changing port so can be run on engr server
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


// Checks input for empty / undefined / null
function isEmpty(value){
    
    if (value === null || value == null)
        return true;

    else if (typeof(value) === 'undefined')
        return true;

    else if (value === "" || value == "")
        return true;

    else
        return false;

} 


// // Insert Functions 
function addEmployee(first, last, group, next) {
    
    if (isEmpty(first) || isEmpty(last) || isEmpty(group)){
        console.log("One or more fields are missing!");
        return false;
    }

    var sql = "INSERT INTO employee_group (employeeId, groupId) values ((SELECT id AS `employeeId` FROM employees WHERE f_name = (?) AND l_name = (?)), (SELECT id AS `groupId` FROM `groups` WHERE name = (?)));";
    var vars = [first, last, group]; 
    pool.query(sql, vars, function (err, results) {
        if (err) {
        //    next(err);
            return false;
        } 
    });
    return true; 
}

function addGroup(group, next) {
    
    if (isEmpty(group)){
        console.log("One or more fields are missing!");
        return false;
    }

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

function addRule(rule_name, group_name, boundary_name, feature_to_disable) {

    if (isEmpty(rule_name) || isEmpty(group_name) || isEmpty(boundary_name) || isEmpty(feature_to_disable)){
        console.log("One or more fields are missing!");
        return false;
    }

    var sql = "INSERT INTO `rules` (`group_id`, `lb_id`, `fd_id`, `rule_name`) VALUES ((?), (SELECT `id` FROM `groups` WHERE groups.name = (?)), (SELECT `id` FROM `lockdown_boundaries` WHERE lockdown_boundaries.name = (?)), (SELECT `id` FROM `features_disabled` WHERE features_disabled.name = (?)));"
    var vars = [rule_name, group_name, boundary_name, feature_to_disable];
    pool.query(sql, vars, function (err, results) {
        if (err) {
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

App.get('/rules', function(req, res, next) {
    var context = {}; 
    // Ensure we are logged in 
    if (!CheckSession(req, res)){
        return; 
    }	  	

    res.render('rules', context); 
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
    else {
        confirmation_msg = "Unable to add Employee. Please check and try again";
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
    else {
        confirmation_msg = "Unable to add Group. Please check and try again";
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

        // Return response to the calling client-side function 
        res.send(JSON.stringify(db_result));
    })


}); 

App.post('/add-rule', function (req, res, next) {
    var context = {};

    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    // Grab first name, last name, and group name from body 	
    var rule_name = req.body.rule_name;
    var group_name = req.body.group_name;
    var boundary_name = req.body.boundary_name;
    var feature_to_disable = req.body.feature_to_disable;

    console.log('Attempting add of ' + first + ' ' + last + ' into group ' + group);
    // Insert into DB and save result
    if (addRule(rule_name, group_name, boundary_name, feature_to_disable) == true) {
        // Successful if got to this point, save confirmation msg
        context.confirmation_msg = 'Succesfully Added Rule' + rule_name;
        console.log('Added rule' + rule_name);
    }
    // Rendering confirmation msg on employee.handlebars 
    res.render('rules', context);
}); 


// The following rule - related GET endpoints are assuming we are going to use a dropdown box to populate form
App.get('/view-rule', function (req, res, next) {
    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    // Get rules to populate in table
    console.log("Getting rule list.");
    var sql = "SELECT r.rule_name AS `rule`, lb.name AS `lockdown boundary`, g.name AS `group`, fd.name AS `feature disbled` FROM `rules` r INNER JOIN `groups` g ON r.group_id = g.id INNER JOIN `features_disabled` fd ON r.fd_id = fd.id INNER JOIN `lockdown_boundaries`lb ON r.lb_id = lb.id ORDER BY rule_name;";
    pool.query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            next(err);
            return;
        }

        var db_result = rows;
        console.log('get-lockdown-boundaries endpoint - returning: ' + db_result);
        res.send(JSON.stringify(db_result));
    })
});

// The following rule - related GET endpoints are assuming we are going to use a dropdown box to populate form
App.get('/view-group', function (req, res, next) {
    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    // Get group list
    console.log("Getting group list.");
    var sql = "SELECT name FROM `groups` ORDER BY name;"
    pool.query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            next(err);
            return;
        }

        var db_result = rows;
        console.log('get-group endpoint - returning: ' + db_result);

        var context = {};
        context.groups = JSON.stringify(db_result); 
        res.send(context);
    })
});

App.get('/view-lockdown-boundary', function (req, res, next) {

    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    // Get features disabled to populate in drop-down
    console.log("Getting lockdown boundary list.");
    var sql = "SELECT name FROM lockdown_boundaries ORDER BY name;";
    pool.query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            next(err);
            return;
        }

        var db_result = rows;
        console.log('get-lockdown-boundaries endpoint - returning: ' + db_result);
        var context = {}
        context.boundaries = JSON.stringify(db_result);

        res.send(context);
    })

});

App.get('/view-features-disabled', function (req, res, next) {

    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    // Get features disabled to populate in drop-down
    console.log("Getting feature list.");
    var sql = "SELECT name FROM features_disabled ORDER BY name;";
    pool.query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            next(err);
            return;
        }

        var db_result = rows;
        console.log('get-features-disabled endpoint - returning: ' + db_result);

        var context = {}
        context.features = JSON.stringify(db_result);

        res.send(context);
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


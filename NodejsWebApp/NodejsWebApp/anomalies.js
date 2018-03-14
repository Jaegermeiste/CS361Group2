// Include Server
var Server = require('./server.js');

var Express = Server.Express;
var Handlebars = Server.Handlebars;
var BodyParser = Server.BodyParser;
var App = Server.App;
var MySql = Server.MySQL;
var Pool = Server.Pool;

// Include Login
var Login = require('./loginServer.js');
var Login_Page = Login.Login_Page;
var Logout = Login.Logout_Page;
var CheckSession = Login.CheckSession;

// Constants
const ANOMALIES_DEFAULT_QUERY = "SELECT anomalies.id, anomalies.timestamp, employees.f_name AS Employee, employee_groups.name AS Employee_Group, anomaly_types.name AS Type, anomalies.latitude, anomalies.longitude FROM anomalies INNER JOIN employees ON anomalies.employee_id = employees.id INNER JOIN employee_groups ON anomalies.group_id = employee_groups.id INNER JOIN anomaly_types ON anomalies.type_id = anomaly_types.id";
const ANOMALIES_TYPES_QUERY = "SELECT anomalies.id, anomalies.timestamp, employees.f_name AS Employee, employee_groups.name AS Employee_Group, anomaly_types.name AS Type, anomalies.latitude, anomalies.longitude FROM anomalies INNER JOIN employees ON anomalies.employee_id = employees.id INNER JOIN employee_groups ON anomalies.group_id = employee_groups.id INNER JOIN anomaly_types ON anomalies.type_id = anomaly_types.id ORDER BY Type ASC";
const ANOMALIES_GROUPS_QUERY = "SELECT anomalies.id, anomalies.timestamp, employees.f_name AS Employee, employee_groups.name AS Employee_Group, anomaly_types.name AS Type, anomalies.latitude, anomalies.longitude FROM anomalies INNER JOIN employees ON anomalies.employee_id = employees.id INNER JOIN employee_groups ON anomalies.group_id = employee_groups.id INNER JOIN anomaly_types ON anomalies.type_id = anomaly_types.id ORDER BY Employee_Group ASC";
const ANOMALIES_EMPLOYEES_QUERY = "SELECT anomalies.id, anomalies.timestamp, employees.f_name AS Employee, employee_groups.name AS Employee_Group, anomaly_types.name AS Type, anomalies.latitude, anomalies.longitude FROM anomalies INNER JOIN employees ON anomalies.employee_id = employees.id INNER JOIN employee_groups ON anomalies.group_id = employee_groups.id INNER JOIN anomaly_types ON anomalies.type_id = anomaly_types.id ORDER BY employees.f_name ASC";

var unittestanomaly = {};
unittestanomaly.Success = false;
unittestanomaly.Running = false;

function getAnomalyView(res, SQLquery, context) {
    if (!Pool || !SQLquery) {
        res.render('anomalies', context);
        return false;
    }

    Pool.query(SQLquery, function (error, results, fields) {
        if (error) {
            console.log(error);
            context.errorMsg = JSON.stringify(error);
            res.render('anomalies', context);
            return;
            //res.write(JSON.stringify(error));
            //res.end();
        }

        if (unittestanomaly.Running) {
            unittestanomaly.Success = true;
            res.redirect('/unittest-anomaly');
            return;
        } else {
            context.view = results;
            res.render('anomalies', context);
        }

        return true;
    });
}

var unittestanomaly = {};
unittestanomaly.Success = false;
unittestanomaly.Running = false;
App.get('/unittest-anomaly', function (req, res, next) {
    var context = {};
    var testContext = {};
    context.layout = "loginMain";
    context.title = "Anomaly Unit Tests";
    context.row = [];
    var result = "";

    if (unittestanomaly.Running === false) {
        console.log("Anomaly Unit Test");
        unittestanomaly.Success = false;
        unittestanomaly.Running = true;
    }

    // Test ANOMALIES_DEFAULT_QUERY
    if (unittestanomaly.DefaultTest === "Running") {
        if (unittestanomaly.Success === true) {
            unittestanomaly.Success = false;
            unittestanomaly.DefaultTest = "Passed";
        }
        else {
            unittestanomaly.Success = false;
            unittestanomaly.DefaultTest = "Failed";
        }
    }
    if (unittestanomaly.DefaultTest) {
        context.row.push({ "name": "Test ANOMALIES_DEFAULT_QUERY", "status": unittestanomaly.DefaultTest });
    } else {
        unittestanomaly.DefaultTest = "Running";
        getAnomalyView(res, ANOMALIES_DEFAULT_QUERY, testContext);
        return;
    }

    // Test ANOMALIES_TYPES_QUERY
    if (unittestanomaly.TypesTest === "Running") {
        if (unittestanomaly.Success === true) {
            unittestanomaly.Success = false;
            unittestanomaly.TypesTest = "Passed";
        }
        else {
            unittestanomaly.Success = false;
            unittestanomaly.TypesTest = "Failed";
        }
    }
    if (unittestanomaly.TypesTest) {
        context.row.push({ "name": "Test ANOMALIES_TYPES_QUERY", "status": unittestanomaly.TypesTest });
    } else {
        unittestanomaly.TypesTest = "Running";
        getAnomalyView(res, ANOMALIES_TYPES_QUERY, testContext);
        return;
    }

    // Test ANOMALIES_GROUPS_QUERY
    if (unittestanomaly.GroupsTest === "Running") {
        if (unittestanomaly.Success === true) {
            unittestanomaly.Success = false;
            unittestanomaly.GroupsTest = "Passed";
        }
        else {
            unittestanomaly.Success = false;
            unittestanomaly.GroupsTest = "Failed";
        }
    }
    if (unittestanomaly.GroupsTest) {
        context.row.push({ "name": "Test ANOMALIES_GROUPS_QUERY", "status": unittestanomaly.GroupsTest });
    } else {
        unittestanomaly.GroupsTest = "Running";
        getAnomalyView(res, ANOMALIES_GROUPS_QUERY, testContext);
        return;
    }

    // Test ANOMALIES_EMPLOYEES_QUERY
    if (unittestanomaly.EmployeesTest === "Running") {
        if (unittestanomaly.Success === true) {
            unittestanomaly.Success = false;
            unittestanomaly.EmployeesTest = "Passed";
        }
        else {
            unittestanomaly.Success = false;
            unittestanomaly.EmployeesTest = "Failed";
        }
    }
    if (unittestanomaly.EmployeesTest) {
        context.row.push({ "name": "Test ANOMALIES_EMPLOYEES_QUERY", "status": unittestanomaly.EmployeesTest });
    } else {
        unittestanomaly.EmployeesTest = "Running";
        getAnomalyView(res, ANOMALIES_EMPLOYEES_QUERY, testContext);
        return;
    }

    console.log("Test complete");
    unittestanomaly.Running = false;

    res.render('loginTest', context);
    return;
});

App.get('/anomalies', function (req, res) {
    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    var context = {};
    context.jsscripts = ["deleteanomaly.js"];
    getAnomalyView(res, ANOMALIES_DEFAULT_QUERY, context);
});

App.get('/anomalies-types', function (req, res) {
    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    var context = {};
    context.jsscripts = ["deleteanomaly.js"];
    getAnomalyView(res, ANOMALIES_TYPES_QUERY, context);
});

App.get('/anomalies-groups', function (req, res) {
    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    var context = {};
    context.jsscripts = ["deleteanomaly.js"];
    getAnomalyView(res, ANOMALIES_GROUPS_QUERY, context);
});

App.get('/anomalies-employees', function (req, res) {
    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    var context = {};
    context.jsscripts = ["deleteanomaly.js"];
    getAnomalyView(res, ANOMALIES_EMPLOYEES_QUERY, context);
});

App.get('/anomalies-delete', function (req, res, next) {
    // Ensure we are logged in
    if (!CheckSession(req, res)) {
        return;
    }

    if (!Pool) {
        res.render('anomalies', context);
        return;
    }

    var context = {};
    console.log("Deleting row " + req.query.id + "from table 'anomalies'");
    var sql = "DELETE FROM anomalies WHERE id = (?)";
    sql = Pool.query(sql, req.query.id, function (error, results, fields) {
        if (error) {
            console.log(error);
            context.errorMsg = JSON.stringify(error);
            res.render('anomalies', context);
            next(error);
            return;

            //res.write(JSON.stringify(error));
            //res.status(400);
            //res.end();
        } else {
            var responseString = "Row " + req.query.id + " deleted from table 'anomalies'.";
            res.send(responseString);
            console.log(responseString);
            res.status(202).end();
        }
    })
});

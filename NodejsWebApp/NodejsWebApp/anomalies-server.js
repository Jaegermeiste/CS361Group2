

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);

var mysql = require('mysql');
var pool = mysql.pool;


app.get('/anomalies', function(req, res){
    var context = {};

    pool.query("SELECT anomalies.id, anomalies.timestamp, employees.f_name AS Employee, employee_groups.name AS Employee_Group, anomaly_types.name AS Type, anomalies.latitude, anomalies.longitude FROM anomalies INNER JOIN employees ON anomalies.employee_id = employees.id INNER JOIN employee_groups ON anomalies.group_id = employee_groups.id INNER JOIN anomaly_types ON anomalies.type_id = anomaly_types.id", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
    	}
    
    context.view = results;
    });
    res.render('anomalies', context);
});


app.get('/anomalies-employees', function(req, res){
    var context = {};

        pool.query("SELECT anomalies.id, anomalies.timestamp, employees.f_name AS Employee, employee_groups.name AS Employee_Group, anomaly_types.name AS Type, anomalies.latitude, anomalies.longitude FROM anomalies INNER JOIN employees ON anomalies.employee_id = employees.id INNER JOIN employee_groups ON anomalies.group_id = employee_groups.id INNER JOIN anomaly_types ON anomalies.type_id = anomaly_types.id ORDER BY employees.f_name ASC", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
    	}

	    context.view  = results;
    });
    res.render('anomalies', context);
});


app.get('/anomalies-groups', function(req, res){
    var context = {};

        mysql.pool.query("SELECT anomalies.id, anomalies.timestamp, employees.f_name AS Employee, employee_groups.name AS Employee_Group, anomaly_types.name AS Type, anomalies.latitude, anomalies.longitude FROM anomalies INNER JOIN employees ON anomalies.employee_id = employees.id INNER JOIN employee_groups ON anomalies.group_id = employee_groups.id INNER JOIN anomaly_types ON anomalies.type_id = anomaly_types.id ORDER BY Employee_Group ASC", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
    	}

    context.view  = results;    	
    });
    res.render('anomalies', context);
});


app.get('/anomalies-types', function(req, res){
    var context = {};

        pool.query("SELECT anomalies.id, anomalies.timestamp, employees.f_name AS Employee, employee_groups.name AS Employee_Group, anomaly_types.name AS Type, anomalies.latitude, anomalies.longitude FROM anomalies INNER JOIN employees ON anomalies.employee_id = employees.id INNER JOIN employee_groups ON anomalies.group_id = employee_groups.id INNER JOIN anomaly_types ON anomalies.type_id = anomaly_types.id ORDER BY Type ASC", function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	    	}
		
	    	context.view  = results;
    	});

    res.render('anomalies', context);

});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getView(res, mysql, context, complete){
        mysql.pool.query("SELECT anomalies.id, anomalies.timestamp, employees.f_name AS Employee, employee_groups.name AS Employee_Group, anomaly_types.name AS Type, anomalies.latitude, anomalies.longitude FROM anomalies INNER JOIN employees ON anomalies.employee_id = employees.id INNER JOIN employee_groups ON anomalies.group_id = employee_groups.id INNER JOIN anomaly_types ON anomalies.type_id = anomaly_types.id ORDER BY Type ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.view  = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteanomaly.js"];
        var mysql = req.app.get('mysql');
        getView(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('anomalies', context);
            }

        }
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM anomalies WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();

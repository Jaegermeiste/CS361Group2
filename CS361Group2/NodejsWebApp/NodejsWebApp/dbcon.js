var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_hannanc',
  password        : '3671',
  database        : 'cs361_hannanc'
});
module.exports.pool = pool;

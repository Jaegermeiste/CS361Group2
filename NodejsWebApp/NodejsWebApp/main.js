

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

app.use('/', require('./home.js'));
app.use('/pokemon', require('./pokemon.js'));
app.use('/types', require('./types.js'));
app.use('/locations', require('./locations.js'));
app.use('/moves', require('./moves.js'));
app.use('/pokemon_moves',require('./pokemon_moves.js'));
app.use('/pokemon_types',require('./pokemon_types.js'));
app.use('/pokemon_locations',require('./pokemon_locations.js'));
app.use('/pokemon_to_types',require('./pokemon_to_types.js'));
app.use('/pokemon_to_locations',require('./pokemon_to_locations.js'));
app.use('/pokemon_to_moves',require('./pokemon_to_moves.js'));
app.use('/moves_to_pokemon',require('./moves_to_pokemon.js'));
app.use('/types_to_pokemon',require('./types_to_pokemon.js'));
app.use('/locations_to_pokemon',require('./locations_to_pokemon.js'));
app.use('/types_to_moves',require('./types_to_moves.js'));
app.use('/moves_to_types',require('./moves_to_types.js'));
app.use('/fulldatabase_id_asc',require('./fulldatabase_id_asc.js'));
app.use('/fulldatabase_id_desc',require('./fulldatabase_id_desc.js'));
app.use('/fulldatabase_name_asc',require('./fulldatabase_name_asc.js'));
app.use('/fulldatabase_name_desc',require('./fulldatabase_name_desc.js'));


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

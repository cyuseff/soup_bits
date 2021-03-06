var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({extended:false});



//Redis connection
var redis = require('redis');
var client;
if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	client = require("redis").createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(":")[1]);
} else {
	client = redis.createClient();
	client.select((process.env.NODE_ENV || 'development').length);
}
//End Redis connection


app.use(express.static('public'));

app.get('/cities', function(request, response){
	client.hkeys('cities', function(error, names){
		response.json(names);
	});
});

app.post('/cities', urlencode, function(request, response){
	var newCity = request.body;

	if(!newCity.name || !newCity.description) {
		response.sendStatus(400);
		return false;
	}

	client.hset('cities', newCity.name, newCity.description, function(error){
		if(error) throw error;
		response.status(201).json(newCity.name);
	});
});


app.delete('/cities/:name', function(request, response){
	client.hdel('cities', request.params.name, function(error){
		if(error) throw error;
		response.sendStatus(204);
	});
});

module.exports = app;
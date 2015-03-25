var request = require('supertest');
var app = require('./app');

var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushdb();

//this will execute every time that we run de app...
client.hset('cities', 'Lotopia', 'description for Lotopia');
client.hset('cities', 'Caspiana', 'description for Caspiana');
client.hset('cities', 'Indigo', 'description for Indigo');

describe('Request to the root path', function(){

	it('Returns a 200 status code', function(done){
		request(app)
			.get('/')
			.expect(200, done);
	})


	it('Returns a HTML format', function(done){
		request(app)
			.get('/')
			.expect('Content-Type', /html/, done);
	});


	it('Returns an index file with Cities', function(done){
		request(app)
			.get('/')
			.expect(/cities/i, done);
	});

});


describe('Listing cities on /cities', function(){

	it('Returns a 200 status code', function(done){
		request(app)
			.get('/cities')
			.expect(200, done);
	});




	it('Return Json Format', function(done){
		request(app)
			.get('/cities')
			.expect('Content-Type', /json/, done);
	});


	it('Return Initials Cities', function(done){
		request(app)
			.get('/cities')
			.expect(/\[(\"([A-Za-z0-9_]|\s)+\"\,*)+\]/, done);
	});

});



describe('Creating new cities', function(){


	
	it('Returns a 201 status code', function(done){
		request(app)
			.post('/cities')
			.send('name=Springfield&description=where+the+simpsoms+live')
			.expect(201, done);
	});


	it('Returns the city name', function(done){
		request(app)
			.post('/cities')
			.send('name=Springfield&description=where+the+simpsoms+live')
			.expect(/springfield/i, done);
	});

});









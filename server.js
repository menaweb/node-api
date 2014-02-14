//server.js

var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;


//Configuración

app.configure(function(){
	//Localización de los ficheros estáticos
	app.use(express.static(__dirname + '/public'));

	//Muestra un log de todos los request en la consola
	app.use(express.logger('dev'));

	//Permite cambiar el HTML con el método POST
	app.use(express.json());
	app.use(express.urlencoded());

	//Simula DELETE y PUT
	app.use(express.methodOverride());

});


//Conexión con la base de datos

MongoClient.connect('mongodb://localhost:27017/todos', function(err, db){
	if(err) throw err;
	else console.log("Connected!");

	
	var Todo = db.collection('todos');

	
	// Rutas de nuestra API
	// GET de todos los TODOs
	app.get('/api/todos', function(req, res) {				
	    Todo.find().toArray(function(err, todos) {
	        if(err) {
	            res.send(err);
	        }
	        console.log(todos);
	        res.json(todos);
	    });
	});

	// POST que crea un TODO y devuelve todos tras la creación
	app.post('/api/todos', function(req, res) {				
	    Todo.insert(
	    	{ text: req.body.text },
	        { done: false },
	    	function(err, todo){
	        	if(err) {
	            	res.send(err);
	        	}

	        	Todo.find().toArray(function(err, todos) {
		            if(err){
		                res.send(err);
		            }
	            	res.json(todos);
	        	});
	    });
	});

	// DELETE un TODO específico y devuelve todos tras borrarlo.
	app.delete('/api/todos/:todo', function(req, res) {		
	    Todo.remove({_id: ObjectID(req.params.todo)}, function(err, todo) {
	        if(err){
	            res.send(err);
	        }

	        Todo.find(function(err, todos) {
	            if(err){
	                res.send(err);
	            }
	            res.json(todos);
	        });

	    })
	});

	// Carga una vista HTML simple donde irá nuestra Single App Page
	// Angular Manejará el Frontend
	app.get('*', function(req, res) {						
	    res.send('./public/index.html');				
	});


});





//Escucha en el puerto 8080 y corre el server
app.listen(8080, function(){
	console.log('App listening on port 8080');
});
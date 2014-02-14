//main.js

var angularTodo = angular.module('angularTodo', []);


//Main controller
function mainController($scope, $http){
	$scope.formData = {};

	//GET. Cuando se cargue la página, pide la API todos los TODOs
	$http.get('/api/todos')
		.success(function(data){
			$scope.todos = data;
			console.log(data);
		})
		.error(function(data){
			console.log('Error: ' + data);
		});

	//POST. Cuando se añade un nuevo TODO, manda el texto a la API
	$scope.createTodo = function(){
		$http.post('/api/todos', $scope.formData)
			.success(function(data){
				$scope.formData = {};
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
	};

	//DELETE. Borra un TODO despues de checkearlo como acabado
	$scope.deleteTodo = function(id){
		$http.delete('/api/todos/' + id)
			.success(function(data){
				$scope.todos.data;
				console.log(data);
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
	};

}
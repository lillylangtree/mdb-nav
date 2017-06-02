// defining the app module of the project
// configure routing
//
angular.module('moviesDBApp', ['ngSanitize','ngRoute','movieDBControllers','TrailerMovieServices','utilityControllers','movieDBDirectives','movieDBServices','DBServices'])
.constant("myMovieConfig", {
        "moviesEndpoint" : "https://api.themoviedb.org/3/movie",
		"moviesSearchEndpoint" : "https://api.themoviedb.org/3/search/movie?query=",
        "apiKey": "35e16679c616a21b9ddebb66272c5902",
		"omdbApiKey": "45e2e591",
        "rottenUri" : "https://www.omdbapi.com/",
        "posterPath": "http://image.tmdb.org/t/p/w370/",
       // "moviesSearchEndpoint": "https://www.omdbapi.com/",
        "myDataRef" : 'https://moviesci.firebaseio.com/',
        "noPoster" : "images/no-poster-w370-v2.png",
		"myapifilmtoken" : "ca8e141b-b14a-4767-a784-14b403e95c22" ,
		"movieDetailsEndPoint" : "http://api.myapifilms.com/imdb/idIMDB?idIMDB=",
		"moviesTrailerEndPoint": "http://api.myapifilms.com/trailerAddict/taapi?idIMDB="
    })
.config(function($routeProvider) {
		 
		$routeProvider
		  .when('/', {
		  	templateUrl: 'templates/home.html'		  	 
		  })
		  .when('/about', {
		  	templateUrl: 'templates/about.html',
		  	controller: 'AboutController'
		  })
		  .when('/movies/favorites', {
            templateUrl: 'templates/favorites.html',
            controller: 'MovieFavoritesController'
           })
		  .when('/movies/:category', {
		  	templateUrl: 'templates/movies.html',
		  	controller: 'MovieListController'
		  })
		  .when('/movie/:movieId/:category', {
              templateUrl: 'templates/movieDetails.html',
              controller: 'MovieDetailsController'
          })
		  .when('/movie/:movieId/:category/:searchMovie', {
              templateUrl: 'templates/movieDetails.html',
              controller: 'MovieDetailsController'
          })
          .when('/movies/search/:movieTitle', {
              templateUrl: 'templates/movieSearch.html',
              controller: 'MovieSearchController'
          })
		  .when('/movie/:movieId/:fromFavourites', {
		  	templateUrl: 'templates/movieDetails.html',
		  	controller: 'MovieDetailsController'
		  })
		  .otherwise({redirectTo: '/popular'}); 
	});
angular.module('utilityControllers',[])
.controller('MenuController',function($scope,dbService,$location) {
// 
   $scope.user= {};
   $scope.registerUser= {};

   $scope.authUser = dbService.getUser();
   if ($scope.authUser) {
          $scope.loggedIn = true;
   } else {
          $scope.loggedIn = false;
        }

   $scope.movieSearch = function () {

            $location.path('/movies/search/' + movieForm.movie.value);
    }

   $scope.loginUser = function() {
      console.log($scope.user);
      dbService.login($scope.user.email,$scope.user.password).then(
        function (result) {
          $scope.$apply(function () {
            $scope.authUser = result;
            $scope.loggedIn = true; });
        },
        function (error) {
          $scope.$apply(function () {
            $scope.authUser = null;
            $scope.loggedIn = false;
            alert("login error: " + error); });
        }
      );
      
   }
   $scope.fadeIn = 'out'
 
  $scope.registerModal = function() {
      $scope.fadeIn = 'in'
  }

  $scope.closeModal = function() {
      $scope.fadeIn = 'out'
  }

  $scope.registerUser = function() {
      console.log($scope.registerUser);
      dbService.register($scope.registerUser.email,$scope.registerUser.password).then(
        function (result) {
          $scope.$apply(function () {
            $scope.authUser = result;
            $scope.loggedIn = true; });
        },
        function (error) {
          $scope.$apply(function () {
            $scope.authUser = null;
            $scope.loggedIn = false;
            alert("login error: " + error); });
        }
      );
      
  }
  $scope.logoutUser = function() {
          dbService.logout();
          $scope.authUser = null;
          $scope.user = {};
          $scope.loggedIn = false;  
   }
});

angular.module('movieDBControllers',[])
.controller('AboutController',function($scope) {
// 
   $scope.title = 'About Us';
   $scope.maps = [{
        address: 'Trinity College Dublin, Dublin',
        zoom: 14,
        width: 400      
        },{
        address: '51st Street, New York, New York',
        zoom: 14,
        width: 400      
        }];
  $scope.map = $scope.maps[0];
})
.controller('MovieFavoritesController', function ($scope, MovieListService, $location) {
        //MovieListService is the service that has resources to obtain favourite movies list
        //see service.js for details
        $scope.loading = true;
        $scope.title = 'My Favorite Movies';

        getMovies( );

        function getMovies( ) {

            MovieListService.getFavoritesList().then(//retrieve movie favorites
                function (result) { //success got data back from api call
                    $scope.movieList = result //moviesList now bound to view template
                    $scope.loading = false;
                }
            ).catch(
                function (error) {
                    $location.path('/error/' + error.data.status_message + '/' + error.status);
                });
        }
        $scope.deleteFavorite = function(movie) {//requested delete from favorites list, enabled by button in view
            MovieListService.deleteFavorite(movie).then(//success delete from favorites list
                function (result) {
                    if (result.status == 200 && result.statusText == 'OK') {
                        getMovies(); //re-get favorite list
                    }
                },
                function (error) {
                    $location.path('/error/' + error.data.status_message + '/' + error.status)
                }
            );
        }
    })
.controller('MovieDetailsController',function($scope, $location, $routeParams,$sce, dbService, MovieListService,TrailerService, myMovieConfig,MovieModelService) {
// 
   $scope.title = 'Movie Details';
   $scope.trailer=false;
   var id = $routeParams.movieId;
   $scope.category = $routeParams.category;
   var url = myMovieConfig.moviesEndpoint + '/' + id + '?api_key=' + myMovieConfig.apiKey;
   MovieListService.getList(url).then(
      function(result){
            $scope.movie = result.data; 
            url = myMovieConfig.rottenUri + '?i=' + $scope.movie.imdb_id + '&r=json&tomatoes=true';
            return MovieListService.getList(url);//result sent to next .then                
            }
      )
      .then(
        function(result){          
          // returning results from previous then
          $scope.rotten = result.data; //setting scope data for viewing
          console.dir(result.data); 
          TrailerService.get($scope.rotten.imdbID.slice(2),function(trailer) {
              if (trailer.length > 0) {
                console.log(trailer);
                $scope.$apply(function () {
                      $scope.trailer = true;
                      $scope.trailerSrc = $sce.trustAsResourceUrl("https://v.traileraddict.com/" + trailer);
                  });
              }
          }); //service requires callback
      })
      .catch(
        function(error) { $location.path('/error/'+error.data.status_message+'/'+error.status)
      });

    $scope.showTrailer = function() {
                      $scope.fadeIn = 'in'
                    }
    $scope.closeModal = function() {
                      $scope.fadeIn = 'out'
                    }

  $scope.authUser = dbService.getUser();
   if ($scope.authUser) {
          $scope.showFav = true;
   } else {
          $scope.showFav = false;
        }

  $scope.addFavourite = function(){//add movie to favourites, enabled by addFavorites button in view
            var storeMovie = MovieModelService.setMovie($scope.movie.title,$scope.movie.imdb_id,$scope.movie.release_date);
            MovieListService.postFavorite(storeMovie).then(//success added to favorites list
                function (result) {
                    if (result.status == 200 && result.statusText == 'OK') {
                        $scope.showFav = false;//disable add favorites button
                    }
                },
                function (error) {
                    $location.path('/error/' + error.data.status_message + '/' + error.status)
                }
            );
        }
})
.controller('MovieListController',function($scope,MovieListService,myMovieConfig,$routeParams) {
// set scope with first and last names
$scope.loading = true;
$scope.category = $routeParams.category;
$scope.title = $scope.category.replace("_"," ").toUpperCase();
$scope.page=1;
getMovies();

function getMovies(){
  var url = myMovieConfig.moviesEndpoint + '/' + $scope.category  + '?page='+ $scope.page + '&api_key=' + myMovieConfig.apiKey;

  $scope.movieList = [];
   MovieListService.getList(url).then(
      function(result){
          $scope.movieList = result.data.results; 
          angular.forEach($scope.movieList,function(key,value) {
            console.log(key,value);
            if (key.poster_path == null)
              key.poster_path = myMovieConfig.noPoster;
            else
              key.poster_path = myMovieConfig.posterPath + key.poster_path;
          });
          $scope.page=result.data.page;
          $scope.pages=result.data.total_pages; 
          $scope.loading = false;
      }
      ).catch(
        function(error) { 
          console.log('error', error)
        });
}

$scope.nextPage = function(){
  $scope.page++;
  getMovies();
  };
 $scope.prevPage = function(){
  $scope.page--;
  getMovies();
  };

})
.controller('MovieSearchController', function ($scope, MovieListService, myMovieConfig, $location, $routeParams) {
        //get list of movies for display
        //parameter: search, contains title of movie to search for
        //MovieListService is the service that has resources to obtain favourite movies list
        //see service.js for details
        //myMovieConfig set in app.js file
        $scope.loading = true;
        var search = $routeParams.movieTitle;
         
        $scope.title = "Searched For Movies: '" + search + "'";
        $scope.category = 'Search';
        getMovies(search);

        function getMovies(search) {
            var movies = search; // search string for searching movies, sent to url as parameter
            //construct url
            var url = myMovieConfig.moviesSearchEndpoint + '?' + 's=' + movies ;

            MovieListService.getList(url).then(//retrieve movies for display
                function (result) { //success, got data back from api call
                    if (!result.data.Error) {
                        $scope.movieList = result.data.Search.filter(function (val) {
                            return val.Poster !== 'N/A' //filter out invalid movies
                        });
                        $scope.loading = false;
                    }
                    else
                        $location.path('/error/' + result.data.Error + '/' + result.data.Response);
                }
            ).catch(
                function (error) { //error from api call
                    console.log('error', error);
                    if ( error.message)
                        $location.path('/error/' + error.message + '/' + 'Error');
                    else
                        $location.path('/error/' + error.data.status_message + '/' + error.status);
                });
        }
    });

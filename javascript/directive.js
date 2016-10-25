angular.module('movieDBDirectives',[]).directive('movieInfoBox', function() {
  return {
    restrict: 'E',    // E -> element
    scope: {
      title: '=title',
      date: '=date',
      poster: '=poster'
    },
    templateUrl: 'templates/directives/movie-info-box.html',
    controller: function($scope) {
                    //console.log($scope);                   
                    }
  };
})
.directive('movieTrailer', function() {
  return {
    restrict: 'E',    // E -> element
    scope: {
      trailerSrc: '=',
      fadeIn: '='
    },
    templateUrl: 'templates/directives/movie-trailer.html',
    link: function(scope,element,attrs) {
                    console.log(scope);                   
                    

                    scope.$watch(attrs.fadeIn, function(value) {
                          if (value === 'in') {
                            if (element.find("iframe")[0].src !== scope.trailerSrc)
                                element.find("iframe")[0].src=scope.trailerSrc;  
                            }
                          else
                            element.find("iframe")[0].src="";   
                        });

                    scope.closeModal = function() {
                      scope.fadeIn = 'out';                   
                    }
                  
                  },
    controller: function($scope,$element) {
                    console.log($scope);
                    $scope.fadeIn='out';
                    
                  }
  };
})
.directive('makeMap', function() {
         
        var directive = {
            restrict: 'EA',            
            templateUrl: 'templates/directives/map.html',
            scope: {
                map: '='
            },
            link: function(scope, element, attrs){
                console.log("in map directive link");
            },
            controller: function mapController($scope) {
            
                    $scope.zoomIn = function(){
                        $scope.map.zoom++;
                    };

                    $scope.zoomOut = function(){
                        $scope.map.zoom--;
                    };
                    $scope.mapDimensions = function() {
                        if (!$scope.map.width)
                            var width = 300;
                        else
                            width = $scope.map.width;
                        if (!$scope.map.height)
                            var height = 300;
                        else
                            height = $scope.map.height;
                        return width + 'x' + height;
                    }        
                }                    
            };
        return directive;     
    });
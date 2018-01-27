
var app = angular.module('app', ['ngMaterial','ngRoute', 'ngAnimate','ngMessages']);


var URL_PREFIX='http://localhost:8080/';
var CLIENT_ID = "bSRfOQprkYdBY1nniQaXmXyZERbgGDAUaXhlzA3i";
var
CLIENT_SECRET = "hsRtJ7L0QHDPgrJmyIYgjfxL24ym8rhJXk7PUfuhJm6hH3rmwgcGPrat25dITDr1u2BVbHAQ8ISV4YkIhPtgATezb806Hb1GBlQUnlDVFiLfOxQU0jzwprq7NfxyXEAp";
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('teal', {
   'default': '400', // by default use shade 400 from the pink palette for primary intentions
   'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
   'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
   'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
  })
  .accentPalette('orange');
});
app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $routeProvider.when("/", {
    controller: "MainCtrl",
    templateUrl: "templates/home.html"
  }).when("/pinlocation", {
    controller: "MapCtrl",
    templateUrl: "templates/pinlocation.html"
  }).otherwise({
    controller: "MainCtrl",
    templateUrl: "templates/error.html"
  });
}]);
// app.run(["$rootScope", "$location", function ($rootScope, $location) {
//     $rootScope.$on("$routeChangeSuccess", function (userInfo) {
//         // console.log(userInfo);
//     });
//     $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
//         if (eventObj.authenticated === false) {
//             $location.path("/");
//         }
//     });
// }]);


app.factory("Auth", ["$http","$q","$window",function ($http, $q, $window) {
    var userFullDetails;
    function login(user) {
        var url="http://localhost:8080/login/";
        var deferred = $q.defer();
        $http({
             method: "POST",
            //  transformRequest: function(obj) {
            //     var str = [];
            //     for(var p in obj)
            //     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            //     return str.join("&");
            //  },
             data: {
                'email':user,
                'password':'batman25',
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'grant_type': 'client_credentials'


             },
             headers: {
                'Content-Type': 'application/json'
              },
             url: url,
           }).then(function successCallback(response) {
             isLoading = false;
            //  console.log(response);
             userFullDetails = {
                 token: response.data.access_token,
                 email: response.data.email,
                 id: response.data.user_id,
                 name:response.data.name,
             };
             $window.localStorage.userFullDetails = JSON.stringify(userFullDetails);
             deferred.resolve(response);
           }, function errorCallback(error) {
             deferred.reject(error);
         });
         return deferred.promise;
    };

    function logout() {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: URL_PREFIX+"logout/",
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization':'Token '+userFullDetails.access_token
            }
        }).then(function successCallback(response) {
            // console.log(result);
            userFullDetails = null;
            $window.localStorage.userFullDetails = null;
            deferred.resolve(result);
        }, function errorCallback(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    function getuserFullDetails() {
        return userFullDetails;
    }
    function init() {
        if ($window.localStorage.userFullDetails) {
            userFullDetails = JSON.parse($window.localStorage.userFullDetails);
        }
    }
    init();
    return {
        login: login,
        logout: logout,
        getuserFullDetails: getuserFullDetails
    };
}]);

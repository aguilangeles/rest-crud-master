/*http://www.bennadel.com/blog/2612-using-the-http-service-in-angularjs-to-make-ajax-requests.htm*/

var app =angular
.module('myapplication');

/**/

  // I control the main demo.
        app.controller(
            "MainController",
            function( $scope, userService ) {
                // I contain the list of users to be rendered.
                $scope.users = [];
                // I contain the ngModel values for form interaction.
                $scope.formData = {};
               //filtered by 
                $scope.searchInput="";
                //search by id trae el id solo para la consulta
                $scope.user_id="";
                //
                $scope.auser={};
                //
                 $scope.updateData = {};

                loadRemoteData();
                // ---
                // PUBLIC METHODS.
                // ---
                // I process the add-user form.
                $scope.addUser = function() {
                    // If the data we provide is invalid, the promise will be rejected,
                    // at which point we can tell the user that something went wrong. In
                    // this case, I'm just logging to the console to keep things very
                    // simple for the demo.
                    userService.addUser($scope.formData)
                        .then(
                            loadRemoteData,
                            function( errorMessage ) {
                                console.warn( errorMessage );
                            }
                        )
                    ;
                    // Reset the form once values have been consumed.
                    //$scope.formData.name = "";
                };
                // I remove the given user from the current collection.
                $scope.removeUser = function( user ) {
                    console.log('remove '+user.user_id);
                    // Rather than doing anything clever on the client-side, I'm just
                    // going to reload the remote data.
                    userService.removeUser( user.user_id )
                        .then( loadRemoteData )
                    ;
                };

                $scope.updateUser = function() {
                    console.log('update '+ user.user_id);
                    // Rather than doing anything clever on the client-side, I'm just
                    // going to reload the remote data.
                    userService.updateUser($scope.updateData)
                        .then(
                            loadRemoteData,
                            function( errorMessage ) {
                                console.warn( errorMessage );
                            }
                        );
                };
                $scope.getUserbyId = function(){
                    console.log('get user by id' + $scope.user_id)
                    userService.getUserbyId($scope.user_id)
                    .then(asingUser);
                }

                // ---
                // PRIVATE METHODS.
                // ---
                // I apply the remote data to the local scope.
                function applyRemoteData( newusers ) {
                    $scope.users = newusers;
                }
                function asingUser(auser){
                    $scope.auser=auser;
                }
                // I load the remote data from the server.
                function loadRemoteData() {
                    // The userService returns a promise.
                    userService.getUsers()
                        .then(
                            function(users) {
                                console.log('users' + users);
                                applyRemoteData( users );
                            }
                        )
                    ;
                }
            }
        );
        // -------------------------------------------------- //
        // -------------------------------------------------- //
        // I act a repository for the remote user collection.
        app.service(
            "userService",
            function( $http, $q ) {
                // Return public API.
                return({
                    addUser: addUser,
                    getUsers: getUsers,
                    removeUser: removeUser,
                    getUserbyId: getUserbyId,
                    updateUser:updateUser
                });
                // ---
                // PUBLIC METHODS.
                // ---
                // I add a user with the given name to the remote collection.
                function addUser(data) {
                console.log(data);
                    var request = $http({
                        method: "post",
                        url: "http://localhost:3000/api/user",
                        params: {
                            action: "add"
                        },

                        data: data
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                // I get all of the users in the remote collection.
                function getUsers() {
                    var request = $http({
                        method: "get",
                        url: "http://localhost:3000/api/user",
                        params: {
                            action: "get"
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                // I remove the user with the given ID from the remote collection.
                function removeUser( user_id ) {
                    var request = $http({
                        method: "delete",
                        url: "http://localhost:3000/api/user/"+user_id,
                        params: {
                            action: "delete"
                        },
                        data: {
                            user_id: user_id
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                //get  user by id
                 function getUserbyId( user_id ) {
                    var request = $http({
                        method: "get",
                        url: "http://localhost:3000/api/user/"+user_id,
                        params: {
                            action: "get"
                        },
                        data: {
                            user_id: user_id
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }

                //update
                function updateUser( user_id ) {
                    var request = $http({
                        method: "put",
                        url: "http://localhost:3000/api/user/"+user_id,
                        params: {
                            action: "put"
                        },
                        data: {
                            user_id: user_id
                        }
                    });
                    return( request.then( handleSuccess, handleError ) );
                }

                // ---
                // PRIVATE METHODS.
                // ---
                // I transform the error response, unwrapping the application dta from
                // the API response payload.
                function handleError( response ) {
                    // The API response from the server should be returned in a
                    // nomralized format. However, if the request was not handled by the
                    // server (or what not handles properly - ex. server error), then we
                    // may have to normalize it on our end, as best we can.
                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    // Otherwise, use expected error message.
                    return( $q.reject( response.data.message ) );
                }
                // I transform the successful response, unwrapping the application data
                // from the API response payload.
                function handleSuccess( response ) {
                    return( response.data );
                }
            }
        );

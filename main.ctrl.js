
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
                $scope.form = {
                    name: "",
                    email:"",
                    password:""
                };
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
                    userService.addUser( $scope)
                        .then(
                            loadRemoteData,
                            function( errorMessage ) {
                                console.warn( errorMessage );
                            }
                        )
                    ;
                    // Reset the form once values have been consumed.
                    $scope.form.name = "";
                };
                // I remove the given user from the current collection.
                $scope.removeUser = function( user ) {
                    // Rather than doing anything clever on the client-side, I'm just
                    // going to reload the remote data.
                    userService.removeUser( user.id )
                        .then( loadRemoteData )
                    ;
                };
                // ---
                // PRIVATE METHODS.
                // ---
                // I apply the remote data to the local scope.
                function applyRemoteData( newusers ) {
                    $scope.users = newusers;
                }
                // I load the remote data from the server.
                function loadRemoteData() {
                    // The userService returns a promise.
                    userService.getUsers()
                        .then(
                            function( users ) {
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
                    getUsers: getUsers/*,
                    removeUser: removeUser*/
                });
                // ---
                // PUBLIC METHODS.
                // ---
                // I add a user with the given name to the remote collection.
                function addUser( name, email, pass ) {
                    var request = $http({
                        method: "post",
                        url: "http://localhost:3000/api/user",
                        params: {
                            action: "add"
                        },
                        data: {
                            name: name,
                            email:email,
                            password:pass
                        }
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
                function removeUser( id ) {
                    var request = $http({
                        method: "delete",
                        url: "api/index.cfm",
                        params: {
                            action: "delete"
                        },
                        data: {
                            id: id
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

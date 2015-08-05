/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('app.controllers', [])
    .controller('ListDetailCtrl', [
        '$state', '$scope', '$stateParams', 'UserService',   // <-- controller dependencies
        function ($state, $scope, $stateParams, UserService) {

            $scope.index = $stateParams.itemId;

        }])
    .controller('ListCtrl', [
        '$state', '$scope', 'UserService','Camera',   // <-- controller dependencies
        function ($state, $scope, UserService,Camera) {

            $scope.dataList = ["One", "Two", "Three"];

            $scope.getPhoto = function () {
           //  var options = {
           //      'buttonLabels': ['Take Picture'],
           //      'addCancelButtonWithLabel': 'Cancel'
           //  };
           // //$ionicActionSheet.show(options, callback);
           //  $ionicActionSheet.show({
           //       buttons: [
           //         { text: 'Take Picture' },
           //         { text: 'Cancel' }
           //       ],
           //       destructiveText: 'Cancel',
           //       //titleText: 'Modify your album',
           //       cancelText: 'Cancel',
           //       cancel: function() {
           //            // add cancel code..
           //          },
           //       buttonClicked: function(index) {
           //         return true;
           //       }
           //     });

                        var picOptions = {
                            destinationType: navigator.camera.DestinationType.FILE_URI,
                            quality: 75,
                            targetWidth: 500,
                            targetHeight: 500,
                            allowEdit: true,
                            saveToPhotoAlbum: false
                        };


                        Camera.getPicture(picOptions).then(function (imageURI) {
                            console.log(imageURI);
                            $scope.lastPhoto = imageURI;
                            $scope.newPhoto = true;

                        }, function (err) {
                            console.log(err);
                            $scope.newPhoto = false;
                            alert(err);
                        });
                };


            $scope.savePhoto = function () {
                    Camera.resizeImage($scope.lastPhoto).then(function (_result) {
                        $scope.thumb = "data:image/jpeg;base64," + _result.imageData;

                        return Camera.toBase64Image($scope.lastPhoto);
                    }).then(function (_convertedBase64) {
                        //alert(_convertedBase64);
                        // $http.post('https://griper.firebaseio.com/.json', {Image: _convertedBase64}).success(function(data, status, headers, config) {
                        //             // this callback will be called asynchronously
                        //             // when the response is available
                        //             console.log(data);
                        //             alert('success');
                        //         }).error(function(data, status, headers, config) {
                        //             console.log(data);
                        //             console.log(status);
                        //             console.log(headers);
                        //             console.log(config);
                        //             alert('error occured');
                        //             // called asynchronously if an error occurs
                        //             // or server returns response with an error status.
                        //         });
                        UserService.UploadImage('photo.jpg',{base64:_convertedBase64.imageData});
                        console.log("convert base image ",_convertedBase64);
                    }, function (_error) {
                        console.log(_error);
                    });
                };




            $scope.doLogoutAction = function () {
                UserService.logout().then(function () {

                    // transition to next state
                    $state.go('app-login');

                }, function (_error) {
                    alert("error logging in " + _error.debug);
                })
            };


        }])
    .controller('AccountCtrl', [
        '$state', '$scope', 'UserService',   // <-- controller dependencies
        function ($state, $scope, UserService) {

            debugger;
            UserService.currentUser().then(function (_user) {
                $scope.user = _user;
            });


        }]);

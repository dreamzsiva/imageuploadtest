angular.module('user.services', [])

    .service('UserService', ['$q', 'ParseConfiguration',
        function ($q, ParseConfiguration) {

            var parseInitialized = false;


            return {

                /**
                 *
                 * @returns {*}
                 */
                init: function () {

                    debugger;
                    // if initialized, then return the activeUser
                    if (parseInitialized === false) {
                        Parse.initialize(ParseConfiguration.applicationId, ParseConfiguration.javascriptKey);
                        parseInitialized = true;
                        console.log("parse initialized in init function");
                    }

                    var currentUser = Parse.User.current();
                    if (currentUser) {
                        return $q.when(currentUser);
                    } else {
                        return $q.reject({error: "noUser"});
                    }

                },
                /**
                 *
                 * @param _userParams
                 */
                createUser: function (_userParams) {

                    var user = new Parse.User();
                    user.set("username", _userParams.email);
                    user.set("password", _userParams.password);
                    user.set("email", _userParams.email);
                    user.set("first_name", _userParams.first_name);
                    user.set("last_name", _userParams.last_name);

                    // should return a promise
                    return user.signUp(null, {});

                },
                UploadImage: function(name, data){
                    var parseFile = new Parse.File(name, data);
                    parseFile.save().then(function() {
                       // The file has been saved to Parse.
                       console.log('Uploaded');
                       return 'saved';
                    }, function(error) {
                    // The file either could not be read, or could not be saved to Parse.
                        console.log(error);
                        return 'error';
                  })
                    // parseFile.get().then(function(url){
                    //     console.log(url)
                    // })

                },
                /**
                 *
                 * @param _parseInitUser
                 * @returns {Promise}
                 */
                currentUser: function (_parseInitUser) {

                    // if there is no user passed in, see if there is already an
                    // active user that can be utilized
                    _parseInitUser = _parseInitUser ? _parseInitUser : Parse.User.current();

                    console.log("_parseInitUser " + Parse.User.current());
                    if (!_parseInitUser) {
                        return $q.reject({error: "noUser"});
                    } else {
                        return $q.when(_parseInitUser);
                    }
                },
                /**
                 *
                 * @param _user
                 * @param _password
                 * @returns {Promise}
                 */
                login: function (_user, _password) {
                    return Parse.User.logIn(_user, _password);
                },
                /**
                 *
                 * @returns {Promise}
                 */
                logout: function (_callback) {
                    var defered = $q.defer();
                    Parse.User.logOut();
                    defered.resolve();
                    return defered.promise;

                }


            }
        }])
    .factory('Camera', ['$q', function ($q) {

        return {
            /**
             *
             * @param options
             * @returns {*}
             */
            getPicture: function (options) {
                var q = $q.defer();

                navigator.camera.getPicture(function (result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },
            /**
             *
             * @param img_path
             * @returns {*}
             */
            resizeImage: function (img_path) {
                var q = $q.defer();
                window.imageResizer.resizeImage(function (success_resp) {
                    console.log('success, img re-size: ' + JSON.stringify(success_resp));
                    q.resolve(success_resp);
                }, function (fail_resp) {
                    console.log('fail, img re-size: ' + JSON.stringify(fail_resp));
                    q.reject(fail_resp);
                }, img_path, 200, 0, {
                    imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                    resizeType: ImageResizer.RESIZE_TYPE_MIN_PIXEL,
                    pixelDensity: true,
                    storeImage: false,
                    photoAlbum: false,
                    format: 'jpg'
                });

                return q.promise;
            },

            toBase64Image: function (img_path) {
                var q = $q.defer();
                window.imageResizer.resizeImage(function (success_resp) {
                    console.log('success, img toBase64Image: ' + JSON.stringify(success_resp));
                    q.resolve(success_resp);
                }, function (fail_resp) {
                    console.log('fail, img toBase64Image: ' + JSON.stringify(fail_resp));
                    q.reject(fail_resp);
                }, img_path, 1, 1, {
                    imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                    resizeType: ImageResizer.RESIZE_TYPE_FACTOR,
                    format: 'jpg'
                });

                return q.promise;
            }
        }
    }])

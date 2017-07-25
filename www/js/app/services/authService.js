define(function (require) {

    "use strict";

    var $                   = require('jquery');

    var authService = {

        login: function(data, success, failure){
            $.ajax({
                headers: {
                    "Content-Type": "application/json"/*,
                     "Authorization" : "Basic dGVzdDp0ZXN0"*/
                },
                type: "POST",
                url: App.apiUrl + "/auth/login",
                cache: false,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(data),
                success: success,
                error: failure
            });
        }
    };

    return authService;

});
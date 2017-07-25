define(function (require) {
    var Login = Backbone.Model.extend({
        defaults: {
            username: '',
            password: '',
            token: '',
            sessionId: ''
        },

        initialize: function(){

        }

    });

    return Login;
});
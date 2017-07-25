define(function (require) {
    var UserLogged = Backbone.Model.extend({
        defaults: {
            Email_Address: '',
            External_Id: "",
            First_Name: "",
            Last_Name: "",
            Login_Name: "",
            Token:  ""
        }
    });

    return UserLogged;
});
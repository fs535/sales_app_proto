define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Login.html'),
        template            = _.template(tpl),
        authService         = require('app/services/authService'),
        UserLogged          = require('app/models/user-logged');

    return Backbone.View.extend({

        className: "login-container",

        events: {
            "submit #login-form " : "performLogin",
            "input input": "onInput",
            "change input": "onInput"
        },

        initialize: function (options) {
            var self = this;

            this.i18next = options.i18next;

            // clear logged data
            // todo
            console.log('userLoggedIn data removed!');
            self.render();
        },

        render: function () {

            var context = {
                model: this.model.attributes,
                i18next: this.i18next
            };

            this.$el.html(template(context));

            this.userName = this.$el.find("#userName");
            this.userName.textinput();

            this.password = this.$el.find("#password");
            this.password.textinput();

            this.submitBtn = this.$el.find("input.submit.btn");
            this.submitBtn.button();
            this.submitBtn.button("disable");

            return this;
        },

        onInput: function(event, requestCompleted){

            if (!this.userName.val() || !this.password.val()) {
                this.submitBtn.button('disable');
            } else {
                if (requestCompleted || !App.requestSendingFlag){
                    this.submitBtn.button('enable');
                }
            }
        },

        performLogin: function(){

            var self = this,
                newUserName = this.userName.val(),
                newPassword = this.password.val();

            this.model.set({'username': newUserName});
            this.model.set({'password': newPassword});

            this.submitBtn.button("disable");

            var success = function(response){

                var lang = self.i18next.detectLanguage();

                App.appData = {
                    loginData: new UserLogged().set(response),
                    language: lang,
                    isLogged: true
                };

                // todo
                // save to local storage

                /*storageService.saveToStorage("userLoggedIn", {
                    loginData: self.model.attributes,
                    language: lang
                }, function(err, value) {

                    self.submitBtn.button('enable');

                    App.appData = value;
                    App.appData.isLogged = true;
                    App.appData.language = lang;

                    // dm event
                    // logon
                    dmService.event(dmService.createEvent({
                        dm_name: "Log-on",
                        dm_result: "success"
                    }));

                    // proceed to main
                    Backbone.history.navigate("/main", {trigger: true, replace: true});
                });*/

                // proceed to home screen
                Backbone.history.navigate("/home", {trigger: true, replace: true});

            },
            failure = function(response, data, options) {
                // enable button if it's possible
                self.onInput(null, true);
                Backbone.trigger('toast-event', self.i18next.t("t_login_failure"));
            };

            authService.login(this.model.attributes, success, failure);

            return false;
        }

    });

});
define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Menu.html'),
        template            = _.template(tpl);


    return Backbone.View.extend({

        events: {
            "click #btn_logOut": "logOut",
            "click #menu-toggle": "expandMenu",
            "click #btn-settings" : "openSettings",
            "change .flip-1" : "onChangeToggle",
            "click #lead-send-icon" : "openLeads"
        },

        initialize: function (options) {

            var self = this;

            this.i18next = options.i18next;

            Backbone.on('language-changed-event', function() {
                self.render();
            });

            Backbone.on('menu-redraw-event', function() {
                self.render();
            });

            this.render();
        },

        render: function () {
            var context = {
                data: this.model,
                i18next: this.i18next
            };

            this.$el.html(template(context));

            // init slider
            this.$el.find('select#toggle-mode').slider();
            // init menu panel
            this.$el.find("#menu" ).panel();

            return this;
        },

        expandMenu: function(){
            this.$el.find("#menu" ).panel("open");
        },

        collapseMenu: function(event){
            this.$el.find("#menu" ).panel("close");
        },

        logOut: function(){

            Backbone.history.navigate("/login", {trigger: true, replace: true});
        },

        openSettings: function(){
            this.collapseMenu();
            Backbone.history.navigate("/settings", {trigger: true, replace: false});
        },

        openLeads: function(){
            if (App.leads && App.leads.length){
                Backbone.history.navigate("/leads", {trigger: true, replace: false});
            }
        },

        onChangeToggle: function(e) {
            if ($(e.currentTarget).val() == "day"){
                $('.dn').attr('href','css/common/day.css');
                App.appData.modeNight = false;
            }
            if ($(e.currentTarget).val() == "night"){
                $('.dn').attr('href','css/common/night.css');
                App.appData.modeNight = true;
            }
        }

    });

});
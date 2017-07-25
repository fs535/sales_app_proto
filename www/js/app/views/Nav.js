define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Nav.html'),
        template            = _.template(tpl);


    return Backbone.View.extend({

        events: {
            "click .nav-tab-block a": "onTabClick"
        },

        initialize: function (options) {

            var self = this;

            this.i18next = options.i18next;
            this.navItems = options.navItems;

            this.currentTab = _.find(this.navItems, function(item){
                return item.active;
            });

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
                data: this.navItems,
                i18next: this.i18next
            };

            this.$el.html(template(context));

            return this;
        },

        onTabClick: function(event){

            var id = $(event.currentTarget).context.id;

            if (this.currentTab.id == id){
                return;
            }

            this.currentTab = _.find(this.navItems, function(item){
                return item.id == id;
            });

            $(".nav-tab-block a").removeClass("ui-btn-active");
            $(event.currentTarget).addClass("ui-btn-active");


            Backbone.history.navigate("/" + id, {trigger: true});
        }

    });

});
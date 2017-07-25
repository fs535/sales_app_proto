define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Tasks.html'),
        template            = _.template(tpl),
        activityView        = require('app/views/Activity');

    return Backbone.View.extend({

        events: {

        },

        initialize: function (options) {
            console.log("Tasks initialized!");

            var self = this;

            Backbone.on('language-changed-event', function() {
                self.render();
            });

            this.i18next = options.i18next;

            this.render();
            this.sync();
        },

        render: function () {


            var context = {
                appData: App.appData,
                i18next: this.i18next
            };

            this.$el.html(template(context));

            return this;
        },

        sync: function(){

            if (webMode) return;

            var self = this;

            $(".ui-loader").show();

            App.Sync.syncLocalTable().then(function () {
                $(".ui-loader").hide();

                self.$list = self.$('.activity-list');

                App.client.getSyncTable("activity").read().then(function (activities){

                    $(".items-count").append(activities.length);

                    activities.forEach(self.addOne, self);
                });

            });
        },

        addOne: function (activity) {
            var view = new activityView({ model: activity });
            this.$list.append(view.render().el);
        }


    });

});
define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/SalesCases.html'),
        template            = _.template(tpl),
        salesCaseView     = require("app/views/SalesCase");

    return Backbone.View.extend({

        events: {

        },

        initialize: function (options) {
            console.log("Sales cases initialized!");

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

                self.$list = self.$('.sales-case-list');

                App.client.getSyncTable("opportunity").read().then(function (opportunities) {

                    $(".items-count").append(opportunities.length);

                    opportunities.forEach(self.addOne, self);
                });

            });
        },

        addOne: function (opportunity) {
            var view = new salesCaseView({ model: opportunity });
            this.$list.append(view.render().el);
        }


    });

});
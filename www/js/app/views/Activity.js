define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Activity.html'),
        template 			= _.template(tpl);


    return Backbone.View.extend({

        tagName: "li",

        events: {

        },

        render: function () {
            this.$el.html(template(this.model));

            return this;
        },

        edit: function () {

        }

    });

});

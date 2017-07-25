define(function (require) {

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone');

    return Backbone.Router.extend({

        routes: {
            "": "home",
            "home": "home",
            "tasks" : "tasks",
            "salesCases" : "salesCases",
            "login": "login",
            "settings": "settings"
        },

        // interceptor to validate user authentification before navigate
        execute: function(callback, args) {

            if (!App.appData || !App.appData.isLogged){
                console.warn('no user data found during execute step!');
                if (Backbone.history.fragment != "login"){
                    Backbone.history.navigate('/login', {trigger: true, replace: true});

                    return false;
                }
            }

            if (callback) callback.apply(this, args);
        },

        renderMenu: function(){
            require(["app/views/Menu", "i18next"], function(MenuView, i18next){
                // append menu
                var menuView = new MenuView({
                        model: App.appData,
                        i18next: i18next
                    }),
                    $menuContainer = $("#menu-container");

                $menuContainer.empty();
                menuView.delegateEvents();

                $menuContainer.append(menuView.$el);
            });
        },

        renderNavBar: function(navItems){

            require(["app/views/Nav", "i18next"], function(NavView, i18next){
                // append navigation menu
                var navView = new NavView({
                        navItems: navItems,
                        i18next: i18next
                    }),
                    $navContainer = $("#nav-container");

                $navContainer.empty();
                navView.delegateEvents();

                $navContainer.append(navView.$el);
            });

        },

        home: function () {

            var $container = $('#container');
            $container.empty();

            /*var $content = $('#settings-content'),
                width = $content.width();

            $content.stop().animate({
                left: width + 100,
                right: -1 * (width + 100)
            });*/

            var self = this;

            require(["app/views/Main", "i18next"], function (MainView, i18next) {

                var view = new MainView({
                    i18next: i18next
                });

                view.delegateEvents();

                $container.append(view.$el);

                // if menus is rendered already - skip
                if ($("#menu-container").find("#header").length == 0){
                    self.renderMenu();
                }

                // add navigation bar specific
                var navItems = [
                    {
                        id: 'home',
                        name: 't_home',
                        active: true
                    },{
                        id: 'tasks',
                        name: 't_tasks'
                    },{
                        id: 'salesCases',
                        name: 't_salesCases'
                    },{
                        id: 'accounts',
                        name: 't_accounts'
                    },{
                        id: 'contacts',
                        name: 't_contacts'
                    }
                ];

                self.renderNavBar(navItems);

            });
        },

        tasks: function () {

            var $container = $('#container');
            $container.empty();

            var self = this;

            require(["app/views/Tasks", "i18next"], function (TasksView, i18next) {

                var view = new TasksView({
                    i18next: i18next
                });

                view.delegateEvents();

                $container.append(view.$el);

                // if menus is rendered already - skip
                if ($("#menu-container").find("#header").length == 0){
                    self.renderMenu();
                }

                // if tab bar is rendered already - skip
                if ($("#nav-container").find("#navbar").length == 0){
                    var navItems = [
                        {
                            id: 'home',
                            name: 't_home'
                        },{
                            id: 'tasks',
                            name: 't_tasks',
                            active: true
                        },{
                            id: 'salesCases',
                            name: 't_salesCases'
                        },{
                            id: 'accounts',
                            name: 't_accounts'
                        },{
                            id: 'contacts',
                            name: 't_contacts'
                        }
                    ];
                    self.renderNavBar(navItems);
                }

            });
        },

        salesCases: function(){

            var $container = $('#container');
            $container.empty();

            var self = this;

            require(["app/views/SalesCases", "i18next"], function (SalesCasesView, i18next) {

                var view = new SalesCasesView({
                    i18next: i18next
                });

                view.delegateEvents();

                $container.append(view.$el);

                // if menus is rendered already - skip
                if ($("#menu-container").find("#header").length == 0){
                    self.renderMenu();
                }

                // if tab bar is rendered already - skip
                if ($("#nav-container").find("#navbar").length == 0){
                    var navItems = [
                        {
                            id: 'home',
                            name: 't_home'
                        },{
                            id: 'tasks',
                            name: 't_tasks'
                        },{
                            id: 'salesCases',
                            name: 't_salesCases',
                            active: true
                        },{
                            id: 'accounts',
                            name: 't_accounts'
                        },{
                            id: 'contacts',
                            name: 't_contacts'
                        }
                    ];
                    self.renderNavBar(navItems);
                }

            });
        },

        login: function(){

            var $container = $('#container'),
                $menuContainer = $("#menu-container"),
                $settingsContainer =  $("#settings-container"),
                $navContainer = $('#nav-container');

            $container.empty();
            $menuContainer.empty();
            $settingsContainer.empty();
            $navContainer.empty();

            require(["app/models/login", "app/views/Login", "app/models/appData", "i18next"], function (Login, LoginView, appData, i18next) {

                var login = new LoginView({
                    model: new Login(),
                    i18next: i18next
                });

                $container.append(login.$el);
            });

        },

        settings: function(){
            var $container = $('#settings-container'),
                $leadsContainer = $('#leads-container');

            $leadsContainer.empty();
            $container.empty();

            require(["app/views/Settings", "app/models/appData", "i18next"], function (SettingsView, appData, i18next) {

                var settingsView = new SettingsView({
                    model: App.appData,
                    i18next: i18next
                });

                $container.append(settingsView.$el);
            });
        }

    });

});
webMode = false;

require.config({

    baseUrl: 'js/libs',

    paths: {
        app: '../app',
        tpl: '../tpl',
        jquery: 'jquery-2.2.3.min',
        underscore: 'underscore-min',
        backbone: 'backbone-min',
        i18next: 'i18next.amd-1.8.0',
        moment: 'moment-with-locales',
        jquerym: 'jquery.mobile-1.4.5'
    },

    map: {
        '*': {
            'app/models/login': 'app/models/login',
            'app/models/appData': 'app/models/appData'
        }
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require(['jquery', 'jquerym', 'underscore', 'backbone', 'app/router', 'i18next', "moment"],
    function ($, m, _, Backbone, Router, i18next, moment) {

    var app = {

        initialize: function() {

            // api
            this.apiUrl = "http://192.168.23.42:8080/mobility/api";

            if (!webMode){
                /* mobile */
                document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
                /**********/
            }else{
                /* web development */
                this.initializeApplication();
                /*******************/
            }
        },

        onDeviceReady: function() {

            this.receivedEvent('deviceready');
            this.initializeApplication();

        },

        // Update DOM on a Received Event
        receivedEvent: function(id) {

        },

        initMobileServiceClient: function(){

            app.client = new WindowsAzure.MobileServiceClient(app.apiUrl);

            app.store = new WindowsAzure.MobileServiceSqliteStore("sales.db");

            app.syncContext = {};
            app.store.defineTable({
                name: "contact",
                columnDefinitions: {
                    id: 'string',
                    deleted: 'boolean',
                    version: 'string',
                    "External_Id": "string",
                    "First_Name": "string",
                    "Last_Name": "string",
                    "Account_Id": "string",
                    "Email_Address": "string",
                    "Work_Phone_numhash": "string"
                }
            }).then(function () {
                app.store.defineTable({
                    name: "account",
                    columnDefinitions: {
                        id: 'string',
                        deleted: 'boolean',
                        version: 'string',
                        "External_Id": "string",
                        "Name": "string"
                    }
                })
            }).then(function () {
                app.store.defineTable({
                    name: "activity",
                    columnDefinitions: {
                        id: 'string',
                        deleted: 'boolean',
                        version: 'string',
                        "External_Id": "string",
                        "Description": "string",
                        "Type": "string",
                        "Planned_Completion": "string",
                        "Status": "string",
                        "Completed": "string",
                        "Planned": "string",
                        "Account_Id": "string",
                        "Primary_Contact_Id": "string",
                        "Opportunity_Id": "string"
                    }
                })
            }).then(function () {
                app.store.defineTable({
                    name: "opportunity",
                    columnDefinitions: {
                        id: 'string',
                        deleted: 'boolean',
                        version: 'string',
                        "External_Id": "string",
                        "Name": "string",
                        "Sales_Stage": "string",
                        "Account_Id": "string",
                        "Contact_Id": "string"
                    }
                })
            }).then(function () {
                app.syncContext = app.client.getSyncContext();
                app.syncContext.pushHandler = {
                    onConflict: function (pushError) {
                        console.log("Conflict");
                    },
                    onError: function (pushError) {
                        console.log("Error");
                    }
                };

                app.syncContext.initialize(app.store).then(function () {
                    app.contactTable = app.client.getSyncTable("contact");
                    app.accountTable = app.client.getSyncTable("account");
                    app.activityTable = app.client.getSyncTable("activity");
                    app.opportunityTable = app.client.getSyncTable("opportunity");

                    document.addEventListener("online", function () {
                        app.Sync.syncLocalTable().then(function () {
                            $('.overlay').hide();
                        });
                    }, false);

                    app.tpl.loadTemplates(["login", "header", "opportunity", "opportunities", "new-opportunity"], function () {

                        app.session.checkAuth({
                            complete: function (mod, res) {
                                app.RomaRouter = new app.RomaRouter();
                                Backbone.history.start();
                            }
                        });

                    });
                });
            });

            app.Sync = {
                syncLocalTable: function() {
                    $('.overlay').show();
                    return app.syncContext
                        .push()
                        .then(function() {
                            return app.syncContext.pull(new WindowsAzure.Query("account"), "allContact");
                        }).then(function () {
                            return app.syncContext.pull(new WindowsAzure.Query("contact"), "allAccounts");
                        }).then(function () {
                            return app.syncContext.pull(new WindowsAzure.Query("opportunity"), "allActivities");
                        }).then(function () {
                            return app.syncContext.pull(new WindowsAzure.Query("activity"), "allOpportunities");
                        }, function (error) {
                            console.log("Finished with error");
                            return {};
                        });
                }
            }
        },

        initializeApplication: function(){

            if (!webMode){
                this.initMobileServiceClient();
            }

            new Router();

            var appData = {
                language: "en"
            };
            App.appData = appData;

            i18next.init({
                lng: appData.language
            }, function(err, t){
                Backbone.history.start();
            });

            // configure ajax and attach global listeners to show and hide loader
            $.ajaxSetup({
                timeout: 60000,
                beforeSend: function() {
                    App.requestSendingFlag = true;
                    $(".ui-loader").show();

                    // disable all possible request calling buttons to prevent duplicate requests
                    $(".request-submit-button").button();
                    $(".request-submit-button").button("disable");

                },
                complete: function(xhr, status) {
                    App.requestSendingFlag = false;
                    $(".ui-loader").hide();

                    // release buttons
                    $(".request-submit-button").button();
                    $(".request-submit-button").button("enable");

                }
            });

        },


    };

    window.App = app;
    app.initialize();


});
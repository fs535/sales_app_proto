"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var select_module_1 = require('ng2-select/components/select.module');
var http_1 = require('@angular/http');
var app_routes_1 = require('./app.routes');
var angular2_perfect_scrollbar_1 = require('angular2-perfect-scrollbar');
var app_component_1 = require('./components/app.component');
var products_component_1 = require("./components/products/products.component");
var productoffers_component_1 = require("./components/productoffers/productoffers.component");
var autosize_directive_1 = require("./directives/autosize.directive");
var settings_1 = require("./domain/settings");
var spinner_component_1 = require("./components/spinner/spinner.component");
var custom_http_1 = require("./services/custom.http");
require("hammerjs");
var material_1 = require('@angular/material');
var PERFECT_SCROLLBAR_CONFIG = {
    suppressScrollX: true
};
var settings;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule.prototype.ngDoBootstrap = function (app) {
        settings = new settings_1.Settings();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var config = JSON.parse(this.responseText);
                settings.hub_url = config.hub_url;
                app.bootstrap(app_component_1.AppComponent);
            }
        };
        xhttp.open("GET", "/config.json", true);
        xhttp.send();
    };
    AppModule = __decorate([
        core_1.NgModule({
            imports: [forms_1.FormsModule, http_1.HttpModule, platform_browser_1.BrowserModule, app_routes_1.routing, material_1.MaterialModule.forRoot(), select_module_1.SelectModule, angular2_perfect_scrollbar_1.PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG)],
            declarations: [app_component_1.AppComponent, products_component_1.ProductsComponent, productoffers_component_1.ProductOffersComponent, autosize_directive_1.Autosize, spinner_component_1.SpinnerComponent],
            entryComponents: [app_component_1.AppComponent],
            providers: [{
                    provide: settings_1.Settings, useFactory: function () {
                        return settings;
                    }
                }, {
                    provide: http_1.Http,
                    useFactory: function (backend, defaultOptions) {
                        return new custom_http_1.CustomHttp(backend, defaultOptions);
                    },
                    deps: [http_1.XHRBackend, http_1.RequestOptions]
                }]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
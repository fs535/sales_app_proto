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
var products_service_1 = require('../services/products.service');
var offers_service_1 = require('../services/offers.service');
var http_1 = require("@angular/http");
var AppComponent = (function () {
    function AppComponent(customHttp) {
        this.customHttp = customHttp;
        this.title = 'Products';
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n    <nav>\n      <my-spinner [isRunning]=\"customHttp.isRunning\"></my-spinner>\n      <a [routerLink]=\"['/productoffers']\" routerLinkActive=\"active\">Product Offers</a>\n      <a [routerLink]=\"['/products']\" routerLinkActive=\"active\">Products</a>\n    </nav>\n    <router-outlet></router-outlet>\n  ",
            providers: [
                products_service_1.ProductService,
                offers_service_1.OfferService
            ]
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map
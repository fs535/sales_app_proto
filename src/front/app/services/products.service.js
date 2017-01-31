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
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var settings_1 = require("../domain/settings");
var ProductService = (function () {
    function ProductService(http, settings) {
        this.http = http;
        this.settings = settings;
    }
    ProductService.prototype.getProductsByOffer = function (offer, productNameSearch, productCategory1, productCategory2, productCategory3, price, brand, size) {
        var params = new http_1.URLSearchParams();
        params.set('offerId', offer.id);
        params.set('category1', productCategory1);
        params.set('category2', productCategory2);
        params.set('category3', productCategory3);
        params.set('price', price);
        params.set('brand', brand);
        params.set('size', size);
        params.set('nameSearch', productNameSearch);
        return this.http.get(this.settings.hub_url + "/products", {
            search: params
        }).toPromise()
            .then(function (res) {
            return res.json() || [];
        })
            .catch(this.handleError);
    };
    ProductService.prototype.getCollections = function () {
        return this.http.get(this.settings.hub_url + "/collections")
            .toPromise()
            .then(function (response) {
            var r = response.json();
            r.category1values.splice(0, 0, "");
            r.category2values.splice(0, 0, "");
            r.category3values.splice(0, 0, "");
            r.brands.splice(0, 0, "");
            r.prices.splice(0, 0, "");
            r.sizes.splice(0, 0, "");
            r.combTypes.splice(0, 0, "");
            r.demandIds.splice(0, 0, "");
            r.demandCounts.splice(0, 0, "");
            r.benefitIds.splice(0, 0, "");
            r.discounts.splice(0, 0, "");
            r.combMaxs.splice(0, 0, "");
            return r;
        })
            .catch(this.handleError);
    };
    ProductService.prototype.getProducts = function (productId, productNameSearch, category1, category2, category3, price, brand, size, activatedPim, pictureUrl, description, offerNameSearch, offerIdearch, offerAssigned) {
        var params = new http_1.URLSearchParams();
        params.set('id', productId);
        params.set('nameSearch', productNameSearch);
        params.set('category1', category1);
        params.set('category2', category2);
        params.set('category3', category3);
        params.set('price', price);
        params.set('brand', brand);
        params.set('size', size);
        params.set('activatedPim', activatedPim);
        params.set('pictureUrlSearch', pictureUrl);
        params.set('descriptionSearch', description);
        params.set('offerNameSearch', offerNameSearch);
        params.set('offerId', offerIdearch);
        params.set('offerAssigned', offerAssigned);
        return this.http.get(this.settings.hub_url + "/products", {
            search: params
        }).toPromise()
            .then(function (res) {
            var data = res.json() || [];
            data.forEach(function (d) {
                if (d.offer) {
                    d.offer.validFrom = new Date(d.offer.validFrom);
                    d.offer.validTo = new Date(d.offer.validTo);
                }
            });
            return data;
        })
            .catch(this.handleError);
    };
    // Update existing Product
    ProductService.prototype.save = function (product) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.settings.hub_url + "/products";
        return this.http
            .patch(url, JSON.stringify(product), { headers: headers })
            .toPromise()
            .then(function (res) {
            var d = res.json() || [];
            if (d.offer) {
                d.offer.validFrom = new Date(d.offer.validFrom);
                d.offer.validTo = new Date(d.offer.validTo);
            }
            return d;
        })
            .catch(this.handleError);
    };
    ProductService.prototype.handleError = function (error) {
        if (error.headers.get('Content-Type') == 'application/json') {
            console.error('An error occurred', JSON.stringify(error.json()));
            return Promise.reject(JSON.stringify(error.json()));
        }
        console.error('An error occurred', '' + error.status + ' ' + error.statusText + ' ' + error.text());
        return Promise.reject('' + error.status + ' ' + error.statusText + ' ' + error.text());
    };
    ProductService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, settings_1.Settings])
    ], ProductService);
    return ProductService;
}());
exports.ProductService = ProductService;
//# sourceMappingURL=products.service.js.map
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
var OfferService = (function () {
    function OfferService(http, settings) {
        this.http = http;
        this.settings = settings;
    }
    OfferService.prototype.getOffers = function (offerType, category1, category2, category3, brand, price, size, product, text, offerId, offerName, offerCombType, offerDemandId, offerCombMax, offerValidFrom, offerValidTo, offerSuspended) {
        var params = new http_1.URLSearchParams();
        params.set('type', offerType);
        params.set('category1', category1);
        params.set('category2', category2);
        params.set('category3', category3);
        params.set('brand', brand);
        params.set('price', price);
        params.set('size', size);
        params.set('product', product);
        params.set('id', offerId);
        params.set('nameSearch', offerName);
        params.set('combType', offerCombType);
        params.set('demandId', offerDemandId);
        params.set('combMax', offerCombMax);
        params.set('validFrom', offerValidFrom);
        params.set('validTo', offerValidTo);
        params.set('suspended', offerSuspended);
        return this.http.get(this.settings.hub_url + "/offers", {
            search: params
        }).toPromise()
            .then(function (res) {
            var data = res.json() || [];
            data.forEach(function (d) {
                d.validFrom = new Date(d.validFrom);
                d.validTo = new Date(d.validTo);
            });
            return data;
        })
            .catch(this.handleError);
    };
    OfferService.prototype.save = function (offer) {
        if (offer.id) {
            return this.patch(offer);
        }
        else {
            return this.post(offer);
        }
    };
    // Update existing Offer
    OfferService.prototype.patch = function (offer) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.settings.hub_url + "/offers";
        return this.http
            .patch(url, JSON.stringify(offer), { headers: headers })
            .toPromise()
            .then(function (res) {
            var data = res.json();
            data.validFrom = new Date(data.validFrom);
            data.validTo = new Date(data.validTo);
            return data;
        })
            .catch(this.handleError);
    };
    // Update existing Offer
    OfferService.prototype.post = function (offer) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var url = this.settings.hub_url + "/offers";
        return this.http
            .post(url, JSON.stringify(offer), { headers: headers })
            .toPromise()
            .then(function (res) {
            var data = res.json();
            data.validFrom = new Date(data.validFrom);
            data.validTo = new Date(data.validTo);
            return data;
        })
            .catch(this.handleError);
    };
    OfferService.prototype.handleError = function (error) {
        if (error.headers.get('Content-Type') == 'application/json') {
            console.error('An error occurred', JSON.stringify(error.json()));
            return Promise.reject(JSON.stringify(error.json()));
        }
        console.error('An error occurred', '' + error.status + ' ' + error.statusText + ' ' + error.text());
        return Promise.reject('' + error.status + ' ' + error.statusText + ' ' + error.text());
    };
    OfferService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, settings_1.Settings])
    ], OfferService);
    return OfferService;
}());
exports.OfferService = OfferService;
//# sourceMappingURL=offers.service.js.map
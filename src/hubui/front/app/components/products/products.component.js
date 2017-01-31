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
var router_1 = require('@angular/router');
var product_1 = require('../../domain/product');
var invalid_offer_1 = require('../../domain/invalid.offer');
var products_service_1 = require('../../services/products.service');
var offers_service_1 = require('../../services/offers.service');
var ProductsComponent = (function () {
    function ProductsComponent(router, productService, offerService) {
        this.router = router;
        this.productService = productService;
        this.offerService = offerService;
        this.products = [];
        this.invalidOfferMap = {};
        this.selectedProduct = new product_1.Product("");
        this.error = '';
        this.offerId = "";
        this.offerName = "";
        this.offerCombType = "";
        this.offerDemandId = "";
        this.offerDemandCount = "";
        this.offerBenefitId = "";
        this.offerDiscount = "";
        this.offerCombMax = "";
        this.offerValidFrom = "";
        this.offerValidTo = "";
        this.offerSuspended = "";
        this.offerAssigned = "";
        this.yesno = [{ id: "", text: "" }, { id: "1", text: "Yes" }, { id: "0", text: "No" }];
        this.productIdSearch = "";
        this.productNameSearch = "";
        this.productCategory1 = "";
        this.productCategory2 = "";
        this.productCategory3 = "";
        this.productPrice = "";
        this.productBrand = "";
        this.productSize = "";
        this.productActivatedPim = "";
        this.productPictureUrlSearch = "";
        this.productDescriptionSearch = "";
    }
    ProductsComponent.prototype.formatDate = function (date) {
        return date.toISOString().slice(0, 10);
    };
    ProductsComponent.prototype.onOfferChangeValidFrom = function (offer, value, n) {
        var d = Date.parse(value);
        if (this.invalidOfferMap[offer.id] == null) {
            this.invalidOfferMap[offer.id] = new invalid_offer_1.InvalidOffer();
        }
        if (!d) {
            this.invalidOfferMap[offer.id].validFrom = "Failed to parse: " + value;
            return;
        }
        else {
            this.invalidOfferMap[offer.id].validFrom = null;
        }
        if (offer.validTo.getTime() <= d) {
            this.invalidOfferMap[offer.id].validFrom = "ValidFrom is AFTER ValidTo";
            return;
        }
        offer.validFrom = new Date(d);
        if (!n) {
            this.saveOffer(offer);
        }
    };
    ProductsComponent.prototype.onOfferChangeValidTo = function (offer, value, n) {
        var d = Date.parse(value);
        if (this.invalidOfferMap[offer.id] == null) {
            this.invalidOfferMap[offer.id] = new invalid_offer_1.InvalidOffer();
        }
        if (!d) {
            this.invalidOfferMap[offer.id].validTo = "Failed to parse: " + value;
            return;
        }
        else {
            this.invalidOfferMap[offer.id].validTo = null;
        }
        if (offer.validFrom.getTime() >= d) {
            this.invalidOfferMap[offer.id].validTo = "ValidFrom is AFTER ValidTo";
            return;
        }
        offer.validTo = new Date(d);
        if (!n) {
            this.saveOffer(offer);
        }
    };
    ProductsComponent.prototype.getCollections = function () {
        var _this = this;
        return this.productService
            .getCollections()
            .then(function (result) {
            _this.category1values = result.category1values;
            _this.category2values = result.category2values;
            _this.category3values = result.category3values;
            _this.brands = result.brands;
            _this.prices = result.prices;
            _this.sizes = result.sizes;
            _this.combTypes = result.combTypes;
            _this.demandIds = result.demandIds;
            _this.demandCounts = result.demandCounts;
            _this.benefitIds = result.benefitIds;
            _this.discounts = result.discounts;
            _this.combMaxs = result.combMaxs;
            return result;
        })
            .catch(function (error) { return _this.error += error; });
    };
    ProductsComponent.prototype.getProducts = function () {
        var _this = this;
        return this.productService
            .getProducts(this.productIdSearch, this.productNameSearch, this.productCategory1, this.productCategory2, this.productCategory3, this.productPrice, this.productBrand, this.productSize, this.productActivatedPim, this.productPictureUrlSearch, this.productDescriptionSearch, this.offerName, this.offerId, this.offerAssigned)
            .then(function (products) {
            _this.products = products;
            _this.invalidOfferMap = {};
            return _this.products;
        })
            .catch(function (error) { return _this.error += error; });
    };
    ProductsComponent.prototype.ngOnInit = function () {
        this.error = '';
        this.getCollections();
        this.getProducts();
    };
    ProductsComponent.prototype.saveProduct = function (product) {
        var _this = this;
        this.error = '';
        var self = this;
        return this.productService.save(product).then(function (product) {
            for (var _i = 0, _a = _this.products; _i < _a.length; _i++) {
                var p = _a[_i];
                if (p.id == product.id) {
                    Object.assign(p, product);
                }
            }
            return '';
        }).catch(function (err) {
            _this.error += err;
        });
    };
    ProductsComponent.prototype.onProductIdSearch = function (item) {
        this.productIdSearch = item;
        this.getProducts();
    };
    ProductsComponent.prototype.onProductNameSearch = function (item) {
        this.productNameSearch = item;
        this.getProducts();
    };
    ProductsComponent.prototype.onProductCategory1Search = function (item) {
        this.productCategory1 = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onProductCategory2Search = function (item) {
        this.productCategory2 = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onProductCategory3Search = function (item) {
        this.productCategory3 = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onProductPriceSearch = function (item) {
        this.productPrice = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onProductBrandSearch = function (item) {
        this.productBrand = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onProductSizeSearch = function (item) {
        this.productSize = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onProductActivatedPimSearch = function (item) {
        this.productActivatedPim = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onProductActivatedPimChange = function (activated, product) {
        product.activatedPim = activated.checked;
        this.saveProduct(product);
    };
    ProductsComponent.prototype.onProductPictureUrlSearch = function (item) {
        this.productPictureUrlSearch = item;
        this.getProducts();
    };
    ProductsComponent.prototype.onProductDescriptionSearch = function (item) {
        this.productDescriptionSearch = item;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferSuspendedChange = function (suspended, offer) {
        offer.suspended = suspended.checked;
        this.saveOffer(offer);
    };
    ProductsComponent.prototype.onProductSelect = function (product) {
        this.selectedProduct = product;
    };
    ProductsComponent.prototype.onOfferIdSearch = function (item) {
        this.offerId = item;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferNameSearch = function (item) {
        this.offerName = item;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferCombTypeSearch = function (item) {
        this.offerCombType = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferDemandIdSearch = function (item) {
        this.offerDemandId = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferDemandCountSearch = function (item) {
        this.offerDemandCount = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferBenefitIdSearch = function (item) {
        this.offerBenefitId = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferDiscountSearch = function (item) {
        this.offerDiscount = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferCombMaxSearch = function (item) {
        this.offerCombMax = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferValidFromSearch = function (item) {
        this.offerValidFrom = item;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferValidToSearch = function (item) {
        this.offerValidTo = item;
        this.getProducts();
    };
    ProductsComponent.prototype.onOfferSuspendedSearch = function (item) {
        this.offerSuspended = item.id;
        this.getProducts();
    };
    ProductsComponent.prototype.saveOffer = function (offer) {
        var _this = this;
        this.error = '';
        this.offerService.save(offer).then(function (offer) {
            for (var _i = 0, _a = _this.products; _i < _a.length; _i++) {
                var p = _a[_i];
                if (p.offer && p.offer.id == offer.id) {
                    Object.assign(p.offer, offer);
                }
            }
            return '';
        }).catch(function (err) {
            _this.error += err;
        });
    };
    ProductsComponent = __decorate([
        core_1.Component({
            selector: 'my-products',
            templateUrl: 'app/components/products/products.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, products_service_1.ProductService, offers_service_1.OfferService])
    ], ProductsComponent);
    return ProductsComponent;
}());
exports.ProductsComponent = ProductsComponent;
//# sourceMappingURL=products.component.js.map
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
var offer_1 = require('../../domain/offer');
var invalid_offer_1 = require('../../domain/invalid.offer');
var products_service_1 = require('../../services/products.service');
var offers_service_1 = require('../../services/offers.service');
var ProductOffersComponent = (function () {
    function ProductOffersComponent(router, productService, offerService) {
        this.router = router;
        this.productService = productService;
        this.offerService = offerService;
        this.products = [];
        this.offerProducts = [];
        this.offerTypes = [{ id: "All", text: "All" }, { id: "New", text: "New" }, { id: "Assigned", text: "Assigned" }];
        this.offerType = "All";
        this.offerTypeSelected = [{ id: "All", text: "All" }];
        this.selectedProduct = new product_1.Product("");
        this.selectedOffer = new offer_1.Offer("");
        this.yesno = [{ id: "", text: "" }, { id: "1", text: "Yes" }, { id: "0", text: "No" }];
        this.productIdSearch = "";
        this.productNameSearch = "";
        this.productCategory1Selected = [];
        this.productCategory2Selected = [];
        this.productCategory3Selected = [];
        this.productPriceSelected = [];
        this.productBrandSelected = [];
        this.productSizeSelected = [];
        this.productCategory1 = "";
        this.productCategory2 = "";
        this.productCategory3 = "";
        this.productPrice = "";
        this.productBrand = "";
        this.productSize = "";
        this.selectedOfferProductNameSearch = "";
        this.selectedOfferProductCategory1 = "";
        this.selectedOfferProductCategory2 = "";
        this.selectedOfferProductCategory3 = "";
        this.selectedOfferProductPrice = "";
        this.selectedOfferProductBrand = "";
        this.selectedOfferProductSize = "";
        this.productOfferNameSearch = "";
        this.productOfferIdSearch = "";
        this.productOfferAssigned = "";
        this.offerCategory1 = "";
        this.offerCategory2 = "";
        this.offerCategory3 = "";
        this.offerBrand = "";
        this.offerPrice = "";
        this.offerSize = "";
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
        this.offers = [];
        this.invalidOfferMap = {};
        this.offer = new offer_1.Offer("");
        this.addingOffer = false;
        this.error = '';
    }
    ProductOffersComponent.prototype.formatDate = function (date) {
        return date.toISOString().slice(0, 10);
    };
    ProductOffersComponent.prototype.onOfferChangeValidFrom = function (offer, value, n) {
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
    ProductOffersComponent.prototype.onOfferChangeValidTo = function (offer, value, n) {
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
    ProductOffersComponent.prototype.getCollections = function () {
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
    ProductOffersComponent.prototype.getProducts = function () {
        var _this = this;
        return this.productService
            .getProducts(this.productIdSearch, this.productNameSearch, this.productCategory1, this.productCategory2, this.productCategory3, this.productPrice, this.productBrand, this.productSize, '', '', '', this.productOfferNameSearch, this.productOfferIdSearch, this.productOfferAssigned)
            .then(function (products) {
            _this.products = products;
            return _this.products;
        })
            .catch(function (error) { return _this.error += error; });
    };
    ProductOffersComponent.prototype.getOfferProducts = function () {
        var _this = this;
        if (this.selectedOffer.id != '') {
            return this.productService
                .getProductsByOffer(this.selectedOffer, this.selectedOfferProductNameSearch, this.selectedOfferProductCategory1, this.selectedOfferProductCategory2, this.selectedOfferProductCategory3, this.selectedOfferProductPrice, this.selectedOfferProductBrand, this.selectedOfferProductSize)
                .then(function (products) {
                _this.offerProducts = products;
                return _this.offerProducts;
            })
                .catch(function (error) { return _this.error += error; });
        }
    };
    ProductOffersComponent.prototype.getOfferWith = function () {
        var result = "with:";
        if (this.offerCategory1 != '') {
            result += " " + this.offerCategory1;
        }
        if (this.offerCategory2 != '') {
            result += " " + this.offerCategory2;
        }
        if (this.offerCategory3 != '') {
            result += " " + this.offerCategory3;
        }
        if (this.offerBrand != '') {
            result += " " + this.offerBrand;
        }
        if (this.offerPrice != '') {
            result += " " + this.offerPrice;
        }
        if (this.offerSize != '') {
            result += " " + this.offerSize;
        }
        if (this.offerId != '') {
            result += " " + this.offerId;
        }
        if (this.offerName != '') {
            result += " " + this.offerName;
        }
        if (this.offerCombType != '') {
            result += " " + this.offerCombType;
        }
        if (this.offerDemandId != '') {
            result += " " + this.offerDemandId;
        }
        if (this.offerDemandCount != '') {
            result += " " + this.offerDemandCount;
        }
        if (this.offerBenefitId != '') {
            result += " " + this.offerBenefitId;
        }
        if (this.offerDiscount != '') {
            result += " " + this.offerDiscount;
        }
        if (this.offerCombMax != '') {
            result += " " + this.offerCombMax;
        }
        if (this.offerValidFrom != '') {
            result += " " + this.offerValidFrom;
        }
        if (this.offerValidTo != '') {
            result += " " + this.offerValidTo;
        }
        if (this.offerSuspended != '' && this.offerSuspended == '1') {
            result += " Suspended";
        }
        if (this.offerSuspended != '' && this.offerSuspended == '0') {
            result += " Not-Suspended";
        }
        return result;
    };
    ProductOffersComponent.prototype.getProductWith = function () {
        var result = "with:";
        if (this.productIdSearch != '') {
            result += " " + this.productIdSearch;
        }
        if (this.productNameSearch != '') {
            result += " " + this.productNameSearch;
        }
        if (this.productCategory1 != '') {
            result += " " + this.productCategory1;
        }
        if (this.productCategory2 != '') {
            result += " " + this.productCategory2;
        }
        if (this.productCategory3 != '') {
            result += " " + this.productCategory3;
        }
        if (this.productOfferIdSearch != '') {
            result += " " + this.productOfferIdSearch;
        }
        if (this.productOfferNameSearch != '') {
            result += " " + this.productOfferNameSearch;
        }
        return result;
    };
    ProductOffersComponent.prototype.getOffers = function () {
        var _this = this;
        return this.offerService
            .getOffers(this.offerType, this.offerCategory1, this.offerCategory2, this.offerCategory3, this.offerBrand, this.offerPrice, this.offerSize, '', '', this.offerId, this.offerName, this.offerCombType, this.offerDemandId, this.offerCombMax, this.offerValidFrom, this.offerValidTo, this.offerSuspended)
            .then(function (offers) {
            _this.offers = offers;
            _this.invalidOfferMap = {};
            return _this.offers;
        })
            .catch(function (error) { return _this.error += error; });
    };
    ProductOffersComponent.prototype.assignSelectedOffer = function (product) {
        if (this.addingOffer) {
            this.offerProducts.push(product);
        }
        else {
            product.offerId = this.selectedOffer.id;
            var self = this;
            this.saveProduct(product, false).then(function (product) {
                self.getOffers();
                self.getOfferProducts();
            });
        }
    };
    ProductOffersComponent.prototype.removeOffer = function (product) {
        if (this.addingOffer) {
            var index = this.offerProducts.indexOf(product);
            if (index > -1) {
                this.offerProducts.splice(index, 1);
            }
        }
        else {
            product.offerId = "";
            var self = this;
            this.saveProduct(product, false).then(function (product) {
                self.getOffers();
                self.getOfferProducts();
            });
        }
    };
    ProductOffersComponent.prototype.newOfferFromProduct = function (product) {
        this.addOffer();
        this.offer.name = "Offer for " + product.name;
        this.offerProducts = [product];
    };
    ProductOffersComponent.prototype.addOffer = function () {
        this.offer = new offer_1.Offer("");
        this.addingOffer = true;
        this.selectedProduct = new product_1.Product("");
        this.selectedOffer = new offer_1.Offer("");
        this.offer.name = "New Offer";
        var janTime = new Date(Date.UTC((new Date()).getFullYear(), 0, 1));
        var decTime = new Date(Date.UTC((new Date()).getFullYear(), 11, 31));
        this.offer.validFrom = janTime;
        this.offer.validTo = decTime;
        this.offer.combType = "32";
        this.offer.demandId = "1";
        this.offer.demandCount = "1";
        this.offer.benefitId = "7";
        this.offer.discount = "20%";
        this.offer.combMax = "1";
        this.offer.rank = "";
        this.offer.showPicture = true;
        this.offer.combCardPrefix = "1";
        this.offer.combStacking = false;
        this.offer.combExternalId = "0";
    };
    ProductOffersComponent.prototype.closeOffer = function () {
        this.error = '';
        this.addingOffer = false;
        this.getOfferProducts();
    };
    ProductOffersComponent.prototype.ngOnInit = function () {
        this.error = '';
        this.getCollections();
        this.getOffers();
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductIdSearch = function (item) {
        this.productIdSearch = item;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductNameSearch = function (item) {
        this.productNameSearch = item;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductCategory1Search = function (item) {
        this.productCategory1 = item.id;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductCategory2Search = function (item) {
        this.productCategory2 = item.id;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductCategory3Search = function (item) {
        this.productCategory3 = item.id;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductPriceSearch = function (item) {
        this.productPrice = item.id;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductBrandSearch = function (item) {
        this.productBrand = item.id;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductSizeSearch = function (item) {
        this.productSize = item.id;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductOfferIdSearch = function (item) {
        this.productOfferIdSearch = item;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductOfferNameSearch = function (item) {
        this.productOfferNameSearch = item;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onProductOfferAssignedSearch = function (item) {
        this.productOfferAssigned = item.id;
        this.getProducts();
    };
    ProductOffersComponent.prototype.onSelectedOfferProductNameSearch = function (item) {
        this.selectedOfferProductNameSearch = item;
        this.getOfferProducts();
    };
    ProductOffersComponent.prototype.onSelectedOfferProductCategory1Search = function (item) {
        this.selectedOfferProductCategory1 = item.id;
        this.getOfferProducts();
    };
    ProductOffersComponent.prototype.onSelectedOfferProductCategory2Search = function (item) {
        this.selectedOfferProductCategory2 = item.id;
        this.getOfferProducts();
    };
    ProductOffersComponent.prototype.onSelectedOfferProductCategory3Search = function (item) {
        this.selectedOfferProductCategory3 = item.id;
        this.getOfferProducts();
    };
    ProductOffersComponent.prototype.onSelectedOfferProductPriceSearch = function (item) {
        this.selectedOfferProductPrice = item.id;
        this.getOfferProducts();
    };
    ProductOffersComponent.prototype.onSelectedOfferProductBrandSearch = function (item) {
        this.selectedOfferProductBrand = item.id;
        this.getOfferProducts();
    };
    ProductOffersComponent.prototype.onSelectedOfferProductSizeSearch = function (item) {
        this.selectedOfferProductSize = item.id;
        this.getOfferProducts();
    };
    ProductOffersComponent.prototype.onOfferCategory1Select = function (category1) {
        this.offerCategory1 = category1.id;
        if (!this.productCategory1) {
            this.productCategory1 = category1.id;
            this.productCategory1Selected = [{ "id": category1.id, "text": category1.text }];
        }
        this.getProducts();
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferCategory2Select = function (category2) {
        this.offerCategory2 = category2.id;
        if (!this.productCategory2) {
            this.productCategory2 = category2.id;
            this.productCategory2Selected = [{ "id": category2.id, "text": category2.text }];
        }
        this.getProducts();
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferCategory3Select = function (category3) {
        this.offerCategory3 = category3.id;
        if (!this.productCategory3) {
            this.productCategory3 = category3.id;
            this.productCategory3Selected = [{ "id": category3.id, "text": category3.text }];
        }
        this.getProducts();
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferBrandSelect = function (brand) {
        this.offerBrand = brand.id;
        if (!this.productBrand) {
            this.productBrand = brand.id;
            this.productBrandSelected = [{ "id": brand.id, "text": brand.text }];
        }
        this.getProducts();
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferPriceSelect = function (price) {
        this.offerPrice = price.id;
        if (!this.productPrice) {
            this.productPrice = price.id;
            this.productPriceSelected = [{ "id": price.id, "text": price.text }];
        }
        this.getProducts();
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferSizeSelect = function (size) {
        this.offerSize = size.id;
        if (!this.productSize) {
            this.productSize = size.id;
            this.productSizeSelected = [{ "id": size.id, "text": size.text }];
        }
        this.getProducts();
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferSuspendedChange = function (suspended, offer) {
        offer.suspended = suspended.checked;
        this.saveOffer(offer);
    };
    ProductOffersComponent.prototype.onNewOfferSuspendedChange = function (suspended, offer) {
        offer.suspended = suspended.checked;
    };
    ProductOffersComponent.prototype.onOfferTypeSelect = function (item) {
        this.offerType = item.id;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onProductSelect = function (product) {
        this.selectedProduct = product;
    };
    ProductOffersComponent.prototype.onOfferSelect = function (offer) {
        this.selectedOffer = offer;
        this.addingOffer = false;
        this.getOfferProducts();
    };
    ProductOffersComponent.prototype.onOfferIdSearch = function (item) {
        this.offerId = item;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferNameSearch = function (item) {
        this.offerName = item;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferCombTypeSearch = function (item) {
        this.offerCombType = item.id;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferDemandIdSearch = function (item) {
        this.offerDemandId = item.id;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferDemandCountSearch = function (item) {
        this.offerDemandCount = item.id;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferBenefitIdSearch = function (item) {
        this.offerBenefitId = item.id;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferDiscountSearch = function (item) {
        this.offerDiscount = item.id;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferCombMaxSearch = function (item) {
        this.offerCombMax = item.id;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferValidFromSearch = function (item) {
        this.offerValidFrom = item;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferValidToSearch = function (item) {
        this.offerValidTo = item;
        this.getOffers();
    };
    ProductOffersComponent.prototype.onOfferSuspendedSearch = function (item) {
        this.offerSuspended = item.id;
        this.getOffers();
    };
    ProductOffersComponent.prototype.saveOffer = function (offer) {
        var _this = this;
        var isNew = (offer.id == '');
        var hadProducts = this.offerProducts.length > 0;
        this.error = '';
        this.offerService.save(offer).then(function (offer) {
            if (isNew) {
                _this.addingOffer = false;
                _this.selectedOffer = offer;
                if (!hadProducts) {
                    _this.offerType = "New";
                    _this.offerTypeSelected = [{ id: "New", text: "New" }];
                }
                _this.getOffers();
                _this.getProducts();
                // Save selected products with new offer
                var expected = _this.offerProducts.length;
                if (expected <= 0) {
                    _this.getOfferProducts();
                }
                else {
                    for (var _i = 0, _a = _this.offerProducts; _i < _a.length; _i++) {
                        var p = _a[_i];
                        p.offerId = offer.id;
                        _this.saveProduct(p, true).then(function (product) {
                            if (--expected <= 0) {
                                _this.getOfferProducts();
                            }
                        });
                    }
                }
            }
            return '';
        }).catch(function (err) {
            _this.error += err;
        });
    };
    ProductOffersComponent.prototype.saveProduct = function (product, isOfferProduct) {
        var _this = this;
        this.error = '';
        var self = this;
        return this.productService.save(product).then(function (product) {
            for (var _i = 0, _a = self.products; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.id == product.id) {
                    item.offerId = product.offerId;
                }
            }
            self.getOffers();
            if (!isOfferProduct) {
                self.getOfferProducts();
            }
            else {
                self.getProducts();
            }
            return product;
        }).catch(function (err) {
            _this.error += err;
        });
    };
    ProductOffersComponent.prototype.onActiveChange = function (active, product) {
        product.activatedPim = active;
        this.saveProduct(product, false);
    };
    ProductOffersComponent = __decorate([
        core_1.Component({
            selector: 'my-productoffers',
            templateUrl: 'app/components/productoffers/productoffers.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, products_service_1.ProductService, offers_service_1.OfferService])
    ], ProductOffersComponent);
    return ProductOffersComponent;
}());
exports.ProductOffersComponent = ProductOffersComponent;
//# sourceMappingURL=productoffers.component.js.map
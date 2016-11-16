import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {Product}                from '../../domain/product';
import {Offer}                from '../../domain/offer';
import {InvalidOffer}                from '../../domain/invalid.offer';

import {Categories}                from '../../domain/categories';
import {SelectItem}                from 'ng2-select/components/select/select-item';
import {MdSlideToggleChange} from '@angular/material/slide-toggle/slide-toggle'

import {ProductService}         from '../../services/products.service';
import {OfferService}         from '../../services/offers.service';
import {Http} from "@angular/http";
@Component({
    selector: 'my-productoffers',
    templateUrl: 'app/components/productoffers/productoffers.component.html'
})
export class ProductOffersComponent implements OnInit {
    products: Product[] = [];
    offerProducts: Product[] = [];
    offerTypes: any[] = [{id:"All", text:"All"}, {id:"New", text:"New"}, {id:"Assigned", text:"Assigned"}];
    offerType: string = "All";
    offerTypeSelected: any[] = [{id:"All", text:"All"}];

    selectedProduct: Product = new Product("");
    selectedOffer: Offer = new Offer("");

    category1values: string[];
    category2values: string[];
    category3values: string[];
    brands: string[];
    prices: string[];
    sizes: string[];
    combTypes: string[];
    demandIds: string[];
    demandCounts: string[];
    benefitIds: string[];
    discounts: string[];
    combMaxs: string[];

    yesno: any = [{id:"", text:""},{id:"1", text:"Yes"}, {id:"0", text:"No"}];

    productIdSearch: string = "";
    productNameSearch: string = "";
    productCategory1Selected: any[] = [];
    productCategory2Selected: any[] = [];
    productCategory3Selected: any[] = [];
    productPriceSelected: any[] = [];
    productBrandSelected: any[] = [];
    productSizeSelected: any[] = [];

    productCategory1: string = "";
    productCategory2: string = "";
    productCategory3: string = "";
    productPrice: string = "";
    productBrand: string = "";
    productSize: string = "";


    selectedOfferProductNameSearch: string = "";
    selectedOfferProductCategory1: string = "";
    selectedOfferProductCategory2: string = "";
    selectedOfferProductCategory3: string = "";
    selectedOfferProductPrice: string = "";
    selectedOfferProductBrand: string = "";
    selectedOfferProductSize: string = "";

    productOfferNameSearch: string = "";
    productOfferIdSearch: string = "";
    productOfferAssigned: string = "";

    offerCategory1: string = "";
    offerCategory2: string = "";
    offerCategory3: string = "";
    offerBrand: string = "";
    offerPrice: string = "";
    offerSize: string = "";

    offerId: string = "";
    offerName: string = "";
    offerCombType: string = "";
    offerDemandId: string = "";
    offerDemandCount: string = "";
    offerBenefitId: string = "";
    offerDiscount: string = "";
    offerCombMax: string = "";
    offerValidFrom: string = "";
    offerValidTo: string = "";
    offerSuspended: string = "";

    offers: Offer[] = [];
    invalidOfferMap: { [key:string]:InvalidOffer; } = {};

    offer: Offer = new Offer("");


    addingOffer = false;
    error: any = '';

    constructor(private router: Router,
                private productService: ProductService,
                private offerService: OfferService) {
    }

    formatDate(date: Date): string {
        return date.toISOString().slice(0, 10);
    }

    onOfferChangeValidFrom(offer: Offer, value: string, n: boolean) {
        var d = Date.parse(value);
        if(this.invalidOfferMap[offer.id] == null) {
            this.invalidOfferMap[offer.id] = new InvalidOffer();
        }
        if(!d) {
            this.invalidOfferMap[offer.id].validFrom = "Failed to parse: "+value;
            return;
        } else {
            this.invalidOfferMap[offer.id].validFrom = null;
        }
        if(offer.validTo.getTime() <= d) {
            this.invalidOfferMap[offer.id].validFrom = "ValidFrom is AFTER ValidTo";
            return;
        }
        offer.validFrom = new Date(d);
        if(!n) {
            this.saveOffer(offer);
        }
    }

    onOfferChangeValidTo(offer: Offer, value: string, n: boolean) {
        var d = Date.parse(value);
        if(this.invalidOfferMap[offer.id] == null) {
            this.invalidOfferMap[offer.id] = new InvalidOffer();
        }
        if(!d) {
            this.invalidOfferMap[offer.id].validTo = "Failed to parse: "+value;
            return;
        } else {
            this.invalidOfferMap[offer.id].validTo = null;
        }
        if(offer.validFrom.getTime() >= d) {
            this.invalidOfferMap[offer.id].validTo = "ValidFrom is AFTER ValidTo";
            return;
        }
        offer.validTo = new Date(d);
        if(!n) {
            this.saveOffer(offer);
        }
    }

    getCollections(): Promise<Categories> {
        return this.productService
            .getCollections()
            .then(result => {
                this.category1values = result.category1values;
                this.category2values = result.category2values;
                this.category3values = result.category3values;
                this.brands = result.brands;
                this.prices = result.prices;
                this.sizes = result.sizes;
                this.combTypes = result.combTypes;
                this.demandIds = result.demandIds;
                this.demandCounts = result.demandCounts;
                this.benefitIds = result.benefitIds;
                this.discounts = result.discounts;
                this.combMaxs = result.combMaxs;
                return result;
            })
            .catch(error => this.error += error);
    }

    getProducts(): Promise<Product[]> {
        return this.productService
            .getProducts(this.productIdSearch, this.productNameSearch,
                         this.productCategory1, this.productCategory2, this.productCategory3,
                         this.productPrice, this.productBrand, this.productSize,
                         '', '', '',
                         this.productOfferNameSearch, this.productOfferIdSearch, this.productOfferAssigned)
            .then(products => {
                this.products = products;
                return this.products;
            })
            .catch(error => this.error += error);
    }

    getOfferProducts(): Promise<Product[]> {
        if(this.selectedOffer.id != '') {
            return this.productService
                .getProductsByOffer(this.selectedOffer, this.selectedOfferProductNameSearch,
                                    this.selectedOfferProductCategory1, this.selectedOfferProductCategory2, this.selectedOfferProductCategory3,
                                    this.selectedOfferProductPrice, this.selectedOfferProductBrand, this.selectedOfferProductSize
                )
                .then(products => {
                    this.offerProducts = products;
                    return this.offerProducts;
                })
                .catch(error => this.error += error);
        }
    }

    getOfferWith() {
        var result = "with:";
        if(this.offerCategory1 != '') {
            result += " "+this.offerCategory1
        }
        if(this.offerCategory2 != '') {
            result += " "+this.offerCategory2
        }
        if(this.offerCategory3 != '') {
            result += " "+this.offerCategory3
        }
        if(this.offerBrand != '') {
            result += " "+this.offerBrand
        }
        if(this.offerPrice != '') {
            result += " "+this.offerPrice
        }
        if(this.offerSize != '') {
            result += " "+this.offerSize
        }
        if(this.offerId != '') {
            result += " "+this.offerId
        }
        if(this.offerName != '') {
            result += " "+this.offerName
        }
        if(this.offerCombType != '') {
            result += " "+this.offerCombType
        }
        if(this.offerDemandId != '') {
            result += " "+this.offerDemandId
        }
        if(this.offerDemandCount != '') {
            result += " "+this.offerDemandCount
        }
        if(this.offerBenefitId != '') {
            result += " "+this.offerBenefitId
        }
        if(this.offerDiscount != '') {
            result += " "+this.offerDiscount
        }
        if(this.offerCombMax != '') {
            result += " "+this.offerCombMax
        }
        if(this.offerValidFrom != '') {
            result += " "+this.offerValidFrom
        }
        if(this.offerValidTo != '') {
            result += " "+this.offerValidTo
        }
        if(this.offerSuspended != '' && this.offerSuspended == '1') {
            result += " Suspended"
        }
        if(this.offerSuspended != '' && this.offerSuspended == '0') {
            result += " Not-Suspended"
        }
        return result;
    }

    getProductWith() {
        var result = "with:";
        if(this.productIdSearch != '') {
            result += " "+this.productIdSearch
        }
        if(this.productNameSearch != '') {
            result += " "+this.productNameSearch
        }
        if(this.productCategory1 != '') {
            result += " "+this.productCategory1
        }
        if(this.productCategory2 != '') {
            result += " "+this.productCategory2
        }
        if(this.productCategory3 != '') {
            result += " "+this.productCategory3
        }
        if(this.productOfferIdSearch != '') {
            result += " "+this.productOfferIdSearch
        }
        if(this.productOfferNameSearch != '') {
            result += " "+this.productOfferNameSearch
        }
        return result;
    }

    getOffers(): Promise<Offer[]> {
        return this.offerService
            .getOffers(this.offerType, this.offerCategory1, this.offerCategory2, this.offerCategory3,
            this.offerBrand, this.offerPrice, this.offerSize,'', '', this.offerId, this.offerName,
            this.offerCombType, this.offerDemandId, this.offerCombMax, this.offerValidFrom, this.offerValidTo, this.offerSuspended)
            .then(offers => {
                this.offers = offers;
                this.invalidOfferMap = {};
                return this.offers;
            })
            .catch(error => this.error += error);
    }

    assignSelectedOffer(product: Product) {
        if(this.addingOffer) {
            this.offerProducts.push(product);
        } else {
            product.offerId = this.selectedOffer.id
            var self = this;
            this.saveProduct(product, false).then((product) => {
                self.getOffers()
                self.getOfferProducts()
            })
        }
    }

    removeOffer(product: Product) {
        if(this.addingOffer) {
            var index = this.offerProducts.indexOf(product);
            if (index > -1) {
                this.offerProducts.splice(index, 1);
            }
        } else {
            product.offerId = "";
            var self = this;
            this.saveProduct(product, false).then((product) => {
                self.getOffers()
                self.getOfferProducts()
            })
        }
    }


    newOfferFromProduct(product: Product) {
        this.addOffer();
        this.offer.name = "Offer for "+product.name;
        this.offerProducts = [product];
    }

    addOffer() {
        this.offer = new Offer("");
        this.addingOffer = true;
        this.selectedProduct = new Product("");
        this.selectedOffer = new Offer("");
        this.offer.name = "New Offer"
        var janTime = new Date(Date.UTC((new Date()).getFullYear(),0,1));
        var decTime = new Date(Date.UTC((new Date()).getFullYear(),11,31));
        this.offer.validFrom = janTime;
        this.offer.validTo = decTime;
        this.offer.combType = "4";
        this.offer.demandId = "1";
        this.offer.demandCount = "1";
        this.offer.benefitId = "7";
        this.offer.discount = "20%";
        this.offer.combMax = "1";
        this.offer.rank = "1";
        this.offer.showPicture = true;
    }

    closeOffer() {
        this.error = '';
        this.addingOffer = false;
        this.getOfferProducts();
    }

    ngOnInit() {
        this.error = '';
        this.getCollections();
        this.getOffers();
        this.getProducts();
    }

    onProductIdSearch(item: string) {
        this.productIdSearch = item
        this.getProducts();
    }
    onProductNameSearch(item: string) {
        this.productNameSearch = item
        this.getProducts();
    }
    onProductCategory1Search(item: SelectItem) {
        this.productCategory1 = item.id
        this.getProducts();
    }
    onProductCategory2Search(item: SelectItem) {
        this.productCategory2 = item.id
        this.getProducts();
    }
    onProductCategory3Search(item: SelectItem) {
        this.productCategory3 = item.id
        this.getProducts();
    }
    onProductPriceSearch(item: SelectItem) {
        this.productPrice = item.id
        this.getProducts();
    }
    onProductBrandSearch(item: SelectItem) {
        this.productBrand = item.id
        this.getProducts();
    }
    onProductSizeSearch(item: SelectItem) {
        this.productSize = item.id
        this.getProducts();
    }

    onProductOfferIdSearch(item: string) {
        this.productOfferIdSearch = item
        this.getProducts();
    }
    onProductOfferNameSearch(item: string) {
        this.productOfferNameSearch = item
        this.getProducts();
    }
    onProductOfferAssignedSearch(item: SelectItem) {
        this.productOfferAssigned = item.id
        this.getProducts();
    }


    onSelectedOfferProductNameSearch(item: string) {
        this.selectedOfferProductNameSearch = item
        this.getOfferProducts();
    }
    onSelectedOfferProductCategory1Search(item: SelectItem) {
        this.selectedOfferProductCategory1 = item.id
        this.getOfferProducts();
    }
    onSelectedOfferProductCategory2Search(item: SelectItem) {
        this.selectedOfferProductCategory2 = item.id
        this.getOfferProducts();
    }
    onSelectedOfferProductCategory3Search(item: SelectItem) {
        this.selectedOfferProductCategory3 = item.id
        this.getOfferProducts();
    }
    onSelectedOfferProductPriceSearch(item: SelectItem) {
        this.selectedOfferProductPrice = item.id
        this.getOfferProducts();
    }
    onSelectedOfferProductBrandSearch(item: SelectItem) {
        this.selectedOfferProductBrand = item.id
        this.getOfferProducts();
    }
    onSelectedOfferProductSizeSearch(item: SelectItem) {
        this.selectedOfferProductSize = item.id
        this.getOfferProducts();
    }

    onOfferCategory1Select(category1: SelectItem) {
        this.offerCategory1 = category1.id;
        if(!this.productCategory1) {
            this.productCategory1 = category1.id;
            this.productCategory1Selected = [{"id": category1.id, "text": category1.text}];
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferCategory2Select(category2: SelectItem) {
        this.offerCategory2 = category2.id;
        if(!this.productCategory2) {
            this.productCategory2 = category2.id;
            this.productCategory2Selected = [{"id": category2.id, "text": category2.text}];
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferCategory3Select(category3: SelectItem) {
        this.offerCategory3 = category3.id;
        if(!this.productCategory3) {
            this.productCategory3 = category3.id;
            this.productCategory3Selected = [{"id": category3.id, "text": category3.text}];
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferBrandSelect(brand: SelectItem) {
        this.offerBrand = brand.id;
        if(!this.productBrand) {
            this.productBrand = brand.id;
            this.productBrandSelected = [{"id": brand.id, "text": brand.text}];
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferPriceSelect(price: SelectItem) {
        this.offerPrice = price.id;
        if(!this.productPrice) {
            this.productPrice = price.id;
            this.productPriceSelected = [{"id": price.id, "text": price.text}];
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferSizeSelect(size: SelectItem) {
        this.offerSize = size.id;
        if(!this.productSize) {
            this.productSize = size.id;
            this.productSizeSelected = [{"id": size.id, "text": size.text}];
        }
        this.getProducts();
        this.getOffers();
    }
    onOfferSuspendedChange(suspended: MdSlideToggleChange, offer: Offer) {
          offer.suspended = suspended.checked;
          this.saveOffer(offer);
    }
    onNewOfferSuspendedChange(suspended: MdSlideToggleChange, offer: Offer) {
          offer.suspended = suspended.checked;
    }

    onOfferTypeSelect(item: SelectItem) {
        this.offerType = item.id;
        this.getOffers();
    }

    onProductSelect(product: Product) {
        this.selectedProduct = product
    }

    onOfferSelect(offer: Offer) {
        this.selectedOffer = offer;
        this.addingOffer = false;
        this.getOfferProducts()
    }

    onOfferIdSearch(item: string) {
        this.offerId = item;
        this.getOffers();
    }
    onOfferNameSearch(item: string) {
        this.offerName = item;
        this.getOffers();
    }
    onOfferCombTypeSearch(item: SelectItem) {
        this.offerCombType = item.id;
        this.getOffers();
    }
    onOfferDemandIdSearch(item: SelectItem) {
        this.offerDemandId = item.id;
        this.getOffers();
    }
    onOfferDemandCountSearch(item: SelectItem) {
        this.offerDemandCount = item.id;
        this.getOffers();
    }
    onOfferBenefitIdSearch(item: SelectItem) {
        this.offerBenefitId = item.id;
        this.getOffers();
    }
    onOfferDiscountSearch(item: SelectItem) {
        this.offerDiscount = item.id;
        this.getOffers();
    }
    onOfferCombMaxSearch(item: SelectItem) {
        this.offerCombMax = item.id;
        this.getOffers();
    }
    onOfferValidFromSearch(item: string) {
        this.offerValidFrom = item;
        this.getOffers();
    }
    onOfferValidToSearch(item: string) {
        this.offerValidTo = item;
        this.getOffers();
    }
    onOfferSuspendedSearch(item: SelectItem) {
        this.offerSuspended = item.id;
        this.getOffers();
    }

    saveOffer(offer: Offer) {
        var isNew: boolean = (offer.id == '');
        var hadProducts = this.offerProducts.length > 0;
        this.error = '';
        this.offerService.save(offer).then((offer) => {
            if (isNew) {
                this.addingOffer = false;
                this.selectedOffer = offer;
                if(!hadProducts) {
                    this.offerType = "New"
                    this.offerTypeSelected = [{id:"New", text:"New"}];
                }
                this.getOffers();
                this.getProducts();
                // Save selected products with new offer
                var expected = this.offerProducts.length;
                if(expected <= 0) {
                    this.getOfferProducts();
                } else {
                    for(let p of this.offerProducts) {
                        p.offerId = offer.id
                        this.saveProduct(p, true).then((product) => {
                           if(--expected <= 0) {
                              this.getOfferProducts();
                           }
                        })
                    }
                }
            }
            return '';
        }).catch((err) => {
            this.error += err;
        });
    }

    saveProduct(product: Product, isOfferProduct: boolean): Promise<Product> {
        this.error = '';
        var self = this;
        return this.productService.save(product).then((product) => {
            for (var item of self.products) {
                if(item.id == product.id) {
                    item.offerId = product.offerId;
                }
            }
            self.getOffers()
            if(!isOfferProduct) {
                self.getOfferProducts()
            } else {
                self.getProducts()
            }
            return product;
        }).catch((err) => {
            this.error += err;
        });
    }

    onActiveChange(active: boolean, product: Product) {
          product.activatedPim = active;
          this.saveProduct(product, false);
    }

}

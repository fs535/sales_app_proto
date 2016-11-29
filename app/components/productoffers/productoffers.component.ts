import {Component, OnInit, Input, Output} from '@angular/core';
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

    offersTotalItems:number = 0;
    offersCurrentPage:number = 1;

    productsTotalItems:number = 0;
    productsCurrentPage:number = 1;

    offerProductsTotalItems: number = 0;
    offerProductsCurrentPage:number = 1;

    pageSize:number = 10;

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
    offerActive: string = "";

    offers: Offer[] = [];
    invalidOfferMap: { [key:string]:InvalidOffer; } = {};

    offer: Offer = new Offer("");


    addingOffer = false;
    error: any = '';

    checkOffer:Offer = new Offer("");
    checkProduct:Product = new Product("");

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
                this.category1values = result.category1Values;
                this.category2values = result.category2Values;
                this.category3values = result.category3Values;
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

    getProducts(): Promise<Object> {
        return this.productService
            .getProducts(this.productIdSearch, this.productNameSearch,
                         this.productCategory1, this.productCategory2, this.productCategory3,
                         this.productPrice, this.productBrand, this.productSize,
                         '', '', '',
                         this.productOfferNameSearch, this.productOfferIdSearch, this.productOfferAssigned, '', this.productsCurrentPage)
            .then(response => {
                this.productsTotalItems = response['totalElements'];
                this.products = response['content'];
                return this.products;
            })
            .catch(error => this.error += error);
    }

    getOfferProducts(): Promise<Object> {
        if(this.selectedOffer.id != '') {
            return this.productService
                .getProductsByOffer(this.selectedOffer, this.selectedOfferProductNameSearch,
                                    this.selectedOfferProductCategory1, this.selectedOfferProductCategory2, this.selectedOfferProductCategory3,
                                    this.selectedOfferProductPrice, this.selectedOfferProductBrand, this.selectedOfferProductSize, this.offerProductsCurrentPage
                )
                .then(response => {

                    this.offerProductsTotalItems = response['totalElements'];
                    this.offerProducts = response['content'];

                    return this.offerProducts;
                })
                .catch(error => this.error += error);
        }
    }

    getOfferWith() {

        let result:string = '';
        let resultArr:Array<string> = new Array<string>();

        if(this.offerCategory1 != '') {
            resultArr.push(this.offerCategory1);
        }
        if(this.offerCategory2 != '') {
            resultArr.push(this.offerCategory2);
        }
        if(this.offerCategory3 != '') {
            resultArr.push(this.offerCategory3);
        }
        if(this.offerBrand != '') {
            resultArr.push(this.offerBrand);
        }
        if(this.offerPrice != '') {
            resultArr.push(this.offerPrice);
        }
        if(this.offerSize != '') {
            resultArr.push(this.offerSize);
        }
        if(this.offerId != '') {
            resultArr.push(this.offerId);
        }
        if(this.offerName != '') {
            resultArr.push(this.offerName);
        }
        if(this.offerCombType != '') {
            resultArr.push(this.offerCombType);
        }
        if(this.offerDemandId != '') {
            resultArr.push(this.offerDemandId);
        }
        if(this.offerDemandCount != '') {
            resultArr.push(this.offerDemandCount);
        }
        if(this.offerBenefitId != '') {
            resultArr.push(this.offerBenefitId);
        }
        if(this.offerDiscount != '') {
            resultArr.push(this.offerDiscount);
        }
        if(this.offerCombMax != '') {
            resultArr.push(this.offerCombMax);
        }
        if(this.offerValidFrom != '') {
            resultArr.push(this.offerValidFrom);
        }
        if(this.offerValidTo != '') {
            resultArr.push(this.offerValidTo);
        }
        if(this.offerActive != '' && this.offerActive == '1') {
            resultArr.push("Active");
        }
        if(this.offerActive != '' && this.offerActive == '0') {
            resultArr.push("Not-Active");
        }

        if (resultArr.length){
            result = " with: " + resultArr.join(" & ");
        }

        return result;
    }

    getProductWith() {
        let result:string = '';
        let resultArr:Array<string> = new Array<string>();

        if(this.productIdSearch != '') {
            resultArr.push(this.productIdSearch);
        }
        if(this.productNameSearch != '') {
            resultArr.push(this.productNameSearch);
        }
        if(this.productCategory1 != '') {
            resultArr.push(this.productCategory1);
        }
        if(this.productCategory2 != '') {
            resultArr.push(this.productCategory2);
        }
        if(this.productCategory3 != '') {
            resultArr.push(this.productCategory3);
        }
        if(this.productOfferIdSearch != '') {
            resultArr.push(this.productOfferIdSearch);
        }
        if(this.productOfferNameSearch != '') {
            resultArr.push(this.productOfferNameSearch);
        }

        if (resultArr.length){
            result = " with: " + resultArr.join(" & ");
        }

        return result;
    }

    getOffers(): Promise<Object> {
        return this.offerService
            .getOffers(this.offerType, this.offerCategory1, this.offerCategory2, this.offerCategory3,
            this.offerBrand, this.offerPrice, this.offerSize,'', '', this.offerId, this.offerName,
            this.offerCombType, this.offerDemandId, this.offerCombMax, this.offerValidFrom, this.offerValidTo, this.offerActive, this.offersCurrentPage)
            .then(response => {
                this.offersTotalItems = response['totalElements'];
                this.offers = response['content'];
                this.invalidOfferMap = {};
                return this.offers;
            })
            .catch(error => this.error += error);
    }

    assignSelectedOffer(product: Product) {
        if(this.addingOffer) {
            this.offerProducts.push(product);
        } else {
            product.offerId = this.selectedOffer.id;
            product.offer = this.selectedOffer;
            var self = this;
            this.saveProduct(product, false).then((product) => {
                self.getOffers();
                self.getOfferProducts();
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
            product.offerId = '0';
            var self = this;
            this.saveProduct(product, false).then((product) => {
                self.getOffers();
                self.getOfferProducts();
            })
        }
    }

    newOfferFromProduct(product: Product) {
        this.addOffer();
        this.offer.name = "Offer for "+product.productName;
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
        this.offer.combType = "32";
        this.offer.demandId = "1";
        this.offer.demandCount = "1";
        this.offer.benefitId = "7";
        this.offer.discount = "0.2";
        this.offer.combMax = "1";
        this.offer.combCardPrefix = "1";
        this.offer.combStacking = false;
        this.offer.combExternalId = "0";
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
            if (category1.id){
                this.productCategory1Selected = [{"id": category1.id, "text": category1.text}];
            }
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferCategory2Select(category2: SelectItem) {
        this.offerCategory2 = category2.id;
        if(!this.productCategory2) {
            this.productCategory2 = category2.id;
            if (category2.id){
                this.productCategory2Selected = [{"id": category2.id, "text": category2.text}];
            }
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferCategory3Select(category3: SelectItem) {
        this.offerCategory3 = category3.id;
        if(!this.productCategory3) {
            this.productCategory3 = category3.id;
            if (category3.id){
                this.productCategory3Selected = [{"id": category3.id, "text": category3.text}];
            }
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferBrandSelect(brand: SelectItem) {
        this.offerBrand = brand.id;
        if(!this.productBrand) {
            this.productBrand = brand.id;
            if (brand.id){
                this.productBrandSelected = [{"id": brand.id, "text": brand.text}];
            }
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferPriceSelect(price: SelectItem) {
        this.offerPrice = price.id;
        if(!this.productPrice) {
            this.productPrice = price.id;
            if (price.id){
                this.productPriceSelected = [{"id": price.id, "text": price.text}];
            }
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferSizeSelect(size: SelectItem) {
        this.offerSize = size.id;
        if(!this.productSize) {
            this.productSize = size.id;
            if (size.id){
                this.productSizeSelected = [{"id": size.id, "text": size.text}];
            }
        }
        this.getProducts();
        this.getOffers();
    }
    onOfferActiveChange(active: MdSlideToggleChange, offer: Offer) {
          offer.active = active.checked;
          this.saveOffer(offer);
    }
    onNewOfferActiveChange(active: MdSlideToggleChange, offer: Offer) {
          offer.active = active.checked;
    }

    onOfferTypeSelect(item: SelectItem) {
        this.offerType = item.id;
        this.getOffers();
    }

    onProductSelect(product: Product) {
        if (this.selectedProduct != product){
            this.selectedProduct = product;
        }
    }

    onOfferSelect(offer: Offer) {
        if (this.selectedOffer != offer){
            this.selectedOffer = offer;
            this.addingOffer = false;
            this.getOfferProducts()
        }
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
    onOfferActiveSearch(item: SelectItem) {
        this.offerActive = item.id;
        this.getOffers();
    }

    focusOnOffer(field:string, value:any){
        // save previous value
        this.checkOffer[field] = value;
    }

    checkAndSaveOffer(field:string, offer:Offer){
        if (this.checkOffer[field] != offer[field]){
            this.saveOffer(offer);
        }
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

    focusOnProduct(field:string, value: Product){
        // save previous value
        this.checkProduct[field] = value;
    }

    checkAndSaveProduct(field:string, product: Product, isOfferProduct: boolean){
        if (this.checkProduct[field] != product[field]){
            this.saveProduct(product, isOfferProduct);
        }
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

    offerPageChanged(event:any){
        this.offersCurrentPage = event;
        this.getOffers();
    }

    productsPageChanged(event:any){
        this.productsCurrentPage = event;
        this.getProducts();
    }

    offerProductsPageChanged(event:any){
        this.offerProductsCurrentPage = event;
        this.getOfferProducts();
    }

    sendToSelligent(){

    }

}

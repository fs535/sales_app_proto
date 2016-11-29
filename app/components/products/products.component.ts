import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {Product}                from '../../domain/product';
import {Offer}                from '../../domain/offer';
import {InvalidOffer}                from '../../domain/invalid.offer';
import {Categories}                from '../../domain/categories';
import {SelectItem}                from 'ng2-select/components/select/select-item';
import {ProductService}         from '../../services/products.service';
import {OfferService}         from '../../services/offers.service';
import {MdSlideToggleChange} from '@angular/material/slide-toggle/slide-toggle'

import {Http} from "@angular/http";
@Component({
    selector: 'my-products',
    templateUrl: 'app/components/products/products.component.html'
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];
    invalidOfferMap: { [key:string]:InvalidOffer; } = {};

    selectedProduct: Product = new Product("");

    error: any = '';


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
    offerAssigned: string = "";

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

    productsTotalItems:number = 0;
    productsCurrentPage:number = 1;
    pageSize:number = 10;

    yesno: any = [{id:"", text:""},{id:"1", text:"Yes"}, {id:"0", text:"No"}];

    productIdSearch: string = "";
    productNameSearch: string = "";
    productCategory1: string = "";
    productCategory2: string = "";
    productCategory3: string = "";
    productPrice: string = "";
    productBrand: string = "";
    productSize: string = "";
    productActivatedPim: string = "";
    productPictureUrlSearch: string = "";
    productDescriptionSearch: string = "";

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
                         this.productActivatedPim, this.productPictureUrlSearch, this.productDescriptionSearch,
                         this.offerName, this.offerId, this.offerAssigned, this.offerActive, this.productsCurrentPage)
            .then(response => {
                this.productsTotalItems = response['totalElements'];
                this.products = response['content'];

                this.invalidOfferMap = {};
                return this.products;
            })
            .catch(error => this.error += error);
    }

    ngOnInit() {
        this.error = '';
        this.getCollections()
        this.getProducts()
    }

    saveProduct(product: Product) {
        this.error = '';
        var self = this;
        return this.productService.save(product).then((product) => {
            for (var p of this.products) {
                if(p.id == product.id) {
                    Object.assign(p, product)
                }
            }
            return '';
        }).catch((err) => {
            this.error += err;
        });
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
    onProductActivatedPimSearch(item: SelectItem) {
        this.productActivatedPim = item.id
        this.getProducts();
    }
    onProductActivatedPimChange(activated: MdSlideToggleChange, product: Product) {
          product.activatedPim = activated.checked;
          this.saveProduct(product);
    }
    onProductPictureUrlSearch(item: string) {
        this.productPictureUrlSearch = item
        this.getProducts();
    }
    onProductDescriptionSearch(item: string) {
        this.productDescriptionSearch = item
        this.getProducts();
    }

    onOfferActiveChange(active: MdSlideToggleChange, offer: Offer) {
          offer.active = active.checked;
          this.saveOffer(offer);
    }
    onProductSelect(product: Product) {
        this.selectedProduct = product
    }
    onOfferIdSearch(item: string) {
        this.offerId = item;
        this.getProducts();
    }
    onOfferNameSearch(item: string) {
        this.offerName = item;
        this.getProducts();
    }
    onOfferCombTypeSearch(item: SelectItem) {
        this.offerCombType = item.id;
        this.getProducts();
    }
    onOfferDemandIdSearch(item: SelectItem) {
        this.offerDemandId = item.id;
        this.getProducts();
    }
    onOfferDemandCountSearch(item: SelectItem) {
        this.offerDemandCount = item.id;
        this.getProducts();
    }
    onOfferBenefitIdSearch(item: SelectItem) {
        this.offerBenefitId = item.id;
        this.getProducts();
    }
    onOfferDiscountSearch(item: SelectItem) {
        this.offerDiscount = item.id;
        this.getProducts();
    }
    onOfferCombMaxSearch(item: SelectItem) {
        this.offerCombMax = item.id;
        this.getProducts();
    }
    onOfferValidFromSearch(item: string) {
        this.offerValidFrom = item;
        this.getProducts();
    }
    onOfferValidToSearch(item: string) {
        this.offerValidTo = item;
        this.getProducts();
    }
    onOfferActiveSearch(item: SelectItem) {
        this.offerActive = item.id;
        this.getProducts();
    }

    saveOffer(offer: Offer) {
        this.error = '';
        this.offerService.save(offer).then((offer) => {
            for (var p of this.products) {
                if(p.offer && p.offer.id == offer.id) {
                    Object.assign(p.offer, offer)
                }
            }
            return '';
        }).catch((err) => {
            this.error += err;
        });
    }

    productsPageChanged(event:any){
        this.productsCurrentPage = event;
        this.getProducts();
    }
}

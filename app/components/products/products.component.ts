import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {Product}                from '../../domain/product';
import {Offer}                from '../../domain/offer';
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
    products: Product[];

    selectedProduct: Product = new Product("");

    error: any = '';

    groups: any = [{id:"Group1", text:"Group1"},{id:"Group2", text:"Group2"}, {id:"Group3", text:"Group3"}];
    group: string = "Group1";
    groupSelected: any[] = [{id:"Group1", text:"Group1"}];


    onGroupSelect(item: SelectItem) {
        this.group = item.id
    }

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

    yesno: any = [{id:"", text:""},{id:"1", text:"Yes"}, {id:"", text:"No"}];

    productIdSearch: string = "";
    productNameSearch: string = "";
    productCategory1: string = "";
    productCategory2: string = "";
    productCategory3: string = "";

    constructor(private router: Router,
                private productService: ProductService,
                private offerService: OfferService) {
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
        this.products = [];
        return this.productService
            .getProducts(this.productIdSearch, this.productNameSearch,
                         this.productCategory1, this.productCategory2, this.productCategory3,
                         this.offerName, this.offerId, this.offerAssigned)
            .then(products => {
                this.products = products;
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
        // Clear both attributes
        if(product.offerName == '') {
            product.offerId = '';
        }
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

    onProductActivatedPimChange(active: boolean, product: Product) {
          product.activatedPim = active;
          this.saveProduct(product);
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
    onOfferSuspendedChange(suspended: MdSlideToggleChange, offer: Offer) {
          offer.suspended = suspended.checked;
          this.saveOffer(null, null, offer);
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
    onOfferSuspendedSearch(item: SelectItem) {
        this.offerSuspended = item.id;
        this.getProducts();
    }

    saveOffer(value: any, field: string, offer: Offer) {
        this.error = '';
        // apply change first
        switch (field)
        {
          case 'combType':
            offer.combType = value;
            break;
          case 'demandId':
            offer.demandId = value;
            break;
          case 'demandCount':
            offer.demandCount = value;
            break;
          case 'benefitId':
            offer.benefitId = value;
            break;
          case 'discount':
            offer.discount = value;
            break;
          case 'combMax':
            offer.combMax = value;
            break;
          case 'validFrom':
            offer.validFrom = value;
            break;
          case 'validTo':
            offer.validTo = value;
            break;
        }
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
}

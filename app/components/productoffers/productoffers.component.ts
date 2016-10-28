import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {Product}                from '../../domain/product';
import {Offer}                from '../../domain/offer';
import {ProductService}         from '../../services/products.service';
import {OfferService}         from '../../services/offers.service';
import {Http} from "@angular/http";
@Component({
    selector: 'my-productoffers',
    templateUrl: 'app/components/productoffers/productoffers.component.html'
})
export class ProductOffersComponent implements OnInit {
    products: Product[];
    offerProducts: Product[];

    selectedProduct: Product = new Product("");
    selectedOffer: Offer = new Offer("");

    categories: string[];
    category1: string = "";
    offerCategory1: string = "";

    productSearch: string = ""
    offerSearch: string = ""

    unoffered: boolean = false;
    unassigned: boolean = false;
    unassignedOffers: Offer[]
    offers: Offer[]

    offer: Offer = new Offer("");


    addingOffer = false;
    error: any = '';

    constructor(private router: Router,
                private productService: ProductService,
                private offerService: OfferService) {
    }

    getProductCategories(): Promise<string[]> {
        return this.productService
            .getProductCategories()
            .then(categories => {
                this.categories = categories;
                return this.categories;
            })
            .catch(error => this.error += error);
    }


    getProducts(): Promise<Product[]> {
        this.products = [];
        if(this.category1 != '' || this.unoffered) {
            return this.productService
                .getProducts(this.category1, this.unoffered, this.productSearch)
                .then(products => {
                    this.products = products;
                    return this.products;
                })
                .catch(error => this.error += error);
        }
    }

    getOfferProducts(): Promise<Product[]> {
        this.offerProducts = [];
        if(this.selectedOffer.id != '') {
            return this.productService
                .getProductsByOffer(this.selectedOffer)
                .then(products => {
                    this.offerProducts = products;
                    return this.offerProducts;
                })
                .catch(error => this.error += error);
        }
    }

    getOffers(): Promise<Offer[]> {
        this.offers = []
        if(this.unassigned) {
            return this.offerService
                .getUnassignedOffers(this.offerSearch)
                .then(offers => {
                    this.offers = offers;
                    return this.offers;
                })
                .catch(error => this.error += error);
        } else if (this.offerCategory1 != ''){
            this.offers = [];
            return this.offerService
                .getOffers(this.offerCategory1, this.unoffered, '', this.offerSearch)
                .then(offers => {
                    this.offers = offers;
                    return this.offers;
                })
                .catch(error => this.error += error);
        }
    }


    assignSelectedOffer(product: Product) {
        product.offer = this.selectedOffer.name
        var self = this;
        this.saveProduct(product).then((product) => {
            self.getOffers()
            self.getOfferProducts()
        })
    }

    addOffer() {
        this.offer = new Offer("");
        this.addingOffer = true;
        this.selectedProduct = new Product("");
        this.selectedOffer = new Offer("");
    }

    closeOffer() {
        this.error = '';
        this.addingOffer = false;
    }

    ngOnInit() {
        this.error = '';
        this.getProductCategories()
    }

    onCategory1Select(category1: string) {
        this.category1 = category1;
        if(!this.offerCategory1) {
            this.offerCategory1 = category1;
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferCategory1Select(category1: string) {
        this.offerCategory1 = category1;
        this.getOffers();
    }

    onUnassignedSelect(unassigned: boolean) {
        this.unassigned = unassigned;
        this.getOffers();
    }


    onUnofferedSelect(unoffered: boolean) {
        this.unoffered = unoffered;
        this.getProducts();
        this.getOffers();
    }

    onProductSearch(productSearch: string) {
        this.productSearch = productSearch;
        this.getProducts();
    }

    onOfferSearch(offerSearch: string) {
        this.offerSearch = offerSearch;
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

    saveOffer(offer: Offer) {
        var isNew: boolean = (offer.id == '');
        this.error = '';
        this.offerService.save(offer).then((offer) => {
            if (isNew) {
                this.addingOffer = false;
                this.selectedOffer = offer;
                this.unassigned = true
                this.getOffers();
                this.getOfferProducts();
                this.getProducts()
            }
            return '';
        }).catch((err) => {
            this.error += err;
        });
    }

    saveProduct(product: Product): Promise<Product> {
        this.error = '';
        var self = this;
        return this.productService.save(product).then((product) => {
            for (var item of self.products) {
                if(item.id == product.id) {
                    item.offerId = product.offerId;
                }
            }
            self.getOffers()
            self.getOfferProducts()
            self.getProducts()

            return product;
        }).catch((err) => {
            this.error += err;
        });
    }

    onActiveChange(active: boolean, product: Product) {
          product.active = active;
          this.saveProduct(product);
    }

}

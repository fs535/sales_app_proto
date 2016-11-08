import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {Product}                from '../../domain/product';
import {Offer}                from '../../domain/offer';
import {Categories}                from '../../domain/categories';
import {SelectItem}                from 'ng2-select/components/select/select-item';
import {ProductService}         from '../../services/products.service';
import {OfferService}         from '../../services/offers.service';
import {Http} from "@angular/http";
import {MdSlideToggleChange} from '@angular/material/slide-toggle/slide-toggle'
@Component({
    selector: 'my-productoffers',
    templateUrl: 'app/components/productoffers/productoffers.component.html'
})
export class ProductOffersComponent implements OnInit {
    products: Product[];
    offerProducts: Product[];
    offerTypes: string[] = ["All", "New", "Assigned"];
    offerType: any = [{id:"All", text:"All"}];

    selectedProduct: Product = new Product("");
    selectedOffer: Offer = new Offer("");

    category1values: string[];
    category2values: string[];
    category3values: string[];
    brands: string[];
    prices: string[];
    sizes: string[];
    combTypes: string[] = ["1", "2", "3", "4"];


    category1: string = "";
    category2: string = "";
    category3: string = "";
    brand: string = "";
    price: string = "";
    size: string = "";

    offerCategory1: string = "";
    offerCategory2: string = "";
    offerCategory3: string = "";
    offerBrand: string = "";
    offerPrice: string = "";
    offerSize: string = "";

    unoffered: boolean = false;
    newOffers: Offer[]
    offers: Offer[]

    offer: Offer = new Offer("");


    addingOffer = false;
    error: any = '';

    constructor(private router: Router,
                private productService: ProductService,
                private offerService: OfferService) {
    }

    getProductCategories(): Promise<Categories> {
        return this.productService
            .getProductCategories()
            .then(result => {
                this.category1values = result.category1values;
                this.category2values = result.category2values;
                this.category3values = result.category3values;
                this.brands = result.brands;
                this.prices = result.prices;
                this.sizes = result.sizes;
                return result;
            })
            .catch(error => this.error += error);
    }


    getProducts(): Promise<Product[]> {
        this.products = [];
        if(this.category1 != '' || this.unoffered) {
            return this.productService
                .getProducts(this.category1,this.category1,this.category1,
                             this.brand, this.price, this.size, this.unoffered, '')
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
        if (this.offerType[0].id == 'New' || this.offerSize != ''  || this.offerPrice != '' || this.offerBrand != '' || this.offerCategory1 != '' || this.offerCategory2 != '' || this.offerCategory3 != ''){
            this.offers = [];
            return this.offerService
                .getOffers(this.offerType[0].id, this.offerCategory1, this.offerCategory2, this.offerCategory3, this.offerBrand, this.offerPrice, this.offerSize,'', '')
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

    onCategory1Select(category1: SelectItem) {
        this.category1 = category1.id;
        this.getProducts();
        this.getOffers();
    }

    onCategory2Select(category2: SelectItem) {
        this.category2 = category2.id;
        this.getProducts();
        this.getOffers();
    }

    onCategory3Select(category3: SelectItem) {
        this.category3 = category3.id;
        this.getProducts();
        this.getOffers();
    }

    onBrandSelect(brand: SelectItem) {
        this.brand = brand.id;
        this.getProducts();
        this.getOffers();
    }
    onPriceSelect(price: SelectItem) {
        this.price = price.id;
        this.getProducts();
        this.getOffers();
    }
    onSizeSelect(size: SelectItem) {
        this.size = size.id;
        this.getProducts();
        this.getOffers();
    }

    onOfferCategory1Select(category1: SelectItem) {
        this.offerCategory1 = category1.id;
        if(!this.category1) {
            this.category1 = category1.id;
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferCategory2Select(category2: SelectItem) {
        this.offerCategory2 = category2.id;
        if(!this.category2) {
            this.category2 = category2.id;
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferCategory3Select(category3: SelectItem) {
        this.offerCategory3 = category3.id;
        if(!this.category3) {
            this.category3 = category3.id;
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferBrandSelect(brand: SelectItem) {
        this.offerBrand = brand.id;
        if(!this.brand) {
            this.brand = brand.id;
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferPriceSelect(price: SelectItem) {
        this.offerPrice = price.id;
        if(!this.price) {
            this.price = price.id;
        }
        this.getProducts();
        this.getOffers();
    }

    onOfferSizeSelect(size: SelectItem) {
        this.offerSize = size.id;
        if(!this.size) {
            this.size = size.id;
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
        this.offerType[0] = {"id":item.id, "text":item.text};
        this.getOffers();
    }


    onUnofferedSelect(unoffered: boolean) {
        this.unoffered = unoffered;
        this.getProducts();
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
                this.offerType[0] = {'id':'New', 'text':'New'};
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
          product.activatedPim = active;
          this.saveProduct(product);
    }

}

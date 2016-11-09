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

    yesno: any = [{id:"", text:""},{id:"1", text:"Yes"}, {id:"", text:"No"}];


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

    canGetOffers(): boolean {
        return this.offerType == 'New' || this.offerSize != ''  || this.offerPrice != '' || this.offerBrand != '' ||
                           this.offerCategory1 != '' || this.offerCategory2 != '' || this.offerCategory3 != '' ||
                           this.offerId != '' || this.offerName != '' || this.offerCombType != '' || this.offerDemandId != '' ||
                           this.offerDemandCount != '' || this.offerBenefitId != '' || this.offerDiscount != '' ||
                           this.offerCombMax != '' || this.offerValidFrom != '' || this.offerValidTo != '' ||
                           this.offerSuspended != ''
    }
    getOffers(): Promise<Offer[]> {
        this.offers = []
        if (this.canGetOffers()){
            this.offers = [];
            return this.offerService
                .getOffers(this.offerType, this.offerCategory1, this.offerCategory2, this.offerCategory3,
                this.offerBrand, this.offerPrice, this.offerSize,'', '', this.offerId, this.offerName,
                this.offerCombType, this.offerDemandId, this.offerCombMax, this.offerValidFrom, this.offerValidTo, this.offerSuspended)

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
        this.offerType = item.id;
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
        this.error = '';
        this.offerService.save(offer).then((offer) => {
            if (isNew) {
                this.addingOffer = false;
                this.selectedOffer = offer;
                this.offerType = "New"
                this.offerTypeSelected = [{id:"New", text:"New"}];
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

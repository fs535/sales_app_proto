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

    productIdSearch: string = "";
    productNameSearch: string = "";
    productCategory1Selected: any[] = [];
    productCategory2Selected: any[] = [];
    productCategory3Selected: any[] = [];
    productCategory1: string = "";
    productCategory2: string = "";
    productCategory3: string = "";

    selectedOfferProductNameSearch: string = "";
    selectedOfferProductCategory1: string = "";
    selectedOfferProductCategory2: string = "";
    selectedOfferProductCategory3: string = "";

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

    newOffers: Offer[]
    offers: Offer[]

    offer: Offer = new Offer("");


    addingOffer = false;
    error: any = '';

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

    canGetProducts(): boolean {
        return this.productIdSearch != ''  || this.productNameSearch != '' || this.productCategory1 != '' ||
                           this.productCategory2 != '' || this.productCategory3 != '' ||
                           this.productOfferNameSearch != '' || this.productOfferIdSearch != '' || this.productOfferAssigned == 'No'
    }

    getProducts(): Promise<Product[]> {
        this.products = [];
        if(this.canGetProducts()) {
            return this.productService
                .getProducts(this.productIdSearch, this.productNameSearch,
                             this.productCategory1, this.productCategory2, this.productCategory3,
                             this.productOfferNameSearch, this.productOfferIdSearch, this.productOfferAssigned)
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
                .getProductsByOffer(this.selectedOffer, this.selectedOfferProductNameSearch,
                                    this.selectedOfferProductCategory1, this.selectedOfferProductCategory2, this.selectedOfferProductCategory3
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
        this.getCollections()
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
        this.getProducts();
        this.getOffers();
    }

    onOfferPriceSelect(price: SelectItem) {
        this.offerPrice = price.id;
        this.getProducts();
        this.getOffers();
    }

    onOfferSizeSelect(size: SelectItem) {
        this.offerSize = size.id;
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

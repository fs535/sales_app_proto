import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {Product}                from '../../domain/product';
import {Offer}                from '../../domain/offer';
import {Categories}                from '../../domain/categories';
import {SelectItem}                from 'ng2-select/components/select/select-item';
import {ProductService}         from '../../services/products.service';
import {OfferService}         from '../../services/offers.service';
import {Http} from "@angular/http";
@Component({
    selector: 'my-products',
    templateUrl: 'app/components/products/products.component.html'
})
export class ProductsComponent implements OnInit {
    products: Product[];

    selectedProduct: Product = new Product("");

    category1values: string[];
    category2values: string[];
    category3values: string[];
    brands: string[];
    prices: string[];
    sizes: string[];

    category1: string = "";
    category2: string = "";
    category3: string = "";
    brand: string = "";
    price: string = "";
    size: string = "";

    productSearch: string = ""

    unoffered: boolean = false;

    error: any = '';

    constructor(private router: Router,
                private productService: ProductService) {
    }

    getCollections(): Promise<Categories> {
        return this.productService
            .getCollections()
            .then(response => {
                this.category1values = response.category1values;
                this.category2values = response.category2values;
                this.category3values = response.category3values;
                this.brands = response.brands;
                this.prices = response.prices;
                this.sizes = response.sizes;
                return response;
            })
            .catch(error => this.error += error);
    }

    getProducts(): Promise<Product[]> {
        this.products = [];
        return this.productService
            .getProducts('', '', this.category1, this.category1, this.category1,
                         '', '', '')
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

    onCategory1Select(category1: SelectItem) {
        this.category1 = category1.id;
        this.getProducts();
    }
    onCategory2Select(category2: SelectItem) {
        this.category2 = category2.id;
        this.getProducts();
    }
    onCategory3Select(category3: SelectItem) {
        this.category3 = category3.id;
        this.getProducts();
    }
    onBrandSelect(brand: SelectItem) {
        this.brand = brand.id;
        this.getProducts();
    }
    onPriceSelect(price: SelectItem) {
        this.price = price.id;
        this.getProducts();
    }
    onSizeSelect(size: SelectItem) {
        this.size = size.id;
        this.getProducts();
    }

    onUnofferedSelect(unoffered: boolean) {
        this.unoffered = unoffered;
        this.getProducts();
    }

    onProductSearch(productSearch: string) {
        this.productSearch = productSearch;
        this.getProducts();
    }

    onProductSelect(product: Product) {
        this.selectedProduct = product
    }

    saveProduct(product: Product): Promise<Product> {
        this.error = '';
        var self = this;
        return this.productService.save(product).then((product) => {
            for (var item of this.products) {
                if(item.id == product.id) {
                    item.offerId = product.offerId;
                }
            }
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

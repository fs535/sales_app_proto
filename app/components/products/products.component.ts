import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {Product}                from '../../domain/product';
import {Offer}                from '../../domain/offer';
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

    categories: string[];
    category1: string = "";

    productSearch: string = ""

    unoffered: boolean = false;

    error: any = '';

    constructor(private router: Router,
                private productService: ProductService) {
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
        return this.productService
            .getProducts(this.category1, this.unoffered, this.productSearch)
            .then(products => {
                this.products = products;
                return this.products;
            })
            .catch(error => this.error += error);
    }

    ngOnInit() {
        this.error = '';
        this.getProductCategories()
        this.getProducts()
    }

    onCategory1Select(category1: string) {
        this.category1 = category1;
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
          product.active = active;
          this.saveProduct(product);
    }
}

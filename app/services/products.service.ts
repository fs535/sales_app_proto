import {Injectable}    from '@angular/core';
import {URLSearchParams, Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Product} from '../domain/product';
import {Offer} from '../domain/offer';
import {Settings} from "../domain/settings";
import {Categories} from "../domain/categories";

@Injectable()
export class ProductService {
    constructor(private http: Http, private settings: Settings) {
    }

    getProductsByOffer(offer: Offer): Promise<Product[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('offer', offer.id);

        return this.http.get(`${this.settings.hub_url}/products`,{
            search: params
        }).toPromise()
            .then(response =>
            response.json()
            )
            .catch(this.handleError);
    }


    getProductCategories(): Promise<Categories> {
        return this.http.get(`${this.settings.hub_url}/products/categories`)
            .toPromise()
            .then(response => {
                let r = response.json()
                r.category1values.splice(0, 0, "")
                r.category2values.splice(0, 0, "")
                r.category3values.splice(0, 0, "")
                r.brands.splice(0, 0, "")
                r.prices.splice(0, 0, "")
                r.sizes.splice(0, 0, "")
                return r
            })
            .catch(this.handleError);
    }

    getProducts(category1: string, category2: string, category3: string,
                brand: string, price: string, size: string,
                unoffered: boolean, text: string): Promise<Product[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('category1', category1);
        params.set('category2', category2);
        params.set('category3', category3);
        params.set('brand', brand);
        params.set('price', price);
        params.set('size', size);

        params.set('offered', unoffered ? "0" : "");
        params.set('text', text);

        return this.http.get(`${this.settings.hub_url}/products`,{
            search: params
        }).toPromise()
            .then(response =>
            response.json()
            )
            .catch(this.handleError);
    }

    // Update existing Product
    save(product: Product): Promise<Product> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let url = `${this.settings.hub_url}/products`;
        return this.http
            .patch(url, JSON.stringify(product), {headers: headers})
            .toPromise()
            .then((res) => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        if (error.headers.get('Content-Type') == 'application/json') {
            console.error('An error occurred', JSON.stringify(error.json()));
            return Promise.reject(JSON.stringify(error.json()));
        }
        console.error('An error occurred', ''+error.status + ' ' + error.statusText + ' ' + error.text());
        return Promise.reject('' + error.status + ' ' + error.statusText + ' ' + error.text());
    }


}

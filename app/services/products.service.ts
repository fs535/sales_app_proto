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

    getProductsByOffer(offer: Offer, productNameSearch: string,
                       productCategory1: string, productCategory2: string, productCategory3: string,
                       price: string, brand: string, size: string): Promise<Product[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('offerId', offer.id);
        params.set('category1', productCategory1);
        params.set('category2', productCategory2);
        params.set('category3', productCategory3);
        params.set('price', price);
        params.set('brand', brand);
        params.set('size', size);
        params.set('nameSearch', productNameSearch);

        return this.http.get(`${this.settings.hub_url}/products`,{
            search: params
        }).toPromise()
            .then(res => {
                return res.json() || []
            })
            .catch(this.handleError);
    }


    getCollections(): Promise<Categories> {
        return this.http.get(`${this.settings.hub_url}/collections`)
            .toPromise()
            .then(response => {
                let r = response.json()
                r.category1values.splice(0, 0, "")
                r.category2values.splice(0, 0, "")
                r.category3values.splice(0, 0, "")
                r.brands.splice(0, 0, "")
                r.prices.splice(0, 0, "")
                r.sizes.splice(0, 0, "")
                r.combTypes.splice(0, 0, "")
                r.demandIds.splice(0, 0, "")
                r.demandCounts.splice(0, 0, "")
                r.benefitIds.splice(0, 0, "")
                r.discounts.splice(0, 0, "")
                r.combMaxs.splice(0, 0, "")
                return r
            })
            .catch(this.handleError);
    }

    getProducts(productId: string, productNameSearch: string, category1: string, category2: string, category3: string,
                price: string, brand: string, size: string,
                activatedPim: string, pictureUrl: string, description: string,
                offerNameSearch: string, offerIdearch: string, offerAssigned: string): Promise<Product[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', productId);
        params.set('nameSearch', productNameSearch);
        params.set('category1', category1);
        params.set('category2', category2);
        params.set('category3', category3);
        params.set('price', price);
        params.set('brand', brand);
        params.set('size', size);
        params.set('activatedPim', activatedPim);
        params.set('pictureUrlSearch', pictureUrl);
        params.set('descriptionSearch', description);

        params.set('offerNameSearch', offerNameSearch);
        params.set('offerId', offerIdearch);
        if(offerAssigned == 'No') {
            params.set('offerAssigned', '0');
        } else if(offerAssigned == 'Yes') {
            params.set('offerAssigned', '1');
        }

        return this.http.get(`${this.settings.hub_url}/products`,{
            search: params
        }).toPromise()
            .then(res => {
                var data = res.json() || [];
                data.forEach((d: any) => {
                    if(d.offer) {
                        d.offer.validFrom = new Date(d.offer.validFrom);
                        d.offer.validTo = new Date(d.offer.validTo);
                    }
                });
                return data;
            })
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
            .then((res) => {
                var d = res.json() || [];
                if(d.offer) {
                    d.offer.validFrom = new Date(d.offer.validFrom);
                    d.offer.validTo = new Date(d.offer.validTo);
                }
                return d;
            })
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

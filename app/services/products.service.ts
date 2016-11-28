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
                       price: string, brand: string, size: string, currentPage:number, pageSize:number = 10): Promise<Object> {
        let params: URLSearchParams = new URLSearchParams();

        params.set('page', String(currentPage - 1));
        params.set('size', String(pageSize));
        //params.set('sort', offerType);

        if (offer.id){
            params.set('offerId', offer.id);
        }
        params.set('category1', productCategory1);
        if (productCategory1){
            params.set('category1', productCategory1);
        }
        if (productCategory2){
            params.set('category2', productCategory2);
        }
        if (productCategory3){
            params.set('category3', productCategory3);
        }
        if (price){
            params.set('price', price);
        }
        if (brand){
            params.set('brand', brand);
        }
        if (size){
            params.set('packageSize', size);
        }
        if (productNameSearch){
            params.set('nameSearch', productNameSearch);
        }

        return this.http.get(`${this.settings.hub_url}/products`,{
            search: params
        }).toPromise()
            .then(res => {
                let result:any = res.json();
                return result;
            })
            .catch(this.handleError);
    }


    getCollections(): Promise<Categories> {
        return this.http.get(`${this.settings.hub_url}/collections`)
            .toPromise()
            .then(response => {

                let prepare = function(param:Array<string>) {
                    for (let i:number = 0; i < param.length; i++) {
                        if (param[i] === null) {
                            param.splice(i, 1);
                            i--;
                        }

                        param[i] = String(param[i]);
                    }
                    param.splice(0, 0, "");
                };

                let r = response.json();
                prepare(r.category1Values);
                prepare(r.category2Values);
                prepare(r.category3Values);
                prepare(r.brands);
                prepare(r.prices);
                prepare(r.sizes);
                prepare(r.combTypes);
                prepare(r.demandIds);
                prepare(r.demandCounts);
                prepare(r.benefitIds);
                prepare(r.discounts);
                prepare(r.combMaxs);

                return r;
            })
            .catch(this.handleError);
    }

    getProducts(productId: string, productNameSearch: string, category1: string, category2: string, category3: string,
                price: string, brand: string, size: string,
                activatedPim: string, pictureUrl: string, description: string,
                offerNameSearch: string, offerIdearch: string, offerAssigned: string, currentPage:number, pageSize:number = 10): Promise<Object> {
        let params: URLSearchParams = new URLSearchParams();

        params.set('page', String(currentPage - 1));
        params.set('size', String(pageSize));
        //params.set('sort', offerType);

        if (productId){
            params.set('id', productId);
        }
        if (productNameSearch){
            params.set('nameSearch', productNameSearch);
        }
        if (category1){
            params.set('category1', category1);
        }
        if (category2){
            params.set('category2', category2);
        }
        if (category3){
            params.set('category3', category3);
        }
        if (price){
            params.set('price', price);
        }
        if (brand){
            params.set('brand', brand);
        }
        if (size){
            params.set('packageSize', size);
        }
        if (activatedPim){
            params.set('activatedPim', activatedPim);
        }
        if (pictureUrl){
            params.set('pictureUrlSearch', pictureUrl);
        }
        if (description){
            params.set('descriptionSearch', description);
        }
        if (offerNameSearch){
            params.set('offerNameSearch', offerNameSearch);
        }
        if (offerIdearch){
            params.set('offerId', offerIdearch);
        }
        if (offerAssigned){
            params.set('offered', offerAssigned);
        }

        return this.http.get(`${this.settings.hub_url}/products`,{
            search: params
        }).toPromise()
            .then(res => {
                let data:any = res.json() || [];
                data.content.forEach((d: any) => {
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
        let url = `${this.settings.hub_url}/product/${product.id}`;
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

import {Injectable}    from '@angular/core';
import {URLSearchParams, Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Offer} from '../domain/offer';
import {Settings} from "../domain/settings";
@Injectable()
export class OfferService {
    constructor(private http: Http, private settings: Settings) {
    }

    getOffers(offerType: string,category1: string, category2: string, category3: string,
              brand: string, price: string, size: string, product: string, text: string): Promise<Offer[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('type', offerType);
        params.set('category1', category1);
        params.set('category2', category2);
        params.set('category3', category3);
        params.set('brand', brand);
        params.set('price', price);
        params.set('size', size);
        params.set('product', product);
        params.set('text', text);

        return this.http.get(`${this.settings.hub_url}/offers`,{
             search: params
        }).toPromise()
            .then(res =>  {
                var data = res.json() || [];
                data.forEach((d: any) => {
                    d.validFrom = new Date(d.validFrom);
                    d.validTo = new Date(d.validTo);
                });
                return data;
            })
            .catch(this.handleError);
    }

    save(offer: Offer): Promise<Offer> {
        if (offer.id) {
            return this.patch(offer);
        } else {
            return this.post(offer);
        }
    }

    // Update existing Offer
    private patch(offer: Offer): Promise<Offer> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let url = `${this.settings.hub_url}/offers`;
        return this.http
            .patch(url, JSON.stringify(offer), {headers: headers})
            .toPromise()
            .then((res) => {
                var data = res.json();
                data.validFrom = new Date(data.validFrom);
                data.validTo = new Date(data.validTo);
                return data;
            })
            .catch(this.handleError);
    }

    // Update existing Offer
    private post(offer: Offer): Promise<Offer> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let url = `${this.settings.hub_url}/offers`;
        return this.http
            .post(url, JSON.stringify(offer), {headers: headers})
            .toPromise()
            .then((res) => {
                var data = res.json();
                data.validFrom = new Date(data.validFrom);
                data.validTo = new Date(data.validTo);
                return data;
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

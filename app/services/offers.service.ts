import {Injectable}    from '@angular/core';
import {URLSearchParams, Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Offer} from '../domain/offer';
import {Settings} from "../domain/settings";
import {AuthenticationService} from "./authentication.service";
@Injectable()
export class OfferService {

    constructor(private http: Http, private settings: Settings, private authService: AuthenticationService) {}

    getOffers(offerType: string,category1: string, category2: string, category3: string,
              brand: string, price: string, size: string, product: string, text: string,
              offerId: string, offerName: string, offerCombType: string, offerDemandId: string, offerCombMax: string,
              offerValidFrom: string, offerValidTo: string, offerActive: string, offerRate:string, currentPage:number, pageSize:number = 10): Promise<Object> {
        let params: URLSearchParams = new URLSearchParams();

        params.set('page', String(currentPage - 1));
        params.set('size', String(pageSize));
        //params.set('sort', offerType);

        params.set('type', offerType);

        if (category1){
            params.set('category1', category1);
        }
        if (category2){
            params.set('category2', category2);
        }
        if (category3){
            params.set('category3', category3);
        }
        if (brand){
            params.set('brand', brand);
        }
        if (price){
            params.set('price', price);
        }
        if (size){
            params.set('packageSize', size);
        }
        if (product){
            params.set('productId', product);
        }
        if (offerId){
            params.set('id', offerId);
        }
        if (offerName){
            params.set('nameSearch', offerName);
        }
        if (offerCombType){
            params.set('combType', offerCombType);
        }
        if (offerDemandId){
            params.set('demandId', offerDemandId);
        }
        if (offerCombMax){
            params.set('combMax', offerCombMax);
        }
        if (offerValidFrom){
            params.set('validFrom', offerValidFrom);
        }
        if (offerValidTo){
            params.set('validTo', offerValidTo);
        }
        if (offerActive !== ''){
            params.set('active', offerActive);
        }

        if (offerRate){
            params.set('rate', offerRate);
        }

        return this.http.get(`${this.settings.hub_url}/api/offers`, new RequestOptions({search: params}))
            .toPromise()
            .then(res =>  {
                let data:any = res.json() || [];
                (data.content as Array<any>).forEach((d:any) => {
                    this.covertFields(d);
                });
                return data;
            })
            .catch(this.handleError);
    }

    covertFields(data:any):any{
        data.validFrom = new Date(data['validFrom']);
        data.validTo = new Date(data['validTo']);
        return data;
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
        let url = `${this.settings.hub_url}/api/offer/${offer.id}`;

        return this.http
            .patch(url, JSON.stringify(offer))
            .toPromise()
            .then((res) => {
                let data:any = res.json();
                // something bad happened
                if (data['statusCode']){
                    return data;
                }
                this.covertFields(data);
                //update version
                offer.version = data.version;
                return data;
            })
            .catch(this.handleError);
    }

    // Update existing Offer
    private post(offer: Offer): Promise<Offer> {

        let url = `${this.settings.hub_url}/api/offer`;
        return this.http
            .post(url, JSON.stringify(offer))
            .toPromise()
            .then((res) => {
                let data:any = res.json();
                // something bad happened
                if (data['statusCode']){
                    return data;
                }
                this.covertFields(data);
                //update version
                offer.version = data.version;
                return data;
            })
            .catch(this.handleError);
    }

    sendToSeelinger(): Promise<Object> {
        let url = `${this.settings.integration_url}/api/generate/offers`;
        return this.http.get(url)
            .toPromise()
            .then(res =>  {
                return res.json();
            })
            .catch(this.handleError);
    }

    deleteOffer(offer:Offer):Promise<Object>{
        let url = `${this.settings.hub_url}/api/offer/${offer.id}`;
        return this.http
            .delete(url)
            .toPromise()
            .then((res) => {
                let data:any = res.json();
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

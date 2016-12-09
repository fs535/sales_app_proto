/**
 * Created by SergejFilatov on 12/7/2016.
 */
import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import { Settings } from '../domain/settings';
import 'rxjs/add/operator/map'
import { Base64Service } from './base64.service';
import { Cookie } from "ng2-cookies";



@Injectable()
export class AuthenticationService {

    constructor(private http: Http,
                private base64: Base64Service,
                private settings: Settings) {
        // get bearer from cookie
        let bearer:any = Cookie.get('bearer');
        if (bearer){
            this.bearer = bearer;
            this.isLoggedIn = true;
        }
    }

    // logged in status
    isLoggedIn: boolean = false;
    // store the URL so we can redirect after logging in
    redirectUrl: string = '/productoffers';
    // bearer
    bearer:string;

    login(username: string, password: string): Promise<any> {
        let self = this;
        let encodedCreds:string = this.base64.encode(username+':'+password);
        let headers:Headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', `Basic ${encodedCreds}`);

        let params:URLSearchParams = new URLSearchParams();
        params.set('grant_type', 'client_credentials');
        params.set('scope', 'hub');

        return this.http.post(`${this.settings.hub_url}/oauth2/token`,
                params, { headers: headers }
            )
            .toPromise()
            .then((response) => {
                let respData:any = response.json();
                self.bearer = respData['access_token'];
                // save to cookie
                Cookie.set('bearer', self.bearer);

                return respData;
            })
            .catch(this.handleError);
    }

    logout() {
        // remove from cookie
        Cookie.delete('bearer');
        this.isLoggedIn = false;
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
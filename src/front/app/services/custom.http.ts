import {Http, ConnectionBackend, Request, Response, RequestOptions, RequestOptionsArgs, Headers} from "@angular/http";
import {Injectable, Injector} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";

@Injectable()
export class CustomHttp extends Http {
    static isRunning : boolean = false;

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private router: Router, private injector: Injector) {
        super(backend, defaultOptions);
    }

    get authService(): AuthenticationService {
        return this.injector.get(AuthenticationService);
    }

    get isRunning():Boolean {
        return CustomHttp.isRunning;
    }

    createHeaders(options: RequestOptionsArgs, isJsonType:boolean):RequestOptionsArgs {
        let headers:Headers;
        if (options){
            if (!options.headers){
                options.headers = new Headers();
            }
            headers = options.headers;
        }else{
            headers = new Headers();
        }
        // if there is not first basic Authorization
        // append bearer
        if (!headers.get('Authorization')){
            headers.append('Authorization', 'Bearer ' + this.authService.bearer);
        }
        if (isJsonType && !headers.get('Content-Type')){
            headers.append('Content-Type', 'application/json');
        }
        return options ? options : new RequestOptions({headers: headers});
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        return observable
            .catch((err) => {
                if (err.status == 401) {
                    this.router.navigate(['/login']);
                    return Observable.throw(err);
                } else {
                    return Observable.throw(err);
                }
            })
            .finally(() => {
                CustomHttp.isRunning = false;
            });
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        return super.request(url, options).finally(() => {
            CustomHttp.isRunning = false;
        });
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        let requestOptions = this.createHeaders(options, false);
        return this.intercept(super.get(url, requestOptions));
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        let requestOptions = this.createHeaders(options, true);
        return this.intercept(super.post(url, body, requestOptions));
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        let requestOptions = this.createHeaders(options, true);
        return this.intercept(super.put(url, body, requestOptions));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        let requestOptions = this.createHeaders(options, false);
        return this.intercept(super.delete(url, requestOptions));
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        let requestOptions = this.createHeaders(options, true);
        return this.intercept(super.patch(url, body, requestOptions));
    }

    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        return super.head(url, options).finally(() => {
            CustomHttp.isRunning = false;
        });
    }

    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        return super.options(url, options).finally(() => {
            CustomHttp.isRunning = false;
        });
    }
}
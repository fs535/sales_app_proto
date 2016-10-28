import {Http, ConnectionBackend, Request, Response, RequestOptions, RequestOptionsArgs, Headers} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

@Injectable()
export class CustomHttp extends Http {
    static isRunning : boolean = false;
    get isRunning():Boolean {
        return CustomHttp.isRunning;
    }

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        return super.request(url, options).finally(() => {
            CustomHttp.isRunning = false;
        });
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        return super.get(url, options).finally(() => {
            CustomHttp.isRunning = false;
        });
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        return super.post(url, body, options).finally(() => {
            CustomHttp.isRunning = false;
        });
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        return super.put(url, body, options).finally(() => {
            CustomHttp.isRunning = false;
        });
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        return super.delete(url, options).finally(() => {
            CustomHttp.isRunning = false;
        });
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        CustomHttp.isRunning = true;
        return super.patch(url, body, options).finally(() => {
            CustomHttp.isRunning = false;
        });
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
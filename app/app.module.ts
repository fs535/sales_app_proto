import {NgModule, ApplicationRef, Provider, NgModuleRef}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';

import {HttpModule, XHRBackend, RequestOptions, Http} from '@angular/http';
import {routing} from './app.routes';

import {AppComponent}  from './components/app.component';
import {ProductsComponent} from "./components/products/products.component";
import {ProductOffersComponent} from "./components/productoffers/productoffers.component";
import {Autosize} from "./directives/autosize.directive";
import {Settings} from "./domain/settings";
import {SpinnerComponent} from "./components/spinner/spinner.component";
import {CustomHttp} from "./services/custom.http";
import "hammerjs"
import { MaterialModule } from '@angular/material';

var settings: Settings;

@NgModule({
    imports: [FormsModule, HttpModule, BrowserModule, routing, MaterialModule.forRoot()],
    declarations: [AppComponent, ProductsComponent, ProductOffersComponent, Autosize, SpinnerComponent],
    entryComponents: [AppComponent],
    providers: [{
        provide: Settings, useFactory: () => {
            return settings;
        }
    }, {
        provide: Http,
        useFactory: (backend: XHRBackend,
                     defaultOptions: RequestOptions) =>
            new CustomHttp(backend, defaultOptions),
        deps: [XHRBackend, RequestOptions]
    }]
})
export class AppModule {
    ngDoBootstrap(app: ApplicationRef) {
        settings = new Settings();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var config = JSON.parse(this.responseText);
                settings.hub_url = config.hub_url;
				app.bootstrap(AppComponent);
            }
        };
        xhttp.open("GET", "/config.json", true);
        xhttp.send();
    }
}
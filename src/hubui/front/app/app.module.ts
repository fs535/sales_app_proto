import {NgModule, ApplicationRef, Provider, NgModuleRef, Injector}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {SelectModule} from 'ng2-select/components/select.module';
import {HttpModule, XHRBackend, RequestOptions, Http} from '@angular/http';
import {routing} from './app.routes';
import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';

import {AppComponent}  from './components/app.component';
import {ProductsComponent} from "./components/products/products.component";
import {ProductOffersComponent} from "./components/productoffers/productoffers.component";
import {Autosize} from "./directives/autosize.directive";
import {Settings} from "./domain/settings";
import {SpinnerComponent} from "./components/spinner/spinner.component";
import {CustomHttp} from "./services/custom.http";
import "hammerjs"
import { MaterialModule } from '@angular/material';
import {Ng2PaginationModule} from 'ng2-pagination';
import {MessageBox} from "./components/templates/message-box";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./guards/authGuard";
import {AuthenticationService} from "./services/authentication.service";
import {Base64Service} from "./services/base64.service";
import {Router} from "@angular/router";
import {InfiniteScrollModule} from "angular2-infinite-scroll";

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

var settings: Settings;

@NgModule({
    imports: [FormsModule, HttpModule, BrowserModule, routing, MaterialModule.forRoot(), SelectModule, PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG), Ng2PaginationModule, InfiniteScrollModule],
    declarations: [LoginComponent, AppComponent, ProductsComponent, ProductOffersComponent, Autosize, SpinnerComponent, MessageBox],
    entryComponents: [AppComponent],
    providers: [AuthGuard,
        AuthenticationService,
        Base64Service,
        {
        provide: Settings, useFactory: () => {
            return settings;
        }
    }, {
        provide: Http,
        useFactory: (backend: XHRBackend,
                     defaultOptions: RequestOptions,
                     router: Router, injector:Injector) =>
            new CustomHttp(backend, defaultOptions, router, injector),
        deps: [XHRBackend, RequestOptions, Router, Injector]
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
                settings.integration_url = config.integration_url;
				app.bootstrap(AppComponent);
            }
        };
        xhttp.open("GET", "/config.json", true);
        xhttp.send();
    }
}
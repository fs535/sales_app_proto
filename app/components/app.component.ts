import {Component}          from '@angular/core';
import {ProductService}    from '../services/products.service';
import {OfferService}    from '../services/offers.service';
import {Http} from "@angular/http";
import {AuthenticationService} from "../services/authentication.service";

@Component({
    selector: 'my-app',
    template: `
    <div class="app-container" [class.appBusy]="customHttp.isRunning">
        <my-spinner [isRunning]="customHttp.isRunning"></my-spinner>
        <nav *ngIf="authService.isLoggedIn">
          <a [routerLink]="['/productoffers']" routerLinkActive="active" class="btn">Product Offers</a>
          <a [routerLink]="['/products']" routerLinkActive="active" class="btn">Products</a>
        </nav>
        <router-outlet></router-outlet>
    </div>
  `,
    providers: [
        ProductService,
        OfferService
    ]
})
export class AppComponent {
    title = 'Products';
    constructor(public customHttp: Http, private authService: AuthenticationService) {

    }
}
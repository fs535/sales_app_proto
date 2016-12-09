import {Component}          from '@angular/core';
import {ProductService}    from '../services/products.service';
import {OfferService}    from '../services/offers.service';
import {Http} from "@angular/http";
import {AuthenticationService} from "../services/authentication.service";

@Component({
    selector: 'my-app',
    template: `
    <nav *ngIf="authService.isLoggedIn">
      <my-spinner [isRunning]="customHttp.isRunning"></my-spinner>
      <a [routerLink]="['/productoffers']" routerLinkActive="active" class="btn">Product Offers</a>
      <a [routerLink]="['/products']" routerLinkActive="active" class="btn">Products</a>
    </nav>
    <router-outlet></router-outlet>
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
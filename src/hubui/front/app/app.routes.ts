import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductOffersComponent } from './components/productoffers/productoffers.component';
import { ProductsComponent } from './components/products/products.component';
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./guards/authGuard";

export const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        redirectTo: '/productoffers',
        pathMatch: 'full',
        canActivate: [AuthGuard]
    },
    {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'productoffers',
        component: ProductOffersComponent,
        canActivate: [AuthGuard]
    }

];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductOffersComponent } from './components/productoffers/productoffers.component';
import { ProductsComponent } from './components/products/products.component';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/productoffers',
        pathMatch: 'full'
    },
    {
        path: 'products',
        component: ProductsComponent
    },
    {
        path: 'productoffers',
        component: ProductOffersComponent
    }

];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
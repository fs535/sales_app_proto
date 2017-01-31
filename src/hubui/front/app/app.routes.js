"use strict";
var router_1 = require('@angular/router');
var productoffers_component_1 = require('./components/productoffers/productoffers.component');
var products_component_1 = require('./components/products/products.component');
exports.appRoutes = [
    {
        path: '',
        redirectTo: '/productoffers',
        pathMatch: 'full'
    },
    {
        path: 'products',
        component: products_component_1.ProductsComponent
    },
    {
        path: 'productoffers',
        component: productoffers_component_1.ProductOffersComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(exports.appRoutes);
/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/ 
//# sourceMappingURL=app.routes.js.map
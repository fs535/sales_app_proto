import {Offer}    from './offer';

export class Product {
    id: string;
    productName: string;
    productCategory1Name: string;
    productCategory2Name: string;
    productCategory3Name: string;
    brand: string;
    ecomPrice: string;
    packageSize: string;
    activatedPim: boolean;
    pimPicture: string;
    description: string;
    version:number;

    offer: Offer;
    offerId: string;
    constructor(id: string) {
        this.id = id;
    }
}
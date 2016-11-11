import {Offer}    from './offer';

export class Product {
    id: string;
    name: string;
    category1: string;
    category2: string;
    category3: string;
    brand: string;
    price: string;
    size: string;
    activatedPim: boolean;
    pictureUrl: string;
    description: string;

    offer: Offer;
    offerId: string;
    offerName: string;

    constructor(id: string) {
        this.id = id;
    }
}
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

    offer: string;
    offerId: string;

    constructor(id: string) {
        this.id = id;
    }
}
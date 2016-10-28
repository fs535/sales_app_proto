export class Product {
    id: string;
    name: string;
    category1: string;
    category2: string;
    category3: string;
    vendor: string;
    price: string;
    active: boolean;

    offer: string;
    offerId: string;

    constructor(id: string) {
        this.id = id;
    }
}
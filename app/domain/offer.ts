export class Offer {
    id: string;
    name: string;
    discount: string;
    combType: string;
    demandId: string;
    demandCount: string;
    benefitId: string;
    combMax: string;
    validFrom: Date;
    validTo: Date;
    active: boolean;
    combCardPrefix: string;
    combStacking: boolean;
    combExternalId: string;
    rank: string;
    showPicture: boolean;
    assigned: boolean;

    constructor(id: string) {
        this.id = id;
    }
}

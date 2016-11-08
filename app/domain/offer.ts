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
    suspended: boolean;
    combCardPrefix: string;
    combStacking: boolean;
    combExternalId: string;

    constructor(id: string) {
        this.id = id;
    }
}

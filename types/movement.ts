export interface Movement {
    id:       string;
    type:     string;
    date:     Date;
    notes:    null;
    supplier: string;
    customer: null;
    driver:   null;
    details:  Detail[];
}

export interface Detail {
    productName: string;
    productSku:  null;
    boxCount:    number;
    totalWeight: string;
    boxes:       Box[];
}

export interface Box {
    barcode:  string;
    weightKg: string;
}

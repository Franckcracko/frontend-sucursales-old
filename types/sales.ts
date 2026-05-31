export interface Branch {
    branch: string;
    card: Sale[];
    cash: Sale[];
    mix: Sale[];
    cancel: Sale[];
}

export interface Sale {
    id: string;
    subtotal: number;
    createdAt: Date;
    method: Method;
    cancel: Cancel;
}

export enum Cancel {
    F = "f",
}

export enum Method {
    E = "e",
    M = "m",
    T = "t",
}


export interface ResponseCut {
    movements:  Movement[];
    operations: Operation[];
}

export interface Movement {
    id:             number;
    deletedAt:      null;
    createdAt:      Date;
    amount:         number;
    description:    string;
    type:           string;
    shiftId:        number;
    paymentMethod:  null;
    reason:         null;
    cashRegisterId: number;
}

export interface Operation {
    day:                Date;
    cashRegisterId:     number;
    cumulativeSales:    number;
    cumulativeIncome:   number;
    cumulativeExpenses: number;
    cumulativeProfit:   number;
    cashSales:          number;
    cardSales:          number;
    voucherSales:       number;
    creditSales:        number;
    cashCredits:        number;
    cashSaelesReturns:  number;
    creditSalesReturns: number;
    cashCreditReturns:  number;
    numberOfSales:      number;
    couponSalesReturns: number;
    cardCredits:        number;
    couponCredits:      number;
    cardCommissions:    number;
    returnCardSales:    number;
    transferSales?:      number;
    transferCredits?:    number;
    checkSales?:         number;
    checkCredits?:       number;
    returnsTransSales?:  number;
    returnsCheckSales?:  number;
}

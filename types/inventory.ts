export interface Driver {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Provider {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Movement {
  id: string;
  type: "EDIT" | "ADD_STOCK" | "DELETE_STOCK";
  description: string | null;
  createdAt: Date;
}
export interface ProductWithProvider {
  id: string;
  name: string;
  barcode: string;
  stock: number;
  stockBoxes: number;
  image: string | null;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
  providerId: string;
  provider: Provider;
}

export interface History {
  id: string;
  createdAt: Date;
  HistoryProduct: HistoryProduct[];
}

export interface HistoryProduct {
  id: string;
  createdAt: Date;
  cost: number;
  stock: number;
  stockBoxes: number;
  weight: number;
  historyId: string;
  providerId: string;
  productId: string;
}

export interface Product {
  id: string;
  sku: null;
  name: string;
  description: null;
  supplierId: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
  supplier: Supplier;
  currentPricePerKg: string;
}

export interface Supplier {
  id: string;
  name: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Price {
  id: string;
  pricePerKg: number;
  startDate: Date;
  productId: string;
}

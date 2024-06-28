export type CryptoOrderStatus = 'completed' | 'pending' | 'failed';

export interface CryptoOrder {
  id: string;
  status: CryptoOrderStatus;
  orderDetails: string;
  orderDate: number;
  orderID: string;
  sourceName: string;
  unit: string;
  // shelf: string;
  // floor: string;
  sourceDesc: string;
  amountOrder: number;
  amount: number;
  orderCurrency: string;
  currency: string;
}
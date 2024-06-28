export type ReportStatus = 'completed' | 'pending' | 'failed';

export interface Report {
  id: string;
  status: ReportStatus;
  orderDetails: string;
  orderDate: number;
  orderID: string;
  sourceName: string;
  unit: string;
  shelf: string;
  floor: string;
  sourceDesc: string;
  amountOrder: number;
  amount: number;
  orderCurrency: string;
  currency: string;
}

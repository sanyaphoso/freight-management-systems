export type CustomerStatus = 'completed' | 'pending' | 'failed';

export interface Customer {
  id: string;
  orderID: string;
  status: CustomerStatus;
  productName: string;
  customerName: string;
  customerAddress: string;
  shippingDate: number;
  detailStatus: string;
  orderDate: number;
  name: string;
  customer_name: string;
  address: string;
  detail: string;
}
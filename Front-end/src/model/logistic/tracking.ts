export type TrackingStatus = 'completed' | 'pending' | 'failed' | 'in_progress' | 'success' ;

export interface Tracking {
  id: string;
  orderID: string;
  status: TrackingStatus;
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
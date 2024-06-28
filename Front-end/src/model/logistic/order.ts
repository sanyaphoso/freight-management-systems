export type OrderStatus = 'completed' | 'pending' | 'failed' | 'in_progress' | 'success';

export interface Order {
  id: string;
  orderID: string;
  status: OrderStatus;
  customerName: string;
  customerAddress: string;
  orderDate: number;
  orderDetails: string;
  orderName: string;
  latitude: number;
  longitude: number;
}
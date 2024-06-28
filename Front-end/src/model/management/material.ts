export type materialStatus = 'completed' | 'pending' | 'failed';

export interface materialOrder {
  id: string;
  status: materialStatus;
  name: string;
  lot: string;
  orderDate: number;
  category: string;
  amount: number;
  unit: string;
  shelf: string;
  price: number;
  description: string;
}
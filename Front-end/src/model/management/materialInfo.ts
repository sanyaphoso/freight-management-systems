export type MaterialInfoStatus = 'completed' | 'pending' | 'failed';

export interface MaterialInfo {
  id: string;
  lot: string;
  status: MaterialInfoStatus;
  name: string;
  orderDate: number;
  category: string;
  amount: number;
  unit: string;
  shelf: string;
  price: number;
  description: string;
}
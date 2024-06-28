export type ShelfStatus = 'completed' | 'pending' | 'failed';

export interface Shelf {
  id: string;
  shelfID: string;
  status: ShelfStatus;
  shelfDate: number;
  shelfName: string;
  shelfDescription: string;
  sourceDesc: string;
  amountShelf: number;
  amount: number;
  shelfCurrency: string;
  currency: string;
}
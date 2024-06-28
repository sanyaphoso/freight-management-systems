export type ShelfInfoStatus = 'completed' | 'pending' | 'failed';

export interface ShelfInfo {
  // id: number;
  // lastName: string;
  // firstName: string;
  // age: number;
  id: number;
  floorId: number;
  floorName: string;
  // status: ShelfInfoStatus;
  floorDescription: string;
  floorDate: number;
  floorAction: any;



}
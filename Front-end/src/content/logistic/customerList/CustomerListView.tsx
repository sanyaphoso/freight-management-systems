import { Card } from '@mui/material';
import { Customer } from '@/model/logistic/customer';
import RecentOrdersTable from './CustomerListTable';
import { subDays } from 'date-fns';

function RecentOrders() {
  const trackingOrders: Customer[] = [
    {
      id: '1',
      shippingDate: new Date().getTime(),
      status: 'completed',
      orderID: 'VUVX709ET7BY',
      customerName: 'Rose',
      productName: 'ประตู',
      customerAddress: 'ลาดกระบัง',
      detailStatus: '',
      orderDate: subDays(new Date(), 123).getTime(),
      name: "string",
      customer_name: "string",
      address: "string",
      detail: "string",
    },
  ];

  return (
    <Card>
      <RecentOrdersTable Customers={trackingOrders} />
    </Card>
  );
}

export default RecentOrders;
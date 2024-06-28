import { Card } from "@mui/material";
// import { Order,Ordertatus } from '@/model/logsitic/order.ts';

import RecentOrdersTable from "./StatusTable";
import { subDays } from "date-fns";
import { Tracking } from "@/model/logistic/tracking";

function RecentOrders() {
  const listOrders: Tracking[] = [
    {
      id: "1",
      shippingDate: new Date().getTime(),
      status: "completed",
      orderID: "VUVX709ET7BY",
      customerName: "Rose",
      productName: "ประตู",
      customerAddress: "ลาดกระบัง",
      detailStatus: "",
      orderDate: new Date().getTime(),
      name: "string",
      customer_name: "string",
      address: "string",
      detail: "string",
    },
  ];

  return (
    <Card>
      <RecentOrdersTable cryptoOrders={listOrders} />
    </Card>
  );
}

export default RecentOrders;

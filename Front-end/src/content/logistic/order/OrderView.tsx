import { Card } from "@mui/material";
// import { Order,Ordertatus } from '@/model/logsitic/order.ts';

import RecentOrdersTable from "./OrderTable";
import { subDays } from "date-fns";
import { Order } from "@/model/logistic/order";

function RecentOrders() {
  const listOrders: Order[] = [
    {
      id: "1",
      orderDetails: "Fiat Deposit",
      orderDate: new Date().getTime(),
      status: "completed",
      orderID: "VUVX709ET7BY",
      customerName: "Rose",
      orderName: "ประตู",
      customerAddress: "ลาดกระบัง",
      latitude: 42152,
      longitude: 42533,
    },
    {
      id: "2",
      orderDetails: "Fiat Deposit",
      orderDate: subDays(new Date(), 1).getTime(),
      status: "completed",
      orderID: "23M3UOG65G8K",
      customerName: "Jack Dawson",
      orderName: "รั้ว",
      customerAddress: "หนองจอก",
      latitude: 42152,
      longitude: 42533,
    },
    {
      id: "3",
      orderDetails: "Fiat Deposit",
      orderDate: subDays(new Date(), 5).getTime(),
      status: "failed",
      orderID: "F6JHK65MS818",
      customerName: "Billy",
      orderName: "บานเลื่อน",
      customerAddress: "อ่อนนุช",
      latitude: 42152,
      longitude: 42533,
    },
    {
      id: "4",
      orderDetails: "Fiat Deposit",
      orderDate: subDays(new Date(), 55).getTime(),
      status: "completed",
      orderID: "QJFAI7N84LGM",
      customerName: "Max",
      orderName: "ประตู",
      customerAddress: "บางนา",
      latitude: 42152,
      longitude: 42533,
    },
    {
      id: "5",
      orderDetails: "Fiat Deposit",
      orderDate: subDays(new Date(), 56).getTime(),
      status: "pending",
      orderID: "BO5KFSYGC0YW",
      customerName: "Bob",
      orderName: "รั้ว",
      customerAddress: "พญาไท",
      latitude: 42152,
      longitude: 42533,
    },
    {
      id: "6",
      orderDetails: "Fiat Deposit",
      orderDate: subDays(new Date(), 33).getTime(),
      status: "completed",
      orderID: "6RS606CBMKVQ",
      customerName: "John",
      orderName: "บานเลื่อน",
      customerAddress: "ราชเทวี",
      latitude: 42152,
      longitude: 42533,
    },
    {
      id: "7",
      orderDetails: "Fiat Deposit",
      orderDate: new Date().getTime(),
      status: "pending",
      orderID: "479KUYHOBMJS",
      customerName: "Paul",
      orderName: "ประตู",
      customerAddress: "รามคำแหง",
      latitude: 42152,
      longitude: 42533,
    },
    {
      id: "8",
      orderDetails: "Paypal Withdraw",
      orderDate: subDays(new Date(), 22).getTime(),
      status: "completed",
      orderID: "W67CFZNT71KR",
      customerName: "Kim",
      orderName: "รั้ว",
      customerAddress: "บางพลี",
      latitude: 42152,
      longitude: 42533,
    },
    {
      id: "9",
      orderDetails: "Fiat Deposit",
      orderDate: subDays(new Date(), 11).getTime(),
      status: "completed",
      orderID: "63GJ5DJFKS4H",
      customerName: "Park",
      orderName: "บานเลื่อน",
      customerAddress: "บึงกุ่ม",
      latitude: 42152,
      longitude: 42533,
    },
    {
      id: "10",
      orderDetails: "Wallet Transfer",
      orderDate: subDays(new Date(), 123).getTime(),
      status: "failed",
      orderID: "17KRZHY8T05M",
      customerName: "Ellen",
      orderName: "ประตู",
      customerAddress: "บางแค",
      latitude: 42152,
      longitude: 42533,
    },
  ];

  return (
    <Card>
      <RecentOrdersTable cryptoOrders={listOrders} />
    </Card>
  );
}

export default RecentOrders;

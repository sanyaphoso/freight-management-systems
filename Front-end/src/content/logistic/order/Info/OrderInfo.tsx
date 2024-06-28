import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import { ReactElement, useState, FC, useEffect } from "react";
import React from "react";

import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/router";
import getConfig from "next/config";
import Label from "@/components/Label";

const { publicRuntimeConfig } = getConfig();

interface EditUnitProps {}

const getStatusLabel = (orderStatus: string): JSX.Element => {
  const map: Record<
    string,
    {
      text: string;
      color:
        | "error"
        | "success"
        | "warning"
        | "black"
        | "primary"
        | "secondary"
        | "info";
    }
  > = {
    pending: {
      text: "pending",
      color: "error",
    },
    success: {
      text: "success",
      color: "success",
    },
    in_progress: {
      text: "in_progress",
      color: "warning",
    },
  };

  const {
    text,
    color,
  }: {
    text: string;
    color:
      | "error"
      | "success"
      | "warning"
      | "black"
      | "primary"
      | "secondary"
      | "info";
  } = map[orderStatus] || { text: "", color: "" };
  return <Label color={color}>{text}</Label>;
};

const OrderInfo: FC<EditUnitProps> = () => {
  const router = useRouter();
  const { orderID } = router.query;
  const [orderData, setOrderData] = useState<any>({});
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (orderID) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (token) {
            const response = await fetch(
              `${publicRuntimeConfig.BackEnd}order-group/${orderID}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.ok) {
              const responseData = await response.json();
              if (responseData && responseData.data) {
                setOrderData(responseData.data);
              } else {
                console.error("Invalid data format from API");
              }
            } else if (response.status === 401) {
              // Token หมดอายุหรือไม่ถูกต้อง
              console.log("Token expired or invalid");
              // ทำการลบ token ที่หมดอายุจาก localStorage
              localStorage.removeItem("accessToken");
            } else {
              console.error("Failed to fetch unit data");
            }
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchData();
    }
  }, [orderID]);

  if (!orderID) {
    return <div>Loading...</div>;
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <Container maxWidth="lg">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="stretch"
          spacing={1}
        >
          <Grid item xs={10} direction="column" justifyContent="center">
            <Card>
              <CardHeader title="Order Info" />
              <Divider />
              <CardContent>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={6} className="mt-5">
                    <TextField
                      fullWidth
                      label="Id"
                      className="mb-4"
                      variant="outlined"
                      value={orderData.id ||""}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Distance"
                      className="mb-4"
                      variant="outlined"
                      value={
                        orderData.node && orderData.node.route_length > 0
                          ? orderData.node.route_length > 0
                            ? (orderData.node.route_length / 1000).toFixed(2) +
                              " km"
                            : orderData.node.route_length + " m"
                          : "0 km"
                      }
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Time"
                      className="mb-4"
                      variant="outlined"
                      value={
                        orderData.node && orderData.node.route_time > 0
                          ? orderData.node.route_time > 0
                            ? (orderData.node.route_time / 60).toFixed(2) +
                              " min"
                            : orderData.node.route_time + " m"
                          : "0 min"
                      }
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Status"
                      className="mb-4"
                      variant="outlined"
                      value={orderData.status || ""}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      label="Date"
                      className="mb-4"
                      variant="outlined"
                      value={
                        orderData.created_at
                          ? format(new Date(orderData.created_at), "yyyy-MM-dd")
                          : ""
                      }
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">ID</TableCell>
                          <TableCell align="center">Name</TableCell>
                          <TableCell align="center">Customer</TableCell>
                          <TableCell align="center">Adress</TableCell>
                          <TableCell align="center">Date</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderData.orders &&
                          orderData.orders.map((order: any, index: any) => {
                            const isCryptoOrderSelected =
                              selectedCryptoOrders.includes(order.id);
                            return (
                              <TableRow
                                hover
                                key={order.id}
                                selected={isCryptoOrderSelected}
                              >
                                <TableCell align="center">
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color="text.primary"
                                    gutterBottom
                                    noWrap
                                  >
                                    {order.id}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color="text.primary"
                                    gutterBottom
                                    noWrap
                                  >
                                    {order.name}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color="text.primary"
                                    gutterBottom
                                    noWrap
                                  >
                                    {order.customer_name}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color="text.primary"
                                    gutterBottom
                                    noWrap
                                  >
                                    {order.address
                                      .split(",")
                                      .slice(0, 2)
                                      .map((line: any, index: any) => (
                                        <React.Fragment key={index}>
                                          {line}
                                          <br />
                                        </React.Fragment>
                                      ))}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color="text.primary"
                                    gutterBottom
                                    noWrap
                                  >
                                    {order.update_at
                                      ? format(
                                          new Date(order.update_at),
                                          "yyyy-MM-dd"
                                        )
                                      : ""}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color="text.primary"
                                    gutterBottom
                                    noWrap
                                  >
                                    {getStatusLabel(order.status)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Grid container justifyContent="flex-end">
                    <Button
                      variant="contained"
                      sx={{ margin: 1 }}
                      onClick={handleGoBack}
                      disableRipple
                      component="a"
                    >
                      Back{" "}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default OrderInfo;

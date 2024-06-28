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

const OrderEdit: FC<EditUnitProps> = () => {
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

  const handleUpdate = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const latitudeArray: number[] = [];
        const longitudeArray: number[] = [];
        const orderGroupIds: number[] = [];

        // Extract latitude and longitude from each order
        orderData.orders.forEach((order: any) => {
          const { latitude, longitude, id } = order; // Replace with actual field names
          latitudeArray.push(latitude);
          longitudeArray.push(longitude);
          orderGroupIds.push(id);
        });

        // Create a string with comma-separated values
        const newLatitude = 13.7957701;
        const newLongitude = 100.7068413;
        const updatedLatitudeValues = [newLatitude,...latitudeArray];
        const updatedLongitudeValues = [newLongitude,...longitudeArray];
        const latitudeString = updatedLatitudeValues.join(",");
        const longitudeString = updatedLongitudeValues.join(",");
        const orderGroupIdsString = orderGroupIds.join(",");
        console.log(latitudeString);
        console.log(longitudeString);
        const formDataToSend = new FormData();
        formDataToSend.append("latitude", latitudeString);
        formDataToSend.append("longitude", longitudeString);

        // Send data to the API
        const response = await fetch(
          `${publicRuntimeConfig.Routing}/get_route`,
          {
            method: "POST",
            headers: {
              // "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        );
        console.log(orderGroupIds)
        if (response.ok) {
          console.log("Route data sent successfully!");
          const responseNodeData = await response.json();
          const responseGroup = await fetch(
            `${publicRuntimeConfig.BackEnd}order-group/${orderID}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({
                orders_ids: orderGroupIdsString,
                node: responseNodeData,
              }),
            }
          );
          if (responseGroup.ok) {
            const responseGroupData = await responseGroup.json();
            console.log("Order group created successfully:", responseGroupData);
            console.log("Selected orders grouped successfully!");
            router.back()
          } else {
            console.error("Failed to group orders:", responseGroup.statusText);
          }
        } else if (response.status === 401) {
          console.log("Token expired or invalid");
          localStorage.removeItem("accessToken");
        } else {
          console.error("Failed to send route data");
          // Handle any failure actions here
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle any error actions here
    }
  };

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
              <CardHeader title="Edit Order" />
              <Divider />
              <CardContent>
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
                        <TableCell align="center">Edit</TableCell>
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
                              <TableCell align="center">
                                <Button
                                  variant="contained"
                                  sx={{ margin: 1 }}
                                  onClick={() =>
                                    router.push(
                                      `/logistic/customerList/edit/${order.id}`
                                    )
                                  }
                                  disableRipple
                                  component="a"
                                >
                                  Edit{" "}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Grid container justifyContent="flex-end" className="mt-5">
                  <Button
                    variant="contained"
                    sx={{ margin: 1 }}
                    disableRipple
                    component="a"
                    onClick={handleUpdate}
                  >
                    Update{""}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ margin: 1 }}
                    disableRipple
                    color="error"
                    component="a"
                    onClick={handleGoBack}
                  >
                    Cancel{""}
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default OrderEdit;

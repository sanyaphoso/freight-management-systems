import Head from "next/head";
import { FC, useEffect, useState } from "react";

import {
  Grid,
  Card,
  CardContent,
  styled,
  Button,
  Container,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import getConfig from "next/config";
import { format } from "date-fns";

const { publicRuntimeConfig } = getConfig();

interface ViewCustomerList {}

const ViewCustomerList: FC<ViewCustomerList> = () => {
  const router = useRouter();
  const { customerId } = router.query;
  const [customerData, setCustomerData] = useState<any>({
    id: "",
    name: "",
    detail: "",
    address: "",
    customer_name: "",
    created_at: "",
  });

  useEffect(() => {
    console.log("customerId:", customerId);
    if (customerId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (token) {
            const response = await fetch(
              `${publicRuntimeConfig.BackEnd}order/${customerId}`,
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
                console.log(responseData.data);
                setCustomerData(responseData.data);
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
  }, [customerId]);

  if (!customerId) {
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
                  {/* Column 1 - Label */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Id"
                      variant="outlined"
                      value={customerData.id || ""}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Name"
                      variant="outlined"
                      value={customerData.name || ""}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Customer"
                      variant="outlined"
                      value={customerData.customer_name || ""}
                      InputProps={{ readOnly: true }}
                    />
                    
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Detail"
                      variant="outlined"
                      value={customerData.detail || ""}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Address"
                      variant="outlined"
                      value={customerData.address || ""}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Status"
                      variant="outlined"
                      value={customerData.status || ""}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Date"
                      variant="outlined"
                      value={
                        customerData.update_at
                          ? format(
                              new Date(customerData.update_at),
                              "yyyy-MM-dd"
                            )
                          : ""
                      }
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
                {/* Button Row */}
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{ margin: 1 }}
                      disableRipple
                      component="a"
                      onClick={handleGoBack}
                    >
                      Back{""}
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

export default ViewCustomerList;

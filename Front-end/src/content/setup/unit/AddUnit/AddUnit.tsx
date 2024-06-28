import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import { ReactElement, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

function AddUnit() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    detail: "",
  });
  const handleCreateUnit: React.MouseEventHandler<HTMLAnchorElement> = async (
    event
  ) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");
    const requestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        detail: formData.detail,
      }),
    };
    try {
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}unit`,
          requestData
        );
        if (response.ok) {
          console.log("Unit created successfully!");
          router.back();
        } else if (response.status === 401) {
          console.log("Token expired or invalid");
          localStorage.removeItem("accessToken");
        } else {
          console.error("Unit creation failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <Card>
        <CardHeader title="Create Unit" />
        <Divider />
        <CardContent>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} className="mt-5">
              <TextField
                required
                fullWidth
                className="mb-4"
                id="name"
                label="Name"
                defaultValue={formData.name}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                className="mb-4"
                id="detail"
                label="Detail"
                defaultValue={formData.detail}
                onChange={handleChange}
              />
            </Grid>
            <Grid container justifyContent="flex-end" className="mt-5">
              <Button
                variant="contained"
                sx={{ margin: 1 }}
                onClick={handleCreateUnit}
                disableRipple
                component="a"
              >
                Create{" "}
              </Button>
              <Button
                variant="contained"
                sx={{ margin: 1 }}
                color="error"
                onClick={handleGoBack}
                disableRipple
                component="a"
              >
                Cancel{" "}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

AddUnit.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default AddUnit;

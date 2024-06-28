import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import { ReactElement, useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CardHeader,
  Divider,
} from "@mui/material";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const Pickup: React.FC = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setFormData] = useState({
    material_id: "",
    amount: "",
    // buy_date: ""
  });

  const [cryptoOrders, setCryptoOrders] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchFloorData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await fetch(
            `${publicRuntimeConfig.BackEnd}material`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const responseData = await response.json();
            setCryptoOrders(
              responseData.data.map((material: any) => ({
                value: material.id,
                label: material.name,
              }))
            );
          } else if (response.status === 401) {
            console.log("Token expired or invalid");
            localStorage.removeItem("accessToken");
          } else {
            console.error("Failed to fetch data. Response:", response);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFloorData();
  }, []);

  const handleCreate: React.MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");
    const formDataToSend = new FormData();
    formDataToSend.append("material_id", formData.material_id);
    formDataToSend.append("amount", formData.amount);

    try {
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}lot/withdraw`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        );
        console.log("formData:", formDataToSend);
        console.log("material_id:", formDataToSend.get("material_id"));
        console.log("amount:", formDataToSend.get("amount"));
        if (response.ok) {
          // console.log('name:', formDataToSend.get('name'));
          const responseData = await response.json();
          // const uploadedImageUrl = responseData.imageUrl;
          // setImageUrl(uploadedImageUrl);
          // ดำเนินการหลังจากการสร้าง Unit สำเร็จ
          console.log("Material Withdraw successfully!");
          router.push("/management/material/");
        } else if (response.status === 401) {
          console.log("Token expired or invalid");
          localStorage.removeItem("accessToken");
        } else {
          console.error("Material Withdraw failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (event: any, id: any) => {
    const { value } = event.target;

    if (id === "material_id") {
      setFormData({
        ...formData,
        material_id: value,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <Card>
        <CardHeader title="Requisition" />
        <Divider />
        <CardContent>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                className="mb-4"
                id="material_id"
                label="Material"
                value={formData.material_id}
                onChange={(e) => handleChange(e, "material_id")}
                select
              >
                {cryptoOrders.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                fullWidth
                className="mb-4"
                id="amount"
                label="Amount"
                value={formData.amount}
                onChange={(e) => handleChange(e, "amount")}
              />
            </Grid>
          </Grid>
          <form encType="multipart/form-data">
            <Grid container justifyContent="flex-end" className="mt-5">
              <Button
                variant="contained"
                sx={{ margin: 1 }}
                disableRipple
                component="a"
                onClick={handleCreate}
              >
                Requisition{""}
              </Button>
              <Button
                variant="contained"
                sx={{ margin: 1 }}
                disableRipple
                color="error"
                component="a"
                onClick={() => router.push("/management/material")}
              >
                Cancel{""}
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Pickup;

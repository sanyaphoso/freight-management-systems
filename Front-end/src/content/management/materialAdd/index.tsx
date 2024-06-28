import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import { ReactElement, useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Button,
  CardHeader,
  Divider,
  MenuItem,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

function Forms() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // เพิ่ม state สำหรับเก็บ URL ของรูป
  const [formData, setFormData] = useState({
    material_id: "",
    name: "Material",
    price: "",
    amount: "",
    detail: "",
    buy_date: new Date().toISOString().split("T")[0],
  });
  const [cryptoOrders, setCryptoOrders] = useState<
    { value: string; label: string }[]
  >([]);

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
            console.error(
              "Failed to fetch floor or unit data. Response:",
              response
            );
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFloorData();
  }, []);

  const handleCreateUnit: React.MouseEventHandler<HTMLAnchorElement> = async (
    event
  ) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");
    const formDataToSend = new FormData();
    formDataToSend.append("material_id", formData.material_id);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("amount", formData.amount);
    formDataToSend.append("detail", formData.detail);
    formDataToSend.append("buy_date", formData.buy_date);

    try {
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}lot/deposit`,
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
        console.log("name:", formDataToSend.get("name"));
        console.log("price:", formDataToSend.get("price"));
        console.log("amount:", formDataToSend.get("amount"));
        console.log("detail:", formDataToSend.get("detail"));
        if (response.ok) {
          const responseData = await response.json();
          // ดำเนินการหลังจากการสร้าง Unit สำเร็จ
          console.log("Unit created successfully!");
          router.push("/management/material/");
        } else if (response.status === 401) {
          // Token หมดอายุหรือไม่ถูกต้อง
          console.log("Token expired or invalid");
          // ทำการลบ token ที่หมดอายุจาก localStorage
          localStorage.removeItem("accessToken");
        } else {
          // ถ้าการสร้าง Unit ไม่สำเร็จ
          console.error("Material creation failed");
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

      // } else if (id === "unit_id") {
      //   setFormData({
      //     ...formData,
      //     unit_id: value
      //   });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // ทำการอ่านไฟล์รูปภาพ
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      setFile(selectedFile); // เซ็ตค่า file ใน state
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
      <Card>
        <CardHeader title="Add Material" />
        <Divider />
        <CardContent>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} className="mt-5">
              <TextField
                required
                fullWidth
                className="mb-4"
                id="material_id"
                label="Material Name"
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
                id="price"
                label="Material price"
                value={formData.price}
                onChange={(e) => handleChange(e, "price")}
              />
              <TextField
                required
                fullWidth
                className="mb-4"
                id="amount"
                label="Material amount"
                value={formData.amount}
                onChange={(e) => handleChange(e, "amount")}
              />
              <TextField
                required
                fullWidth
                className="mb-4"
                id="detail"
                label="detail"
                value={formData.detail}
                onChange={(e) => handleChange(e, "detail")}
              />
            </Grid>
          </Grid>
          {/* Button Row */}
          <form encType="multipart/form-data">
            <Grid container justifyContent="flex-end" className="mt-5">
              <Button
                variant="contained"
                sx={{ margin: 1 }}
                disableRipple
                component="a"
                // type="submit"
                onClick={handleCreateUnit}
              >
                Create{""}
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
          </form>
        </CardContent>
      </Card>
    </>
  );
}

Forms.getLayout = (page: ReactElement) => <SidebarLayout>{page}</SidebarLayout>;

export default Forms;

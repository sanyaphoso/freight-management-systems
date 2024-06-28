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

interface CryptoOrder {
  id: string;
  name: string;
  detail: string;
  unit_id: string;
  floor_id: string;
}

interface UserData {
  id: string;
  username: string;
  full_name: string;
}



function EditPermission() {
  const router = useRouter();
  const { roleId } = router.query;
  const [formData, setFormData] = useState({
    user_id: Array.isArray(roleId) ? roleId[0] : roleId || "",
    role_ids: [],
    full_name: "", // Store full_name here
  });
  

  const [userData, setUserData] = useState<{ value: string; label: string }[]>(
    []
  );
  const [roleData, setRoleData] = useState<{ value: string; label: string }[]>([]);
  const [cryptoOrders, setCryptoOrders] = useState([]);

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
          const responseUser = await fetch(
            `${publicRuntimeConfig.BackEnd}users/user`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const responseRole = await fetch(
            `${publicRuntimeConfig.BackEnd}role`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok && responseUser.ok && responseRole.ok) {
            const responseData = await response.json();
            const responseDataUser = await responseUser.json();
            const responseDataRole = await responseRole.json();
            // console.log('Floor Data:', responseDataFloor.data)

            setCryptoOrders(
              responseData.data.map((material: any) => ({
                value: material.id,
                label: material.name,
              }))
            );
            setUserData(
              responseDataUser.data.map((user: any) => ({
                value: user.id,
                label: user.full_name,
              }))
            );
            setRoleData(
              responseDataRole.data.map((role: any) => ({
                value: role.id,
                label: role.name,
              }))
            );
            
          } else if (
            response.status === 401 ||
            responseUser.status === 401 ||
            responseRole.status === 401
          ) {
            console.log("Token expired or invalid");
            localStorage.removeItem("accessToken");
          } else {
            console.error(
              "Failed to fetch floor or unit data. Response:",
              response,
              responseUser,
              responseRole
            );
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFloorData();
  }, []);

  const handleCreateUnit: React.MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");
    const formDataToSend = new FormData();
    formDataToSend.append("user_id", formData.user_id);
    formDataToSend.append("role_ids", formData.role_ids.join(','));

    try {
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}role/update-role-user`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        );
        console.log("formData:", formDataToSend);
        if (response.ok) {
          // console.log('name:', formDataToSend.get('name'));
          const responseData = await response.json();
          // ดำเนินการหลังจากการสร้าง Unit สำเร็จ
          console.log("Add Permission successfully!");
          router.push("/setup/permission");
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
  
    if (id === "user_id") {
      setFormData({
        ...formData,
        user_id: value,
      });
    } else if (id === "role_id") {
      setFormData({
        ...formData,
        role_ids: value,
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
        <CardHeader title="Permission Edit" />
        <Divider />
        <CardContent>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} className="mt-5">
            <TextField
                fullWidth
                className="mb-4"
                id="user_id"
                label="User Name"
                value={formData.user_id}
                select
                InputProps={{ readOnly: true }}
              >
                {userData.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                fullWidth
                className="mb-4"
                id="role_id"
                label="Roles"
                value={formData.role_ids}
                onChange={(e) => handleChange(e, "role_id")}
                select
                SelectProps={{
                  multiple: true, // Enable multiple selections
                  value: formData.role_ids,
                  onChange: (e) => handleChange(e, "role_id"),
                }}
              >
                {roleData.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

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
                Update
              </Button>
              <Button
                variant="contained"
                sx={{ margin: 1 }}
                disableRipple
                color="error"
                component="a"
                onClick={() => router.push("/setup/permission")}
              >
                Cancel
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

EditPermission.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default EditPermission;

import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import { ReactElement, useState, FC, useEffect } from "react";
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

interface Role {
  id: string;
  name: string;
  // other properties...
}

function InfoPermission() {
  const router = useRouter();
  const { roleId } = router.query;
  const [formData, setFormData] = useState({
    user_id: Array.isArray(roleId) ? roleId[0] : roleId || "",
    role_ids: [], // Store multiple roles here
  });

  const [userData, setUserData] = useState<{ value: string; label: string }[]>(
    []
  );
  const [roleData, setRoleData] = useState<Role[]>([]);

  const [cryptoOrders, setCryptoOrders] = useState([]);

  useEffect(() => {
    const fetchFloorData = async () => {
      console.log("roleId:", roleId);
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
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
            `${publicRuntimeConfig.BackEnd}role/role-user/${roleId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (responseUser.ok && responseRole.ok) {
            const responseDataUser = await responseUser.json();
            const responseDataRole = await responseRole.json();
            console.log("Role", responseDataRole);
            setUserData(
              responseDataUser.data.map((user: any) => ({
                value: user.id,
                label: user.full_name,
              }))
            );
            setRoleData(responseDataRole.data);
            console.log("Role", roleData)
            setFormData({
              ...formData,
              role_ids: responseDataRole.data.map((role: any) => role.id),
            });
          } else if (
            responseUser.status === 401 ||
            responseRole.status === 401
          ) {
            console.log("Token expired or invalid");
            localStorage.removeItem("accessToken");
          } else {
            console.error(
              "Failed to fetch floor or unit data. Response:",
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

  // const handleChange = (event: any, id: any) => {
  //   const { value } = event.target;

  //   if (id === "user_id") {
  //     setFormData({
  //       ...formData,
  //       user_id: value,
  //     });
  //   } else if (id === "role_id") {
  //     setFormData({
  //       ...formData,
  //       role_ids: value,
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [id]: value,
  //     });
  //   }
  // };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <Card>
        <CardHeader title="Permission Info" />
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
                fullWidth
                className="mb-4"
                id="role_id"
                label="Roles"
                value={formData.role_ids.map(roleId => {
                  const selectedRole = roleData.find(role => role.id === roleId);
                  return selectedRole ? selectedRole.name : '';
                }).join(', ')} // Join role names with a comma and space
                InputProps={{ readOnly: true }} // Make the field non-editable
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
                onClick={handleBack}
              >
                Back
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

InfoPermission.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default InfoPermission;
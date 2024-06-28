import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import { ReactElement, useState, FC, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>({
    id: "",
    image_url: "",
    full_name: "",
    username: "",
    created_at: "",
  });
  const [image, setImage] = useState<Blob | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await fetch(
            `${publicRuntimeConfig.BackEnd}users/user-info`,
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
            console.log("API response ok:", responseData);
            setUserData(responseData.data);

            const responseImage = await fetch(
              `${publicRuntimeConfig.BackEnd}upload/${responseData.data.image_url}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (responseImage.ok) {
              const imageData = await responseImage.blob(); // หรือ responseImage.text() ตามที่เหมาะสม
              console.log("image", imageData);
              setImage(imageData);
            } else {
              console.error("Error fetching image:", responseImage.statusText);
            }
          } else if (response.status === 401) {
            console.log("Token expired or invalid");
            localStorage.removeItem("accessToken");
          } else {
            console.error(
              `Failed to fetch user data. Status: ${response.status}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

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
              <CardHeader title="User Info" />
              <Divider />
              <CardContent>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={4}>
                    {/* Display uploaded image */}
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      className="mt-5 mb-5 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 rounded-lg bg-gray-50"
                    >
                      <img
                        src={image ? URL.createObjectURL(image) : ""}
                        alt="Uploaded Image"
                        className="max-h-48 max-w-full"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} className="mt-5">
                    <TextField
                      required
                      fullWidth
                      className="mb-5"
                      label="Id"
                      variant="outlined"
                      value={userData.id}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      required
                      fullWidth
                      className="mb-5"
                      label="Full name"
                      variant="outlined"
                      value={userData.full_name}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      required
                      fullWidth
                      className="mb-5"
                      label="Username"
                      variant="outlined"
                      value={userData.username}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      required
                      fullWidth
                      className="mb-5"
                      label="created"
                      variant="outlined"
                      value={
                        userData.created_at
                          ? format(new Date(userData.created_at), "yyyy-MM-dd")
                          : ""
                      }
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

// EditUnit.getLayout = (page : ReactElement) => <SidebarLayout>{page}</SidebarLayout>;
export default Profile;

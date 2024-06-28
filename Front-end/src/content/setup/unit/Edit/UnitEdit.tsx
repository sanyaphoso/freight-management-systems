import Head from "next/head";
import { useState, FC, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

interface EditUnitProps {}

const EditUnit: FC<EditUnitProps> = () => {
  const router = useRouter();
  const { unitId } = router.query;
  const [unitData, setUnitData] = useState<any>({
    name: "",
    detail: "",
  });

  useEffect(() => {
    if (unitId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (token) {
            const response = await fetch(
              `${publicRuntimeConfig.BackEnd}unit/${unitId}`,
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
              if (responseData && responseData.data) {
                setUnitData(responseData.data);
              } else {
                console.error("Invalid data format from API");
              }
            } else if (response.status === 401) {
              console.log("Token expired or invalid");
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
  }, [unitId]);

  const handleUpdateUnit = async () => {
    const token = localStorage.getItem("accessToken");
    const requestData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: unitData.name,
        detail: unitData.detail,
      }),
    };

    try {
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}unit/${unitId}`,
          requestData
        );
        console.log("ok", response);
        if (response.ok) {
          console.log("Unit updated successfully!");
          router.back();
        } else if (response.status === 401) {
          console.log("Token expired or invalid");
          localStorage.removeItem("accessToken");
        } else {
          console.error("Unit update failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!unitId) {
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
              <CardHeader title="Edit Unit" />
              <Divider />
              <CardContent>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={6} className="mt-5">
                    <TextField
                      required
                      fullWidth
                      label="Name"
                      className="mb-4"
                      variant="outlined"
                      value={unitData.name}
                      onChange={(e) =>
                        setUnitData({ ...unitData, name: e.target.value })
                      }
                    />
                    <TextField
                      required
                      fullWidth
                      label="Detail"
                      className="mb-4"
                      variant="outlined"
                      value={unitData.detail}
                      onChange={(e) =>
                        setUnitData({ ...unitData, detail: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid container justifyContent="flex-end">
                    <Button
                      // type="submit"
                      variant="contained"
                      sx={{ margin: 1 }}
                      onClick={handleUpdateUnit}
                      disableRipple
                      component="a"
                    >
                      Update{" "}
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
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default EditUnit;

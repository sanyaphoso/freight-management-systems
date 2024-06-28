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

const ShelfEdit: FC<EditUnitProps> = () => {
  const router = useRouter();
  const { shelfId } = router.query;
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ShelfData, setShelfData] = useState<any>({
    name: "",
    detail: "",
    image_url: imageUrl,
  });

  useEffect(() => {
    if (shelfId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (token) {
            const response = await fetch(
              `${publicRuntimeConfig.BackEnd}shelf/${shelfId}`,
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
              console.log("ok", responseData);
              if (responseData && responseData.data) {
                setShelfData(responseData.data);
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
  }, [shelfId]);

  if (!shelfId) {
    return <div>Loading...</div>;
  }
  const handleUpdateShelf: React.MouseEventHandler<HTMLAnchorElement> = async (
    event
  ) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");
    const formDataToSend = new FormData();
    formDataToSend.append("image_url", file!);
    formDataToSend.append("name", ShelfData.name);
    formDataToSend.append("detail", ShelfData.detail);
    try {
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}shelf/${shelfId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        );
        console.log("formData:", formDataToSend);
        if (response.ok) {
          console.log("name:", formDataToSend.get("name"));
          console.log("detail:", formDataToSend.get("detail"));
          const responseData = await response.json();
          const uploadedImageUrl = responseData.imageUrl;
          setImageUrl(uploadedImageUrl);
          console.log("Shelf Updated successfully!");
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

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      setFile(selectedFile);
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
              <CardHeader title="Unit Edit" />
              <Divider />
              <CardContent>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={6} className="mt-10">
                    <TextField
                      required
                      fullWidth
                      className="mb-5"
                      label="Name"
                      variant="outlined"
                      value={ShelfData.name}
                      onChange={(e) =>
                        setShelfData({ ...ShelfData, name: e.target.value })
                      }
                    />
                    <TextField
                      required
                      fullWidth
                      className="mb-5"
                      label="Detail"
                      variant="outlined"
                      value={ShelfData.detail}
                      onChange={(e) =>
                        setShelfData({ ...ShelfData, detail: e.target.value })
                      }
                    />
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Uploaded Image"
                        className="w-300 h-300 justify-center"
                      />
                    )}
                    <Button
                      variant="contained"
                      component="label"
                      htmlFor="dropzone-file"
                      className="mt-2"
                    >
                      Upload Image
                    </Button>
                  </Grid>
                  <Grid container justifyContent="flex-end">
                    <Button
                      variant="contained"
                      sx={{ margin: 1 }}
                      disableRipple
                      component="a"
                      onClick={handleUpdateShelf}
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

export default ShelfEdit;

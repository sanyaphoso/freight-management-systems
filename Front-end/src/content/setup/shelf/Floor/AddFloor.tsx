import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import { ReactElement, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Button,
  CardHeader,
  Divider,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

function Forms() {
  const router = useRouter();
  const { shelfId } = router.query;
  console.log("Id:", shelfId);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    image: imageUrl,
    name: "",
    detail: "",
  });

  const handleCreateUnit: React.MouseEventHandler<HTMLAnchorElement> = async (
    event
  ) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");
    const formDataToSend = new FormData();
    if (typeof shelfId === "string") {
      formDataToSend.append("shelve_id", shelfId);
    }
    formDataToSend.append("name", formData.name);
    formDataToSend.append("image_url", file!);
    formDataToSend.append("detail", formData.detail);

    try {
      if (token) {
        const response = await fetch(`${publicRuntimeConfig.BackEnd}floor`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        });
        console.log("formData:", formDataToSend);
        if (response.ok) {
          console.log("name:", formDataToSend.get("name"));
          console.log("detail:", formDataToSend.get("detail"));
          const responseData = await response.json();
          const uploadedImageUrl = responseData.imageUrl;
          setImageUrl(uploadedImageUrl);
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
      <Card>
        <CardHeader title="Create Floor" />
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
          </Grid>
          <form encType="multipart/form-data">
            <Grid container justifyContent="flex-end" className="mt-5">
              <Button
                variant="contained"
                sx={{ margin: 1 }}
                disableRipple
                component="a"
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

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, FC, useState } from "react";
import { MaterialInfo } from "@/model/management/materialInfo";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

interface EditMaterialProps {}
interface CryptoOrder {
  id: string;
  name: string;
  detail: string;
  unit_id: string;
  floor_id: string;
}

const MaterialEdit: FC<EditMaterialProps> = () => {
  const router = useRouter();
  const { materialId } = router.query;
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [materialData, setmaterialData] = useState<any>({
    id: "",
    name: "",
    detail: "",
    unit_id: "",
    total: "0",
    floor_id: "",
    image_url: imageUrl,
    created_at: "",
  });
  const [floorOptions, setFloorOptions] = useState<
    { value: string; label: string }[]
  >([]); // State to store floor options
  const [unitOptions, setUnitOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (materialId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (token) {
            const response = await fetch(
              `${publicRuntimeConfig.BackEnd}material/${materialId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const responseFloor = await fetch(
              `${publicRuntimeConfig.BackEnd}floor`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const responseUnit = await fetch(
              `${publicRuntimeConfig.BackEnd}unit`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.ok && responseFloor.ok && responseUnit.ok) {
              const responseData = await response.json();
              const responseDataFloor = await responseFloor.json();
              const responseDataUnit = await responseUnit.json();
              console.log("ok", responseData);
              if (responseData && responseData.data) {
                setmaterialData(responseData.data);
                setFloorOptions(
                  responseDataFloor.data.map((floor: any) => ({
                    value: floor.id,
                    label: floor.name,
                  }))
                );
                setUnitOptions(
                  responseDataUnit.data.map((unit: any) => ({
                    value: unit.id,
                    label: unit.name,
                  }))
                );
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
  }, [materialId]);

  if (!materialId) {
    return <div>Loading...</div>;
  }
  const handleUpdate: React.MouseEventHandler<HTMLAnchorElement> = async (
    event
  ) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");
    const formDataToSend = new FormData();
    formDataToSend.append("name", materialData.name);
    formDataToSend.append("image_url", file!); // แนบรูปภาพ
    formDataToSend.append("detail", materialData.detail);
    formDataToSend.append("floor_id", materialData.floor_id);
    formDataToSend.append("total", materialData.total);
    formDataToSend.append("unit_id", materialData.unit_id);
    try {
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}material/${materialId}`,
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
          console.log("Material Updated successfully!");
          router.back();
        } else if (response.status === 401) {
          console.log("Token expired or invalid");
          localStorage.removeItem("accessToken");
        } else {
          console.error("Material creation failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (event: any, id: any) => {
    const { value } = event.target;

    if (id === "floor_id") {
      setmaterialData({
        ...materialData,
        floor_id: value,
      });
    } else if (id === "unit_id") {
      setmaterialData({
        ...materialData,
        unit_id: value,
      });
    } else {
      setmaterialData({
        ...materialData,
        [id]: value,
      });
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
              <CardHeader title="Material Type Edit" />
              <Divider />
              <CardContent>
                <Grid container spacing={3} justifyContent="center">
                  {/* Column 2 - Form */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      className="mb-5"
                      label="Name"
                      variant="outlined"
                      value={materialData.name}
                      onChange={(e) =>
                        setmaterialData({
                          ...materialData,
                          name: e.target.value,
                        })
                      }
                    />
                    <TextField
                      required
                      fullWidth
                      className="mb-5"
                      label="Detail"
                      variant="outlined"
                      value={materialData.detail}
                      onChange={(e) =>
                        setmaterialData({
                          ...materialData,
                          detail: e.target.value,
                        })
                      }
                    />
                    <TextField
                      required
                      fullWidth
                      className="mb-5"
                      label="Unit"
                      variant="outlined"
                      value={materialData.unit_id}
                      onChange={(e) =>
                        setmaterialData({
                          ...materialData,
                          unit_id: e.target.value,
                        })
                      }
                      select
                    >
                      {unitOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      required
                      fullWidth
                      className="mb-5"
                      label="Floor"
                      variant="outlined"
                      value={materialData.floor_id}
                      onChange={(e) =>
                        setmaterialData({
                          ...materialData,
                          floor_id: e.target.value,
                        })
                      }
                      select
                    >
                      {floorOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
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
                <Grid container justifyContent="flex-end">
                  <Button
                    variant="contained"
                    sx={{ margin: 1 }}
                    onClick={handleUpdate}
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default MaterialEdit;

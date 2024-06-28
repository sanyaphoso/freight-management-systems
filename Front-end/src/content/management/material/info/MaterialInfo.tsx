import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, FC, useState } from "react";
import RecentOrdersTable from "@/content/management/material/info/MaterialInfoTable";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

interface EditUnitProps {}
interface Option {
  value: string;
  label: string;
}

interface CryptoOrder {
  id: string;
  name: string;
  detail: string;
  unit_id: string;
  floor_id: string;
}

interface SetupMaterialInfoTableProps {
  materialId: string | string[];
  lotData: any[];
}

const MaterialInfoPage: FC = () => {
  const router = useRouter();
  const { materialId } = router.query;
  const [materialData, setmaterialData] = useState<any>({
    id: "",
    name: "",
    detail: "",
    unit_id: "",
    total: "",
    floor_id: "",
    image_url: "",
    update_at: "",
  });
  const [floorOptions, setFloorOptions] = useState<Option[]>([]); // State to store floor options
  const [unitOptions, setUnitOptions] = useState<Option[]>([]);
  const [lotData, setLotData] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | undefined>(undefined);

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
            const responseLot = await fetch(
              `${publicRuntimeConfig.BackEnd}lot/${materialId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (
              response.ok &&
              responseFloor.ok &&
              responseUnit.ok &&
              responseLot.ok
            ) {
              const responseData = await response.json();
              const responseDataFloor = await responseFloor.json();
              const responseDataUnit = await responseUnit.json();
              const responseDataLot = await responseLot.json();
              console.log("ok", responseData);
              setmaterialData(responseData.data);
              setLotData(responseDataLot.data);
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
                console.error(
                  "Error fetching image:",
                  responseImage.statusText
                );
              }
            } else if (response.status === 401) {
              // Token หมดอายุหรือไม่ถูกต้อง
              console.log("Token expired or invalid");
              // ทำการลบ token ที่หมดอายุจาก localStorage
              localStorage.removeItem("accessToken");
            } else {
              console.error("Failed to fetch unit data");
            }
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchData(); // เรียก fetchData เมื่อ Component ถูก Mount
    }
  }, [materialId]);

  if (!materialId) {
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
              <CardHeader title="Material Info" />
              <Divider />
              <CardContent>
                <Grid container spacing={3} justifyContent="center">
                  {/* Column 1 - Label */}
                  <Grid item xs={12} sm={4}>
                    {/* Display uploaded image */}
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      className="mb-5 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 rounded-lg bg-gray-50"
                    >
                      <img
                        src={image ? URL.createObjectURL(image) : ""}
                        alt="Uploaded Image"
                        className="max-h-48 max-w-full"
                      />
                    </Grid>
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Id"
                      variant="outlined"
                      value={materialData.id}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Name"
                      variant="outlined"
                      value={materialData.name}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Detial"
                      variant="outlined"
                      value={materialData.detail}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Unit"
                      variant="outlined"
                      value={
                        unitOptions.find(
                          (unit) => unit.value === materialData.unit_id
                        )?.label || ""
                      }
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Total"
                      variant="outlined"
                      value={materialData.total}
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Floor"
                      variant="outlined"
                      value={
                        floorOptions.find(
                          (floor) => floor.value === materialData.floor_id
                        )?.label || ""
                      }
                      InputProps={{ readOnly: true }}
                    />
                    <TextField
                      fullWidth
                      className="mb-5"
                      label="Date"
                      variant="outlined"
                      value={
                        materialData.update_at
                          ? format(
                              new Date(materialData.update_at),
                              "yyyy-MM-dd"
                            )
                          : ""
                      }
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  {/* Column 2 - Form */}
                  <Grid item xs={12} sm={7}>
                  <RecentOrdersTable  materialId={materialId} lotData={lotData} />
                  </Grid>
                </Grid>
                {/* Button Row */}
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{ margin: 1 }}
                      disableRipple
                      component="a"
                      onClick={handleGoBack}
                    >
                      Back{""}
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

export default MaterialInfoPage;

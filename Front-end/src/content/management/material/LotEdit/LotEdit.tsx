import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MaterialInfo } from "@/model/management/materialInfo";
import { Button, Card, CardContent, TextField, Grid } from "@mui/material";

const LotEdit = () => {
  const router = useRouter();
  const { materialId } = router.query;
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialInfo | null>(
    null
  );

  // const [materialData, setMaterialData] = useState({
  //   material: 'Material 1',
  //   amount: '',
  //   price: '',
  //   description: '',
  //   updateBy: 'User 1',
  // });

  // const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
  //   const { name, value } = event.target;
  //   if (name === 'material') {
  //     const material = value as string;
  //     // ค้นหาวัตถุดิบที่ตรงกับ value และกำหนดค่าใหม่ให้กับ selectedMaterial
  //     const foundMaterial = data.find((item) => item.name === material);
  //     setSelectedMaterial(foundMaterial || null);
  //   }
  //   setMaterialData({ ...materialData, [name as string]: value as string });
  // };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // รับไฟล์ภาพแรกจากการเลือก

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedImage = e?.target?.result; // URL ของรูปภาพที่อัปโหลด
        // ทำต่อไปตามความเหมาะสม เช่น การแสดงรูปภาพที่อัปโหลด
      };
      reader.readAsDataURL(file); // อ่านไฟล์ภาพเพื่อแสดงผล
    }
  };

  // Simulated function to fetch data based on materialId
  const fetchMaterialData = async (id: string) => {
    // Perform API request or data retrieval based on the id
    // For simulation purposes, you can use a setTimeout to mimic an API call
    // Replace this with your actual data fetching logic
    // Example: const response = await fetch(`/api/materials/${id}`);
    // const data = await response.json();
    const data: MaterialInfo[] = [
      // Simulated data
      {
        id: "1",
        status: "completed",
        name: "Material A",
        lot: "1",
        category: "Category A",
        orderDate: new Date().getTime(),
        amount: 10,
        unit: "kg",
        shelf: "Shelf A",
        price: 300,
        description: " ",
      },
      {
        id: "2",
        status: "pending",
        name: "Material A",
        lot: "2",
        orderDate: new Date().getTime(),
        category: "Category B",
        amount: 5,
        unit: "pieces",
        shelf: "Shelf B",
        price: 500,
        description: " ",
      },
      // Add more simulated data as needed...
    ];

    // Find the MaterialInfo based on the provided id
    const selected = data.find((material) => material.id === id);
    return selected || null;
  };

  useEffect(() => {
    if (materialId && typeof materialId === "string") {
      fetchMaterialData(materialId).then((data) => {
        setSelectedMaterial(data);
      });
    }
  }, [materialId]);

  if (!selectedMaterial) {
    // Loading state or handle if the material data is not found
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={3} justifyContent="center">
            {/* Column 1 - Label */}
            {/* <Grid item xs={12} sm={1.5}>
                        
                    </Grid> */}

            {/* Column 2 - Form */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                className="mb-4"
                id="outlined-required"
                label="Lot"
                defaultValue={selectedMaterial.lot}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                required
                fullWidth
                className="mb-4"
                id="outlined-required"
                label="Price"
                defaultValue={selectedMaterial.price}
              />
              <TextField
                required
                fullWidth
                className="mb-4"
                id="outlined-required"
                label="Amount"
                defaultValue={selectedMaterial.amount}
              />
            </Grid>

            {/* Display uploaded image */}
            <Grid
              item
              xs={12}
              sm={4}
              container
              justifyContent="center"
              alignItems="center"
              className="ml-5"
            >
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                className="mb-2 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 rounded-lg bg-gray-50"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="uploadInput"
                  style={{ display: "none" }}
                />
                <label htmlFor="uploadInput">
                  <img
                    src="/path/to/your/image.jpg"
                    alt="Uploaded Image"
                    className="max-h-48 max-w-full cursor-pointer"
                  />
                </label>
              </Grid>
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
                onClick={() => router.push("/management/material")}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ margin: 1 }}
                disableRipple
                color="error"
                component="a"
                onClick={() => router.push("/management/material")}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default LotEdit;

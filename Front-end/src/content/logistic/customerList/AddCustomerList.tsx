import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import PageTitle from "@/components/PageTitle";
import { ReactElement, useEffect, useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";

import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  styled,
} from "@mui/material";
import Footer from "@/components/Footer";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
// Change the import statement to the correct path

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import axios from "axios";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import getConfig from "next/config";

const label = { inputProps: { "aria-label": "Switch demo" } };
const { publicRuntimeConfig } = getConfig();

const customIcon = new L.Icon({
  iconUrl: "/management/marker.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

type LatLngTuple = [number, number];

function Forms() {
  //API
  const [formData, setFormData] = useState({
    customer_name: "",
    name: "",
    detail: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const handleCreateCustomerList: React.MouseEventHandler<
    HTMLAnchorElement
  > = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");
    const requestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer_name: formData.customer_name,
        name: formData.name,
        detail: formData.detail,
        address: textFieldValue.address,
        latitude: textFieldValue.latitude,
        longitude: textFieldValue.longitude,
      }),
    };
    try {
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}order`,
          requestData
        );
        if (response.ok) {
          console.log(
            formData.customer_name,
            formData.name,
            formData.detail,
            textFieldValue.address,
            textFieldValue.latitude,
            textFieldValue.longitude
          ),
            console.log("CustomerList created successfully!");
          router.push("/logistic/customerList/");
        } else if (response.status === 401) {
          console.log("Token expired or invalid");
          localStorage.removeItem("accessToken");
        } else {
          console.error("CustomerList creation failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (event: any) => {
    const { id, value } = event.target;

    // Check if the changed field is latitude, longitude, or address
    if (id === "latitude" || id === "longitude" || id === "address") {
      setTextFieldValue((prevValue) => ({
        ...prevValue,
        [id]: value,
      }));
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const [currentPosition, setCurrentPosition] = useState<LatLngTuple | null>(
    null
  );
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(
    null
  );

  const router = useRouter();
  // const currentRoute = router.pathname;
    
  useEffect(() => {
    setMarkerPosition([13.7957701, 100.7068413]);
  
  }, []);

  const [value, setValue] = useState(30);

  const handleMarkerDrag = async (event: L.LeafletEvent) => {
    const marker = event.target;
    const newPosition = marker.getLatLng();

    try {
      console.log("Requesting reverse geocoding...");
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}`
      );

      console.log("Geocoding response:", response.data);
      const address = response.data.display_name;

      console.log("Updating text field value...");
      updateTextFieldValue(newPosition, address);

      console.log("Updating marker and current positions...");
      setMarkerPosition([newPosition.lat, newPosition.lng]);
      +[newPosition.lat, newPosition.lng];
    } catch (error) {
      console.error("Error fetching reverse geocoding:", error);
    }
  };

  const updateTextFieldValue = (newPosition: L.LatLng, address: string) => {
    const latitude = newPosition.lat.toFixed(6);
    const longitude = newPosition.lng.toFixed(6);
    setTextFieldValue({ latitude, longitude, address });
  };

  const [textFieldValue, setTextFieldValue] = useState<{
    latitude: string;
    longitude: string;
    address: string; // Add the address property
  }>({
    latitude: "",
    longitude: "",
    address: "", // Initialize the address property
  });

  useEffect(() => {
    if (currentPosition) {
      const latitude = currentPosition[0].toFixed(6);
      const longitude = currentPosition[1].toFixed(6);
      setTextFieldValue({ ...textFieldValue, latitude, longitude }); // Set address as an empty string initially
    }
  }, [currentPosition]);

  const Search = ({
    setMarkerPosition,
    setCurrentPosition,
    setAddress,
  }: any) => {
    const map = useMap();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = async () => {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchTerm });
      console.log(results);
      if (results.length > 0) {
        const { x, y, label } = results[0];
        map.setView([y, x], 13);
        setMarkerPosition([y, x]);
        setCurrentPosition([y, x]);
        console.log(label);
        setAddress(label || "");
      }
    };

    return (
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "0px",
          zIndex: 1000,
        }}
      >
        <input
          style={{
            border: "1px solid #ccc",
            borderColor: "#ccc",
            borderWidth: "2px",
            borderRadius: "4px",
            padding: "5px",
            alignContent: "center",
            position: "absolute",
            top: "0px",
            right: "70px",
            zIndex: 1000,
            width: "146px",
            height: "30px",
          }}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a location"
        />
        <button
          style={{
            border: "1px solid #ccc",
            borderColor: "#ccc",
            borderWidth: "2px",
            borderRadius: "4px",
            alignContent: "center",
            position: "absolute",
            top: "0px",
            right: "12px",
            zIndex: 1000,
            width: "50px",
            height: "30px",
            backgroundColor: "white",
          }}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    );
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
        <Grid container spacing={0}>
          <Grid item xs={12} direction="column" justifyContent="center">
            <Card>
              <CardHeader title="Order Details" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {/* Left Column */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": { m: 1, width: "100%" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        required
                        id="customer_name"
                        label="Customer Name"
                        value={formData.customer_name}
                        onChange={handleChange}
                      />

                      <TextField
                        required
                        id="name"
                        label="Order Name"
                        value={formData.name}
                        onChange={handleChange}
                      />

                      <TextField
                        required
                        id="detail"
                        label="Details"
                        value={formData.detail}
                        onChange={handleChange}
                      />
                      <TextField
                        required
                        id="address"
                        label="Address"
                        value={textFieldValue.address}
                        onChange={handleChange}
                      />

                      <TextField
                        required
                        id="latitude"
                        label="Latitude"
                        value={textFieldValue.latitude}
                        onChange={handleChange}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        required
                        id="longitude"
                        label="Longitude"
                        value={textFieldValue.longitude}
                        onChange={handleChange}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Box>
                  </Grid>
                  {/* Right Column */}
                  <Grid item xs={12} sm={6}>
                    {/* Leaflet Map */}
                    <div style={{ padding: "10px" }}>
                      <MapContainer
                        center={[13.7957701, 100.7068413]}
                        zoom={13}
                        style={{ height: "400px", width: "100%" }}
                        scrollWheelZoom={false}
                      >
                        <Search
                          setMarkerPosition={setMarkerPosition}
                          setCurrentPosition={setCurrentPosition}
                          setAddress={(newAddress: string) =>
                            setTextFieldValue((prevValue) => ({
                              ...prevValue,
                              address: newAddress,
                            }))
                          }
                        />

                        <TileLayer
                          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={markerPosition || [0, 0]}
                          draggable={true}
                          eventHandlers={{ dragend: handleMarkerDrag }}
                          icon={customIcon} // Use the custom icon
                        >
                          <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                          </Popup>
                          <Tooltip>{`Latitude: ${markerPosition?.[0]}, Longitude: ${markerPosition?.[1]}`}</Tooltip>
                        </Marker>
                      </MapContainer>
                      
                    </div>
                  </Grid>
                  <Grid container justifyContent="flex-end" className="mt-5">
                    <Button
                      variant="contained"
                      sx={{ margin: 1 }}
                      disableRipple
                      component="a"
                      onClick={handleCreateCustomerList}
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
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

Forms.getLayout = (page: ReactElement) => <SidebarLayout>{page}</SidebarLayout>;

export default Forms;

import Head from "next/head";
import { FC, ReactElement, useEffect, useState } from "react";
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
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

interface EditCustomerListProps {}

const customIcon = new L.Icon({
  iconUrl: "/management/marker.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const EditCustomerList: FC<EditCustomerListProps> = () => {
  const router = useRouter();
  const { customerId } = router.query;
  const [customerData, setCustomerData] = useState<any>({
    id: "",
    name: "",
    detail: "",
    address: "",
    customer_name: "",
    created_at: "",
  });
  const [currentPosition, setCurrentPosition] = useState<LatLngTuple | null>(
    null
  );
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(
    null
  );
  const [value, setValue] = useState(30);
  const [textFieldValue, setTextFieldValue] = useState<{
    latitude: string;
    longitude: string;
    address: string;
  }>({
    latitude: "",
    longitude: "",
    address: "",
  });

  useEffect(() => {
    console.log("customerId:", customerId);
    if (customerId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (token) {
            const response = await fetch(
              `${publicRuntimeConfig.BackEnd}order/${customerId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.ok) {
              const responseData = await response.json();
              if (responseData && responseData.data) {
                console.log(responseData.data);
                setCustomerData(responseData.data);
                setCurrentPosition([responseData.data.latitude, responseData.data.longitude]);
                setMarkerPosition([responseData.data.latitude, responseData.data.longitude])
                setTextFieldValue({...responseData.data})
              } else {
                console.error("Invalid data format from API");
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

      fetchData();
    }
  }, [customerId]);




  const handleUpdateCustomerList: React.MouseEventHandler<
    HTMLAnchorElement
  > = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");

    const requestData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer_name: customerData.customer_name,
        name: customerData.name,
        detail: customerData.detail,
        address: textFieldValue.address,
        latitude: textFieldValue.latitude,
        longitude: textFieldValue.longitude,
      }),
    };

    try {
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}order/${customerId}`, // Adjust the endpoint
          requestData
        );
        const responseData = await response.json();
        if (response.ok) {
          console.log("Order updated successfully!");
          console.log(responseData.data);
          router.back();
        } else if (response.status === 401) {
          console.log("Token expired or invalid");
          localStorage.removeItem("accessToken");
        } else {
          console.error("Order update failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!customerId) {
    return <div>Loading...</div>;
  }

  // const customIcon = new L.Icon({
  //   iconUrl: "/marker.svg",
  //   iconSize: [32, 32],
  //   iconAnchor: [16, 32],
  //   popupAnchor: [0, -32],
  // });

  type LatLngTuple = [number, number];

  // const currentRoute = router.pathname;

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
      setCurrentPosition([newPosition.lat, newPosition.lng]);
    } catch (error) {
      console.error("Error fetching reverse geocoding:", error);
    }
  };

  const updateTextFieldValue = (newPosition: L.LatLng, address: string) => {
    const latitude = newPosition.lat.toFixed(6);
    const longitude = newPosition.lng.toFixed(6);
    setTextFieldValue({ latitude, longitude, address });
  };

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
              <CardHeader title="Edit Order" />
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
                        value={customerData.customer_name}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            customer_name: e.target.value,
                          })
                        }
                      />

                      <TextField
                        required
                        id="name"
                        label="Order Name"
                        value={customerData.name}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            name: e.target.value,
                          })
                        }
                      />

                      <TextField
                        required
                        id="detail"
                        label="Details"
                        value={customerData.detail}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            detail: e.target.value,
                          })
                        }
                      />
                      <TextField
                        required
                        id="address"
                        label="Address"
                        value={textFieldValue.address}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            address: e.target.value,
                          })
                        }
                      />

                      <TextField
                        required
                        id="latitude"
                        label="Latitude"
                        value={textFieldValue.latitude}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            latitude: e.target.value,
                          })
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                      />

                      <TextField
                        required
                        id="longitude"
                        label="Longitude"
                        value={textFieldValue.longitude}
                        onChange={(e) =>
                          setCustomerData({
                            ...customerData,
                            longitude: e.target.value,
                          })
                        }
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
                      {currentPosition ? (
                        <MapContainer
                          center={currentPosition}
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
                      ) : (
                        <p>Loading map...</p>
                      )}
                    </div>
                  </Grid>
                  <Grid container justifyContent="flex-end" className="mt-5">
                    <Button
                      variant="contained"
                      sx={{ margin: 1 }}
                      disableRipple
                      component="a"
                      onClick={handleUpdateCustomerList}
                    >
                      Update{""}
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
};

export default EditCustomerList;

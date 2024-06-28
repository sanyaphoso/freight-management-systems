import { FC, ChangeEvent, useState, useEffect } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import Label from "@/components/Label";
import { useRouter } from "next/router";
import { Order, OrderStatus } from "@/model/logistic/order";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { LatLngTuple } from "leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { LatLngExpression, icon } from "leaflet";
import React from "react";
import getConfig from "next/config";
import { SelectChangeEvent } from "@mui/material/Select";

const { publicRuntimeConfig } = getConfig();

interface RecentOrdersTableProps {
  className?: string;
  cryptoOrders: Order[];
}

interface Filters {
  status?: OrderStatus;
}

interface RoutingMachineProps {
  routeCoords: LatLngExpression[][];
}

interface TrackingOrder {
  orders: Order[];
}

const customIcon = new L.Icon({
  iconUrl: "/management/location.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const getStatusLabel = (orderStatus: string): JSX.Element => {
  const map: Record<string, { text: string; color: "error" | "success" | "warning" | "black" | "primary" | "secondary" | "info" }> = {
    pending: {
      text: "pending",
      color: "error",
    },
    success: {
      text: "success",
      color: "success",
    },
    in_progress: {
      text: "in_progress",
      color: "warning",
    },
  };

  const { text, color }: { text: string; color: "error" | "success" | "warning" | "black" | "primary" | "secondary" | "info" } = map[orderStatus] || { text: '', color: '' };
  return <Label color={color}>{text}</Label>;
};

const applyFilters = (cryptoOrders: Order[], filters: Filters): Order[] => {
  return cryptoOrders.filter((cryptoOrder) => {
    let matches = true;

    if (filters.status && cryptoOrder.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  cryptoOrders: Order[],
  page: number,
  limit: number
): Order[] => {
  return cryptoOrders.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ cryptoOrders }) => {
  const router = useRouter();
  const { trackingID } = router.query;
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({});
  const [trackingOrders, setTrackingOrders] = useState<TrackingOrder>({
    orders: [],
  });
  const [routeCoords, setRouteCoords] = useState<LatLngExpression[][]>([]);

  useEffect(() => {
    if (trackingID) {
      console.log(trackingID);
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (token) {
            const response = await fetch(
              `${publicRuntimeConfig.BackEnd}order-group/${trackingID}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.ok) {
              const responseData = await response.json();
              console.log("data", responseData.data);
              setTrackingOrders(responseData.data);
              console.log("dataset", trackingOrders);
              setRouteCoords(responseData.data.node.route_coords);
              console.log("routeCoords", routeCoords);

              if (
                responseData &&
                responseData.data &&
                Array.isArray(responseData.data)
              ) {
                console.log("data", responseData.data);
                setTrackingOrders(responseData.data);
              } else {
                console.error("Invalid data format from API");
              }
            } else if (response.status === 401) {
              // Token หมดอายุหรือไม่ถูกต้อง
              console.log("Token expired or invalid");
              // ทำการลบ token ที่หมดอายุจาก localStorage
              localStorage.removeItem("accessToken");
            } else {
              console.error("Failed to fetch orders");
            }
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchData();
    }
  }, [trackingID, setRouteCoords]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCryptoOrders = applyFilters(cryptoOrders, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < cryptoOrders.length;
  const selectedAllCryptoOrders =
    selectedCryptoOrders.length === cryptoOrders.length;
  const theme = useTheme();

  const colors = ["blue", "red", "green", "orange", "purple"];
  const markerIcon = icon({
    iconUrl: "/management/marker-icon.svg",
    iconSize: [41, 41],
    iconAnchor: [20, 41],
    popupAnchor: [1, -34],
  });

  const markerStart = icon({
    iconUrl: "/management/location_icon.svg",
    iconSize: [32, 32],
    iconAnchor: [20, 41],
    popupAnchor: [1, -34],
  });

  const RoutingMachine: React.FC<RoutingMachineProps> = ({ routeCoords }) => {
    const map = useMap();

    useEffect(() => {
      if (map) {
        const control = L.Routing.control({
          waypoints: [
            L.latLng(13.745471504363191, 100.62317090481594), // First destination
            L.latLng(13.72887257810719, 100.77569625918126), // Second destination
          ],
        });
        control.addTo(map);

        return () => {
          map.removeControl(control);
        };
      }
    }, [map, routeCoords]);

    return null;
  };
  type OrderStatus = "pending" | "in_progress" | "success";

  const handleStatusChange = async (event: SelectChangeEvent, order: any) => {
    console.log("id", order);
    try {
      const newStatus = event.target.value as OrderStatus;
      const token = localStorage.getItem("accessToken");

      if (token) {
        let apiEndpoint = "";

        switch (newStatus) {
          case "in_progress":
            apiEndpoint = `${publicRuntimeConfig.BackEnd}order/in-progress/${order}`;
            break;
          case "success":
            apiEndpoint = `${publicRuntimeConfig.BackEnd}order/success/${order}`;
            break;
          default:
            break;
        }

        if (apiEndpoint) {
          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          });

          if (response.ok) {
            // Handle success
            console.log(`Order ${order} status updated to ${newStatus}`);
            router.reload();
          } else {
            // Handle failure
            console.error("Failed to update order status");
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoBack = () => {
    router.back();
  };




  return (
    <Card>
      <div style={{ margin: "15px" }}>
        <MapContainer
          center={[13.7957701,100.7068413]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {routeCoords?.map((latlng, index) => {
            return (
              <React.Fragment key={index}>
                <Polyline
                  positions={latlng}
                  color={colors[index % colors.length]}
                />
                {index === 0 && (
                  <Marker position={latlng[0]} icon={markerStart}>
                    <Popup>Start of Route {index + 1}</Popup>
                  </Marker>
                )}
                <Marker position={latlng[latlng.length - 1]} icon={markerIcon}>
                  <Popup>End of Route {index + 1}</Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Customer</TableCell>
              <TableCell align="center">Adress</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trackingOrders.orders &&
              trackingOrders.orders.map((order: any, index: any) => {
                const isCryptoOrderSelected = selectedCryptoOrders.includes(
                  order.id
                );
                return (
                  <TableRow
                    hover
                    key={order.id}
                    selected={isCryptoOrderSelected}
                  >
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {order.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {order.customer_name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {order.address
                          .split(",")
                          .slice(0, 2)
                          .map((line: any, index: any) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {order.update_at
                          ? format(new Date(order.update_at), "yyyy-MM-dd")
                          : ""}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <FormControl>
                        <Select
                          value={order.status}
                          onChange={(event) => {
                            if (order.id) {
                              handleStatusChange(event, order.id);
                            }
                          }}
                        >
                          <MenuItem value="pending">{getStatusLabel("pending")}</MenuItem>
                          <MenuItem value="in_progress">{getStatusLabel("in_progress")}</MenuItem>
                          <MenuItem value="success">{getStatusLabel("success")}</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredCryptoOrders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
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
      {/* Popup สำหรับการ สรุปรายการ */}
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired,
};

RecentOrdersTable.defaultProps = {
  cryptoOrders: [],
};

export default RecentOrdersTable;

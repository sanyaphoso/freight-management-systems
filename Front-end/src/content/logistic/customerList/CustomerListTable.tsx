import { FC, ChangeEvent, useState, useEffect } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
} from "@mui/material";

import Label from "@/components/Label";
import { Customer, CustomerStatus } from "@/model/logistic/customer";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import BulkActions from "./BulkActions";
import { SelectChangeEvent } from "@mui/material/Select";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const currentDate = new Date();

interface RecentCustomerTableProps {
  className?: string;
  Customers: Customer[];
}

interface Filters {
  status?: CustomerStatus;
}

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

const applyFilters = (Customers: Customer[], filters: Filters): Customer[] => {
  return Customers.filter((Customer) => {
    let matches = true;

    if (filters.status && Customer.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  Customers: Customer[],
  page: number,
  limit: number
): Customer[] => {
  return Customers.slice(page * limit, page * limit + limit);
};

const RecentCustomerTable: FC<RecentCustomerTableProps> = ({
}) => {
  const router = useRouter();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const selectedBulkActions = selectedCustomers.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: undefined,
  });
  const [trackOrders, setCustomerList] = useState<any[]>([]);
  const [routeNode, setRouteNode] = useState<any[]>([]);

  const functionGroupOrderbyId = async (): Promise<void> => {
    try {
      if (selectedCustomers.length > 0) {
        const latitudeValues = selectedCustomers.map((trackingId) => {
          const trackingOrder = trackOrders.find(
            (order) => order.id === trackingId
          );
          return trackingOrder.latitude;
        });
        const longitudeValues = selectedCustomers.map((trackingId) => {
          const trackingOrder = trackOrders.find(
            (order) => order.id === trackingId
          );
          return trackingOrder.longitude;
        });

        const newLatitude = 13.7957701;
        const newLongitude = 100.7068413;
        const updatedLatitudeValues = [newLatitude,...latitudeValues];
        const updatedLongitudeValues = [newLongitude,...longitudeValues];
        const concatenatedUpdatedLatitude = updatedLatitudeValues.join(",");
        const concatenatedUpdatedLongitude = updatedLongitudeValues.join(",");

        console.log("Updated Latitude", concatenatedUpdatedLatitude);
        console.log("Updated Longitude", concatenatedUpdatedLongitude);

        // const concatenatedLatitude = latitudeValues.join(",");
        // const concatenatedLongitude = longitudeValues.join(",");
        // console.log("Latitude", concatenatedLatitude);
        // console.log("Longitude", concatenatedLongitude);

        const orderGroupIds = selectedCustomers.join(",");
        console.log("groupId", orderGroupIds);
        const formDataToSend = new FormData();
        formDataToSend.append("latitude", concatenatedUpdatedLatitude);
        formDataToSend.append("longitude", concatenatedUpdatedLongitude);

        const responseNode = await fetch(
          `${publicRuntimeConfig.Routing}/get_route`,
          {
            method: "POST",
            headers: {
              // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formDataToSend,
          }
        );

        console.log("Response from server:", responseNode);
        if (responseNode.ok) {
          const responseNodeData = await responseNode.json();
          console.log("Node created successfully:", responseNodeData);
          router.reload();
          const response = await fetch(
            `${publicRuntimeConfig.BackEnd}order-group`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({
                orders_ids: orderGroupIds,
                node: responseNodeData,
                // coordinates: coordinates,
              }),
            }
          );

          if (response.ok) {
            const responseData = await response.json();
            console.log("Order group created successfully:", responseData);
            setCustomerList((prevCustomerList) => {
              const updatedList = prevCustomerList.map((order) => {
                if (selectedCustomers.includes(order.id)) {
                  return {
                    ...order,
                    orderGroup_id: responseData.orderGroup_id,
                  };
                }
                return order;
              });
              return updatedList;
            });
            setSelectedCustomers([]);
            console.log("Selected orders grouped successfully!");
          } else {
            console.error("Failed to group orders:", response.statusText);
          }
          console.log("Selected orders grouped successfully!");
        } else {
          console.error("Failed to Node:", responseNode.statusText);
        }
      } else {
        console.log("No orders selected for grouping.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeMenu = (): void => {
    // Define the closeMenu function
    // You can implement the logic to close the menu here
    // For example, set a state variable to control the menu's open state
  };

  const handleDeleteAllSelected = (): void => {
    // Implement the logic to delete selected items
    selectedCustomers.forEach((trackingId) => {
      handleDeleteCustomerList(trackingId);
    });

    // Clear the selection after deletion
    setSelectedCustomers([]);
  };

  //API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await fetch(`${publicRuntimeConfig.BackEnd}order`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const responseData = await response.json();
            if (
              responseData &&
              responseData.data &&
              Array.isArray(responseData.data)
            ) {
              const filteredData = responseData.data.filter(
                (item: any) => item.orders_group_id == null
              );
              setCustomerList(filteredData);
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
  }, []);

  const handleDeleteCustomerList = async (customerId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}order/${customerId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          // ดำเนินการหลังจากการลบ Unit สำเร็จ
          console.log(`Unit with ID ${customerId} deleted successfully!`);

          // ทำการรีเฟรชหน้าหลังจากการลบข้อมูล (เพื่อดึงข้อมูลใหม่)
          router.reload();
        } else if (response.status === 401) {
          // Token หมดอายุหรือไม่ถูกต้อง
          console.log("Token expired or invalid");
          // ทำการลบ token ที่หมดอายุจาก localStorage
          localStorage.removeItem("accessToken");
        } else {
          // ถ้าการลบ Unit ไม่สำเร็จ
          console.error(`Failed to delete Unit with ID ${customerId}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const statusOptions = [
    {
      id: "all",
      name: "All",
    },
    {
      id: "pending",
      name: "pending",
    },
    {
      id: "in_progress",
      name: "in_progress",
    },
    {
      id: "success",
      name: "success",
    },
  ];

  const handleStatusChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | SelectChangeEvent<"completed" | "pending" | "failed" | "all">
  ): void => {
    let value: any;

    if ("target" in e) {
      if (e.target.value !== "all") {
        value = e.target.value;
      }
    } else {
      if (e !== "all") {
        value = e;
      }
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const handleSelectAllCustomers = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCustomers(
      event.target.checked
        ? trackOrders.map((CustomerOrder) => CustomerOrder.id)
        : []
    );
  };

  const handleSelectOneCustomer = (
    _event: ChangeEvent<HTMLInputElement>,
    CustomerId: string
  ): void => {
    if (!selectedCustomers.includes(CustomerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, CustomerId]);
    } else {
      setSelectedCustomers((prevSelected) =>
        prevSelected.filter((id) => id !== CustomerId)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCustomers = applyFilters(trackOrders, filters);
  const paginatedCustomers = applyPagination(filteredCustomers, page, limit);
  const selectedSomeCustomers =
    selectedCustomers.length > 0 &&
    selectedCustomers.length < trackOrders.length;
  const selectedAllCustomers = selectedCustomers.length === trackOrders.length;
  const theme = useTheme();

  const trackingStatusToString = (status: CustomerStatus | undefined): string => {
    return status || ""; // Convert undefined to an empty string
  };

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions
            onDeleteSelected={handleDeleteAllSelected}
            onCloseMenu={closeMenu}
            onGroupOrder={functionGroupOrderbyId}
          />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || "all"}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>

                
              </FormControl>
            </Box>
          }
          title="Customer Lists"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" align="center">
                <Checkbox
                  color="primary"
                  checked={selectedAllCustomers}
                  indeterminate={selectedSomeCustomers}
                  onChange={handleSelectAllCustomers}
                />
              </TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Customer</TableCell>
              <TableCell align="center">Detail</TableCell>
              {/* <TableCell align="center">Date</TableCell> */}
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((CustomerOrder) => {
              const isCustomerSelected = selectedCustomers.includes(
                CustomerOrder.id
              );
              return (
                <TableRow
                  hover
                  key={CustomerOrder.id}
                  selected={isCustomerSelected}
                >
                  <TableCell padding="checkbox" align="center">
                    <Checkbox
                      color="primary"
                      checked={isCustomerSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCustomer(event, CustomerOrder.id)
                      }
                      value={isCustomerSelected}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {CustomerOrder.id}
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
                      {CustomerOrder.name}
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
                      {CustomerOrder.customer_name}
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
                      {CustomerOrder.detail}
                    </Typography>
                  </TableCell>
                  {/* <TableCell align="center">
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {format(currentDate, "yyyy-MM-dd")}
                    </Typography>
                  </TableCell> */}
                  <TableCell align="center">
                    {getStatusLabel(CustomerOrder.status)}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View" arrow>
                      <IconButton
                        sx={{
                          "&:hover": {
                            background: theme.colors.info.lighter,
                          },
                          color: theme.palette.info.main,
                        }}
                        onClick={() => {
                          router.push(
                            `/logistic/customerList/info/${CustomerOrder.id}`
                          );
                        }}
                        color="inherit"
                        size="small"
                      >
                        <VisibilityTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        sx={{
                          "&:hover": {
                            background: theme.colors.primary.lighter,
                          },
                          color: theme.palette.primary.main,
                        }}
                        onClick={() =>
                          router.push(
                            `/logistic/customerList/edit/${CustomerOrder.id}`
                          )
                        }
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        sx={{
                          "&:hover": { background: theme.colors.error.lighter },
                          color: theme.palette.error.main,
                        }}
                        color="inherit"
                        size="small"
                        onClick={() =>
                          handleDeleteCustomerList(CustomerOrder.id)
                        }
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
          count={filteredCustomers.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

export default RecentCustomerTable;

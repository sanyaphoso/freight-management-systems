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
  TextField,
  Button,
  styled,
} from "@mui/material";

import Label from "@/components/Label";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import BulkActions from "./BulkActions";
import { Tracking, TrackingStatus } from "@/model/logistic/tracking";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { SelectChangeEvent } from "@mui/material/Select";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

interface RecentOrdersTableProps {
  className?: string;
  cryptoOrders: Tracking[];
}

interface Filters {
  status?: TrackingStatus;
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


const applyFilters = (
  cryptoOrders: Tracking[],
  filters: Filters
): Tracking[] => {
  return cryptoOrders.filter((cryptoOrder) => {
    let matches = true;

    if (filters.status && cryptoOrder.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  cryptoOrders: Tracking[],
  page: number,
  limit: number
): Tracking[] => {
  return cryptoOrders.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ cryptoOrders }) => {
  // fuction for modal

  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("pdf");
  const [trackingOrders, setTrackingOrders] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await fetch(`${publicRuntimeConfig.BackEnd}order-group`, {
            method: "GET",
            headers: {
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
              console.log("data", responseData.data);
              setTrackingOrders(responseData.data);
              responseData.data.forEach((orderGroup: any) => {
                checkOrderStatus(orderGroup.id);
              });
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
  

  const handleExportClick = () => {
    // ตรวจสอบว่ามีรายการที่ถูกเลือกหรือไม่
    if (selectedReports.length === 0) {
      // แสดง popup แจ้งเตือนเมื่อไม่มีรายการที่ถูกเลือก
      alert("Please select items to export.");
      return;
    }
    // เปิด popup สำหรับการ Export
    setShowExportModal(true);
  };

  const handleCloseModal = () => {
    // ปิด popup สำหรับการ Export
    setShowExportModal(false);
  };

  const router = useRouter();
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: undefined,
  });

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
      // กรณี SelectChangeEvent
      if (e !== "all") {
        value = e;
      }
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? cryptoOrders.map((cryptoOrder) => cryptoOrder.id)
        : []
    );
  };

  const handleSelectOneCryptoOrder = (
    _event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId,
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

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

  //stepper const
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = ["pending", "in_progress", "success"]; // Add your own step names
  const TransparentStepper = styled(Stepper)({
    background: "transparent", // Set the background to transparent
  });

  const getStepFromStatus = (status: string): number => {
    const statusToStepMap: Record<string, number> = {
      pending: 0,
      in_progress: 1,
      success: 4,
      // Add more mappings if needed
    };
  
    return statusToStepMap[status] || 0; // Default to 0 if status is not found
  };

  const checkOrderStatus = async (orderGroupId: any) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await fetch(`${publicRuntimeConfig.BackEnd}order-group/${orderGroupId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          if (
            responseData &&
            responseData.data &&
            Array.isArray(responseData.data.orders)
          ) {
            const allOrdersInProgress = responseData.data.orders.every(
              (order: Tracking) => order.status === 'in_progress'
            );
            
            const allOrdersSuccess = responseData.data.orders.every(
              (order: Tracking) => order.status === 'success'
            );
            
            

  
            if (allOrdersInProgress) {
              await fetch(`${publicRuntimeConfig.BackEnd}order-group/in-progress/${orderGroupId}`, {
                method: "POST", // Or the appropriate HTTP method for your API
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            }
            if (allOrdersSuccess) {
              await fetch(`${publicRuntimeConfig.BackEnd}order-group/success/${orderGroupId}`, {
                method: "POST", // Or the appropriate HTTP method for your API
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            }
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
  
  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions
            Tracks={paginatedCryptoOrders.filter((value) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                value.id
              );
              return isCryptoOrderSelected;
            })}
          />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              {/* <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || "all"}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                  onClose={() => {
                    // Handle the dropdown close event
                    // เปิด Modal สำหรับการสรุปรายการ (Summary List Modal) เมื่อคลิก "Add"
                    setShowExportModal(false);
                  }}
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
            </Box>
          }
          title="Tracking Status"
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
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                />
              </TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center" sx={{ width: "480px" }}>
                Details
              </TableCell>
              <TableCell align="center">Distance</TableCell>
              <TableCell align="center">Time</TableCell>
              {/* <TableCell align="center">Date</TableCell> */}
              {/* <TableCell align="center">Status</TableCell> */}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trackingOrders.map((orderGroup: any) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                orderGroup.id
              );
              return (
                <TableRow
                  hover
                  key={orderGroup.id}
                  selected={isCryptoOrderSelected}
                >
                  <TableCell padding="checkbox" align="center">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, orderGroup.id)
                      }
                      value={isCryptoOrderSelected}
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
                      {orderGroup.id}
                    </Typography>
                  </TableCell>
                    <TableCell align="center">
                      <TransparentStepper activeStep={getStepFromStatus(orderGroup.status)} alternativeLabel>
                        {steps.map((label, index) => (
                          <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </TransparentStepper>
                    </TableCell>
                    <TableCell align="center">
                    <Typography variant="body1" color="text.primary" noWrap>
                      {orderGroup.node.route_length > 0
                        ? orderGroup.node.route_length > 1000
                          ? (orderGroup.node.route_length / 1000).toFixed(2) +
                            " km"
                          : orderGroup.node.route_length + " m"
                        : "0 km"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" color="text.primary" noWrap>
                      {orderGroup.node.route_time > 0
                        ? orderGroup.node.route_time > 1000
                          ? (orderGroup.node.route_time / 60).toFixed(2) +
                            "min"
                          : orderGroup.node.route_time + " m"
                        : "0 min"}
                    </Typography>
                  </TableCell>
                  {/* <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {orderGroup.created_at
                        ? format(new Date(orderGroup.created_at), "yyyy-MM-dd")
                        : ""}
                    </Typography>
                  </TableCell> */}
                  {/* <TableCell align="center">
                    {getStatusLabel(orderGroup.status)}
                  </TableCell> */}
                  <TableCell align="center">
                    <Tooltip title="View" arrow>
                      <IconButton
                        sx={{
                          "&:hover": {
                            background: theme.colors.info.lighter,
                          },
                          color: theme.palette.info.main,
                        }}
                        onClick={() => router.push(`/logistic/tracking/info/${orderGroup.id}`)}
                        color="inherit"
                        size="small"
                      >
                        <VisibilityTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Edit" arrow>
                      <IconButton
                        sx={{
                          "&:hover": {
                            background: theme.colors.primary.lighter,
                          },
                          color: theme.palette.primary.main,
                        }}
                        onClick={() =>
                          router.push("/logistic/customerList/EditCustomerList")
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
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip> */}
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

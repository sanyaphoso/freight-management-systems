import { FC, ChangeEvent, useState, useEffect } from "react";
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
  Button,
  Modal,
  TextField,
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

// import { CryptoOrder, CryptoOrderStatus } from '@/model/setup/shelf';
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import BulkActions from "./BulkActions";
import { useRouter } from "next/router";
import getConfig from "next/config";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns";

const { publicRuntimeConfig } = getConfig();

// interface RecentOrdersTableProps {
//   className?: string;
//   cryptoOrders: CryptoOrder[];
// }

interface Filters {
  status?: any;
}
interface CryptoOrder {
  id: string;
  name: string;
  detail: string;
  unit_id: string;
  floor_id: string;
  material_id: string; // Add this property to CryptoOrder
  type: string;  // Ensure 'type' is present with a default value
  amount: string; 
  update_by: string; 
  created_at: string; 
}

const applyFilters = (orders: any[], filters: Filters) => {
  return orders.filter((order) => {
    let matches = true;

    if (filters.status && order.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (orders: any[], page: number, limit: number) => {
  const startIndex = page * limit;
  return orders.slice(startIndex, startIndex + limit);
};

interface User {
  id: string; // หรือชนิดข้อมูลที่ 'id' เป็น
  full_name: string; // หรือชนิดข้อมูลที่ 'full_name' เป็น
}
interface Material {
  label: string; // Add any other properties you need for Material
}

interface Materials {
  [key: string]: Material;
}

const RecentOrdersTable: FC = () => {
  const router = useRouter();
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null,
  });
  const [cryptoOrders, setCryptoOrders] = useState<CryptoOrder[]>([]);
  const [materials, setMaterials] = useState<Materials>({});
  const [unitData, setUnitData] = useState<CryptoOrder[]>([]);
  const [floorData, setFloorData] = useState<CryptoOrder[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});

  // Export
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("pdf");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await fetch(
            `${publicRuntimeConfig.BackEnd}material-history`,
            {
              method: "GET", // หรือ 'GET', 'PUT', 'DELETE' ตามที่ต้องการ
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const responseMaterial = await fetch(
            `${publicRuntimeConfig.BackEnd}material`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const responseUser = await fetch(
            `${publicRuntimeConfig.BackEnd}users/user-info`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok && responseMaterial.ok && responseUser.ok) {
            const responseData = await response.json();
            const responseDataMaterial = await responseMaterial.json();
            const responseDataUser = await responseUser.json();
            console.log("User", responseDataUser);

            console.log("UserChack", users);
            if (
              responseData &&
              responseData.data &&
              Array.isArray(responseData.data)
            ) {
              setCryptoOrders(responseData.data);
              setUsers(responseDataUser.data);
              setMaterials(
                responseDataMaterial.data.reduce((acc: any, material: any) => {
                  acc[material.id] = {
                    value: material.id,
                    label: material.name,
                  };
                  return acc;
                }, {})
              );
              // setUsers(
              //   responseDataUser.data.reduce((acc, user) => {
              //     acc[user.id] = { id: user.id, full_name: user.full_name };
              //     return acc;
              //   }, {})
              // );
              // console.log('Update By:', cryptoOrder.update_by);
              // console.log('User Data for Update By:', users[cryptoOrder.update_by]);

              console.error("Invalid data format from API");
            }
          } else if (response.status === 401) {
            // Token หมดอายุหรือไม่ถูกต้อง
            console.log("Token expired or invalid");
            // ทำการลบ token ที่หมดอายุจาก localStorage
            localStorage.removeItem("accessToken");
          } else {
            console.error("Failed to fetch crypto orders");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    console.log("Chack", users);
    fetchData(); // เรียก fetchData เมื่อ Component ถูก Mount
  }, []);

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

  const ordersToExport = selectedCryptoOrders.map((orderId) =>
    cryptoOrders.find((order) => order.id === orderId)
  );
  const filteredCryptoOrders = applyFilters(
    selectedCryptoOrders.length > 0 ? ordersToExport : cryptoOrders,
    filters
  );
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

  const handleExportClick = () => {
    // ตรวจสอบว่ามีรายการที่ถูกเลือกหรือไม่
    if (selectedCryptoOrders.length === 0) {
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

  const handleExportConfirm = async () => {
    // Use the original cryptoOrders array for exporting
    const ordersToExport = selectedCryptoOrders.map((orderId) =>
      cryptoOrders.find((order) => order.id === orderId)
    );

    if (fileType === "xlsx") {
      // Create Workbook and add rows
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("MaterialList");
      worksheet.addRow([
        "No",
        "ID",
        "Material",
        "Detail",
        "Amount",
        "Date",
      ]);

      const dataForExcel = ordersToExport.map((cryptoOrder, index) => {
        if (!cryptoOrder) {
          return []; // Skip this entry if cryptoOrder is undefined
        }
      
        const {
          id = "",
          material_id = "",
          type = "", // Ensure 'type' is present with a default value
          amount = "",
          created_at,
        } = cryptoOrder;
      
        return [
          index + 1,
          id,
          materials[material_id]?.label || "N/A",
          type,
          amount,
          created_at ? format(new Date(created_at), "yyyy-MM-dd") : "",
        ];
      });
      

      worksheet.addRows(dataForExcel);

      // Write Excel file
      workbook.xlsx.writeBuffer().then((buffer) => {
        const excelBlob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(excelBlob, `${fileName}.xlsx`);
        setShowExportModal(false);
      });
    } else if (fileType === "csv") {
      // Create CSV content
      const csvContent = [
        "ID,Material,Detail,Amount,Update by,Date",
        ...ordersToExport.map((cryptoOrder) => [
          cryptoOrder?.id ?? "",
          materials[cryptoOrder?.material_id ?? ""]?.label ?? "N/A",
          cryptoOrder?.type ?? "",
          cryptoOrder?.amount ?? "",
          cryptoOrder?.created_at
            ? format(new Date(cryptoOrder.created_at), "yyyy-MM-dd")
            : "",
        ].join(',')),
      ].join('\n');
      
      

      // Save CSV file
      const csvBlob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8",
      });
      saveAs(csvBlob, `${fileName}.csv`);
      setShowExportModal(false);
    }

    return null;
  };

  return (
    <Card>
      <CardHeader
        title="History"
        action={
          <Button
            variant="contained"
            component="a"
            sx={{ margin: 1 }}
            disableRipple
            onClick={handleExportClick}
          >
            Export
          </Button>
        }
      />
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
              <TableCell align="center">Material</TableCell>
              <TableCell align="center">Detail</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Update by</TableCell>
              <TableCell align="center">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCryptoOrders.map((cryptoOrder) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                cryptoOrder.id
              );
              return (
                <TableRow
                  hover
                  key={cryptoOrder.id}
                  selected={isCryptoOrderSelected}
                >
                  <TableCell padding="checkbox" align="center">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, cryptoOrder.id)
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
                      {cryptoOrder.id}
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
                      {/* ใช้ material_id ใน cryptoOrder เพื่อดึงข้อมูลวัสดุจาก materials */}
                      {materials[cryptoOrder.material_id]?.label || "N/A"}
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
                      {cryptoOrder.type}
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
                      {cryptoOrder.amount}
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
                      {String(users.full_name)}
                      {/* {users[cryptoOrder.update_by]?.full_name || 'N/A'} */}
                      {/* {users[cryptoOrder.update_by]?.name || 'N/A'} */}
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
                      {cryptoOrder.created_at
                        ? format(new Date(cryptoOrder.created_at), "yyyy-MM-dd")
                        : ""}
                    </Typography>
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
      {/* Popup สำหรับการ Export */}
      <Modal
        open={showExportModal}
        onClose={handleCloseModal}
        aria-labelledby="export-modal-title"
        aria-describedby="export-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500, // เพิ่มความกว้างให้พอดีกับ PDFViewer
            height: 300, // เพิ่มความสูงให้พอดีกับ PDFViewer
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="export-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
            className="mb-5"
          >
            Export Data
          </Typography>
          <TextField
            label="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="file-type-label">File Type</InputLabel>
            <Select
              labelId="file-type-label"
              id="file-type-select"
              value={fileType}
              label="File Type"
              onChange={(e) => setFileType(e.target.value as string)}
            >
              <MenuItem value="xlsx">xlsx</MenuItem>
              <MenuItem value="csv">csv</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              component="a"
              disableRipple
              className="mr-5"
              onClick={handleExportConfirm}
            >
              Export
            </Button>
            <Button
              variant="contained"
              component="a"
              disableRipple
              color="error"
              onClick={handleCloseModal}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
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

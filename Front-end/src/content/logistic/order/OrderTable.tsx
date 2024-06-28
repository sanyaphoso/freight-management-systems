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
} from "@mui/material";

import Label from "@/components/Label";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { useRouter } from "next/router";
import BulkActions from "./BulkActions";
import Modal from "@mui/material/Modal";
import { Order, OrderStatus } from "@/model/logistic/order";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { SelectChangeEvent } from "@mui/material/Select";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

interface RecentOrdersTableProps {
  className?: string;
  cryptoOrders: Order[];
}

interface Filters {
  status?: OrderStatus;
}

interface CryptoOrder {
  id: string;
  name: string;
  detail: string;
  unit_id: string;
  floor_id: string;
}

interface GroupOrder {
  orders: Order[];
}

const getStatusLabel = (orderStatus: string): JSX.Element => {
  const map: Record<
    string,
    {
      text: string;
      color:
        | "error"
        | "success"
        | "warning"
        | "black"
        | "primary"
        | "secondary"
        | "info";
    }
  > = {
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

  const {
    text,
    color,
  }: {
    text: string;
    color:
      | "error"
      | "success"
      | "warning"
      | "black"
      | "primary"
      | "secondary"
      | "info";
  } = map[orderStatus] || { text: "", color: "" };
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
  // fuction for modal

  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("pdf");
  const [paginatedReports, setPaginatedReports] = useState<any[]>([]);
  const [groupOrders, setGroupOrders] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await fetch(
            `${publicRuntimeConfig.BackEnd}order-group`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const responseData = await response.json();
            if (
              responseData &&
              responseData.data &&
              Array.isArray(responseData.data)
            ) {
              console.log("data", responseData.data);
              setGroupOrders(responseData.data);
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

  const handleExportConfirm = () => {
    // ถ้าเลือก Export เป็น Excel
    if (fileType === "excel") {
      // สร้างชุดข้อมูลสำหรับ Excel
      const dataForExcel = paginatedReports.map((report: any) => {
        return {
          "Material ID": report.orderDetails,
          "Material Name": report.orderID,
          Category: report.sourceName,
          Unit: report.unit,
          Shelf: report.shelf,
          Floor: report.floor,
        };
      });

      // สร้าง Workbook ของ Excel
      const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
      // Merge เซลล์ A1 ถึง F1 เพื่อใส่หัวข้อ
      worksheet["!merges"] = [
        // สร้างการ Merge ให้กับเซลล์ A1 ถึง F1
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // A1:F1
      ];

      // กำหนดข้อความลงในเซลล์ A1 ให้เป็น "Material List"
      const headerStyle = {
        font: { bold: true },
        alignment: { horizontal: "center" },
      };

      worksheet["A1"].s = headerStyle;
      worksheet["A1"].v = "Material List";

      // ใส่ข้อมูลลงในเซลล์ใน Worksheet และกำหนดรูปแบบให้กับหัวเรื่อง
      worksheet["A2"].s = headerStyle;
      worksheet["A2"].v = "Material ID";

      worksheet["B2"].s = headerStyle;
      worksheet["B2"].v = "Material Name";

      worksheet["C2"].s = headerStyle;
      worksheet["C2"].v = "Category";

      worksheet["D2"].s = headerStyle;
      worksheet["D2"].v = "Unit";

      worksheet["E2"].s = headerStyle;
      worksheet["E2"].v = "Shelf";

      worksheet["F2"].s = headerStyle;
      worksheet["F2"].v = "Floor";

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "MaterialList");

      // แปลง Workbook ให้เป็นไฟล์ Excel
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const excelBlob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      // ดาวน์โหลดไฟล์ Excel
      saveAs(excelBlob, `${fileName}.xlsx`);
      setShowExportModal(false); // ปิด popup หลังจากดาวน์โหลด
    } else if (fileType === "pdf") {
      const generatePDF = () => {
        // ลงทะเบียนฟอนต์
        // Font.register({
        //   family: 'AngsanaNew', // ตั้งชื่อฟอนต์ที่คุณต้องการให้แสดงผล
        //   src: AngsanaNew, // ใช้ path ของฟอนต์ที่คุณนำเข้ามา
        // });

        const doc = new jsPDF();
        let verticalOffset = 10;

        paginatedReports.forEach((report) => {
          // <Text style={{ fontFamily: 'AngsanaNew' }}>Text with your custom font</Text>
          doc.text(report.orderDetails, 10, verticalOffset);
          doc.text(report.orderID, 10, verticalOffset + 10);
          // ... (add other content)
          verticalOffset += 20;
        });

        doc.save(`${fileName}.pdf`);
        setShowExportModal(false); // ปิด popup หลังจากดาวน์โหลด
      };

      generatePDF();
    }

    return null; // Return null or any other fallback if fileType is not 'pdf'
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

  const handleDeleteCustomerList = async (groupId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await fetch(
          `${publicRuntimeConfig.BackEnd}order-group/${groupId}`,
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
          console.log(`Unit with ID ${groupId} deleted successfully!`);

          // ทำการรีเฟรชหน้าหลังจากการลบข้อมูล (เพื่อดึงข้อมูลใหม่)
          // router.replace(router.asPath);
          router.reload();
        } else if (response.status === 401) {
          // Token หมดอายุหรือไม่ถูกต้อง
          console.log("Token expired or invalid");
          // ทำการลบ token ที่หมดอายุจาก localStorage
          localStorage.removeItem("accessToken");
        } else {
          // ถ้าการลบ Unit ไม่สำเร็จ
          console.error(`Failed to delete Unit with ID ${groupId}`);
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
            Orders={paginatedCryptoOrders.filter((value) => {
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
          title="Order Lists"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                />
              </TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Distance</TableCell>
              <TableCell align="center">Time</TableCell>
              {/* <TableCell align="center">Date</TableCell> */}
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupOrders.map((orderGroup: any) => {
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
                    <Typography variant="body1" color="text.primary" noWrap>
                      {orderGroup.orders
                        .map((order: any) => order.name)
                        .join(", ")}
                    </Typography>
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
                  <TableCell align="center">
                    {getStatusLabel(orderGroup.status)}
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
                        onClick={() =>
                          router.push(`/logistic/order/info/${orderGroup.id}`)
                        }
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
                          router.push(`/logistic/order/edit/${orderGroup.id}`)
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
                          handleDeleteCustomerList(orderGroup.id)
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
          count={filteredCryptoOrders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
      {/* Popup สำหรับการ สรุปรายการ */}
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
          {/* {pdfContent ? (
            <PDFViewer width={500} height={300}>
              {pdfContent}
            </PDFViewer>
          ) : (
            <Typography variant="body1">No content to display</Typography>
          )} */}
          {/* ส่วนอื่น ๆ ใน Modal */}
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
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
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

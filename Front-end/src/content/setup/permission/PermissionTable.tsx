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
// import { CryptoOrder, CryptoOrderStatus } from '@/model/setup/material';
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import BulkActions from "./BulkActions";
import { useRouter } from "next/router";
import getConfig from "next/config";

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

const PermissionTable: FC = () => {
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
  const [user, setUser] = useState([]);
  const [role, setRole] = useState([]);
  const [userRoles, setUserRoles] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchAllUsersInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          // Fetch all users
          const usersResponse = await fetch(
            `${publicRuntimeConfig.BackEnd}users/user`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log("Users data:", usersData);
            setCryptoOrders(usersData.data);

            // Iterate through each user
            for (const user of usersData.data) {
              // Fetch roles for each user
              const responseRole = await fetch(
                `${publicRuntimeConfig.BackEnd}role/role-user/${user.id}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (responseRole.ok) {
                const roleData = await responseRole.json();
                console.log(`Roles for user ${user.id}:`, roleData.data);
                // อัปเดต state userRoles โดยใช้ ID ของผู้ใช้เป็นคีย์
                setUserRoles((prevUserRoles) => ({
                  ...prevUserRoles,
                  [user.id]: roleData.data,
                }));
              } else {
                // Handle error when fetching user roles
                console.error(
                  `Error fetching Roles for user ${user.id}:`,
                  responseRole.statusText
                );
              }
            }
          } else if (usersResponse.status === 401) {
            // Token หมดอายุหรือไม่ถูกต้อง
            console.log("Token expired or invalid");
            // ทำการลบ token ที่หมดอายุจาก localStorage
            localStorage.removeItem("accessToken");
          } else {
            // Handle error when fetching user info
            console.error("Error fetching users:", usersResponse.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsersInfo();
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

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && <CardHeader title="User Lists" />}
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
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Actions</TableCell>
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
                      {cryptoOrder.full_name}
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
                      {userRoles[cryptoOrder.id] &&
                      userRoles[cryptoOrder.id].length > 0 ? (
                        <ul>
                          {userRoles[cryptoOrder.id].map((roleItem: any) => (
                            <li key={roleItem.id}>{roleItem.name}</li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </Typography>
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
                          router.push(`/setup/permission/info/${cryptoOrder.id}`)
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
                        color="inherit"
                        size="small"
                        onClick={() =>
                          router.push(`/setup/permission/edit/${cryptoOrder.id}`)
                        }
                      >
                        <EditTwoToneIcon fontSize="small" />
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
    </Card>
  );
};

PermissionTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired,
};

PermissionTable.defaultProps = {
  cryptoOrders: [],
};

export default PermissionTable;

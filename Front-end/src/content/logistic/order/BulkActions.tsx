
import { useState, useRef } from "react";

import {
  Box,
  Menu,
  IconButton,
  Button,
  ListItemText,
  ListItem,
  List,
  Typography,
  Modal,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import { format } from "date-fns";
import { Order, OrderStatus } from "@/model/logistic/order";

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

interface BulkActionsProps {
  Orders: Order[];
}

function BulkActions({ Orders }: BulkActionsProps) {
  const [onMenuOpen, menuOpen] = useState<boolean>(false);
  const [isBulkAddModalOpen, setBulkAddModalOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const moreRef = useRef<HTMLButtonElement | null>(null);

  const openMenu = (): void => {
    menuOpen(true);
  };

  const closeMenu = (): void => {
    menuOpen(false);
  };

  const openBulkAddModal = (): void => {
    setBulkAddModalOpen(true);
    closeMenu(); // Close the menu when the modal is opened
  };

  const closeBulkAddModal = (): void => {
    setBulkAddModalOpen(false);
  };

  // Function to handle data selection
  const handleDataSelection = (): void => {
    // Replace this with your logic to get selected data
    // For example, you might get the selected data from a state
    const mockSelectedData = ["Item 1", "Item 2", "Item 3"];
    setSelectedData(mockSelectedData);
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography variant="h5" color="text.secondary">
            Bulk actions:
          </Typography>
          <ButtonError
            sx={{ ml: 1 }}
            startIcon={<DeleteTwoToneIcon />}
            variant="contained"
          >
            Delete
          </ButtonError>
        </Box>
        <IconButton
          color="primary"
          onClick={openMenu}
          ref={moreRef}
          sx={{ ml: 2, p: 1 }}
        >
          <MoreVertTwoToneIcon />
        </IconButton>
      </Box>

      <Menu
        keepMounted
        anchorEl={moreRef.current}
        open={onMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <List sx={{ p: 1 }} component="nav">
          <ListItem
            button
            onClick={() => {
              handleDataSelection();
              openBulkAddModal();
            }}
          >
            <ListItemText primary="Bulk add selected" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Bulk delete selected" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Bulk edit selected" />
          </ListItem>
        </List>
      </Menu>

      {/* Modal for Bulk Add */}
      <Modal
        open={isBulkAddModalOpen}
        onClose={closeBulkAddModal}
        aria-labelledby="bulk-add-modal-title"
        aria-describedby="bulk-add-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="bulk-add-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            สรุปรายการ
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Customers</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Date</TableCell>
                  {/* Add more columns as needed */}
                </TableRow>
              </TableHead>
              <TableBody>
                {Orders.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.orderID}</TableCell>
                    <TableCell>{item.customerAddress}</TableCell>
                    <TableCell>
                      {format(item.orderDate, "MMMM dd yyyy")}
                    </TableCell>
                    {/* Add more cells as needed */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              component="a"
              disableRipple
              className="mr-5"
            >
              Ok
            </Button>
            <Button
              variant="contained"
              component="a"
              disableRipple
              color="error"
              onClick={closeBulkAddModal}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default BulkActions;

import { useState, useRef } from "react";
import { ListItemText, ListItem, List, Alert, AlertColor } from "@mui/material";
import React from "react";

interface BulkActionsProps {
  onDeleteSelected: () => void;
  onCloseMenu: () => void;
  onGroupOrder: () => void; // Add onGroupOrder to the prop interface
}

function BulkActions({
  onDeleteSelected,
  onCloseMenu,
  onGroupOrder,
}: BulkActionsProps) {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertSeverity, setAlertSeverity] = React.useState<
    AlertColor | undefined
  >(undefined);

  const handleDeleteSelected = (): void => {
    // Call the onDeleteSelected callback
    onDeleteSelected();
    // Close the menu
    onCloseMenu();
  };

  const handleGroupOrder = (): void => {
    // Call the onGroupOrder callback
    onGroupOrder();
    // Close the menu
    onCloseMenu();

    // Set the alert message and severity
    setAlertMessage("Bulk group orders clicked!");
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  return (
    <>
      <List sx={{ p: 1 }} component="nav">
        <ListItem button onClick={handleDeleteSelected}>
          <ListItemText primary="Bulk delete selected" />
        </ListItem>
        <ListItem button onClick={handleGroupOrder}>
          <ListItemText primary="Bulk group orders" />
        </ListItem>
      </List>
      <Alert
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
        sx={{ display: alertOpen ? "flex" : "none" }}
      >
        {alertMessage}
      </Alert>
    </>
  );
}

export default BulkActions;

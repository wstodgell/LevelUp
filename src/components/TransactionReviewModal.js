import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const TransactionReviewModal = ({
  open,
  transactions,
  setTransactions,
  expenseCategories,
  handleClose,
  handleSave,
}) => {
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const handleCategoryChange = (id, newValue) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, category: newValue } : txn))
    );
  };

  const columns = [
    { field: "date", headerName: "Date", width: 120 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "amount", headerName: "Amount", width: 100, type: "number" },
    { field: "card", headerName: "Card", width: 120 },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      renderCell: (params) => (
        <Autocomplete
          options={expenseCategories}
          value={params.row.category || ""}
          onChange={(e, newValue) =>
            handleCategoryChange(params.row.id, newValue)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Select category..."
            />
          )}
          disableClearable
          fullWidth
        />
      ),
    },
  ];

  return (
    <>
      {/* Main Transactions Dialog */}
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Review Transactions</DialogTitle>
        <DialogContent dividers>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={transactions}
              columns={columns}
              pageSize={100}
              rowsPerPageOptions={[100]}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancelOpen(true)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
      >
        <DialogTitle>
          You have unsaved changes. Are you sure you want to cancel?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmCancelOpen(false)}>No</Button>
          <Button
            onClick={() => {
              setConfirmCancelOpen(false);
              handleClose();
            }}
            color="error"
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransactionReviewModal;

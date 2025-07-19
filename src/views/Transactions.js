import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Papa from "papaparse";
import { Autocomplete, TextField } from "@mui/material";

const categoryOptions = [
  "Groceries",
  "Restaurants",
  "Fitness",
  "Travel",
  "Subscriptions",
  "Self-Care",
  "Alcohol",
  "Entertainment",
  "Clothing",
  "Business",
  "Vacation",
  "Misc",
  "Electronics",
  "Living",
];

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  width: "90%", // Responsive width
  maxWidth: "900px", // 👈 This caps the width
  maxHeight: "90vh", // Optional: keeps it from being too tall
  overflow: "auto", // Scroll inside modal if needed
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, meta } = results;
        console.log("🔍 Parsed Headers:", meta.fields); // 💡 Check if they're correct

        // Try to intelligently guess column mappings
        const dateKey = meta.fields.find((f) =>
          f.toLowerCase().includes("date")
        );
        const descKey = meta.fields.find((f) =>
          f.toLowerCase().includes("description")
        );
        const amountKey = meta.fields.find((f) =>
          f.toLowerCase().includes("amount")
        );
        const cardKey = meta.fields.find((f) =>
          f.toLowerCase().includes("card")
        );

        if (!dateKey || !descKey || !amountKey) {
          alert("⛔ CSV must include Date, Description, and Amount columns.");
          return;
        }

        const cleaned = data
          .filter((row) => row[dateKey] && row[descKey] && row[amountKey])
          .map((row, index) => ({
            id: index,
            date: row[dateKey].trim(),
            description: row[descKey].trim(),
            amount: parseFloat((row[amountKey] || "").replace(/[$,]/g, "")),
            card: row[cardKey]?.trim() || "Unknown",
            category: "",
          }));

        console.log("✅ Cleaned transactions:", cleaned);
        setTransactions(cleaned);
        setOpen(true);
      },
    });
  };

  const handleCellEdit = (params) => {
    const { id, field, value } = params;
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, [field]: value } : txn))
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
      width: 160,
      renderCell: (params) => (
        <Autocomplete
          options={categoryOptions}
          value={params.row.category || ""}
          onChange={(e, newValue) => {
            const updated = { ...params.row, category: newValue };
            setTransactions((prev) =>
              prev.map((row) => (row.id === params.row.id ? updated : row))
            );
          }}
          renderInput={(params) => <TextField {...params} variant="standard" />}
          freeSolo // Optional: allow typing custom values
        />
      ),
    },
  ];

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        Upload Transactions CSV
      </Typography>
      <Button variant="contained" component="label">
        Upload CSV
        <input type="file" accept=".csv" hidden onChange={handleUpload} />
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Review Transactions
          </Typography>
          <DataGrid
            rows={transactions}
            columns={columns}
            pageSize={100}
            rowsPerPageOptions={[100]}
            disableSelectionOnClick
            autoHeight
          />
          <Button
            onClick={() => setOpen(false)}
            sx={{ mt: 2 }}
            variant="outlined"
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Transactions;

import React, { useState } from "react";
import { Box, Button, Modal, Typography, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Papa from "papaparse";
import Autocomplete from "@mui/material/Autocomplete";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  width: "90%",
  maxWidth: "900px",
  maxHeight: "90vh",
  overflow: "auto",
};

const Transactions = ({ currentUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [open, setOpen] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Load categories *just-in-time*
    try {
      const res = await fetch(
        `http://localhost:5000/expense-categories?userId=${
          currentUser?.id || ""
        }`
      );
      const data = await res.json();
      setCategoryOptions(data.map((c) => c.name));
    } catch (err) {
      console.error("Failed to load categories:", err);
      alert("Failed to load expense categories.");
      return;
    }

    // Parse file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, meta } = results;
        console.log("🔍 Parsed Headers:", meta.fields);

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
          disablePortal
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Select category"
            />
          )}
          freeSolo
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

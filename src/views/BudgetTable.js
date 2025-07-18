import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";

const columns = [
  { field: "category", headerName: "Category", minWidth: 150, editable: true },
  { field: "month", headerName: "Month", width: 100 },
  {
    field: "amount",
    headerName: "Amount",
    width: 100,
    editable: true,
    type: "number",
  },
  // add more fields if needed
];

export default function BudgetTable({ currentUser }) {
  console.log("💡 BudgetTable currentUser prop is:", currentUser);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    axios
      .get(`/budget`, { params: { userId: currentUser.id } })
      .then((res) => setRows(res.data))
      .catch(console.error);
  }, [currentUser]);

  const handleEdit = useCallback(({ id, field, value }) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
    axios.put(`/budget/${id}`, { [field]: value }).catch(console.error);
  }, []);

  const handleAddRow = () => {
    axios
      .post("/budget", {
        userId: currentUser.id,
        category: "",
        month: "July",
        amount: 0,
        type: "fixed",
      })
      .then((res) => {
        setRows((prev) => [...prev, res.data]);
      })
      .catch(console.error);
  };

  return (
    <Box
      sx={
        {
          /* same styling as before */
        }
      }
    >
      <Typography variant="h6">Budget</Typography>
      <Button onClick={handleAddRow}>➕ Add Row</Button>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellEditCommit={handleEdit}
        rowHeight={28}
        // your sx styling
      />
    </Box>
  );
}

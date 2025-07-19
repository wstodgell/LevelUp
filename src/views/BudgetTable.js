import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

export default function BudgetTable({ currentUser }) {
  console.log("💡 BudgetTable currentUser prop is:", currentUser);
  const [rows, setRows] = useState([]);

  const handleDelete = (id) => {
    axios
      .delete(`/budget/${id}`)
      .then(() => {
        setRows((prev) => prev.filter((row) => row.id !== id));
      })
      .catch(console.error);
  };

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

  useEffect(() => {
    if (!currentUser) {
      console.log("🚫 No current user!");
      return;
    }
    console.log("✅ Sending request with userId:", currentUser.id);

    axios
      .get(`http://localhost:5000/budget`, {
        params: { userId: currentUser.id },
      })
      .then((res) => {
        console.log("✅ Budget data:", res.data);
        setRows(res.data);
      })
      .catch(console.error);
  }, [currentUser]);

  // ✅ Moved columns here, so handleDelete is in scope
  const columns = [
    {
      field: "category",
      headerName: "Category",
      minWidth: 150,
      editable: true,
    },
    { field: "month", headerName: "Month", width: 100 },
    {
      field: "amount",
      headerName: "Amount",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Delete">
          <IconButton
            onClick={handleDelete}
            sx={{
              padding: 0,
              verticalAlign: "middle",
              color: "#e74c3c",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.2)",
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Typography variant="h6">Budget</Typography>
      <Button onClick={handleAddRow}>➕ Add Row</Button>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellEditCommit={handleEdit}
        rowHeight={28}
      />
    </Box>
  );
}

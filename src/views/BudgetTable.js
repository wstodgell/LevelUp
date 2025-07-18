import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const initialRows = [
  { id: 1, category: "Phone", May: 73.7, June: 73.7 },
  { id: 2, category: "Internet", May: 66.96, June: 66.96 },
];

const columns = [
  { field: "category", headerName: "Category", minWidth: 150, editable: true },
  {
    field: "May",
    headerName: "May",
    width: 100,
    editable: true,
    type: "number",
  },
  {
    field: "June",
    headerName: "June",
    width: 100,
    editable: true,
    type: "number",
  },
];

export default function BudgetTable() {
  const [rows, setRows] = React.useState(initialRows);

  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, value }) => {
      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
      );
    },
    []
  );

  return (
    <Box sx={{ height: 400, maxWidth: 600, overflowX: "auto", padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Budget Grid (Editable)
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <button
          onClick={() => {
            const newId = rows.length ? rows[rows.length - 1].id + 1 : 1;
            setRows((prev) => [
              ...prev,
              { id: newId, category: "", May: 0, June: 0 },
            ]);
          }}
        >
          ➕ Add Row
        </button>
      </Box>

      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        onCellEditCommit={handleEditCellChangeCommitted}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        columnBuffer={2}
        rowHeight={28}
        sx={{
          "& .MuiDataGrid-row": {
            borderBottom: "1px solid #ddd",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "2px solid #bbb",
          },
          "& .MuiDataGrid-cell": {
            borderRight: "1px solid #eee",
          },
        }}
      />
    </Box>
  );
}

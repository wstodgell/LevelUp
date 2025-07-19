import React, { useState, useEffect } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import Papa from "papaparse";
import TransactionReviewModal from "../components/TransactionReviewModal";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/expense-categories?userId=3"
        );
        const data = await res.json();
        const names = data.map((cat) => cat.name);
        setExpenseCategories(names);
      } catch (err) {
        console.error("Error fetching expense categories:", err);
        alert("Failed to load expense categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, meta } = results;

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
          alert("CSV must include Date, Description, and Amount columns.");
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

        if (!expenseCategories.length) {
          alert("Expense categories not loaded yet.");
          return;
        }

        setTransactions(cleaned);
        setOpen(true);
      },
    });
  };

  const handleSave = () => {
    console.log("✅ Saving transactions:", transactions);
    // TODO: Replace with API call to save to DB
    setOpen(false);
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        Upload Transactions CSV
      </Typography>

      {loadingCategories ? (
        <Box display="flex" alignItems="center" gap={1}>
          ⏳ <Typography>Loading categories...</Typography>
        </Box>
      ) : (
        <Button variant="contained" component="label">
          Upload CSV
          <input type="file" accept=".csv" hidden onChange={handleUpload} />
        </Button>
      )}

      <TransactionReviewModal
        open={open}
        transactions={transactions}
        setTransactions={setTransactions}
        expenseCategories={expenseCategories}
        handleClose={() => setOpen(false)}
        handleSave={handleSave}
      />
    </Box>
  );
};

export default Transactions;

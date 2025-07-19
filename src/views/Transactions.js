import React, { useState, useEffect } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import Papa from "papaparse";
import TransactionReviewModal from "../components/TransactionReviewModal";
import axios from "axios"; // up top
import SHA256 from "crypto-js/sha256";

const createTransactionHash = (txn, userId) => {
  const raw = `${userId}-${txn.date}-${txn.amount}-${txn.description
    .trim()
    .toLowerCase()}`;
  return SHA256(raw).toString();
};

const Transactions = ({ currentUser }) => {
  const userId = currentUser?.id; // 💡 Clean and safe
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/expense-categories?userId=${userId}`
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

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {
        const { data, meta } = results;

        // Identify column names in the CSV (flexible to slight name changes)
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

        // Validate required columns exist
        if (!dateKey || !descKey || !amountKey) {
          alert("CSV must include Date, Description, and Amount columns.");
          return;
        }

        // Step 1: Clean and normalize the parsed CSV data
        const rawTransactions = data
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

        // Step 2: Get existing hashes from backend
        let existingHashes = [];
        try {
          const res = await axios.get(
            `http://localhost:5000/transactions/hashes?userId=${currentUser.id}`
          );
          existingHashes = res.data;
        } catch (err) {
          console.error("Error fetching existing hashes:", err);
          alert("Couldn't validate duplicates. Try again later.");
          return;
        }

        const known = new Set(existingHashes);

        // Step 3: Add unique_hash and filter out duplicates
        const deduped = rawTransactions
          .map((txn) => {
            const hash = createTransactionHash(txn, currentUser.id);
            return { ...txn, unique_hash: hash };
          })
          .filter((txn) => !known.has(txn.unique_hash));

        const duplicatesCount = rawTransactions.length - deduped.length;

        if (duplicatesCount > 0) {
          alert(`${duplicatesCount} duplicate transaction(s) were skipped.`);
        }

        // Step 4: Show the modal with clean data
        setTransactions(deduped);
        setOpen(true);
      },
    });
  };

  const handleSave = async () => {
    try {
      const payload = transactions.map((txn) => ({
        user_id: userId,
        date: new Date(txn.date).toISOString().split("T")[0], // 🧽 clean ISO date
        description: txn.description || "",
        category: txn.category || null, // allow nulls
        amount: Number(txn.amount) || 0,
        card: txn.card || null, // ✅ add this
        unique_hash: txn.unique_hash || null,
      }));

      const res = await axios.post(
        "http://localhost:5000/transactions",
        payload
      );

      console.log("✅ Saved to DB:", res.data);
      alert(`Saved ${res.data.inserted} transactions!`);
      setOpen(false);
    } catch (err) {
      console.error("❌ Failed to save transactions:", err);
      alert("Failed to save transactions.");
    }
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

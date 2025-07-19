// src/views/Summary.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Summary.css"; // Style separately
import { Box, CircularProgress, Typography } from "@mui/material";

const monthOrder = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Summary({ currentUser }) {
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    axios
      .get(`http://localhost:5000/budget?userId=${currentUser.id}`)
      .then((res) => {
        console.log("Raw budget data:", res.data);
        setBudgetData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading summary:", err);
        setLoading(false);
      });
  }, [currentUser]);

  if (loading)
    return (
      <Box p={3}>
        <CircularProgress />
      </Box>
    );

  // === Filter + organize ===
  const fixedItems = budgetData.filter((entry) => entry.type === "fixed");

  // Map: category => { month => amount }
  const grouped = {};
  fixedItems.forEach((item) => {
    const cat = item.category;
    const month = item.month;
    if (!grouped[cat]) grouped[cat] = {};
    grouped[cat][month] = item.amount;
  });

  // Category list sorted
  const categories = Object.keys(grouped).sort();

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Fixed Budget Summary
      </Typography>
      <div className="budget-summary-table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              {monthOrder.map((m) => (
                <th key={m}>{m.slice(0, 3)}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              let total = 0;
              return (
                <tr key={cat}>
                  <td>{cat}</td>
                  {monthOrder.map((month) => {
                    const value = Number(grouped[cat][month] || 0); // 🔒 Coerce value to number
                    total += value; // ✅ total is now always numeric
                    return <td key={month}>${value.toFixed(2)}</td>;
                  })}
                  <td>
                    <strong>${total.toFixed(2)}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Box>
  );
}

export default Summary;

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

// 📍 At the top of Summary.js
const formatCurrency = (num) =>
  Number(num).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

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
              <th className="label-cell">Category</th>
              {monthOrder.map((m) => (
                <th key={m} className="month-cell">
                  {m.slice(0, 3)}
                </th>
              ))}
              <th className="total-cell">Total</th>
              <th className="budget-cell">Budget</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              let total = 0;
              return (
                <tr key={cat}>
                  <td className="label-cell">{cat}</td>
                  {monthOrder.map((month) => {
                    const value = Number(grouped[cat][month] || 0);
                    total += value;
                    return (
                      <td key={month} className="month-cell">
                        {formatCurrency(value)}
                      </td>
                    );
                  })}
                  <td className="total-cell">{formatCurrency(total)}</td>
                  <td className="budget-cell">
                    {formatCurrency(Number(total / 12))}
                  </td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td className="label-cell">
                <strong>Total Fixed Exp</strong>
              </td>
              {monthOrder.map((month) => {
                const totalForMonth = categories.reduce((sum, cat) => {
                  return sum + Number(grouped[cat][month] || 0);
                }, 0);
                return (
                  <td key={month} className="month-cell">
                    <strong>{formatCurrency(totalForMonth)}</strong>
                  </td>
                );
              })}
              <td className="total-cell">
                <strong>
                  {formatCurrency(
                    categories.reduce((sum, cat) => {
                      return (
                        sum +
                        monthOrder.reduce((catTotal, month) => {
                          return catTotal + Number(grouped[cat][month] || 0);
                        }, 0)
                      );
                    }, 0)
                  )}
                </strong>
              </td>
              <td className="budget-cell">
                <strong>
                  {formatCurrency(
                    categories.reduce((sum, cat) => {
                      return (
                        sum +
                        monthOrder.reduce((catTotal, month) => {
                          return catTotal + Number(grouped[cat][month] || 0);
                        }, 0)
                      );
                    }, 0) / 12
                  )}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Box>
  );
}

export default Summary;

// src/components/SummaryTable.js
import React from "react";
import { Typography } from "@mui/material";

const monthOrder = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const formatCurrency = (num) =>
  Number(num).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

function SummaryTable({ title, data, categories }) {
  return (
    <>
      <Typography variant="h5" mt={5} mb={2}>
        {title}
      </Typography>
      <div className="budget-summary-table">
        <table>
          <thead>
            <tr>
              <th className="label-cell">Category</th>
              {monthOrder.map((m) => (
                <th key={m} className="month-cell">{m.slice(0, 3)}</th>
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
                    const value = Number(data[cat]?.[month] || 0);
                    total += value;
                    return (
                      <td key={month} className="month-cell">
                        {formatCurrency(value)}
                      </td>
                    );
                  })}
                  <td className="total-cell">{formatCurrency(total)}</td>
                  <td className="budget-cell">{formatCurrency(total / 12)}</td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td className="label-cell">
                <strong>Total {title.includes("Budget") ? "Fixed Exp" : "Variable Exp"}</strong>
              </td>
              {monthOrder.map((month) => {
                const monthTotal = categories.reduce((sum, cat) => {
                  return sum + Number(data[cat]?.[month] || 0);
                }, 0);
                return (
                  <td key={month} className="month-cell">
                    <strong>{formatCurrency(monthTotal)}</strong>
                  </td>
                );
              })}
              <td className="total-cell">
                <strong>
                  {formatCurrency(
                    categories.reduce((sum, cat) =>
                      sum + monthOrder.reduce((catTotal, month) =>
                        catTotal + Number(data[cat]?.[month] || 0), 0), 0)}
                </strong>
              </td>
              <td className="budget-cell">
                <strong>
                  {formatCurrency(
                    categories.reduce((sum, cat) =>
                      sum + monthOrder.reduce((catTotal, month) =>
                        catTotal + Number(data[cat]?.[month] || 0), 0), 0) / 12}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SummaryTable;

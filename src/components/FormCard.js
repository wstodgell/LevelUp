import React from "react";
import "./FormCard.css"; // Optional custom styling

function FormCard({ title, children }) {
  return (
    <div className="form-card">
      <h2>{title}</h2>
      <div className="form-content">{children}</div>
    </div>
  );
}

export default FormCard;

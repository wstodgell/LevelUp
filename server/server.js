const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set the path for the file
const filePath = path.join(__dirname, "submissions.txt");

// Store submissions in-memory and in file
let submissions = [];

// Endpoint to handle form submissions
app.post("/submit", (req, res) => {
  const formData = req.body;
  submissions.push(formData);

  // Write to file
  fs.appendFile(filePath, JSON.stringify(formData) + "\n", (err) => {
    if (err) {
      console.error("Failed to save data:", err);
      return res.status(500).json({ message: "Failed to save data" });
    }

    console.log("Form Data Received and Saved:", formData);
    res.status(200).json({ message: "Form data received and saved!" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

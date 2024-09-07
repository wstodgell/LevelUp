const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

// Use environment variables for configuration
const PORT = process.env.PORT || 5000;
const pool = new Pool({
  user: process.env.PG_USER || "postgres", // Use environment variables for DB credentials
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "LevelUp",
  password: process.env.PG_PASSWORD || "yourPasswordHere",
  port: process.env.PG_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Check database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Database connected, current time:", res.rows[0].now);
  }
});

// Endpoint to handle fetching day data based on the selected date
app.get("/dayData", async (req, res) => {
  const { date } = req.query;

  try {
    const queryText =
      "SELECT * FROM day_entries WHERE CAST(timestamp AS DATE) = $1";
    const result = await pool.query(queryText, [date]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return the first matching row
    } else {
      res.status(200).json(null); // No record found
    }
  } catch (error) {
    console.error("Error fetching day data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Endpoint to handle form submissions
app.post("/submit", async (req, res) => {
  const {
    timestamp,
    bedTime,
    upTime,
    restedRating,
    morningMoodRating,
    journalEntry,
    toDo,
    entryType,
    submitted,
  } = req.body;

  try {
    // Insert data into PostgreSQL database
    const queryText = `
      INSERT INTO day_entries (timestamp, bed_time, up_time, rested_rating, morning_mood_rating, journal_entry, to_do_list, entry_type, submitted) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
    `;
    const queryValues = [
      timestamp,
      bedTime,
      upTime,
      restedRating,
      morningMoodRating,
      journalEntry,
      toDo,
      entryType,
      submitted,
    ];

    const result = await pool.query(queryText, queryValues);

    console.log("Form Data Received and Saved:", result.rows[0]);
    res
      .status(200)
      .json({ message: "Form data received and saved!", data: result.rows[0] });
  } catch (error) {
    console.error("Failed to save data:", error);
    res.status(500).json({ message: "Failed to save data" });
  }
});

// Serve the React build files
const path = require("path");
app.use(express.static(path.join(__dirname, "build")));

// Fallback to serving React's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

// PostgreSQL connection pool
const pool = new Pool({
  user: "postgres", // Your PostgreSQL username
  host: "localhost",
  database: "LeveUp", // The name of your PostgreSQL database
  password: "1ISOLATEnow!!!", // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

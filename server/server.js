const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

// Use environment variables for configuration
const PORT = process.env.PORT || 5000;
const pool = new Pool({
  user: process.env.PG_USER || "postgres", // Use environment variables for DB credentials
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "LevelUp",
  password: process.env.PG_PASSWORD || "LevelUp2025!",
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

// Simple login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT id, username, email, password_hash FROM users WHERE email = $1",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res
      .status(200)
      .json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
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
  console.log("POST /submit route hit");
  const {
    userId,
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

  console.log("entryDate being submitted:", timestamp);
  const entryDate = new Date(timestamp).toISOString().split("T")[0]; // Extract YYYY-MM-DD
  console.log("entryDate after conversion:", entryDate);

  try {
    const insertQuery = `
      INSERT INTO day_entries (
        user_id, timestamp, bed_time, up_time, rested_rating, morning_mood_rating, 
        journal_entry, to_do_list, entry_type, submitted, entry_date
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      ON CONFLICT (user_id, entry_date)
      DO UPDATE SET
        timestamp = EXCLUDED.timestamp,
        bed_time = EXCLUDED.bed_time,
        up_time = EXCLUDED.up_time,
        rested_rating = EXCLUDED.rested_rating,
        morning_mood_rating = EXCLUDED.morning_mood_rating,
        journal_entry = EXCLUDED.journal_entry,
        to_do_list = EXCLUDED.to_do_list,
        entry_type = EXCLUDED.entry_type,
        submitted = EXCLUDED.submitted
      RETURNING *;
    `;

    const insertValues = [
      userId,
      timestamp,
      bedTime,
      upTime,
      restedRating,
      morningMoodRating,
      journalEntry,
      toDo,
      entryType,
      submitted,
      entryDate,
    ];

    const result = await pool.query(insertQuery, insertValues);
    res.status(200).json({
      message: "Entry inserted or updated!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error saving entry:", error);
    res.status(500).json({ message: "Failed to save data" });
  }
});

// New: Signup endpoint
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Prevent duplicate emails
    const { rows } = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 2. Hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    // 3. Insert the new user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, username, email`,
      [username, email, hash]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Unexpected server error" });
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

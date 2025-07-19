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
  const { userId, date } = req.query;

  try {
    const dayRes = await pool.query(
      `SELECT * FROM day_entries WHERE user_id = $1 AND entry_date = $2`,
      [userId, date]
    );

    const todoRes = await pool.query(
      `SELECT content, completed FROM todo_items
       WHERE user_id = $1 AND entry_date = $2`,
      [userId, date]
    );

    const entry = dayRes.rows.length ? dayRes.rows[0] : null;

    res.json({ entry, todos: todoRes.rows });
  } catch (error) {
    console.error("Error fetching day data:", error);
    res.status(500).json({ error: "Failed to fetch day data" });
  }
});

// Endpoint to handle form submissions
app.post("/submit", async (req, res) => {
  const {
    userId,
    timestamp,
    bedTime,
    upTime,
    restedRating,
    morningMoodRating,
    journalEntry,
    entryType,
    submitted,
    todos = [],
  } = req.body;

  const entryDate = new Date(timestamp).toISOString().split("T")[0];

  try {
    const dayResult = await pool.query(
      `
      INSERT INTO day_entries (
        user_id, timestamp, bed_time, up_time, rested_rating,
        morning_mood_rating, journal_entry, entry_type, submitted, entry_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (user_id, entry_date)
      DO UPDATE SET
        timestamp           = EXCLUDED.timestamp,
        bed_time            = EXCLUDED.bed_time,
        up_time             = EXCLUDED.up_time,
        rested_rating       = EXCLUDED.rested_rating,
        morning_mood_rating = EXCLUDED.morning_mood_rating,
        journal_entry       = EXCLUDED.journal_entry,
        entry_type          = EXCLUDED.entry_type,
        submitted           = EXCLUDED.submitted
      RETURNING id, user_id, entry_date;
    `,
      [
        userId,
        timestamp,
        bedTime,
        upTime,
        restedRating,
        morningMoodRating,
        journalEntry,
        entryType,
        submitted,
        entryDate,
      ]
    );

    const entry = dayResult.rows[0];

    await pool.query(
      `DELETE FROM todo_items WHERE user_id = $1 AND entry_date = $2`,
      [userId, entry.entry_date]
    );

    const insertedTodos = [];
    const todoText = `
      INSERT INTO todo_items 
        (user_id, entry_date, content, completed, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *;
    `;
    for (const item of todos) {
      const todoRes = await pool.query(todoText, [
        userId,
        entry.entry_date,
        item.content,
        item.completed ?? false,
      ]);
      insertedTodos.push(todoRes.rows[0]);
    }

    res.status(200).json({
      message: "Entry + todos saved",
      entry,
      todos: insertedTodos,
    });
  } catch (err) {
    console.error("Error saving entry/todos:", err);
    res.status(500).json({ error: "Failed to save entry & todos" });
  }
});

app.get("/expense-categories", async (req, res) => {
  const userId = req.query.userId || null;

  try {
    const { rows } = await pool.query(
      `
      SELECT id, name 
      FROM expense_categories 
      WHERE user_id IS NULL OR user_id = $1
      ORDER BY name
      `,
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Failed to fetch expense categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
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

app.post("/endOfDay", async (req, res) => {
  const { userId, timestamp, journalEntry, submitted, todos = [] } = req.body;

  const entryDate = new Date(timestamp).toISOString().split("T")[0];

  try {
    // Save or update endOfDay entry
    const dayResult = await pool.query(
      `
      INSERT INTO day_entries (
        user_id, timestamp, journal_entry, entry_type, submitted, entry_date
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, entry_date)
      DO UPDATE SET
        timestamp     = EXCLUDED.timestamp,
        journal_entry = EXCLUDED.journal_entry,
        entry_type    = EXCLUDED.entry_type,
        submitted     = EXCLUDED.submitted
      RETURNING id, user_id, entry_date;
      `,
      [userId, timestamp, journalEntry, "endOfDay", submitted, entryDate]
    );

    const entry = dayResult.rows[0];

    // Replace todo items
    await pool.query(
      `DELETE FROM todo_items WHERE user_id = $1 AND entry_date = $2`,
      [userId, entry.entry_date]
    );

    const insertedTodos = [];
    const todoInsert = `
      INSERT INTO todo_items
        (user_id, entry_date, content, completed, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *;
    `;

    for (const todo of todos) {
      const result = await pool.query(todoInsert, [
        userId,
        entry.entry_date,
        todo.content,
        todo.completed ?? false,
      ]);
      insertedTodos.push(result.rows[0]);
    }

    res.status(200).json({
      message: "End-of-day entry and todos saved",
      entry,
      todos: insertedTodos,
    });
  } catch (err) {
    console.error("Error saving end-of-day data:", err);
    res.status(500).json({ error: "Failed to save end-of-day data" });
  }
});

app.get("/budget", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const result = await pool.query(
      `
      SELECT 
        b.id,
        b.category_id,
        c.name AS category,
        b.month,
        b.year,
        b.amount,
        b.budgeted,
        b.type
      FROM budget_entries b
      JOIN budget_categories c ON b.category_id = c.id
      WHERE b.user_id = $1
      ORDER BY b.year, b.month, c.name
    `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching budget:", err);
    res.status(500).json({ error: "Failed to fetch budget" });
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

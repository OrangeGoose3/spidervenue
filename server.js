const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./database.db");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  age INTEGER
)`);

// Signup endpoint
app.post("/signup", (req, res) => {
  const { username, password, age } = req.body;
  if (!username || !password || !age) {
    return res.status(400).send("Please provide username, password, and age.");
  }
  if (age < 10) {
    return res.status(400).send("You must be 10 or older to sign up.");
  }

  const stmt = db.prepare("INSERT INTO users (username, password, age) VALUES (?, ?, ?)");
  stmt.run(username, password, age, function (err) {
    if (err) {
      return res.status(400).send("Username already taken or error occurred.");
    }
    res.send("Signup successful");
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Please provide username and password.");
  }

  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    if (!row) {
      return res.status(401).send("Invalid username or password");
    }
    res.send("Login successful");
  });
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SpiderVenue server running on port ${PORT}`);
});


const express = require("express");
const bodyParser = require("body-parser");
const mysql2 = require("mysql2");
const cors = require("cors"); // CORS issue fix

const app = express();
const port = 9183;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql2.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Kis766626@",
  port: 3306,
  database: "login",
});

connection.connect((err) => {
  if (err) {
    console.error("Error Connecting:", err.stack);
    return;
  }
  console.log("Connected as ID", connection.threadId);
});

app.get("/admin", (req, res) => {
  const colAdmin = "SELECT Email, Password FROM login_db";
  connection.query(colAdmin, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed." });
    }
    res.json(results);
  });
});

app.post("/createadmin", (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const query = `INSERT INTO login_db (Email, Password) VALUES (?, ?)`;
  connection.query(query, [Email, Password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "Login created successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

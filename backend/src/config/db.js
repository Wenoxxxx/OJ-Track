// src/config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  port:     Number(process.env.DB_PORT) || 5000,
  database: process.env.DB_NAME     || "oj_track",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

module.exports = pool;

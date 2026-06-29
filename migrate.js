/**
 * migrate.js — run once to apply the is_archived migration.
 * Usage:  node migrate.js
 * Place this file in the project root or backend/src.
 * It reads DB credentials from .env (same as the app).
 */
const path   = require("path");
const fs     = require("fs");
const mysql  = require("mysql2/promise");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const SQL = fs.readFileSync(
  path.resolve(__dirname, "db/add_is_archived.sql"),
  "utf8"
);

// Split on semicolons and filter empty statements
const statements = SQL
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

(async () => {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || "localhost",
    port:     Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME     || "oj_track",
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  console.log("Connected. Running migration…");

  for (const stmt of statements) {
    // Skip pure SQL comments
    if (stmt.replace(/--.*$/gm, "").trim() === "") continue;
    console.log(">", stmt.slice(0, 60), "…");
    await conn.execute(stmt);
  }

  console.log("✅  Migration complete.");
  await conn.end();
})().catch((err) => {
  console.error("❌  Migration failed:", err.message);
  process.exit(1);
});

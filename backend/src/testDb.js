import pool from "./config/database.js";

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("DB connected! Test query result:", rows[0].result);
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}

testConnection();

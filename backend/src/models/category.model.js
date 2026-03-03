import pool from "../config/database.js";

// CREATE
export const createCategory = async (name) => {
  const [result] = await pool.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name]
  );
  return result;
};

// READ ALL
export const getCategories = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM categories ORDER BY created_at DESC"
  );
  return rows;
};

// UPDATE
export const updateCategory = async (id, name) => {
  if (!id || !name) throw new Error("Invalid id or name");
  await pool.query(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, id]
  );
};

// DELETE
export const deleteCategory = async (id) => {
  await pool.query(
    "DELETE FROM categories WHERE id = ?",
    [id]
  );
};
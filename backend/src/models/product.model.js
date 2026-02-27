import pool from "../config/database.js";

export const getAllProducts = async (status = "all") => {
  let query = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;

  const params = [];

  if (status === "active") {
    query += " WHERE p.is_active = TRUE";
  }

  if (status === "inactive") {
    query += " WHERE p.is_active = FALSE";
  }

  query += " ORDER BY p.created_at DESC";

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM products WHERE id = ?`,
    [id]
  );
  return rows[0];
};
export const getInactiveProducts = async () => {
  const [rows] = await pool.query(`
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = FALSE
    ORDER BY p.created_at DESC
  `);

  return rows;
};
export const createProduct = async (product) => {
  const { name, description, price, stock_quantity, category_id, image_url } = product;

  const [result] = await pool.query(
    `
    INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, description, price, stock_quantity, category_id, image_url]
  );

  return result.insertId;
};

export const updateProduct = async (id, product) => {
  const { name, description, price, stock_quantity, category_id, image_url } = product;

  const is_active = stock_quantity > 0;

  await pool.query(
    `
    UPDATE products
    SET name = ?, 
        description = ?, 
        price = ?, 
        stock_quantity = ?, 
        category_id = ?, 
        image_url = ?,
        is_active = ?
    WHERE id = ?
    `,
    [name, description, price, stock_quantity, category_id, image_url, is_active, id]
  );
};

export const softDeleteProduct = async (id) => {
  await pool.query(
    `UPDATE products SET is_active = FALSE WHERE id = ?`,
    [id]
  );
};
export const hardDeleteProduct = async (id) => {
  await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
};
export const restoreProduct = async (id) => {
  await pool.query(
    `UPDATE products SET is_active = TRUE WHERE id = ?`,
    [id]
  );
};

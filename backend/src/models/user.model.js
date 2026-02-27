import pool from "../config/database.js";

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `
    SELECT 
      users.id, 
      users.name, 
      users.email, 
      users.password,
      users.must_change_password,
      roles.name AS role_name
    FROM users
    JOIN roles ON users.role_id = roles.id
    WHERE users.email = ?
    `,
    [email]
  );

  return rows[0];
};

export const createUser = async ({ name, email, password, role_id }) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
    [name, email, password, role_id]
  );

  return result.insertId;
};

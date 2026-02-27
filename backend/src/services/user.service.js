import pool from "../config/database.js";

export const getAllEmployees = async () => {
  const [rows] = await pool.query(`
    SELECT users.id, users.name, users.email, roles.name as role
    FROM users
    JOIN roles ON users.role_id = roles.id
    WHERE roles.name != 'CUSTOMER'
  `);

  return rows;
};

export const deleteEmployeeById = async (id) => {
  await pool.query("DELETE FROM users WHERE id = ?", [id]);
};

export const updateEmployeeRole = async (id, roleName) => {
  const [[role]] = await pool.query(
    "SELECT id FROM roles WHERE name = ?",
    [roleName]
  );

  if (!role) throw new Error("Invalid role");

  await pool.query(
    "UPDATE users SET role_id = ? WHERE id = ?",
    [role.id, id]
  );
};
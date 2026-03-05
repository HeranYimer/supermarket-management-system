import pool from "../config/database.js";

/* ================= GET ALL ================= */
export const getSuppliers = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM suppliers ORDER BY created_at DESC"
  );
  return rows;
};

/* ================= CREATE ================= */
export const createSupplier = async (supplier) => {
  const { name, phone, email, address } = supplier;

  await pool.query(
    `INSERT INTO suppliers (name, phone, email, address, status)
     VALUES (?, ?, ?, ?, 'ACTIVE')`,
    [name, phone, email, address]
  );
};

/* ================= UPDATE (INFO + STATUS) ================= */
export const updateSupplier = async (id, supplier) => {
  const { name, phone, email, address, status } = supplier;

  await pool.query(
    `UPDATE suppliers
     SET name = ?, phone = ?, email = ?, address = ?, status = ?
     WHERE id = ?`,
    [name, phone, email, address, status, id]
  );
};

/* ================= DELETE (NOT USED ANYMORE) ================= */
export const deleteSupplier = async (id) => {
  await pool.query("DELETE FROM suppliers WHERE id=?", [id]);
};
import pool from "../config/database.js";

export const createNotification = async (title, message, type, role) => {
  await pool.query(
    `INSERT INTO notifications (title, message, type, role) VALUES (?, ?, ?, ?)`,
    [title, message, type, role]
  );
};

export const getNotificationsByRole = async (role) => {
  const [rows] = await pool.query(
    `SELECT * FROM notifications
     WHERE role = ? AND is_read = FALSE
     ORDER BY created_at DESC`,
    [role]
  );
  return rows;
};

export const markAsRead = async (id) => {
  const [result] = await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE id = ?`,
    [id]
  );
  return result;
};

export const markAllAsRead = async (role) => {
  await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE role = ?`,
    [role]
  );
};
import bcrypt from "bcrypt";
import pool from "../../config/database.js";
import {
  getAllEmployees,
  deleteEmployeeById,
  updateEmployeeRole,
} from "../../services/user.service.js";
import { sendEmail } from "../../utils/email.js";
// Helper to generate random password
const generateTempPassword = (length = 12) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // 1️⃣ Generate temporary password
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 2️⃣ Get role id
    const [[roleRow]] = await pool.query(
      "SELECT id FROM roles WHERE name = ?",
      [role]
    );

    if (!roleRow) return res.status(400).json({ error: "Invalid role" });

    // 3️⃣ Insert employee into database
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, role_id, must_change_password)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, roleRow.id, 1]
    );

    // 4️⃣ Send email via Ethereal
    await sendEmail({
      to: email,
      subject: "Your Temporary SuperMarket Password",
      html: `
        <p>Hello ${name},</p>
        <p>Your account has been created.</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please <strong>log in and change your password immediately</strong>.</p>
      `,
    });

    res.status(201).json({
      message: "Employee created successfully and email sent",
      userId: result.insertId,
      tempPassword, // optional for frontend testing
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create employee" });
  }
};
export const getEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    await deleteEmployeeById(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
};

export const changeEmployeeRole = async (req, res) => {
  try {
    const { role } = req.body;
    await updateEmployeeRole(req.params.id, role);
    res.json({ message: "Role updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users SET password = ?, must_change_password = 0 WHERE id = ?`,
      [hashedPassword, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update password" });
  }
};
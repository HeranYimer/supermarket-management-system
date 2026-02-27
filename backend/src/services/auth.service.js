import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/user.model.js";
import pool from "../config/database.js";
import { ROLES } from "../constants/roles.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const registerCustomer = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error("Email already registered");

  const [roleRows] = await pool.query(
    "SELECT id FROM roles WHERE name = ?",
    [ROLES.CUSTOMER]
  );

  const roleId = roleRows[0].id;

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await createUser({
    name,
    email,
    password: hashedPassword,
    role_id: roleId,
  });

  return userId;
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Incorrect email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Incorrect email or password");

  const token = jwt.sign(
    { id: user.id, role: user.role_name },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role_name,
       mustChangePassword: user.must_change_password === 1,
    },
  };
};
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Register.module.css";
import { register } from "../../api/api.js";

export default function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: 3,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await register(
      form.name,
      form.email,
      form.password,
      parseInt(form.role_id)
    );

    if (result.userId) {
      setSuccess("Account created successfully!");
      setError("");
    } else {
      setError(result.error || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <p className={styles.switchText}>
        Already have an account?{" "}
        <Link to="/login" className={styles.link}>Login</Link>
      </p>
    </div>
  );
}

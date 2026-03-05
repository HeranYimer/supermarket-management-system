// frontend/src/pages/Auth/Register.jsx

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
  const [showPassword, setShowPassword] = useState(false);

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

        {/* Professional password field */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{ paddingRight: "35px" }}
          />
          <svg
            onClick={() => setShowPassword(!showPassword)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fill: "#666",
            }}
          >
            {showPassword ? (
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-3.04 0-5.5-2.46-5.5-5.5S8.96 6.5 12 6.5s5.5 2.46 5.5 5.5S15.04 17.5 12 17.5zm0-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
            ) : (
              <path d="M12 6a9.77 9.77 0 00-7.91 4 9.77 9.77 0 0015.82 0A9.77 9.77 0 0012 6zm0 11a7.72 7.72 0 01-6.38-3 7.72 7.72 0 0112.76 0A7.72 7.72 0 0112 17zm0-11a4 4 0 104 4 4 4 0 00-4-4z" />
            )}
          </svg>
        </div>

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
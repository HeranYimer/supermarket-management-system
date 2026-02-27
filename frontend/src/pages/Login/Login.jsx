import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { login } from "../../api/api.js";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login submitted:", email, password);

    try {
      const result = await login(email, password);
      console.log("Login result:", result);

      if (result.token) {
        onLogin(result);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError("Network or server error");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.switchText}>
        Don't have an account?{" "}
        <Link to="/register" className={styles.link}>
          Sign up
        </Link>
      </p>
    </div>
  );
}

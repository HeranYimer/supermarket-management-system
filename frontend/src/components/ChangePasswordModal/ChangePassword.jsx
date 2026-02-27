import { useState } from "react";
import styles from "./ChangePasswordModal.module.css";
import { updatePassword } from "../../api/api"; // use your API function

export default function ChangePasswordModal({ token, onClose }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Simple password strength
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return "Weak";
    if (score <= 3) return "Medium";
    return "Strong";
  };

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) return setError("Passwords do not match");
    if (strength === "Weak") return setError("Please choose a stronger password");

    try {
      setLoading(true);
      await updatePassword(password, token);
      setError("");
      onClose();
    } catch (err) {
      setError("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Change Your Password</h2>
        <p>You must change your temporary password.</p>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Strength Meter */}
          {password && (
            <div className={styles.strengthWrapper}>
              <div
                className={`${styles.strengthBar} ${
                  strength === "Weak"
                    ? styles.weak
                    : strength === "Medium"
                    ? styles.medium
                    : styles.strong
                }`}
              />
              <small>Password Strength: {strength}</small>
            </div>
          )}

          {/* Confirm Password */}
          <div className={styles.passwordField}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className={styles.eye}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
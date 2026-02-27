import { useState } from "react";
import styles from "./Topbar.module.css";

export default function Topbar({ user, toggleDark }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Example notifications (later connect to backend)
  const [notifications] = useState([
    "Low stock detected",
    "New product added",
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.rightSection}>
        
        {/* 🌙 Dark Mode Toggle */}
        <div className={styles.iconBtn} onClick={toggleDark}>
          🌙
        </div>

        {/* 🔔 Notifications */}
        <div className={styles.iconBtn}>
          🔔
          {notifications.length > 0 && (
            <span className={styles.badge}>
              {notifications.length}
            </span>
          )}
        </div>

        {/* 👤 User Section */}
        <div
          className={styles.userArea}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className={styles.userInfo}>
            <span className={styles.welcome}>
              Welcome, {user?.name}
            </span>
            <span className={styles.role}>
              {user?.role}
            </span>
          </div>

          {user?.profile_image ? (
            <img
              src={user.profile_image}
              alt="profile"
              className={styles.avatarImg}
            />
          ) : (
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownItem}>
              Profile
            </div>
            <div
              className={styles.dropdownItem}
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
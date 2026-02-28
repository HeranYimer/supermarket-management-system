import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Topbar.module.css";

export default function Topbar({ user, toggleDark }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // 🔔 unread notifications
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const goToNotifications = () => {
    if (user?.token) navigate("/notifications");
  };

  // 🔔 Fetch unread notifications count
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      // count unread notifications
      const unread = data.filter(n => !n.read_status).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (user?.token) fetchNotifications();
  }, [user]);

  return (
    <div className={styles.topbar}>
      <div className={styles.rightSection}>
        {/* 🌙 Dark Mode Toggle */}
        <div className={styles.iconBtn} onClick={toggleDark}>🌙</div>

        {/* 🔔 Notifications */}
        <div className={styles.iconBtn} onClick={goToNotifications}>
          🔔
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </div>

        {/* 👤 User Section */}
        <div
          className={styles.userArea}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className={styles.userInfo}>
            <span className={styles.welcome}>Welcome, {user?.name}</span>
            <span className={styles.role}>{user?.role}</span>
          </div>
          {user?.profile_image ? (
            <img src={user.profile_image} alt="profile" className={styles.avatarImg} />
          ) : (
            <div className={styles.avatar}>{user?.name?.charAt(0)?.toUpperCase()}</div>
          )}
        </div>

        {dropdownOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownItem}>Profile</div>
            <div className={styles.dropdownItem} onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
    </div>
  );
}
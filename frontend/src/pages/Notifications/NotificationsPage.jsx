import { useEffect, useState } from "react";
import styles from "./NotificationsPage.module.css";

export default function NotificationsPage({ user, token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    if (!token) return; // don't fetch if no token
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          console.error("Unauthorized - please login");
          return setNotifications([]);
        }
        throw new Error("Failed to fetch notifications");
      }
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setNotifications([]);
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to mark as read");
      setSuccessMsg("Notification marked as read");
      fetchNotifications();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to mark all as read");
      setSuccessMsg("All notifications marked as read ✅");
      fetchNotifications();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Notifications</h1>

      {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className={styles.emptyNotif}>No notifications</p>
      ) : (
        <>
          <button className={styles.markAllBtn} onClick={markAllAsRead}>
            Mark All as Read
          </button>
          <div className={styles.notifList}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`${styles.notifItem} ${
                  notif.is_read ? styles.read : styles.unread
                }`}
              >
                <div>
                  <strong>{notif.title}</strong>
                  <p>{notif.message}</p>
                </div>
                <div>
                {!notif.is_read && (
                  <button
                    className={styles.markBtn}
                    onClick={() => markAsRead(notif.id)}
                  >
                    Mark as Read
                  </button>
                )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../../components/Topbar/Topbar.jsx";
import styles from "./ManagerDashboard.module.css";
import { getDashboard } from "../../../api/api.js";

export default function ManagerDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await getDashboard("manager", user.token);
        if (!res.error) setStats(res);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (!user) return <p>Loading user info...</p>;

  return (
    <div className={styles.container}>
      <Sidebar role={user.role} />
      <div className={styles.main}>
        <Topbar userName={user.name} onLogout={onLogout} />
        <div className={styles.content}>
          {loading ? (
            <p>Loading stats...</p>
          ) : (
            <div className={styles.cards}>
              {/* Manager stats */}
              <div className={styles.card}>Total Users: {stats.totalUsers || 0}</div>
              <div className={styles.card}>Total Customers: {stats.totalCustomers || 0}</div>
              <div className={styles.card}>Total Products: {stats.totalProducts || 0}</div>
              {/* Managers don’t see suppliers */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../../components/Topbar/Topbar.jsx";
import styles from "./CashierDashboard.module.css";
import { getDashboard } from "../../../api/api.js";

export default function CashierDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await getDashboard("cashier", user.token);
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
              {/* Cashier-specific stats */}
              <div className={styles.card}>Total Sales: {stats.totalSales || 0}</div>
              <div className={styles.card}>Transactions Today: {stats.transactions || 0}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

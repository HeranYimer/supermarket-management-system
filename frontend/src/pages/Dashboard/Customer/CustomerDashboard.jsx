import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../../components/Topbar/Topbar.jsx";
import styles from "./CustomerDashboard.module.css";

export default function CustomerDashboard({ user, onLogout }) {
  if (!user) return <p>Loading user info...</p>;

  return (
    <div className={styles.container}>
      <Sidebar role={user.role} />
      <div className={styles.main}>
        <Topbar userName={user.name} onLogout={onLogout} />
        <div className={styles.content}>
          <p>This is your customer portal.</p>

          {/* Example features */}
          <ul>
            <li>View Products</li>
            <li>View Orders</li>
            <li>Update Account</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

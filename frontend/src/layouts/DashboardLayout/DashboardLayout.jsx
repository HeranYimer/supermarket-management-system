// frontend/src/layouts/DashboardLayout/DashboardLayout.jsx
import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({ children, user }) {
  const [dark, setDark] = useState(false);

  return (
    <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
      <Sidebar user={user} />

      <div className={styles.main}>
        <Topbar user={user} toggleDark={() => setDark(!dark)} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
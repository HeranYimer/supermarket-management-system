import { NavLink } from "react-router-dom";
import { sidebarMenus } from "../../config/sidebarConfig";
import styles from "./Sidebar.module.css";

export default function Sidebar({ user }) {
  const role = user?.role?.toLowerCase();
  const menu = sidebarMenus[role] || [];

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>SuperMarket</h2>

      {menu.map((item) => (
        <NavLink key={item.path} to={item.path} className={styles.link}>
          {item.icon} {item.name}
        </NavLink>
      ))}
    </div>
  );
}
import styles from "./StatsCards.module.css";

export default function StatsCards({ stats }) {
  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <div className={styles.top}>
          <span>Total Orders</span>
        </div>
        <h2>{stats.totalOrders || 0}</h2>
        <p className={styles.growth}>+12% from last month</p>
      </div>

      <div className={styles.card}>
        <div className={styles.top}>
          <span>Total Revenue</span>
        </div>
        <h2>${stats.totalRevenue || 0}</h2>
        <p className={styles.growth}>+8% from last month</p>
      </div>

      <div className={styles.card}>
        <div className={styles.top}>
          <span>Total Customers</span>
        </div>
        <h2>{stats.totalCustomers || 0}</h2>
        <p className={styles.growth}>+5% from last month</p>
      </div>

      <div className={styles.card}>
        <div className={styles.top}>
          <span>Total Products</span>
        </div>
        <h2>{stats.totalProducts || 0}</h2>
        <p className={styles.growth}>+3% from last month</p>
      </div>
    </div>
  );
}

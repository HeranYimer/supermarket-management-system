import styles from "./StatCard.module.css";

export default function StatCard({ title, value }) {
<div className={styles.statsGrid}>
  <div className={styles.card}>
    <h4>Total Employees</h4>
    <h2>13</h2>
  </div>

  <div className={styles.card}>
    <h4>Total Customers</h4>
    <h2>4</h2>
  </div>

  <div className={styles.card}>
    <h4>Total Products</h4>
    <h2>11</h2>
  </div>

  <div className={styles.card}>
    <h4>Revenue Today</h4>
    <h2>$0.00</h2>
  </div>
</div>
}
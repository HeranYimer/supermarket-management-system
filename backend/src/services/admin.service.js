import pool from "../config/database.js";

export const getAdminStats = async () => {
  const [[employeeCount]] = await pool.query(`
    SELECT COUNT(*) as totalEmployees 
    FROM users 
    WHERE role_id IN (
      SELECT id FROM roles WHERE name != 'CUSTOMER'
    )
  `);

  const [[customerCount]] = await pool.query(`
    SELECT COUNT(*) as totalCustomers
    FROM users
    WHERE role_id = (
      SELECT id FROM roles WHERE name = 'CUSTOMER'
    )
  `);

  const [[productCount]] = await pool.query(`
    SELECT COUNT(*) as totalProducts FROM products
  `);

  const [[todayRevenue]] = await pool.query(`
    SELECT IFNULL(SUM(total_amount),0) as revenueToday
    FROM sales
    WHERE DATE(created_at) = CURDATE()
  `);

  return {
    totalEmployees: employeeCount.totalEmployees,
    totalCustomers: customerCount.totalCustomers,
    totalProducts: productCount.totalProducts,
    revenueToday: todayRevenue.revenueToday,
  };
};
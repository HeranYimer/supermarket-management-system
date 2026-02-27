import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout/DashboardLayout";
import StatCard from "../../../components/StatCard/StatCard";
import ProductCard from "../../../components/ProductCard/ProductCard";
import AddProductModal from "../../../components/AddProductModal/AddProductModal";
import {
  getAdminStats,
  getProducts,
  deleteProduct,
  deactivateProduct,
  restoreProduct,
} from "../../../api/api";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ================= LOAD STATS ================= */
  useEffect(() => {
    const loadStats = async () => {
      const data = await getAdminStats(user.token);
      setStats(data);
    };
    loadStats();
  }, [user.token]);

  /* ================= LOAD PRODUCTS ================= */
  const loadProducts = async () => {
    try {
      const data = await getProducts(user.token, statusFilter);
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    if (activeView === "products") {
      loadProducts();
    }
  }, [activeView, statusFilter]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout user={user} onMenuClick={setActiveView}>
      {activeView === "dashboard" && (
        <>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Admin Dashboard</h1>
              <p className={styles.subtitle}>
                Monitor system performance and overview.
              </p>
            </div>
          </div>

          <div className={styles.stats}>
            <StatCard title="Total Employees" value={stats?.totalEmployees || 0} />
            <StatCard title="Total Customers" value={stats?.totalCustomers || 0} />
            <StatCard title="Total Products" value={stats?.totalProducts || 0} />
            <StatCard
              title="Revenue Today"
              value={`$${stats?.revenueToday || 0}`}
            />
          </div>
        </>
      )}

      {activeView === "products" && (
        <div className={styles.cardSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Products Management</h2>
              <p>Admin has full control over products</p>
            </div>

            <button
              className={styles.primaryBtn}
              onClick={() => setShowAddModal(true)}
            >
              + Add Product
            </button>
          </div>

          {/* Search & Filter */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                minWidth: "200px",
              }}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Products Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px"
          }}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                token={user.token}
                isAdmin={true}
                onDeactivate={async (id) => {
                  await deactivateProduct(id, user.token);
                  loadProducts();
                }}
                onRestore={async (id) => {
                  await restoreProduct(id, user.token);
                  loadProducts();
                }}
                onDelete={async (id) => {
                  await deleteProduct(id, user.token);
                  loadProducts();
                }}
                onUpdated={loadProducts}
              />
            ))}
          </div>

          {showAddModal && (
            <AddProductModal
              token={user.token}
              onClose={() => setShowAddModal(false)}
              onProductAdded={loadProducts}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
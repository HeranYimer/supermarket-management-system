import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout/DashboardLayout";
import {
  getProducts,
  deleteProduct,
  deactivateProduct,
  restoreProduct,
} from "../../../api/api";
import AddProductModal from "../../../components/AddProductModal/AddProductModal";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { productPermissions } from "../../../config/permissionConfig";
import styles from "./InventoryDashboard.module.css";

export default function InventoryDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const permissions = productPermissions[user.role] || {};

  const loadProducts = async () => {
    try {
      const data = await getProducts(user.token, statusFilter);
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [statusFilter]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout user={user}>
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.topSection}>
          <h1 className={styles.title}>Products</h1>

          <div className={styles.controls}>
            <input
              className={styles.search}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className={styles.filter}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              token={user.token}
              onDeactivate={permissions.canDeactivate ? async (id) => {
                await deactivateProduct(id, user.token);
                loadProducts();
              } : null}
              onRestore={permissions.canDeactivate ? async (id) => {
                await restoreProduct(id, user.token);
                loadProducts();
              } : null}
              onDelete={permissions.canDelete ? async (id) => {
                await deleteProduct(id, user.token);
                loadProducts();
              } : null}
              onUpdated={loadProducts}
              permissions={permissions}
            />
          ))}
        </div>

        {permissions.canAdd && (
          <>
            <button
              className={styles.addBtn}
              onClick={() => setShowAddModal(true)}
            >
              + Add Product
            </button>

            {showAddModal && (
              <AddProductModal
                token={user.token}
                onClose={() => setShowAddModal(false)}
                onProductAdded={loadProducts}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
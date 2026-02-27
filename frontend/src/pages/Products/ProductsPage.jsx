import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import ProductCard from "../../components/ProductCard/ProductCard";
import AddProductModal from "../../components/AddProductModal/AddProductModal";
import {
  getProducts,
  deleteProduct,
  deactivateProduct,
  restoreProduct,
} from "../../api/api";

import styles from "./ProductsPage.module.css";

export default function ProductsPage({ user }) {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const isAdmin = user.role === "ADMIN";
  const canEdit = ["ADMIN", "MANAGER", "INVENTORY"].includes(user.role);
  const canDelete = isAdmin;

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
        <div className={styles.topSection}>
          <h1 className={styles.title}>Products</h1>

          <div className={styles.controls}>
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.search}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filter}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              token={user.token}
              canEdit={canEdit}   // ✅ New prop
              canDelete={canDelete} // ✅ New prop
              onDeactivate={async (id) => {
                await deactivateProduct(id, user.token);
                loadProducts();
              }}
              onRestore={async (id) => {
                await restoreProduct(id, user.token);
                loadProducts();
              }}
              onDelete={async (id) => {
                if (canDelete) {
                  await deleteProduct(id, user.token);
                  loadProducts();
                }
              }}
              onUpdated={loadProducts}
            />
          ))}
        </div>
  {canEdit && (
              <button
                className={styles.addBtn}
                onClick={() => setShowAddModal(true)}
              >
                + Add Product
              </button>
            )}
        {showAddModal && (
          <AddProductModal
            token={user.token}
            onClose={() => setShowAddModal(false)}
            onProductAdded={loadProducts}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
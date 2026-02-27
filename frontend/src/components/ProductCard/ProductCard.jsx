import { useState } from "react";
import EditProductModal from "../EditProductModal/EditProductModal";
import styles from "./ProductCard.module.css";

// Pass permissions as a prop
// permissions = { canAdd, canEdit, canDelete, canDeactivate }
export default function ProductCard({
  product,
  token,
  canEdit,
  canDelete,
  onDeactivate,
  onRestore,
  onDelete,
  onUpdated,
}) {
  const [showConfirm, setShowConfirm] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const isLowStock = product.stock_quantity < 10;

  return (
    <>
      <div
        className={`${styles.card} 
        ${isLowStock ? styles.lowStockCard : ""} 
        ${!product.is_active ? styles.inactiveCard : ""}`}
      >
        <div
          className={`${styles.statusBadge} ${
            product.is_active ? styles.active : styles.inactive
          }`}
        >
          {product.is_active ? "Active 🟢" : "Inactive 🔴"}
        </div>

        <img
          src={product.image_url || "https://via.placeholder.com/150"}
          alt={product.name}
          className={styles.image}
        />

        <div className={styles.name}>{product.name}</div>
        <div className={styles.price}>
          {Number(product.price).toLocaleString("en-ET")} ETB
        </div>

        <div className={`${styles.stock} ${isLowStock ? styles.lowStock : ""}`}>
          Stock: {product.stock_quantity}
        </div>

        {canEdit && (
          <div className={styles.actions}>
            <button className={styles.editBtn} onClick={() => setShowEdit(true)}>
              Edit
            </button>

            {product.is_active ? (
              <button
                className={styles.deactivateBtn}
                onClick={() => setShowConfirm("deactivate")}
              >
                Deactivate
              </button>
            ) : (
              <button
                className={styles.activateBtn}
                onClick={() => onRestore(product.id)}
              >
                Activate
              </button>
            )}

            {canDelete && (
              <button
                className={styles.deleteBtn}
                onClick={() => setShowConfirm("delete")}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {showConfirm && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>{showConfirm === "delete" ? "Delete Permanently" : "Deactivate Product"}</h3>
            <p>
              {showConfirm === "delete"
                ? `Are you sure you want to permanently delete "${product.name}"?`
                : `Are you sure you want to deactivate "${product.name}"?`}
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowConfirm(null)}>
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={async () => {
                  if (showConfirm === "delete" && canDelete) await onDelete(product.id);
                  if (showConfirm === "deactivate") await onDeactivate(product.id);
                  setShowConfirm(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <EditProductModal
          product={product}
          token={token}
          onClose={() => setShowEdit(false)}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
}
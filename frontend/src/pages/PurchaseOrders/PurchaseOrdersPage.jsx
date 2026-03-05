// frontend/src/pages/Dashboard/PurchaseOrders/PurchaseOrdersPage.jsx

import { useEffect, useState } from "react";
import styles from "./PurchaseOrdersPage.module.css";
import {
  getPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  changePOStatus,
  getSuppliers,
  getProducts,
} from "../../api/api";

import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import toast from "react-hot-toast";

export default function PurchaseOrdersPage({ token, user }) {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPO, setNewPO] = useState({
    id: null,
    supplier_id: "",
    items: [],
    total_amount: 0,
    status: "Pending",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const isReadOnly = user?.role === "INVENTORY";

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [poData, supplierData, productData] = await Promise.all([
        getPurchaseOrders(token),
        getSuppliers(token),
        getProducts(token),
      ]);
      setPurchaseOrders(poData || []);
      setSuppliers(supplierData || []);
      setProducts(productData || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ITEMS ================= */
  const handleAddItem = () => {
    setNewPO((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: 1, cost_price: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    const items = [...newPO.items];
    items.splice(index, 1);
    updateItems(items);
  };

  const handleItemChange = (index, field, value) => {
    const items = [...newPO.items];
    items[index][field] =
      field === "quantity" || field === "cost_price" ? Number(value) : value;
    updateItems(items);
  };

  const updateItems = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.cost_price,
      0
    );
    setNewPO((prev) => ({ ...prev, items, total_amount: total }));
  };

  /* ================= CREATE / EDIT PO ================= */
  const handleSavePO = async () => {
    if (!newPO.supplier_id || newPO.items.length === 0) {
      return toast.error("Supplier and items are required");
    }

    try {
      if (newPO.id) {
        await updatePurchaseOrder(newPO.id, newPO, token);
        toast.success(`Purchase order #${newPO.id} updated ✅`);
      } else {
        await createPurchaseOrder(newPO, token);
        toast.success("Purchase order created ✅");
      }

      setShowAddForm(false);
      setNewPO({
        id: null,
        supplier_id: "",
        items: [],
        total_amount: 0,
        status: "Pending",
      });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save purchase order");
    }
  };

  /* ================= STATUS CHANGE ================= */
  const handleStatusChange = (po, newStatus) => {
    if (isReadOnly) return;
    setSelectedPO({ ...po, newStatus });
    setConfirmMessage(`Change PO #${po.id} status to ${newStatus}?`);
    setShowConfirm(true);
  };

  const confirmStatusChange = async () => {
    try {
      await changePOStatus(selectedPO.id, selectedPO.newStatus, token);
      toast.success(`PO #${selectedPO.id} updated`);
      setShowConfirm(false);
      setSelectedPO(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  /* ================= EDIT PO ================= */
  const handleEditPO = async (po) => {
    try {
      const fullPO = await getPurchaseOrder(po.id, token); // fetch full PO including items
      setNewPO({
        id: fullPO.id,
        supplier_id: fullPO.supplier_id,
        items: fullPO.items || [],
        total_amount: Number(fullPO.total_amount) || 0, // <-- ensure number
        status: fullPO.status,
      });
      setShowAddForm(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load purchase order");
    }
  };

  /* ================= UI ================= */
  return (
    <div className={styles.container}>
      <h1>Purchase Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* ===== TABLE ===== */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Supplier</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Created</th>
                  {!isReadOnly && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr key={po.id}>
                    <td>{po.id}</td>
                    <td>{po.supplier_name}</td>
                    <td>ETB {Number(po.total_amount || 0).toFixed(2)}</td>
                    <td>
                      <span
                        className={
                          po.status.toLowerCase() === "received"
                            ? styles.activeBadge
                            : po.status.toLowerCase() === "cancelled"
                            ? styles.cancelBadge
                            : styles.inactiveBadge
                        }
                      >
                        {po.status}
                      </span>
                    </td>
                    <td>{new Date(po.created_at).toLocaleDateString()}</td>

                    {!isReadOnly && (
                      <td>
                        <div className={styles.actionButtons}>
                          {po.status.toLowerCase() === "pending" && (
                            <>
                              <button
                                className={styles.editBtn}
                                onClick={() => handleEditPO(po)}
                              >
                                Edit
                              </button>
                              <button
                                className={styles.receiveBtn}
                                onClick={() => handleStatusChange(po, "Received")}
                              >
                                Receive
                              </button>
                              <button
                                className={styles.cancelBtn}
                                onClick={() => handleStatusChange(po, "Cancelled")}
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {po.status.toLowerCase() === "cancelled" && (
                            <button
                              className={styles.reopenBtn}
                              onClick={() => handleStatusChange(po, "Pending")}
                            >
                              Reopen
                            </button>
                          )}

                          {po.status.toLowerCase() === "received" && (
                            <span className={styles.completedText}>Completed</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== CREATE / EDIT FORM ===== */}
          {showAddForm && !isReadOnly && (
            <div className={styles.addForm}>
              <select
                value={newPO.supplier_id}
                onChange={(e) =>
                  setNewPO({ ...newPO, supplier_id: e.target.value })
                }
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              {newPO.items.map((item, idx) => {
                const isEditable = newPO.status.toLowerCase() === "pending";
                return (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.field}>
                      <label>Product</label>
                      <select
                        value={item.product_id}
                        onChange={(e) =>
                          handleItemChange(idx, "product_id", e.target.value)
                        }
                        disabled={!isEditable}
                      >
                        <option value="">Select Product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, "quantity", e.target.value)
                        }
                        disabled={!isEditable}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Cost Price (ETB)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.cost_price}
                        onChange={(e) =>
                          handleItemChange(idx, "cost_price", e.target.value)
                        }
                        disabled={!isEditable}
                      />
                    </div>

                    {isEditable && (
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemoveItem(idx)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}

              {newPO.status.toLowerCase() === "pending" && (
                <button onClick={handleAddItem}>+ Add Item</button>
              )}

              <h3>
                Total Amount: ETB {(Number(newPO.total_amount) || 0).toFixed(2)}
              </h3>

              {newPO.status.toLowerCase() === "pending" && (
                <button className={styles.createBtn} onClick={handleSavePO}>
                  {newPO.id ? "Update Purchase Order" : "Create Purchase Order"}
                </button>
              )}
            </div>
          )}
        </>
      )}

      {showConfirm && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={confirmStatusChange}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
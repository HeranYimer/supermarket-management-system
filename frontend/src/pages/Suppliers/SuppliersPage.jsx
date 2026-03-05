import { useEffect, useState } from "react";
import styles from "./SuppliersPage.module.css";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
} from "../../api/api";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { supplierPermissions } from "../../config/permissionConfig";
import toast from "react-hot-toast";

export default function SuppliersPage({ token, user }) {
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "ACTIVE",
  });

  const [editId, setEditId] = useState(null);
  const [editSupplier, setEditSupplier] = useState({});

  /* CONFIRM MODAL STATE */
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(""); // <-- NEW

  /* ===== ROLE PERMISSIONS ===== */
  const role = user?.role;
  const permissions = supplierPermissions[role] || {};
  /* ============================ */

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers(token);
      setSuppliers(data);
      setFiltered(data);
    } catch {
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  // SEARCH
  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setFiltered(
      suppliers.filter((s) =>
        s.name.toLowerCase().includes(q)
      )
    );
  };

  // CREATE
  const handleCreate = async () => {
    try {
      await createSupplier(newSupplier, token);

      toast.success("Supplier created successfully ✅");

      setShowAddForm(false);
      setNewSupplier({
        name: "",
        phone: "",
        email: "",
        address: "",
        status: "ACTIVE",
      });

      fetchSuppliers();
    } catch {
      toast.error("Create failed");
    }
  };

  // UPDATE
  const handleUpdate = async (id) => {
    try {
      await updateSupplier(id, editSupplier, token);

      toast.success("Supplier updated successfully ✅");

      setEditId(null);
      fetchSuppliers();
    } catch {
      toast.error("Update failed");
    }
  };

  // ASK CONFIRM BEFORE STATUS CHANGE
  const handleStatusToggle = (supplier) => {
    if (!permissions.canUpdate) return;

    setSelectedSupplier(supplier);

    // ✅ DYNAMIC CONFIRMATION MESSAGE
    const message =
      supplier.status === "ACTIVE"
        ? `Are you sure you want to deactivate "${supplier.name}"?`
        : `Are you sure you want to activate "${supplier.name}"?`;

    setConfirmMessage(message);
    setShowConfirm(true);
  };

  // CONFIRM STATUS CHANGE
  const confirmStatusChange = async () => {
    try {
      const supplier = selectedSupplier;

      const newStatus =
        supplier.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      await updateSupplier(
        supplier.id,
        { ...supplier, status: newStatus },
        token
      );

      toast.success(
        `Supplier ${
          newStatus === "ACTIVE" ? "activated" : "deactivated"
        } successfully `
      );

      setShowConfirm(false);
      setSelectedSupplier(null);
      setConfirmMessage(""); // <-- reset message

      fetchSuppliers();
    } catch {
      toast.error("Status change failed");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Supplier Management</h1>

      <div className={styles.searchBar}>
        <input
          placeholder="Search suppliers..."
          className={styles.searchInput}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  {editId === s.id ? (
                    <>
                      <td data-label="Name">
                        <input
                          value={editSupplier.name}
                          onChange={(e) =>
                            setEditSupplier({
                              ...editSupplier,
                              name: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td data-label="Phone">
                        <input
                          value={editSupplier.phone}
                          onChange={(e) =>
                            setEditSupplier({
                              ...editSupplier,
                              phone: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td data-label="Email">
                        <input
                          value={editSupplier.email}
                          onChange={(e) =>
                            setEditSupplier({
                              ...editSupplier,
                              email: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td data-label="Address">
                        <input
                          value={editSupplier.address}
                          onChange={(e) =>
                            setEditSupplier({
                              ...editSupplier,
                              address: e.target.value,
                            })
                          }
                        />
                      </td>

                      <td>{editSupplier.status}</td>

                      <td>
                        {new Date(
                          s.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <button
                          className={styles.updateBtn}
                          onClick={() => handleUpdate(s.id)}
                        >
                          Update
                        </button>

                        <button
                          className={styles.cancelBtn}
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td data-label="Name">{s.name}</td>
                      <td data-label="Phone">{s.phone}</td>
                      <td data-label="Email">{s.email}</td>
                      <td data-label="Address">{s.address}</td>

                      <td>
                        <span
                          className={
                            s.status === "ACTIVE"
                              ? styles.activeBadge
                              : styles.inactiveBadge
                          }
                        >
                          {s.status}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          s.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        {permissions.canUpdate && (
                          <>
                            <button
                              className={styles.editBtn}
                              onClick={() => {
                                setEditId(s.id);
                                setEditSupplier(s);
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className={
                                s.status === "ACTIVE"
                                  ? styles.deactiveBtn
                                  : styles.activateBtn
                              }
                              onClick={() =>
                                handleStatusToggle(s)
                              }
                            >
                              {s.status === "ACTIVE"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {permissions.canCreate && !showAddForm && (
        <button
          className={styles.addBtn}
          onClick={() => setShowAddForm(true)}
        >
          + Add Supplier
        </button>
      )}

      {permissions.canCreate && showAddForm && (
        <div className={styles.addForm}>
          <input
            placeholder="Name"
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, name: e.target.value })
            }
          />
          <input
            placeholder="Phone"
            onChange={(e) =>
              setNewSupplier({
                ...newSupplier,
                phone: e.target.value,
              })
            }
          />
          <input
            placeholder="Email"
            onChange={(e) =>
              setNewSupplier({
                ...newSupplier,
                email: e.target.value,
              })
            }
          />
          <input
            placeholder="Address"
            onChange={(e) =>
              setNewSupplier({
                ...newSupplier,
                address: e.target.value,
              })
            }
          />

          <button className={styles.createBtn} onClick={handleCreate}>
            Create
          </button>

          <button
            className={styles.cancelBtn}
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <ConfirmModal
          message={confirmMessage} // <-- dynamic message with supplier name
          onConfirm={confirmStatusChange}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
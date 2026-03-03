import { useEffect, useState } from "react";
import styles from "./CategoriesPage.module.css";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/api";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal.jsx";
import { categoryPermissions } from "../../config/permissionConfig.js";

export default function CategoriesPage({ token, user }) {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  /* ================= ROLE PERMISSIONS ================= */
  const role = user?.role?.toLowerCase() || "";
  const perms = categoryPermissions[role] || {};

  const canCreate = perms.canAdd;
  const canUpdate = perms.canEdit;
  const canDelete = perms.canDelete;
  /* ==================================================== */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories(token);
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Search categories
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredCategories(
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(query)
      )
    );
  };

  // Add category
  const handleAdd = async () => {
    if (!newCategoryName) return;
    try {
      await createCategory(newCategoryName, token);
      setNewCategoryName("");
      setShowAddForm(false);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit category
  const handleEdit = async (id) => {
    if (!editCategoryName) return alert("Category name is required");
    try {
      await updateCategory(id, editCategoryName, token);
      setEditCategoryId(null);
      setEditCategoryName("");
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete trigger
  const handleDeleteClick = (cat) => {
    setCategoryToDelete(cat);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategory(categoryToDelete.id, token);
    setShowConfirm(false);
    setCategoryToDelete(null);
    fetchCategories();
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setCategoryToDelete(null);
  };

  return (
    <div className={styles.container}>
      <h1>Category Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search categories..."
        onChange={handleSearch}
        className={styles.searchInput}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredCategories.length === 0 ? (
        <p>No categories found</p>
      ) : (
        <ul className={styles.categoryList}>
          {filteredCategories.map((cat) => (
            <li key={cat.id} className={styles.categoryItem}>

              {/* EDIT MODE */}
              {canUpdate && editCategoryId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) =>
                      setEditCategoryName(e.target.value)
                    }
                  />
                  <button
                    className={styles.updateBtn}
                    onClick={() => handleEdit(cat.id)}
                  >
                    Update
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setEditCategoryId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{cat.name}</span>

                  <div className={styles.itemBtns}>
                    {/* EDIT BUTTON */}
                    {canUpdate && (
                      <button
                        className={styles.editBtn}
                        onClick={() => {
                          setEditCategoryId(cat.id);
                          setEditCategoryName(cat.name);
                        }}
                      >
                        Edit
                      </button>
                    )}

                    {/* DELETE BUTTON */}
                    {canDelete && (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteClick(cat)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ADD CATEGORY BUTTON */}
      {canCreate && !showAddForm && (
        <button
          className={styles.addBtn}
          onClick={() => setShowAddForm(true)}
        >
          + Add Category
        </button>
      )}

      {/* ADD FORM */}
      {canCreate && showAddForm && (
        <div className={styles.addFormBlock}>
          <input
            type="text"
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <div className={styles.formBtns}>
            <button
              className={styles.createBtn}
              onClick={handleAdd}
            >
              Create
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => {
                setShowAddForm(false);
                setNewCategoryName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {showConfirm && canDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete category "${categoryToDelete.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
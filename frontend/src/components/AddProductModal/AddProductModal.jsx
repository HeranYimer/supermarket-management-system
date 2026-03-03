import { useState, useEffect } from "react";
import { createProduct, getCategories } from "../../api/api";
import styles from "./AddProductModal.module.css";

export default function AddProductModal({ token, onClose, onProductAdded }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: null,
  });

  // ✅ NEW: categories state
  const [categories, setCategories] = useState([]);

  // ✅ NEW: fetch categories when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(token);
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [token]);

  // ✅ UPDATED: handle category_id as number
  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "category_id"
          ? Number(e.target.value)
          : e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct(form, token);
    onProductAdded();
    onClose();
  };

  return (
    <div>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          required
        />

        <input
          name="stock_quantity"
          type="number"
          placeholder="Stock"
          onChange={handleChange}
          required
        />

        {/* ✅ NEW: Category Dropdown */}
        <select
          name="category_id"
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className={styles.buttons}>
          <button className={styles.createBtn} type="submit">
            Create
          </button>

          <button
            className={styles.cancelBtn}
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
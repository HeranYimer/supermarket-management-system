import { useState, useEffect } from "react";
import styles from "./EditProductModal.module.css";
import { updateProduct, getCategories } from "../../api/api";

export default function EditProductModal({ product, token, onClose, onUpdated }) {
  const [form, setForm] = useState({
    ...product,
    category_id: Number(product.category_id), // ensure it's a number
  });
  const [categories, setCategories] = useState([]);

  // Fetch categories when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(token);
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, [token]);

  // Handle form changes
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
    await updateProduct(product.id, form, token);
    onUpdated();
    onClose();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="stock_quantity"
            type="number"
            value={form.stock_quantity}
            onChange={handleChange}
            required
          />
          <input
            name="image_url"
            value={form.image_url || ""}
            onChange={handleChange}
            placeholder="Image URL"
          />

          {/* Category dropdown without placeholder */}
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className={styles.actions}>
            <button className={styles.updateBtn} type="submit">Update</button>
            <button className={styles.cancleBtn} type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
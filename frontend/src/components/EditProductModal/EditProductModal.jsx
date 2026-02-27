import { useState } from "react";
import styles from "./EditProductModal.module.css";
import { updateProduct } from "../../api/api";

export default function EditProductModal({ product, token, onClose, onUpdated }) {
  const [form, setForm] = useState({ ...product });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
          <input name="name" value={form.name} onChange={handleChange} required />
          <input name="price" type="number" value={form.price} onChange={handleChange} required />
          <input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} required />
          <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Image URL" />
          <div className={styles.actions}>
            <button className={styles.updateBtn} type="submit">Update</button>
            <button className={styles.cancleBtn} type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
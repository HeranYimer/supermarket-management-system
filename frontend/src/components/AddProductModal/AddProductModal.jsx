import { useState } from "react";
import { createProduct } from "../../api/api";
import styles from "./AddProductModal.module.css";
export default function AddProductModal({ token, onClose, onProductAdded }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
        <input name="stock_quantity" type="number" placeholder="Stock" onChange={handleChange} required />
<div className={styles.buttons}>

        <button className={styles.createBtn} type="submit">Create</button>
        <button className={styles.cancelBtn} type="button" onClick={onClose}>Cancel</button>
</div>
      </form>
    </div>
  );
}
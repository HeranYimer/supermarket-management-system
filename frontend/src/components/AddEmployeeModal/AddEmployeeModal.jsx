// frontend/src/components/AddEmployeeModal/AddEmployeeModal.jsx
import { useState } from "react";
import styles from "./AddEmployeeModal.module.css";
import { createEmployee } from "../../api/api";
import toast from "react-hot-toast";
export default function AddEmployeeModal({ token, onClose, onEmployeeAdded }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "MANAGER",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Capture backend response
      const response = await createEmployee(form, token);

      setSuccess("Employee added successfully");
      setError("");

      // Refresh employee table
      onEmployeeAdded();
      onClose();

      // Show temporary password for testing
      if (response.tempPassword) {
  toast.success(`Temporary password: ${response.tempPassword}`, {
    duration: 8000, // shows for 8 seconds
    style: {
      background: "#4caf50",
      color: "white",
      fontWeight: "bold",
    },
  });
}
    } catch (err) {
      setError("Failed to create employee");
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Add Employee</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <select name="role" value={form.role} onChange={handleChange}>
            <option>ADMIN</option>
            <option>MANAGER</option>
            <option>CASHIER</option>
            <option>INVENTORY</option>
          </select>
          <div className={styles.actions}>
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </div>
    </div>
  );
}
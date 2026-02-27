import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout/DashboardLayout";
import EmployeeTable from "../../../components/EmployeeTable/EmployeeTable";
import AddEmployeeModal from "../../../components/AddEmployeeModal/AddEmployeeModal";
import {
  getEmployees,
  deleteEmployee,
  updateEmployeeRole,
} from "../../../api/api";
import styles from "./EmployeesPage.module.css";

export default function EmployeesPage({ user }) {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ All hooks are declared first — no early return
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEmployees(user?.token);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load employees:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      loadEmployees();
    }
  }, [user?.token, loadEmployees]);

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id, user.token);
      loadEmployees();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateEmployeeRole(id, role, user.token);
      loadEmployees();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  // ✅ Conditional rendering — no hooks inside conditions
  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <DashboardLayout user={user}>
      <div className={styles.header}>
        <div>
          <h1>Employee Management</h1>
          <p>Control roles and manage system staff.</p>
        </div>
      </div>

      {loading ? (
        <div>Loading employees...</div>
      ) : (
        <EmployeeTable
          employees={employees}
          onDelete={handleDelete}
          onRoleChange={handleRoleChange}
          currentUserId={user.id}
        />
      )}

      <button
        className={styles.primaryBtn}
        onClick={() => setShowModal(true)}
      >
        + Add Employee
      </button>

      {showModal && (
        <AddEmployeeModal
          token={user.token}
          onClose={() => setShowModal(false)}
          onEmployeeAdded={loadEmployees}
        />
      )}
    </DashboardLayout>
  );
}
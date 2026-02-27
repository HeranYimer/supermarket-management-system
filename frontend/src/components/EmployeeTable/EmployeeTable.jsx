import styles from "./EmployeeTable.module.css";
import { useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

export default function EmployeeTable({
  employees,
  onDelete,
  onRoleChange,
  currentUserId,
}) {
  const [confirmData, setConfirmData] = useState(null);

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ textAlign: "right" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>

              <td>
                {emp.id === currentUserId ? (
                  <span className={styles.roleBadge}>{emp.role}</span>
                ) : (
                  <select
                    value={emp.role}
                    onChange={(e) =>
                      setConfirmData({
                        type: "role",
                        id: emp.id,
                        newRole: e.target.value,
                        message: "Are you sure you want to change this role?",
                      })
                    }
                    className={styles.roleSelect}
                  >
                    <option value="MANAGER">MANAGER</option>
                    <option value="CASHIER">CASHIER</option>
                    <option value="INVENTORY">INVENTORY</option>
                  </select>
                )}
              </td>

              <td style={{ textAlign: "right" }}>
                {emp.id !== currentUserId && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setConfirmData({
                        type: "delete",
                        id: emp.id,
                        message:
                          "Are you sure you want to delete this employee?",
                      })
                    }
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmData && (
        <ConfirmModal
          message={confirmData.message}
          onCancel={() => setConfirmData(null)}
          onConfirm={() => {
            if (confirmData.type === "delete") {
              onDelete(confirmData.id);
            } else if (confirmData.type === "role") {
              onRoleChange(confirmData.id, confirmData.newRole);
            }
            setConfirmData(null);
          }}
        />
      )}
    </>
  );
}
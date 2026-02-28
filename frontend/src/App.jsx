// frontend/src/App.jsx
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";

import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard.jsx";
import EmployeesPage from "./pages/Dashboard/Admin/EmployeesPage.jsx";
import ProductsPage from "./pages/Products/ProductsPage.jsx";
import NotificationsPage from "./pages/Notifications/NotificationsPage.jsx";
import ManagerDashboard from "./pages/Dashboard/Manager/ManagerDashboard.jsx";
import CashierDashboard from "./pages/Dashboard/Cashier/CashierDashboard.jsx";
import InventoryDashboard from "./pages/Dashboard/Inventory/InventoryDashboard.jsx";
import CustomerDashboard from "./pages/Dashboard/Customer/CustomerDashboard.jsx";
import AnalyticsDashboard from "./components/AnalyticsDashboard/AnalayticsDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChangePasswordModal from "./components/ChangePasswordModal/ChangePassword.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage on app mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Login handler
  const handleLogin = (data) => {
    const userData = { ...data.user, token: data.token };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // Show change password modal if required
    if (userData.mustChangePassword) {
      setShowChangePasswordModal(true);
    } else {
      navigate(`/dashboard/${userData.role.toLowerCase()}`);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
<Route path="/dashboard" element={<AnalyticsDashboard />} />
        {/* Protected dashboards */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute user={user} allowedRoles={["ADMIN"]}>
              <AdminDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
   <Route
  path="/employees"
  element={<EmployeesPage user={user} />}
/>
<Route
  path="/products"
  element={<ProductsPage user={user} />}
/>
<Route
  path="/notifications"
  element={
    <ProtectedRoute user={user} allowedRoles={["ADMIN", "MANAGER", "INVENTORY"]}>
      <NotificationsPage user={user} token={user?.token} />
    </ProtectedRoute>
  }
/>
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute user={user} allowedRoles={["MANAGER"]}>
              <ManagerDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cashier"
          element={
            <ProtectedRoute user={user} allowedRoles={["CASHIER"]}>
              <CashierDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/inventory"
          element={
            <ProtectedRoute user={user} allowedRoles={["INVENTORY"]}>
              <InventoryDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/customer"
          element={
            <ProtectedRoute user={user} allowedRoles={["CUSTOMER"]}>
              <CustomerDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      {/* Change Password Modal */}
      {showChangePasswordModal && user && (
        <ChangePasswordModal
          token={user.token}
          onClose={() => {
            setShowChangePasswordModal(false);
            navigate(`/dashboard/${user.role.toLowerCase()}`);
          }}
        />
      )}
    </>
  );
}

export default App;
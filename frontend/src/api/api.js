// frontend/src/api/api.js

const BASE_URL = "http://localhost:5000/api";

/* =====================================================
   AUTH
===================================================== */

export const login = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch {
    return { error: "Network error" };
  }
};

export const register = async (name, email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return await res.json();
  } catch {
    return { error: "Network error" };
  }
};

/* =====================================================
   DASHBOARD
===================================================== */

export const getDashboard = async (route, token) => {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/${route}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { error: "Network error" };
  }
};

export const getAdminStats = async (token) => {
  const res = await fetch(`${BASE_URL}/dashboard/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

/* =====================================================
   EMPLOYEES
===================================================== */

export const createEmployee = async (employeeData, token) => {
  const res = await fetch(`${BASE_URL}/users/create-employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(employeeData),
  });
  return res.json();
};

export const getEmployees = async (token) => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const deleteEmployee = async (id, token) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const updateEmployeeRole = async (id, role, token) => {
  const res = await fetch(`${BASE_URL}/users/${id}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  return res.json();
};

export const updatePassword = async (newPassword, token) => {
  const res = await fetch(`${BASE_URL}/users/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });
  return res.json();
};

/* =====================================================
   PRODUCTS
===================================================== */

// Get active products
export const getProducts = async (token, status = "all") => {
  const res = await fetch(
    `${BASE_URL}/products?status=${status}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.json();
};

// Get inactive products
export const getInactiveProducts = async (token) => {
  const res = await fetch(`${BASE_URL}/products/inactive`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// Create product
export const createProduct = async (data, token) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Update product
export const updateProduct = async (id, data, token) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// 🔴 Hard delete (Admin only)
export const deleteProduct = async (id, token) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// 🟡 Soft delete (Deactivate)
export const deactivateProduct = async (id, token) => {
  const res = await fetch(`${BASE_URL}/products/${id}/deactivate`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// 🟢 Restore product
export const restoreProduct = async (id, token) => {
  const res = await fetch(`${BASE_URL}/products/${id}/restore`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ================= CATEGORY API =================

// Get all categories
export const getCategories = async (token) => {
  const res = await fetch("http://localhost:5000/api/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

// Create category
export const createCategory = async (name, token) => {
  const res = await fetch("http://localhost:5000/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }), // wrap string as object
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create category");
  return data;
};

// Update category
export const updateCategory = async (id, name, token) => {
  const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update category");
  }
  return data;
};

// Delete category
export const deleteCategory = async (id, token) => {
  const res = await fetch(
    `http://localhost:5000/api/categories/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
};

/* ================= SUPPLIERS ================= */

export const getSuppliers = async (token) => {
  const res = await fetch("http://localhost:5000/api/suppliers", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch suppliers");
  return res.json();
};

export const createSupplier = async (supplier, token) => {
  const res = await fetch("http://localhost:5000/api/suppliers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(supplier),
  });

  if (!res.ok) throw new Error("Failed to create supplier");
};

export const updateSupplier = async (id, supplier, token) => {
  const res = await fetch(
    `http://localhost:5000/api/suppliers/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(supplier),
    }
  );

  if (!res.ok) throw new Error("Failed to update supplier");
};

export const deleteSupplier = async (id, token) => {
  const res = await fetch(
    `http://localhost:5000/api/suppliers/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error("Failed to delete supplier");
};
// ================= PURCHASE ORDERS =================
export const getPurchaseOrders = async (token) => {
  const res = await fetch(`${BASE_URL}/purchase-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch purchase orders");
  return res.json();
};
export const getPurchaseOrder = async (id, token) => {
  const res = await fetch(`${BASE_URL}/purchase-orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch purchase order");
  return res.json();
};
export const createPurchaseOrder = async (poData, token) => {
  const res = await fetch(`${BASE_URL}/purchase-orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(poData),
  });
  if (!res.ok) throw new Error("Failed to create purchase order");
  return res.json();
};

export const changePOStatus = async (id, status, token) => {
  const res = await fetch(`${BASE_URL}/purchase-orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to change purchase order status");
  return res.json();
};
export const updatePurchaseOrder = async (id, poData, token) => {
  const res = await fetch(`${BASE_URL}/purchase-orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(poData),
  });
  if (!res.ok) throw new Error("Failed to update purchase order");
  return await res.json();
};
/* =====================================================
   SALES (Future)
===================================================== */

export const createSale = async (saleData, token) => {
  const res = await fetch(`${BASE_URL}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(saleData),
  });
  return res.json();
};
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
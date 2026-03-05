import pool from "../config/database.js";

// Get all purchase orders
export const getPurchaseOrders = async () => {
  const [rows] = await pool.query(`
    SELECT po.*, s.name AS supplier_name
    FROM purchase_orders po
    JOIN suppliers s ON po.supplier_id = s.id
    ORDER BY po.created_at DESC
  `);
  return rows;
};

// Get PO by ID with items
export const getPurchaseOrderById = async (id) => {
  const [po] = await pool.query(`
    SELECT po.*, s.name AS supplier_name
    FROM purchase_orders po
    JOIN suppliers s ON po.supplier_id = s.id
    WHERE po.id = ?
  `, [id]);

  const [items] = await pool.query(`
    SELECT poi.*, p.name AS product_name
    FROM purchase_order_items poi
    JOIN products p ON poi.product_id = p.id
    WHERE poi.purchase_order_id = ?
  `, [id]);

  return { ...po[0], items };
};

// Create PO
export const createPurchaseOrder = async (poData) => {
  const { supplier_id, status= "Pending", total_amount, items } = poData;

  const [result] = await pool.query(`
    INSERT INTO purchase_orders (supplier_id, status, total_amount, created_at)
    VALUES (?, ?, ?, NOW())
  `, [supplier_id, status, total_amount]);

  const poId = result.insertId;

  for (let item of items) {
    await pool.query(`
      INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, cost_price)
      VALUES (?, ?, ?, ?)
    `, [poId, item.product_id, item.quantity, item.cost_price]);
  }

  return poId;
};

// Update PO status
export const updatePurchaseOrderStatus = async (id, status) => {
  await pool.query(`
    UPDATE purchase_orders
    SET status = ?
    WHERE id = ?
  `, [status, id]);
};
// Update existing purchase order
export const updatePurchaseOrder = async (id, poData) => {
  const { supplier_id, total_amount, items } = poData;

  // 1. Update main PO data
  await pool.query(`
    UPDATE purchase_orders
    SET supplier_id = ?, total_amount = ?
    WHERE id = ?
  `, [supplier_id, total_amount, id]);

  // 2. Delete existing items (simplest approach)
  await pool.query(`DELETE FROM purchase_order_items WHERE purchase_order_id = ?`, [id]);

  // 3. Insert updated items
  for (let item of items) {
    await pool.query(`
      INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, cost_price)
      VALUES (?, ?, ?, ?)
    `, [id, item.product_id, item.quantity, item.cost_price]);
  }

  return id;
};
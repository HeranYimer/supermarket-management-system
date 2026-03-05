import * as PurchaseOrderModel from "../../models/purchaseorder.model.js";
import { updateStock } from "../../models/product.model.js";

// Get all POs
export const getAllPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrderModel.getPurchaseOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch purchase orders" });
  }
};

// Get PO by ID
export const getPurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await PurchaseOrderModel.getPurchaseOrderById(id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch purchase order" });
  }
};

// Create PO
export const createPurchaseOrder = async (req, res) => {
  try {
    const poId = await PurchaseOrderModel.createPurchaseOrder(req.body);
    res.json({ message: "Purchase order created", id: poId });
  } catch (err) {
    console.error(err); // <-- Log full error
    res.status(500).json({ error: "Failed to create purchase order", details: err.message });
  }
};

// Change PO status
export const changePOStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await PurchaseOrderModel.updatePurchaseOrderStatus(id, status);

    // Update stock if received
    if (status === "Received") {
      const order = await PurchaseOrderModel.getPurchaseOrderById(id);
      for (let item of order.items) {
        await updateStock(item.product_id, item.quantity);
      }
    }

    res.json({ message: `Purchase order marked as ${status}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to update purchase order status" });
  }
};

// Update existing PO
export const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const poData = req.body;

    await PurchaseOrderModel.updatePurchaseOrder(id, poData);

    res.json({ message: `Purchase order #${id} updated successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update purchase order", details: err.message });
  }
};
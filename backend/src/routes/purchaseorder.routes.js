import express from "express";
import {
  getAllPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  changePOStatus,
  updatePurchaseOrder
} from "../controllers/purchaseorder/purchaseorder.controller.js";

const router = express.Router();

router.get("/", getAllPurchaseOrders);
router.get("/:id", getPurchaseOrder);
router.post("/", createPurchaseOrder);
router.patch("/:id/status", changePOStatus);

// NEW: Update PO
router.put("/:id", updatePurchaseOrder);

export default router;
import express from "express";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
} from "../controllers/supplier/supplier.controller.js";

const router = express.Router();

/* ================= GET ALL ================= */
router.get("/", getAllSuppliers);

/* ================= CREATE ================= */
router.post("/", createSupplier);

/* ================= UPDATE (EDIT + STATUS CHANGE) ================= */
router.put("/:id", updateSupplier);

export default router;
import * as SupplierModel from "../../models/supplier.model.js";

/* ================= GET ================= */
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await SupplierModel.getSuppliers();
    res.json(suppliers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};

/* ================= CREATE ================= */
export const createSupplier = async (req, res) => {
  try {
    await SupplierModel.createSupplier(req.body);
    res.json({ message: "Supplier created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create supplier" });
  }
};

/* ================= UPDATE (EDIT + STATUS) ================= */
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    await SupplierModel.updateSupplier(id, req.body);

    res.json({ message: "Supplier updated successfully" });
  } catch (err) {
    console.error("Update supplier error:", err);
    res.status(500).json({ error: "Failed to update supplier" });
  }
};
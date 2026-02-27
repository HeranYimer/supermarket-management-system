import express from "express";
import * as ProductController from "../controllers/product/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();
router.get(
  "/inactive",
  protect,
  authorizeRoles("ADMIN", "INVENTORY"),
  ProductController.getInactiveProducts
);
router.get("/", protect, ProductController.getProducts);
router.get("/:id", protect, ProductController.getProduct);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "INVENTORY"),
  ProductController.createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN", "INVENTORY"),
  ProductController.updateProduct
);
router.put(
  "/:id/deactivate",
  protect,
  authorizeRoles("ADMIN", "INVENTORY"),
  ProductController.softDeleteProduct
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  ProductController.hardDeleteProduct
);
router.put(
  "/:id/restore",
  protect,
  authorizeRoles("ADMIN", "INVENTORY"),
  ProductController.restoreProduct
);
export default router;
import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { managerDashboard } from "../controllers/dashboard/manager.controller.js";
import { cashierDashboard } from "../controllers/dashboard/cashier.controller.js";
import { inventoryDashboard } from "../controllers/dashboard/inventory.controller.js";
import { getAdminDashboard } from "../controllers/dashboard/admin.controller.js";

const router = express.Router();

router.get(
  "/admin",
  protect,
  authorizeRoles("ADMIN"),
  getAdminDashboard
);

router.get(
  "/manager",
  protect,
  authorizeRoles("ADMIN", "MANAGER"),
  managerDashboard
);

router.get(
  "/cashier",
  protect,
  authorizeRoles("ADMIN", "MANAGER", "CASHIER"),
  cashierDashboard
);

router.get(
  "/inventory",
  protect,
  authorizeRoles("INVENTORY"),
  inventoryDashboard
);

export default router;

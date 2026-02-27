import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

import {
  createEmployee,
  getEmployees,
  deleteEmployee,
  changeEmployeeRole,
  changePassword,
} from "../controllers/user/user.controller.js";

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.get("/", getEmployees);
router.post("/create-employee", createEmployee);
router.delete("/:id", deleteEmployee);
router.put("/:id/role", changeEmployeeRole);
router.put("/change-password", protect, changePassword);
export default router;
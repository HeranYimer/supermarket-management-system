import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import * as NotificationController from "../controllers/notification/notification.controller.js";

const router = express.Router();

router.get("/", protect, NotificationController.getNotifications);
router.put("/:id/read", protect, NotificationController.markNotificationAsRead);
router.put("/read-all", protect, NotificationController.markAllNotificationsAsRead);

export default router;
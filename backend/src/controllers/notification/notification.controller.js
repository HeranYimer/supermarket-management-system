import * as NotificationModel from "../../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const role = req.user.role;
    const notifications = await NotificationModel.getNotificationsByRole(role);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    await NotificationModel.markAsRead(id);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await NotificationModel.markAllAsRead(req.user.role);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};
import { getAdminStats } from "../../services/admin.service.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};

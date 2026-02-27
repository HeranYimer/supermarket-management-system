import { registerCustomer } from "../../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userId = await registerCustomer({ name, email, password });

    res.status(201).json({
      message: "Customer registered successfully",
      userId,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
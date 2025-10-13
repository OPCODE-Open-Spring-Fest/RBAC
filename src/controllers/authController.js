import { loginUser } from "../services/authService.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const { token, refreshToken } = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      refreshToken,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message || "Authentication failed",
    });
  }
};

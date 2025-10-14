import { User } from "../models/user.model.js";

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = user.generateAccessToken();
  const refreshToken = user.refreshAccessToken();

  // Update user's refresh token in database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { token, refreshToken };
};

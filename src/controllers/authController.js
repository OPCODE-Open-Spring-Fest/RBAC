import { User } from '../models/user.model.js';
import { registerUserService, loginUserService } from '../services/authService.js';
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/sendEmail.js';
import asynkcHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
//register user
export const registerUser = asynkcHandler(async (req, res) => {
    const userData = await registerUserService(req.body);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userData
    });
});
// login user
export const loginUser = asynkcHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await loginUserService({ email, password });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: result.user,
  });
});
// Forgot password
export const forgotPassword = asynkcHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );


    user.refreshToken = resetToken;
    await user.save();

    const resetUrl = `http://localhost:5000/api/auth/resetPassword/${resetToken}`

    const html = `
    <p>Hello ${user.fullname},</p>
    <p>You requested a password reset. Click below to reset your password:</p>
     <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link will expire in <b>1 hour</b>.</p>

    `

    await sendEmail(user.email,html);

    console.log(resetUrl);
    return res.status(200).json({
      success: true,
      message: 'Password reset link sent'
    })
});
// Reset password
export const resetPassword = asynkcHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, 'Password is required');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(400, 'Invalid or expired token');
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) {
    throw new ApiError(400, 'Invalid or expired token');
  }

  user.password = password;
  user.refreshToken = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successful' });
});

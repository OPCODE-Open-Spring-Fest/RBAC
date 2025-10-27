import { User } from '../models/user.model.js';
import { registerUserService, loginUserService } from '../services/authService.js';
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/sendEmail.js';
import asynkcHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';



/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Create a new user account with username, email, fullname, password, and optional role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - fullname
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: mukesh dhadhariya
 *               email:
 *                 type: string
 *                 example: mukeshdhadhariya1@gmail.com
 *               fullname:
 *                 type: string
 *                 example: Mukesh Dhadhariya
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 description: Optional Role ID reference
 *                 example: 64f3c2a7e1f0b2a7b1c0d123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Bad request (missing fields or username/email already exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields (username, email, fullname, password) are required
 *       500:
 *         description: Registration failed due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration failed
 *                 error:
 *                   type: string
 *                   example: Error message
 */
export const registerUser = asynkcHandler(async (req, res) => {
    const userData = await registerUserService(req.body);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userData
    });
});



/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Authenticate a user with email and password and return JWT token along with refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mukesh@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "d1f2e3c4-5678-90ab-cdef-1234567890ab"
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email and password are required
 *       401:
 *         description: Authentication failed (invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Authentication failed
 */
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


/**
 * @swagger
 * /api/auth/forgotPassword:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password reset link sent"
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       401:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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


/**
 * @swagger
 * /api/auth/resetPassword/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: JWT reset token sent by email
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: MyN3wP@ssw0rd
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password reset successful"
 *       400:
 *         description: Invalid or expired token / missing password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired token"
 *       401:
 *         description: Unauthorized (token mismatch)
 *       500:
 *         description: Server error
 */
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
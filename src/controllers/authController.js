import { loginUser } from '../services/authService.js';
import { User } from '../models/user.model.js';

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
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' });
    }

    const { token, refreshToken } = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message || 'Authentication failed',
    });
  }
};

/**
 * @openapi
 * /api/auth/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check if the API is working
 *     description: Simple health check endpoint to verify API is up and running.
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is working good
 *                 status:
 *                   type: intger
 *                   example: 200
 */
export const CheckHealth = (req, res) => {
  console.log('api is working');
  return res.status(200).json({
    message: 'API is working good',
    status: 200,
  });
};

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
export const UserRegistration = async (req, res) => {
  try {
    const { username, email, fullname, password, role } = req.body;

    if (
      [username, email, fullname, password].some(field => field?.trim() === '')
    ) {
      return res.status(400).json({
        message:
          'All fields (username, email, fullname, password) are required',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser)
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });

    const user = await User.create({
      username: username.toLowerCase(),
      email,
      fullname,
      password,
      role: role || null,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Registration failed', error: error.message });
  }
};

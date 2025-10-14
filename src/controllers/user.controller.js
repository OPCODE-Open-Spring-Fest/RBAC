import { User } from "../models/user.model.js";




/**
 * @openapi
 * /api/v1/user/health:
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
const CheckHealth= (req, res) => {
  console.log('api is working')
  return res.status(200).json({
    message: 'API is working good',
    status: 200
  });
}

/**
 * @openapi
 * /api/v1/user/register:
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
const UserRegistration=async (req, res) => {
  try {
    const { username, email, fullname, password,role} = req.body;

    if(
        [username,email,fullname,password].some((field)=>  field?.trim()==="")
    ){
        return res.status(400).json({
            message: "All fields (username, email, fullname, password) are required"
        });
    }

    const existingUser = await User.findOne({ 
        $or: [{ username }, { email }] 
    });
    if (existingUser) return res.status(400).json({ message: 'Username or email already exists' });

    const user=await User.create({
        username:username.toLowerCase(),
        email,
        fullname,
        password,
        role:role || null
    })

    await user.save();

    res.status(201).json({ message: 'User registered successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
}

export {
    CheckHealth,
    UserRegistration
}
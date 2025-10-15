import { registerUserService,loginUserService } from '../services/authService.js';

export const registerUser = async (req, res) => {
  try {
    const userData = await registerUserService(req.body);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userData
    });
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    const status = error.statusCode || 400;
    return res.status(status).json({ success: false, message: error.message || 'Login failed' });
  }
};
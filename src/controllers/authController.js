import { registerUserService, loginUserService, refreshTokenService, logoutService } from '../services/authService.js';

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
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    const status = error.statusCode || 400;
    return res.status(status).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshTokenService(refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    console.error('Error in refreshToken:', error);
    const status = error.statusCode || 401;
    return res.status(status).json({ 
      success: false, 
      message: error.message || 'Token refresh failed' 
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await logoutService(refreshToken);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in logout:', error);
    const status = error.statusCode || 400;
    return res.status(status).json({ 
      success: false, 
      message: error.message || 'Logout failed' 
    });
  }
};
import { User } from '../models/user.model.js';
import Role from '../models/Role.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signAccessToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set in environment');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const registerUserService = async ({ username, email, fullname, password }) => {
  if (!username || !email || !password || !fullname) {
    throw new Error('All fields are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const userRole = await Role.findOne({ name: 'User' });
  if (!userRole) {
    throw new Error('Default role not found. Please seed roles first.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password,salt);

  const newUser = await User.create({
    username,
    email,
    fullname,
    password: hashedPassword,
    role: userRole._id,
  });

  return {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    role: userRole.name,
  };
};


export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email }).populate('role');
 
  if (!user) {
    const err = new Error('Invalid credentials'); 
    err.statusCode = 401;
    throw err;
  }
 

  const isMatch = await bcrypt.compare(password, user.password);
  
   
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const roleName = user.role && user.role.name ? user.role.name : null;
  const payload = {
    id: user._id,
    role: roleName,
  };

  const accessToken = signAccessToken(payload);
  
  // Generate refresh token
  let refreshToken, expiryDate;
  try {
    const tokenData = user.generateRefreshToken();
    refreshToken = tokenData.refreshToken;
    expiryDate = tokenData.expiryDate;
  } catch (error) {
    console.error('Error generating refresh token:', error.message);
    throw new Error(`Refresh token generation failed: ${error.message}`);
  }
  
  // Save refresh token to database
  user.refreshToken = refreshToken;
  user.refreshTokenExpiry = expiryDate;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      role: roleName,
    },
  };
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    const err = new Error('Refresh token is required');
    err.statusCode = 400;
    throw err;
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user with the refresh token
    const user = await User.findOne({ 
      _id: decoded._id, 
      refreshToken: refreshToken 
    }).populate('role');

    if (!user) {
      const err = new Error('Invalid refresh token');
      err.statusCode = 401;
      throw err;
    }

    // Check if refresh token is expired
    if (user.refreshTokenExpiry && new Date() > user.refreshTokenExpiry) {
      const err = new Error('Refresh token expired');
      err.statusCode = 401;
      throw err;
    }

    // Generate new access token
    const roleName = user.role && user.role.name ? user.role.name : null;
    const payload = {
      id: user._id,
      role: roleName,
    };

    const newAccessToken = signAccessToken(payload);

    return {
      accessToken: newAccessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: roleName,
      },
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      const err = new Error('Invalid or expired refresh token');
      err.statusCode = 401;
      throw err;
    }
    throw error;
  }
};

export const logoutService = async (refreshToken) => {
  if (!refreshToken) {
    const err = new Error('Refresh token is required');
    err.statusCode = 400;
    throw err;
  }

  try {
    // Find user with the refresh token and clear it
    const user = await User.findOne({ refreshToken: refreshToken });
    
    if (user) {
      await user.clearRefreshToken();
    }

    return { message: 'Logged out successfully' };
  } catch (error) {
    console.error('Error in logoutService:', error);
    throw new Error('Logout failed');
  }
};
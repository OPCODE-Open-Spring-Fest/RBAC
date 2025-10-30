import { User } from '../models/user.model.js';
import Role from '../models/Role.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signAccessToken = payload => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set in environment');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const registerUserService = async ({
  username,
  email,
  fullname,
  password,
}) => {
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
  const hashedPassword = await bcrypt.hash(password, salt);

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

  const isMatch = bcrypt.compare(password, user.password);

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
  return {
    accessToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      role: roleName,
    },
  };
};
